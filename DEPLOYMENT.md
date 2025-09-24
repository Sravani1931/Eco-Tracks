# 🚀 EcoTrack Deployment Guide

This guide covers deploying EcoTrack to various platforms for your resume and portfolio.

## 📋 Prerequisites

- GitHub account
- Domain name (optional)
- MongoDB Atlas account (free tier available)

## 🌐 Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://mongodb.com/atlas)
   - Create free cluster

2. **Configure Database**
   - Create database: `ecotrack`
   - Create user with read/write permissions
   - Get connection string

3. **Update Environment Variables**
   ```env
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/ecotrack
   ```

## 🎯 Frontend Deployment (Vercel)

### Option 1: Vercel (Recommended)

1. **Connect GitHub Repository**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository

2. **Configure Build Settings**
   ```bash
   # Build Command
   cd frontend && yarn build
   
   # Output Directory
   frontend/build
   
   # Install Command
   cd frontend && yarn install
   ```

3. **Environment Variables**
   ```env
   REACT_APP_BACKEND_URL=https://your-backend-url.com
   ```

4. **Deploy**
   - Vercel automatically deploys on push to main branch

### Option 2: Netlify

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Connect GitHub repository

2. **Build Settings**
   ```bash
   # Build command
   cd frontend && yarn build
   
   # Publish directory
   frontend/build
   ```

## ⚡ Backend Deployment (Render)

### Option 1: Render (Recommended)

1. **Create Web Service**
   - Go to [Render](https://render.com)
   - Connect GitHub repository

2. **Configure Service**
   ```yaml
   # Build Command
   cd backend && pip install -r requirements.txt
   
   # Start Command
   cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT
   
   # Environment
   Python 3.11
   ```

3. **Environment Variables**
   ```env
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/ecotrack
   DB_NAME=ecotrack
   CORS_ORIGINS=https://your-frontend-url.vercel.app
   SECRET_KEY=your-production-secret-key
   ```

### Option 2: Railway

1. **Connect Repository**
   - Go to [Railway](https://railway.app)
   - Deploy from GitHub

2. **Configure**
   ```bash
   # Procfile (create in backend directory)
   web: uvicorn server:app --host 0.0.0.0 --port $PORT
   ```

## 🐳 Docker Deployment

### Backend Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8001

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
```

### Frontend Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8001:8001"
    environment:
      - MONGO_URL=mongodb://mongo:27017
      - DB_NAME=ecotrack

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      - REACT_APP_BACKEND_URL=http://localhost:8001

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

## 🔒 Security Considerations

### Production Environment Variables

**Backend:**
```env
SECRET_KEY=complex-random-secret-key-for-production
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/ecotrack
```

**Frontend:**
```env
REACT_APP_BACKEND_URL=https://your-api-domain.com
```

### Security Checklist

- [ ] Use strong SECRET_KEY in production
- [ ] Configure CORS origins properly
- [ ] Use HTTPS for all communications
- [ ] Set up proper database authentication
- [ ] Enable MongoDB security features
- [ ] Use environment variables for secrets
- [ ] Set up monitoring and logging

## 📊 Monitoring & Analytics

### Health Checks

Add health check endpoint:
```python
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}
```

### Error Tracking

Consider integrating:
- Sentry for error tracking
- LogRocket for frontend monitoring
- MongoDB Atlas monitoring

## 🎯 Resume & Portfolio Tips

### Live Demo Links
- Add working demo links to your resume
- Include in GitHub repository description
- Share in LinkedIn projects section

### Documentation
- Comprehensive README with screenshots
- API documentation with examples
- Architecture diagrams
- Performance metrics

### Showcase Features
- Highlight environmental impact
- Demonstrate technical skills
- Show responsive design
- Include testing coverage

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check CORS_ORIGINS environment variable
   - Ensure frontend URL matches CORS setting

2. **Database Connection**
   - Verify MongoDB connection string
   - Check network access in Atlas

3. **Build Failures**
   - Check Node.js/Python versions
   - Verify all dependencies are listed

### Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

---

## 🎉 Success Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and functional
- [ ] Database connected and working
- [ ] Environment variables configured
- [ ] Custom domain configured (optional)
- [ ] HTTPS certificates working
- [ ] API endpoints responding correctly
- [ ] Frontend-backend communication working
- [ ] Error handling in place
- [ ] Monitoring configured

Your EcoTrack application is now live and ready to impress recruiters! 🌱