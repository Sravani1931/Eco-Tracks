from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
import hashlib
import time
from datetime import datetime, timezone, timedelta
import json
import random

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

security = HTTPBearer()

# Blockchain Simulation State
class BlockchainSimulator:
    def __init__(self):
        self.blocks = []
        self.pending_transactions = []
        self.certificates = {}
        self.institutions = {}
        self.wallets = {}
        self.current_block_number = 0
        self.gas_price = 20  # Gwei
        
        # Initialize genesis block
        self.create_genesis_block()
    
    def create_genesis_block(self):
        genesis_block = {
            "blockNumber": 0,
            "timestamp": int(time.time()),
            "previousHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "hash": "0x0000000000000000000000000000000000000000000000000000000000000001",
            "transactions": [],
            "gasUsed": 0,
            "gasLimit": 8000000
        }
        self.blocks.append(genesis_block)
    
    def generate_address(self) -> str:
        """Generate a mock Ethereum address"""
        return f"0x{random.randbytes(20).hex()}"
    
    def generate_transaction_hash(self) -> str:
        """Generate a mock transaction hash"""
        return f"0x{random.randbytes(32).hex()}"
    
    def calculate_gas_cost(self, operation_type: str) -> int:
        """Calculate gas cost for different operations"""
        gas_costs = {
            "register_institution": 150000,
            "issue_certificate": 100000,
            "verify_certificate": 21000,
            "transfer": 21000
        }
        return gas_costs.get(operation_type, 21000)
    
    def calculate_certificate_hash(self, certificate_data: dict) -> str:
        """Calculate SHA-256 hash of certificate data"""
        cert_string = json.dumps(certificate_data, sort_keys=True)
        return hashlib.sha256(cert_string.encode()).hexdigest()
    
    def create_transaction(self, from_address: str, to_address: str, operation: str, data: dict, gas_limit: int) -> dict:
        """Create a new transaction"""
        tx_hash = self.generate_transaction_hash()
        gas_used = min(gas_limit, self.calculate_gas_cost(operation))
        
        transaction = {
            "hash": tx_hash,
            "from": from_address,
            "to": to_address,
            "operation": operation,
            "data": data,
            "gasLimit": gas_limit,
            "gasUsed": gas_used,
            "gasPrice": self.gas_price,
            "timestamp": int(time.time()),
            "blockNumber": None,  # Will be set when mined
            "status": "pending"
        }
        
        self.pending_transactions.append(transaction)
        return transaction
    
    def mine_block(self):
        """Mine pending transactions into a new block"""
        if not self.pending_transactions:
            return None
        
        self.current_block_number += 1
        previous_hash = self.blocks[-1]["hash"]
        
        # Process transactions
        block_transactions = self.pending_transactions.copy()
        total_gas_used = sum(tx["gasUsed"] for tx in block_transactions)
        
        # Update transaction status and block number
        for tx in block_transactions:
            tx["status"] = "confirmed"
            tx["blockNumber"] = self.current_block_number
        
        # Create new block
        block_data = f"{self.current_block_number}{previous_hash}{json.dumps(block_transactions)}{int(time.time())}"
        block_hash = f"0x{hashlib.sha256(block_data.encode()).hexdigest()}"
        
        new_block = {
            "blockNumber": self.current_block_number,
            "timestamp": int(time.time()),
            "previousHash": previous_hash,
            "hash": block_hash,
            "transactions": block_transactions,
            "gasUsed": total_gas_used,
            "gasLimit": 8000000
        }
        
        self.blocks.append(new_block)
        self.pending_transactions = []
        
        return new_block

# Initialize blockchain simulator
blockchain = BlockchainSimulator()

# Models
class WalletConnect(BaseModel):
    address: Optional[str] = None
    
class WalletResponse(BaseModel):
    address: str
    balance: float
    
class Institution(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    address: str
    email: EmailStr
    wallet_address: str
    verified: bool = False
    registered_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CertificateData(BaseModel):
    recipient_name: str
    course_name: str
    completion_date: str
    grade: Optional[str] = None
    institution_id: str

class Certificate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    certificate_hash: str
    recipient_name: str
    course_name: str
    completion_date: str
    grade: Optional[str] = None
    institution_id: str
    institution_name: str
    transaction_hash: str
    block_number: int
    issued_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    verified: bool = True

class Transaction(BaseModel):
    hash: str
    from_address: str
    to_address: str
    operation: str
    data: Dict[str, Any]
    gas_limit: int
    gas_used: int
    gas_price: int
    timestamp: int
    block_number: Optional[int]
    status: str

class Block(BaseModel):
    block_number: int
    timestamp: int
    previous_hash: str
    hash: str
    transactions: List[Transaction]
    gas_used: int
    gas_limit: int

# Wallet Routes
@api_router.post("/wallet/connect", response_model=WalletResponse)
async def connect_wallet(wallet_data: WalletConnect):
    """Simulate MetaMask wallet connection"""
    if wallet_data.address:
        # Existing wallet
        wallet_address = wallet_data.address
    else:
        # Generate new wallet
        wallet_address = blockchain.generate_address()
    
    # Simulate wallet balance (in ETH)
    balance = round(random.uniform(0.5, 10.0), 4)
    
    return WalletResponse(address=wallet_address, balance=balance)

@api_router.get("/wallet/{address}/balance")
async def get_wallet_balance(address: str):
    """Get wallet balance"""
    balance = round(random.uniform(0.1, 5.0), 4)
    return {"address": address, "balance": balance, "currency": "ETH"}

# Institution Routes
@api_router.post("/institutions/register", response_model=Dict[str, Any])
async def register_institution(institution_data: Institution):
    """Register a new institution on the blockchain"""
    
    # Generate wallet address for institution
    wallet_address = blockchain.generate_address()
    institution_data.wallet_address = wallet_address
    
    # Create blockchain transaction
    contract_address = "0x742d35Cc6634C0532925a3b8D045A879689996F4"  # Mock contract address
    tx_data = {
        "name": institution_data.name,
        "email": institution_data.email,
        "address": institution_data.address
    }
    
    transaction = blockchain.create_transaction(
        from_address=wallet_address,
        to_address=contract_address,
        operation="register_institution",
        data=tx_data,
        gas_limit=200000
    )
    
    # Store in database
    institution_dict = institution_data.dict()
    institution_dict["registered_at"] = institution_dict["registered_at"].isoformat()
    await db.institutions.insert_one(institution_dict)
    
    # Store in blockchain simulator
    blockchain.institutions[institution_data.id] = institution_dict
    
    # Mine block (simulate auto-mining)
    block = blockchain.mine_block()
    
    return {
        "institution_id": institution_data.id,
        "wallet_address": wallet_address,
        "transaction_hash": transaction["hash"],
        "block_number": block["blockNumber"] if block else None,
        "gas_used": transaction["gasUsed"],
        "status": "confirmed"
    }

@api_router.get("/institutions", response_model=List[Institution])
async def get_institutions():
    """Get all registered institutions"""
    institutions = await db.institutions.find().to_list(1000)
    return [Institution(**inst) for inst in institutions]

@api_router.get("/institutions/{institution_id}")
async def get_institution(institution_id: str):
    """Get institution details"""
    institution = await db.institutions.find_one({"id": institution_id})
    if not institution:
        raise HTTPException(status_code=404, detail="Institution not found")
    return institution

# Certificate Routes
@api_router.post("/certificates/issue", response_model=Dict[str, Any])
async def issue_certificate(cert_data: CertificateData, wallet_address: str):
    """Issue a new certificate on the blockchain"""
    
    # Verify institution exists
    institution = await db.institutions.find_one({"id": cert_data.institution_id})
    if not institution:
        raise HTTPException(status_code=404, detail="Institution not found")
    
    # Calculate certificate hash
    cert_hash_data = {
        "recipient_name": cert_data.recipient_name,
        "course_name": cert_data.course_name,
        "completion_date": cert_data.completion_date,
        "institution_id": cert_data.institution_id
    }
    certificate_hash = blockchain.calculate_certificate_hash(cert_hash_data)
    
    # Create blockchain transaction
    contract_address = "0x742d35Cc6634C0532925a3b8D045A879689996F4"
    tx_data = {
        "certificate_hash": certificate_hash,
        "recipient": cert_data.recipient_name,
        "course": cert_data.course_name,
        "completion_date": cert_data.completion_date,
        "institution": cert_data.institution_id
    }
    
    transaction = blockchain.create_transaction(
        from_address=wallet_address,
        to_address=contract_address,
        operation="issue_certificate",
        data=tx_data,
        gas_limit=150000
    )
    
    # Create certificate
    certificate = Certificate(
        certificate_hash=certificate_hash,
        recipient_name=cert_data.recipient_name,
        course_name=cert_data.course_name,
        completion_date=cert_data.completion_date,
        grade=cert_data.grade,
        institution_id=cert_data.institution_id,
        institution_name=institution["name"],
        transaction_hash=transaction["hash"],
        block_number=0  # Will be updated when mined
    )
    
    # Store in database
    cert_dict = certificate.dict()
    cert_dict["issued_at"] = cert_dict["issued_at"].isoformat()
    await db.certificates.insert_one(cert_dict)
    
    # Store in blockchain simulator
    blockchain.certificates[certificate_hash] = cert_dict
    
    # Mine block
    block = blockchain.mine_block()
    if block:
        # Update certificate with block number
        await db.certificates.update_one(
            {"certificate_hash": certificate_hash},
            {"$set": {"block_number": block["blockNumber"]}}
        )
    
    return {
        "certificate_id": certificate.id,
        "certificate_hash": certificate_hash,
        "transaction_hash": transaction["hash"],
        "block_number": block["blockNumber"] if block else None,
        "gas_used": transaction["gasUsed"],
        "status": "confirmed"
    }

@api_router.get("/certificates/verify/{certificate_hash}")
async def verify_certificate(certificate_hash: str):
    """Verify certificate authenticity on the blockchain"""
    
    # Check database first
    certificate = await db.certificates.find_one({"certificate_hash": certificate_hash})
    if not certificate:
        raise HTTPException(status_code=404, detail="Certificate not found")
    
    # Simulate blockchain verification
    contract_address = "0x742d35Cc6634C0532925a3b8D045A879689996F4"
    verification_address = blockchain.generate_address()
    
    tx_data = {"certificate_hash": certificate_hash}
    
    transaction = blockchain.create_transaction(
        from_address=verification_address,
        to_address=contract_address,
        operation="verify_certificate",
        data=tx_data,
        gas_limit=25000
    )
    
    # Mine verification transaction
    block = blockchain.mine_block()
    
    return {
        "certificate": certificate,
        "verified": True,
        "verification_transaction": transaction["hash"],
        "block_number": block["blockNumber"] if block else None,
        "verification_timestamp": int(time.time())
    }

@api_router.get("/certificates", response_model=List[Certificate])
async def get_certificates():
    """Get all certificates"""
    certificates = await db.certificates.find().to_list(1000)
    return [Certificate(**cert) for cert in certificates]

# Blockchain Explorer Routes
@api_router.get("/blockchain/blocks", response_model=List[Block])
async def get_blocks():
    """Get blockchain blocks"""
    return [Block(**block) for block in blockchain.blocks]

@api_router.get("/blockchain/blocks/{block_number}")
async def get_block(block_number: int):
    """Get specific block details"""
    for block in blockchain.blocks:
        if block["blockNumber"] == block_number:
            return block
    raise HTTPException(status_code=404, detail="Block not found")

@api_router.get("/blockchain/transactions")
async def get_transactions():
    """Get all transactions"""
    all_transactions = []
    for block in blockchain.blocks:
        all_transactions.extend(block["transactions"])
    all_transactions.extend(blockchain.pending_transactions)
    return all_transactions

@api_router.get("/blockchain/transactions/{tx_hash}")
async def get_transaction(tx_hash: str):
    """Get specific transaction details"""
    # Check all blocks
    for block in blockchain.blocks:
        for tx in block["transactions"]:
            if tx["hash"] == tx_hash:
                return tx
    
    # Check pending transactions
    for tx in blockchain.pending_transactions:
        if tx["hash"] == tx_hash:
            return tx
    
    raise HTTPException(status_code=404, detail="Transaction not found")

@api_router.get("/blockchain/stats")
async def get_blockchain_stats():
    """Get blockchain statistics"""
    total_transactions = sum(len(block["transactions"]) for block in blockchain.blocks)
    total_certificates = await db.certificates.count_documents({})
    total_institutions = await db.institutions.count_documents({})
    
    return {
        "total_blocks": len(blockchain.blocks),
        "total_transactions": total_transactions,
        "pending_transactions": len(blockchain.pending_transactions),
        "total_certificates": total_certificates,
        "total_institutions": total_institutions,
        "current_gas_price": blockchain.gas_price,
        "latest_block": blockchain.blocks[-1] if blockchain.blocks else None
    }

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