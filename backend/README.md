# Backend - VeriMedia API Server

The backend API server for VeriMedia, built with Node.js and Express.js, providing REST endpoints for media verification and watermarking.

## Overview

This Express.js application serves as the API backend for the VeriMedia platform, handling:
- User authentication and authorization
- Media file uploads and processing
- Integration with AI analysis services
- Database operations for verification logs
- Cryptographic watermarking operations

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload handling
- **Bcrypt** - Password hashing

## Project Structure

```
backend/
├── config/
│   ├── ai.config.js              # AI service configuration
│   └── db.js                     # MongoDB connection setup
├── controllers/
│   ├── auth.controller.js        # Authentication handlers
│   ├── verify.controller.js      # Media verification logic
│   └── watermark.controller.js   # Watermarking operations
├── middleware/
│   └── auth.middleware.js        # JWT authentication middleware
├── models/
│   ├── User.js                   # User schema
│   └── Verification.js           # Verification log schema
├── routes/
│   ├── auth.routes.js            # Authentication endpoints
│   ├── verify.routes.js          # Verification API routes
│   └── watermark.routes.js       # Watermarking routes
├── uploads/                      # Temporary file storage
├── .env                          # Environment variables
├── app.js                        # Express application setup
├── package.json                  # Dependencies and scripts
├── README.md                     # This file
└── server.js                     # Server entry point
```

## Key Features

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

#### Media Verification
- `POST /api/verify` - Upload and analyze media files
- Returns AI analysis results with trust scores

#### Watermarking
- `POST /api/watermark` - Embed C2PA watermarks
- Processes files and returns watermarked versions

### Security
- **JWT Authentication**: Token-based user sessions
- **Password Hashing**: Bcrypt for secure password storage
- **File Validation**: Type and size restrictions on uploads
- **CORS Configuration**: Cross-origin request handling

### Database Integration
- **User Management**: Registration and authentication
- **Verification Logs**: Store analysis results and metadata
- **File Tracking**: Upload history and processing status

## Development

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud instance)

### Installation
```bash
cd backend
npm install
```

### Environment Setup
Create a `.env` file:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/verimedia
JWT_SECRET=your_secret_key
AI_SERVICE_URL=http://127.0.0.1:8000
```

### Running the Server
```bash
npm start          # Production mode
npm run dev        # Development with nodemon
```

### Database
Ensure MongoDB is running on the specified URI. The application will create collections automatically.

## API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Media Verification

#### Analyze Media
```http
POST /api/verify
Content-Type: multipart/form-data

file: [image/video file]
```

Response:
```json
{
  "trustScore": 85,
  "prediction": "REAL",
  "real_probability": 87.5,
  "fake_probability": 12.5,
  "layers": [
    {
      "name": "AI Deepfake Detection",
      "status": "pass",
      "confidence": 87.5
    }
  ]
}
```

### Watermarking

#### Add Watermark
```http
POST /api/watermark
Content-Type: multipart/form-data

file: [image/video file]
```

Returns the watermarked file as a blob.

## File Handling

- **Upload Directory**: Files are temporarily stored in `uploads/`
- **Cleanup**: Files are automatically deleted after processing
- **Size Limits**: Configurable upload size restrictions
- **Type Validation**: Only image and video files accepted

## Error Handling

The API provides consistent error responses:

```json
{
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid input)
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Middleware

### Authentication Middleware
Protects routes requiring user authentication:

```javascript
const auth = require('./middleware/auth.middleware');
app.use('/api/protected', auth, protectedRoutes);
```

### File Upload Middleware
Handles multipart form data:

```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
app.post('/upload', upload.single('file'), controller);
```

## Database Models

### User Model
```javascript
{
  name: String,
  email: String,
  password: String, // Hashed
  createdAt: Date
}
```

### Verification Model
```javascript
{
  trustScore: Number,
  layers: [{
    name: String,
    status: String,
    confidence: Number
  }],
  createdAt: Date
}
```

## Testing

```bash
npm test  # If test scripts are added
```

## Deployment

1. Set production environment variables
2. Use a process manager like PM2
3. Configure reverse proxy (nginx)
4. Set up SSL certificates
5. Monitor logs and performance

## Contributing

1. Follow existing code patterns
2. Add proper error handling
3. Update API documentation
4. Test endpoints thoroughly

## Related Documentation

- [Main Project README](../README.md)
- [Frontend](../frontend/README.md)
- [AI Service](../ai-service/README.md)