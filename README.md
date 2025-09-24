# 🌱 EcoTrack: Personal Carbon Footprint Calculator

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue.svg)](https://github.com/features/actions)

A comprehensive full-stack web application that empowers users to track and reduce their carbon footprint through intelligent transportation monitoring. Features real-time CO₂ calculations, interactive visualizations, and personalized sustainability insights.

**🎯 Perfect for demonstrating modern web development skills, environmental consciousness, and full-stack expertise for your portfolio and resume!**

## 🚀 Live Demo & Screenshots

### Landing Page
![EcoTrack Landing Page](https://via.placeholder.com/800x400/10b981/ffffff?text=EcoTrack+Landing+Page)
*Beautiful, responsive landing page with clear call-to-action*

### Dashboard Interface  
![EcoTrack Dashboard](https://via.placeholder.com/800x400/059669/ffffff?text=EcoTrack+Dashboard)
*Interactive dashboard with real-time statistics and emission trends*

- **🌐 Frontend**: [Demo Link] - Responsive React application
- **⚡ Backend API**: [API Documentation] - RESTful FastAPI endpoints  
- **📊 Database**: MongoDB with optimized queries
- **🔧 GitHub**: Complete source code with CI/CD pipeline

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

## 🛠️ Tech Stack
- **Frontend**: React.js, Chart.js (for charts), Axios (for API calls), Tailwind CSS (styling).
- **Backend**: Node.js, Express.js (API server), Mongoose (ORM).
- **Database**: MongoDB (cloud-hosted on Atlas).
- **Authentication**: JWT tokens, bcrypt for passwords.
- **Deployment**: Vercel (frontend), Render (backend), MongoDB Atlas (DB).
- **Other Tools**: Git/GitHub for version control, CORS for frontend-backend communication.

## 📋 Prerequisites
- Node.js (v14+)
- MongoDB account (free Atlas cluster)
- Git installed

## 🏗️ Installation & Setup (Local Development)
Follow these steps to run the project on your machine:

### 1. Clone the Repository
```bash
git clone https://github.com/[yourusername]/ecotrack.git
cd ecotrack
