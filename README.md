# 🌱 EcoTrack: Personal Carbon Footprint Calculator

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue.svg)](https://github.com/features/actions)

A comprehensive full-stack web application that empowers users to track and reduce their carbon footprint through intelligent transportation monitoring. Features real-time CO₂ calculations, interactive visualizations, and personalized sustainability insights.

**🎯 Perfect for demonstrating modern web development skills, environmental consciousness, and full-stack expertise for your portfolio and resume!**

## 🚀 Application Screenshots

### 🏠 Landing Page
![EcoTrack Landing Page](screenshots/landing-page.png)
*Beautiful, responsive landing page with clear environmental messaging and call-to-action*

### 📊 Dashboard Interface  
![EcoTrack Dashboard](screenshots/dashboard.png)
*Interactive dashboard with real-time carbon footprint statistics and emission trends*

### ➕ Activity Management
![Add Activity](screenshots/add-activity.png)
*User-friendly form for logging transportation activities with multiple transport types*

### 📋 Activity History
![Activity History](screenshots/activity-history.png)
*Complete history of logged activities with emission calculations and transport icons*

## 🌐 Local Development

To run this application locally:

```bash
# Clone the repository
git clone https://github.com/yourusername/ecotrack.git
cd ecotrack

# Backend setup
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8001

# Frontend setup (new terminal)
cd frontend
yarn install
yarn start
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Documentation**: http://localhost:8001/docs

## ✨ Key Features

### 🔐 **Secure Authentication System**
- JWT-based authentication with bcrypt password hashing
- User registration and login with form validation
- Protected routes and session management
- Secure token storage and refresh

### 📊 **Transportation Activity Tracking**
- Multiple transport types: Car, Bus, Train, Flight, Walking, Cycling
- Real-time CO₂ calculations using scientific emission factors:
  - Car: 0.21 kg CO₂/km | Bus: 0.089 kg CO₂/km | Train: 0.041 kg CO₂/km
  - Flight: 0.255 kg CO₂/km | Walking/Cycling: 0.0 kg CO₂/km
- Distance tracking with date/time logging
- Activity descriptions and notes

### 📈 **Interactive Dashboard & Analytics**
- Real-time statistics: Total emissions, activity count, daily averages
- Dynamic charts with Chart.js (daily, weekly, monthly views)
- Responsive data visualization with trend analysis
- Personalized emission tracking over time

### 🎨 **Modern User Experience**
- Responsive design with Tailwind CSS and shadcn/ui components
- Mobile-first approach with cross-device compatibility
- Smooth animations and loading states
- Intuitive navigation and user flows

### 🔧 **Technical Excellence**
- RESTful API architecture with FastAPI
- MongoDB integration with optimized queries
- Comprehensive error handling and validation
- Automated testing suite and CI/CD pipeline

## 🛠️ Technology Stack

### Frontend
![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-3178C6?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.17-06B6D4?style=flat-square&logo=tailwindcss)

- **React 19** - Modern functional components with hooks
- **Chart.js** - Interactive data visualization and trend analysis  
- **shadcn/ui** - Beautiful, accessible UI component library
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Axios** - Promise-based HTTP client for API communication
- **React Router** - Client-side routing and navigation

### Backend  
![FastAPI](https://img.shields.io/badge/FastAPI-0.110.1-009688?style=flat-square&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=flat-square&logo=mongodb)

- **FastAPI** - High-performance Python web framework
- **Motor** - Asynchronous MongoDB driver
- **Pydantic** - Data validation and settings management
- **JWT & bcrypt** - Secure authentication and password hashing
- **Uvicorn** - ASGI server for production deployment

### Development & Deployment
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)
![GitHub](https://img.shields.io/badge/GitHub-Actions-181717?style=flat-square&logo=github)

- **MongoDB** - NoSQL database for flexible data storage
- **GitHub Actions** - Automated CI/CD pipeline
- **Docker** - Containerization for consistent deployment
- **Vercel/Render** - Cloud deployment platforms

## 📋 Prerequisites
- **Node.js** (v18+) - [Download](https://nodejs.org/)
- **Python** (3.11+) - [Download](https://python.org/)
- **MongoDB** - Local installation or [Atlas account](https://mongodb.com/atlas)
- **Git** - [Download](https://git-scm.com/)
- **Yarn** - `npm install -g yarn`

## 🏗️ Installation & Setup

### 2. Environment Setup

**Backend Environment:**
```bash
cd backend
cp .env.example .env
```

Edit `.env` file:
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=ecotrack
CORS_ORIGINS=http://localhost:3000
```

**Frontend Environment:**
```bash
cd frontend  
cp .env.example .env
```

Edit `.env` file:
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

### 3. Install Dependencies

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
yarn install
```

### 4. Start Development Servers

**Backend (Terminal 1):**
```bash
cd backend
uvicorn server:app --reload --port 8001
```

**Frontend (Terminal 2):**
```bash
cd frontend
yarn start
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001  
- **API Docs**: http://localhost:8001/docs
