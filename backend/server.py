from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# JWT Configuration
SECRET_KEY = "ecotrack_secret_key_change_in_production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

security = HTTPBearer()

# Carbon emission factors (kg CO2 per km)
EMISSION_FACTORS = {
    "car": 0.21,
    "bus": 0.089,
    "train": 0.041,
    "flight": 0.255,
    "walking": 0.0,
    "cycling": 0.0
}

class TransportType(str, Enum):
    CAR = "car"
    BUS = "bus"
    TRAIN = "train"
    FLIGHT = "flight"
    WALKING = "walking"
    CYCLING = "cycling"

# Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ActivityCreate(BaseModel):
    transport_type: TransportType
    distance_km: float
    date: datetime
    description: Optional[str] = None

class Activity(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    transport_type: TransportType
    distance_km: float
    carbon_footprint_kg: float
    date: datetime
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Token(BaseModel):
    access_token: str
    token_type: str

class DashboardStats(BaseModel):
    total_emissions: float
    total_activities: int
    avg_daily_emissions: float
    current_month_emissions: float

# Utility Functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
        user = await db.users.find_one({"id": user_id})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        
        return User(**user)
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

def calculate_carbon_footprint(transport_type: TransportType, distance_km: float) -> float:
    """Calculate carbon footprint based on transport type and distance"""
    emission_factor = EMISSION_FACTORS.get(transport_type.value, 0)
    return round(emission_factor * distance_km, 3)

def prepare_for_mongo(data):
    """Convert datetime objects to ISO strings for MongoDB storage"""
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, datetime):
                data[key] = value.isoformat()
    return data

def parse_from_mongo(item):
    """Convert ISO strings back to datetime objects"""
    if isinstance(item, dict):
        for key, value in item.items():
            if key in ['date', 'created_at'] and isinstance(value, str):
                try:
                    item[key] = datetime.fromisoformat(value.replace('Z', '+00:00'))
                except:
                    pass
    return item

# Authentication Routes
@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    hashed_password = hash_password(user_data.password)
    user = User(email=user_data.email, name=user_data.name)
    
    user_dict = user.dict()
    user_dict["password"] = hashed_password
    user_dict = prepare_for_mongo(user_dict)
    
    await db.users.insert_one(user_dict)
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id})
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    user = await db.users.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(data={"sub": user["id"]})
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.get("/auth/me", response_model=User)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

# Activity Routes
@api_router.post("/activities", response_model=Activity)
async def create_activity(activity_data: ActivityCreate, current_user: User = Depends(get_current_user)):
    carbon_footprint = calculate_carbon_footprint(activity_data.transport_type, activity_data.distance_km)
    
    activity = Activity(
        user_id=current_user.id,
        transport_type=activity_data.transport_type,
        distance_km=activity_data.distance_km,
        carbon_footprint_kg=carbon_footprint,
        date=activity_data.date,
        description=activity_data.description
    )
    
    activity_dict = prepare_for_mongo(activity.dict())
    await db.activities.insert_one(activity_dict)
    
    return activity

@api_router.get("/activities", response_model=List[Activity])
async def get_activities(current_user: User = Depends(get_current_user)):
    activities = await db.activities.find({"user_id": current_user.id}).sort("date", -1).to_list(1000)
    return [Activity(**parse_from_mongo(activity)) for activity in activities]

@api_router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(current_user: User = Depends(get_current_user)):
    activities = await db.activities.find({"user_id": current_user.id}).to_list(1000)
    
    if not activities:
        return DashboardStats(
            total_emissions=0,
            total_activities=0,
            avg_daily_emissions=0,
            current_month_emissions=0
        )
    
    total_emissions = sum(activity["carbon_footprint_kg"] for activity in activities)
    total_activities = len(activities)
    
    # Calculate current month emissions
    current_month = datetime.now(timezone.utc).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    current_month_activities = [
        activity for activity in activities 
        if isinstance(activity.get("date"), str) and 
        datetime.fromisoformat(activity["date"].replace('Z', '+00:00')) >= current_month
    ]
    current_month_emissions = sum(activity["carbon_footprint_kg"] for activity in current_month_activities)
    
    # Calculate average daily emissions (last 30 days)
    thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
    recent_activities = [
        activity for activity in activities 
        if isinstance(activity.get("date"), str) and 
        datetime.fromisoformat(activity["date"].replace('Z', '+00:00')) >= thirty_days_ago
    ]
    avg_daily_emissions = sum(activity["carbon_footprint_kg"] for activity in recent_activities) / 30 if recent_activities else 0
    
    return DashboardStats(
        total_emissions=round(total_emissions, 3),
        total_activities=total_activities,
        avg_daily_emissions=round(avg_daily_emissions, 3),
        current_month_emissions=round(current_month_emissions, 3)
    )

@api_router.get("/activities/chart-data")
async def get_chart_data(period: str = "weekly", current_user: User = Depends(get_current_user)):
    """Get emissions data for charts (daily, weekly, or monthly)"""
    activities = await db.activities.find({"user_id": current_user.id}).to_list(1000)
    
    # Parse activities and sort by date
    parsed_activities = []
    for activity in activities:
        try:
            if isinstance(activity.get("date"), str):
                activity["date"] = datetime.fromisoformat(activity["date"].replace('Z', '+00:00'))
                parsed_activities.append(activity)
        except:
            continue
    
    parsed_activities.sort(key=lambda x: x["date"])
    
    # Group by period
    chart_data = []
    if period == "daily":
        # Last 30 days
        for i in range(30):
            date = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days=i)
            day_emissions = sum(
                activity["carbon_footprint_kg"] for activity in parsed_activities
                if activity["date"].date() == date.date()
            )
            chart_data.append({
                "date": date.strftime("%Y-%m-%d"),
                "emissions": round(day_emissions, 3)
            })
    
    elif period == "weekly":
        # Last 12 weeks
        for i in range(12):
            week_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(weeks=i)
            week_start = week_start - timedelta(days=week_start.weekday())  # Start of week (Monday)
            week_end = week_start + timedelta(days=7)
            
            week_emissions = sum(
                activity["carbon_footprint_kg"] for activity in parsed_activities
                if week_start <= activity["date"] < week_end
            )
            chart_data.append({
                "date": week_start.strftime("%Y-W%U"),
                "emissions": round(week_emissions, 3)
            })
    
    else:  # monthly
        # Last 12 months
        for i in range(12):
            month_date = datetime.now(timezone.utc).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            month_date = month_date.replace(month=month_date.month - i if month_date.month > i else 12 + month_date.month - i)
            if month_date.month > datetime.now(timezone.utc).month:
                month_date = month_date.replace(year=month_date.year - 1)
            
            month_emissions = sum(
                activity["carbon_footprint_kg"] for activity in parsed_activities
                if activity["date"].year == month_date.year and activity["date"].month == month_date.month
            )
            chart_data.append({
                "date": month_date.strftime("%Y-%m"),
                "emissions": round(month_emissions, 3)
            })
    
    return {"data": list(reversed(chart_data))}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()