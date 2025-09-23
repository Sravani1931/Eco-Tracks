#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime, timezone
import uuid

class EcoTrackAPITester:
    def __init__(self):
        # Use the public endpoint from frontend .env
        self.base_url = "https://eco-metrics-7.preview.emergentagent.com/api"
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            status = "✅ PASS"
        else:
            status = "❌ FAIL"
        
        result = f"{status} - {name}"
        if details:
            result += f" | {details}"
        
        print(result)
        self.test_results.append({
            "name": name,
            "success": success,
            "details": details
        })
        return success

    def test_user_registration(self):
        """Test user registration endpoint"""
        test_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        test_data = {
            "email": test_email,
            "password": "TestPass123!",
            "name": "Test User"
        }
        
        try:
            response = requests.post(f"{self.base_url}/auth/register", json=test_data)
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "token_type" in data:
                    self.token = data["access_token"]
                    return self.log_test("User Registration", True, f"Token received, email: {test_email}")
                else:
                    return self.log_test("User Registration", False, "Missing token in response")
            else:
                return self.log_test("User Registration", False, f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            return self.log_test("User Registration", False, f"Exception: {str(e)}")

    def test_user_login(self):
        """Test user login with existing test user"""
        test_data = {
            "email": "test@example.com",
            "password": "password123"
        }
        
        try:
            response = requests.post(f"{self.base_url}/auth/login", json=test_data)
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data:
                    self.token = data["access_token"]
                    return self.log_test("User Login", True, "Successfully logged in with test user")
                else:
                    return self.log_test("User Login", False, "Missing token in response")
            else:
                return self.log_test("User Login", False, f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            return self.log_test("User Login", False, f"Exception: {str(e)}")

    def test_get_current_user(self):
        """Test getting current user info"""
        if not self.token:
            return self.log_test("Get Current User", False, "No token available")
        
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = requests.get(f"{self.base_url}/auth/me", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if "id" in data and "email" in data and "name" in data:
                    self.user_id = data["id"]
                    return self.log_test("Get Current User", True, f"User: {data['name']} ({data['email']})")
                else:
                    return self.log_test("Get Current User", False, "Missing user fields in response")
            else:
                return self.log_test("Get Current User", False, f"Status: {response.status_code}")
                
        except Exception as e:
            return self.log_test("Get Current User", False, f"Exception: {str(e)}")

    def test_create_activity(self):
        """Test creating a transportation activity"""
        if not self.token:
            return self.log_test("Create Activity", False, "No token available")
        
        activity_data = {
            "transport_type": "car",
            "distance_km": 25.5,
            "date": datetime.now(timezone.utc).isoformat(),
            "description": "Test car trip to work"
        }
        
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = requests.post(f"{self.base_url}/activities", json=activity_data, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                expected_carbon = 25.5 * 0.21  # car emission factor
                if abs(data.get("carbon_footprint_kg", 0) - expected_carbon) < 0.01:
                    return self.log_test("Create Activity", True, f"Activity created, CO2: {data['carbon_footprint_kg']} kg")
                else:
                    return self.log_test("Create Activity", False, f"Incorrect carbon calculation: {data.get('carbon_footprint_kg')}")
            else:
                return self.log_test("Create Activity", False, f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            return self.log_test("Create Activity", False, f"Exception: {str(e)}")

    def test_get_activities(self):
        """Test getting user activities"""
        if not self.token:
            return self.log_test("Get Activities", False, "No token available")
        
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = requests.get(f"{self.base_url}/activities", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    return self.log_test("Get Activities", True, f"Retrieved {len(data)} activities")
                else:
                    return self.log_test("Get Activities", False, "Response is not a list")
            else:
                return self.log_test("Get Activities", False, f"Status: {response.status_code}")
                
        except Exception as e:
            return self.log_test("Get Activities", False, f"Exception: {str(e)}")

    def test_dashboard_stats(self):
        """Test dashboard statistics endpoint"""
        if not self.token:
            return self.log_test("Dashboard Stats", False, "No token available")
        
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = requests.get(f"{self.base_url}/dashboard/stats", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["total_emissions", "total_activities", "avg_daily_emissions", "current_month_emissions"]
                if all(field in data for field in required_fields):
                    return self.log_test("Dashboard Stats", True, f"Stats: {data['total_activities']} activities, {data['total_emissions']} kg CO2")
                else:
                    return self.log_test("Dashboard Stats", False, f"Missing required fields: {required_fields}")
            else:
                return self.log_test("Dashboard Stats", False, f"Status: {response.status_code}")
                
        except Exception as e:
            return self.log_test("Dashboard Stats", False, f"Exception: {str(e)}")

    def test_chart_data(self):
        """Test chart data endpoint"""
        if not self.token:
            return self.log_test("Chart Data", False, "No token available")
        
        periods = ["daily", "weekly", "monthly"]
        success_count = 0
        
        for period in periods:
            try:
                headers = {"Authorization": f"Bearer {self.token}"}
                response = requests.get(f"{self.base_url}/activities/chart-data?period={period}", headers=headers)
                
                if response.status_code == 200:
                    data = response.json()
                    if "data" in data and isinstance(data["data"], list):
                        success_count += 1
                        self.log_test(f"Chart Data ({period})", True, f"Retrieved {len(data['data'])} data points")
                    else:
                        self.log_test(f"Chart Data ({period})", False, "Invalid data format")
                else:
                    self.log_test(f"Chart Data ({period})", False, f"Status: {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"Chart Data ({period})", False, f"Exception: {str(e)}")
        
        return success_count == len(periods)

    def test_carbon_calculations(self):
        """Test carbon footprint calculations for different transport types"""
        if not self.token:
            return self.log_test("Carbon Calculations", False, "No token available")
        
        # Test different transport types with known emission factors
        transport_tests = [
            {"type": "car", "distance": 10, "expected": 2.1},
            {"type": "bus", "distance": 10, "expected": 0.89},
            {"type": "train", "distance": 10, "expected": 0.41},
            {"type": "flight", "distance": 10, "expected": 2.55},
            {"type": "walking", "distance": 10, "expected": 0.0},
            {"type": "cycling", "distance": 10, "expected": 0.0}
        ]
        
        success_count = 0
        headers = {"Authorization": f"Bearer {self.token}"}
        
        for test in transport_tests:
            try:
                activity_data = {
                    "transport_type": test["type"],
                    "distance_km": test["distance"],
                    "date": datetime.now(timezone.utc).isoformat(),
                    "description": f"Test {test['type']} calculation"
                }
                
                response = requests.post(f"{self.base_url}/activities", json=activity_data, headers=headers)
                
                if response.status_code == 200:
                    data = response.json()
                    actual_carbon = data.get("carbon_footprint_kg", 0)
                    if abs(actual_carbon - test["expected"]) < 0.01:
                        success_count += 1
                        self.log_test(f"Carbon Calc ({test['type']})", True, f"{actual_carbon} kg CO2")
                    else:
                        self.log_test(f"Carbon Calc ({test['type']})", False, f"Expected {test['expected']}, got {actual_carbon}")
                else:
                    self.log_test(f"Carbon Calc ({test['type']})", False, f"Status: {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"Carbon Calc ({test['type']})", False, f"Exception: {str(e)}")
        
        return success_count == len(transport_tests)

    def test_authentication_flow(self):
        """Test complete authentication flow"""
        # Test invalid login
        try:
            invalid_data = {"email": "invalid@example.com", "password": "wrongpass"}
            response = requests.post(f"{self.base_url}/auth/login", json=invalid_data)
            
            if response.status_code == 401:
                self.log_test("Invalid Login Rejection", True, "Correctly rejected invalid credentials")
            else:
                self.log_test("Invalid Login Rejection", False, f"Expected 401, got {response.status_code}")
                
        except Exception as e:
            self.log_test("Invalid Login Rejection", False, f"Exception: {str(e)}")

        # Test accessing protected endpoint without token
        try:
            response = requests.get(f"{self.base_url}/auth/me")
            
            if response.status_code == 403:  # FastAPI HTTPBearer returns 403 for missing token
                self.log_test("Protected Endpoint Security", True, "Correctly rejected request without token")
            else:
                self.log_test("Protected Endpoint Security", False, f"Expected 403, got {response.status_code}")
                
        except Exception as e:
            self.log_test("Protected Endpoint Security", False, f"Exception: {str(e)}")

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting EcoTrack API Tests")
        print("=" * 50)
        
        # Try to login with existing test user first, then register if needed
        if not self.test_user_login():
            print("\n📝 Test user login failed, trying registration...")
            if not self.test_user_registration():
                print("❌ Cannot proceed without authentication")
                return False
        
        # Run authenticated tests
        self.test_get_current_user()
        self.test_create_activity()
        self.test_get_activities()
        self.test_dashboard_stats()
        self.test_chart_data()
        self.test_carbon_calculations()
        
        # Test security
        self.test_authentication_flow()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return False

def main():
    tester = EcoTrackAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())