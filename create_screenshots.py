#!/usr/bin/env python3
"""
Script to generate placeholder screenshots for the EcoTrack application.
Run this after setting up the development environment.
"""

import os
import subprocess
import sys

def create_screenshot_placeholders():
    """Create placeholder screenshots for GitHub README"""
    screenshots_dir = "screenshots"
    
    if not os.path.exists(screenshots_dir):
        os.makedirs(screenshots_dir)
    
    # Create placeholder files
    placeholders = [
        "landing-page.png",
        "dashboard.png", 
        "add-activity.png",
        "activity-history.png",
        "auth-modal.png"
    ]
    
    placeholder_content = b"PLACEHOLDER_IMAGE"
    
    for placeholder in placeholders:
        filepath = os.path.join(screenshots_dir, placeholder)
        if not os.path.exists(filepath):
            with open(filepath, "wb") as f:
                f.write(placeholder_content)
            print(f"✅ Created placeholder: {filepath}")
        else:
            print(f"📸 Screenshot exists: {filepath}")

def main():
    print("🖼️  EcoTrack Screenshot Generator")
    print("=" * 40)
    
    create_screenshot_placeholders()
    
    print("\n📋 To generate real screenshots:")
    print("1. Start the development servers:")
    print("   Backend: cd backend && uvicorn server:app --reload --port 8001")
    print("   Frontend: cd frontend && yarn start")
    print("2. Navigate to http://localhost:3000")
    print("3. Take screenshots manually and replace the placeholder files")
    print("4. Recommended screenshot sizes: 800x500 or 1200x800")

if __name__ == "__main__":
    main()