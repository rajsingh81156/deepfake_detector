# 🚀 VeriMedia Deployment Guide

## Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)
- MongoDB (local or cloud instance)

## Quick Start with Docker Compose

1. **Clone the repository**
   ```bash
   git clone https://github.com/rajsingh81156/verimedia.git
   cd verimedia
   ```

2. **Configure environment variables**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your actual values
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - AI Service: http://localhost:8000
   - MongoDB: localhost:27017

## Manual Deployment

### 1. AI Service Setup
```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run build
npm run preview
```

## Production Deployment

### Environment Variables

Create production `.env` files:

**backend/.env**
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/verimedia
JWT_SECRET=your_super_secure_jwt_secret
AI_SERVICE_URL=http://your-ai-service-url:8000/analyze
FRONTEND_URL=https://yourdomain.com
```

**frontend/.env**
```env
VITE_API_URL=https://your-api-domain.com/api
```

### Using Docker in Production

1. **Build and push images**
   ```bash
   # Build images
   docker build -t verimedia-ai ./ai-service
   docker build -t verimedia-backend ./backend
   docker build -t verimedia-frontend ./frontend

   # Tag and push to registry
   docker tag verimedia-ai your-registry/verimedia-ai:latest
   docker push your-registry/verimedia-ai:latest
   ```

2. **Deploy with docker-compose.prod.yml**
   ```yaml
   # docker-compose.prod.yml
   version: '3.8'
   services:
     ai-service:
       image: your-registry/verimedia-ai:latest
       environment:
         - PYTHONPATH=/app
       ports:
         - "8000:8000"

     backend:
       image: your-registry/verimedia-backend:latest
       environment:
         - NODE_ENV=production
         - MONGO_URI=${MONGO_URI}
         - JWT_SECRET=${JWT_SECRET}
         - AI_SERVICE_URL=http://ai-service:8000/analyze
       ports:
         - "5000:5000"

     frontend:
       image: your-registry/verimedia-frontend:latest
       ports:
         - "80:5173"
   ```

## Cloud Deployment Options

### Vercel (Frontend)
```bash
npm install -g vercel
cd frontend
vercel --prod
```

### Railway (Backend + Database)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### AWS/GCP/Azure
- Use ECS/EKS for container orchestration
- Cloud Run for serverless
- App Engine for full-stack

## Troubleshooting

### Common Issues

1. **AI Service Connection Failed**
   - Ensure AI service is running on port 8000
   - Check AI_SERVICE_URL in backend/.env
   - Verify CORS settings

2. **Database Connection Failed**
   - Check MONGO_URI in backend/.env
   - Ensure MongoDB is running
   - Verify network connectivity

3. **File Upload Issues**
   - Check uploads directory permissions
   - Verify file size limits
   - Check multer configuration

4. **CORS Errors**
   - Update FRONTEND_URL in backend/.env
   - Check CORS middleware configuration

### Health Checks

- Backend: `GET /health`
- AI Service: `GET /health`
- Database: Check MongoDB connection

### Logs

```bash
# View container logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
```

## Security Checklist

- [ ] Change default JWT secret
- [ ] Use HTTPS in production
- [ ] Configure proper CORS origins
- [ ] Set up proper MongoDB authentication
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Use environment variables for secrets
- [ ] Regular dependency updates

## Performance Optimization

- Enable gzip compression
- Implement caching headers
- Use CDN for static assets
- Optimize Docker images
- Set up monitoring and logging
- Implement database indexing

## Monitoring

Consider adding:
- Application Performance Monitoring (APM)
- Error tracking (Sentry)
- Log aggregation (ELK stack)
- Health check endpoints
- Metrics collection (Prometheus)