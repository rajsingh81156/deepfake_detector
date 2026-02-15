# VeriMedia: AI-Powered Deepfake Detection Platform

A comprehensive web application that combines advanced AI deepfake detection with cryptographic watermarking to establish media authenticity and provenance. Built with a multi-layered "Swiss Cheese Model" approach for robust content verification.

##  Features

### AI Deepfake Detection
- **Neural Network Analysis**: Trained MobileNetV2 model for detecting synthetic media
- **Real-time Processing**: Fast inference on uploaded images and videos
- **Confidence Scoring**: Detailed probability assessments for real vs. fake content

### Cryptographic Watermarking
- **C2PA Standard**: Content Provenance and Authenticity compliant watermarks
- **Immutable Metadata**: Tamper-proof digital signatures embedded in media
- **Chain of Custody**: Track every modification and edit history

### Multi-Layer Verification
- **Swiss Cheese Model**: Overlapping detection methods prevent single-point failures
- **Metadata Analysis**: EXIF, IPTC, and XMP data inspection
- **Behavioral Signals**: Advanced pattern recognition for AI-generated artifacts

### Modern Web Interface
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Feedback**: Instant analysis results with visual indicators
- **Intuitive UX**: Drag-and-drop file uploads with progress tracking

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern component-based UI
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - REST API framework
- **MongoDB** - Document database for verification logs
- **Multer** - File upload handling
- **JWT** - Authentication tokens

### AI Service
- **Python 3.13** - AI/ML processing
- **FastAPI** - High-performance API framework
- **PyTorch** - Deep learning framework
- **Torchvision** - Computer vision utilities
- **MobileNetV2** - Lightweight CNN architecture

## 📁 Project Structure

```
deepfake_detector/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   └── services/      # API communication
│   └── package.json
├── backend/           # Node.js API server
│   ├── controllers/       # Route handlers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   └── config/           # Configuration files
├── ai-service/        # Python AI service
│   ├── model/            # PyTorch model and preprocessing
│   └── main.py          # FastAPI application
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rajsingh81156/deepfake_detector.git
   cd deepfake_detector
   ```

2. **Setup AI Service**
   ```bash
   cd ai-service
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

3. **Setup Backend**
   ```bash
   cd ../backend
   npm install
   # Ensure MongoDB is running
   npm run dev
   ```

4. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

### Run with Docker (single command)

Use the provided scripts to build and start all services (MongoDB, AI service, backend, frontend) with one command.

On macOS / Linux:
```bash
./start.sh
```

On Windows (PowerShell):
```powershell
.\start.ps1
```

The scripts run `docker compose up --build -d` under the hood. To stop and remove containers run:

```bash
docker compose down
```

### Environment Variables

Create `.env` files in `backend/` and `frontend/`:

**backend/.env**
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/verimedia
JWT_SECRET=your_secret_key
AI_SERVICE_URL=http://127.0.0.1:8000
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
```

## 🔧 API Endpoints

### Verification
- `POST /api/verify` - Analyze media for deepfakes
- `GET /api/verifications` - Get verification history

### Watermarking
- `POST /api/watermark` - Embed C2PA watermark

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

## 🤖 AI Model Details

The deepfake detection model is based on MobileNetV2 architecture:
- **Input**: 224x224 RGB images
- **Architecture**: MobileNetV2 → Custom classifier (128 → 2)
- **Training**: Binary classification (Real/Fake)
- **Accuracy**: ~95% on test dataset

## 📊 Swiss Cheese Model

Our verification approach uses multiple overlapping layers:

1. **AI Detection Layer** - Neural network analysis
2. **Metadata Layer** - File metadata inspection
3. **Watermark Layer** - Cryptographic provenance
4. **Behavioral Layer** - Pattern recognition
5. **Source Attribution** - Origin verification

## 🔒 Security Features

- **Cryptographic Watermarks** - Tamper-proof content signing
- **File Integrity** - SHA-256 hashing for verification
- **Secure Uploads** - Temporary file handling with cleanup
- **CORS Protection** - Configured cross-origin policies

## 📈 Performance

- **Inference Time**: < 500ms per image
- **Model Size**: ~10MB (MobileNetV2)
- **Memory Usage**: ~200MB during operation
- **Concurrent Requests**: Supports multiple simultaneous analyses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

For questions or support, please open an issue on GitHub.

---

**VeriMedia** - Establishing trust in digital media through AI and cryptography.