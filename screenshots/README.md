# EcoTrack Screenshots

This directory contains screenshots of the EcoTrack application for documentation purposes.

## Screenshots to Add:

1. **landing-page.png** - Homepage with hero section and feature cards
2. **auth-modal.png** - Login/registration modal
3. **dashboard.png** - User dashboard with statistics and charts
4. **add-activity.png** - Activity creation form
5. **activity-history.png** - Activity history list
6. **mobile-view.png** - Mobile responsive design

## How to Generate Screenshots:

1. Run the application locally:
   ```bash
   # Backend
   cd backend && uvicorn server:app --reload --port 8001
   
   # Frontend  
   cd frontend && yarn start
   ```

2. Navigate to http://localhost:3000
3. Take screenshots of different pages
4. Save them in this directory

## Usage in README:

Screenshots are referenced in the main README.md using relative paths:
```markdown
![Landing Page](screenshots/landing-page.png)
```