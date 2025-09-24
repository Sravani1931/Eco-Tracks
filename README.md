# 🌱 EcoTrack: Personal Carbon Footprint Calculator

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue.svg)](https://github.com/features/actions)

A comprehensive full-stack web application that empowers users to track and reduce their carbon footprint through intelligent transportation monitoring. Features real-time CO₂ calculations, interactive visualizations, and personalized sustainability insights.

**🎯 Perfect for demonstrating modern web development skills, environmental consciousness, and full-stack expertise for your portfolio and resume!**

## 🚀 Live Demo
- **Frontend**: [Live App Link]([live-link]) (Hosted on Vercel)
- **Backend API**: [API Docs or Backend Link]([backend-link-if-public]) (Hosted on Render)
- **GitHub Repo**: [[github-repo-link]]

![Home Page Screenshot](https://github.com/[yourusername]/ecotrack/raw/main/screenshot-home.png)
*(Screenshot of the dashboard with a sample emissions chart)*

## ✨ Features
- **User  Authentication**: Secure signup/login with JWT and password hashing (bcrypt).
- **Activity Logging**: Forms to input daily activities (e.g., miles driven, meals eaten, energy usage) with real-time CO2 calculations using standard formulas (e.g., 0.4 kg CO2 per mile for cars).
- **Personalized Reports**: Dashboard with visualizations using Chart.js (line/bar charts for emissions trends over time).
- **Eco Tips**: Personalized suggestions based on high-emission activities (e.g., "Switch to public transit to save 20% CO2").
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS.
- **Bonus Integration**: Weather-based tips via OpenWeather API (e.g., "Bundle up—reduce heating use today").

Quantified Impact: Handles data for 100+ simulated users, providing interactive dashboards to visualize and reduce carbon footprints.

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
