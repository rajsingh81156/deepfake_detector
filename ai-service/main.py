from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import torch
import torch.nn.functional as F

from model.model import load_model, DEVICE
from model.preprocess import preprocess_image

# ----------------------------
# App init
# ----------------------------
app = FastAPI(title="VeriMedia AI Service")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ----------------------------
# Configuration
# ----------------------------
# Adjust this threshold based on your model's optimal threshold
# Lower = more sensitive to fakes (catches more but may have false positives)
# Higher = less sensitive (fewer false positives but may miss some fakes)
DETECTION_THRESHOLD = 0.5  # Default, adjust based on find_optimal_threshold results

# Model file path
MODEL_PATH = "model/best_deepfake_model.pth"

# ----------------------------
# Load model ONCE (IMPORTANT)
# ----------------------------
print(f"🚀 Loading model from {MODEL_PATH}...")
model = load_model(MODEL_PATH, model_type="auto")
model.eval()  # ✅ VERY IMPORTANT
print(f"✅ Model loaded successfully on {DEVICE}")
print(f"🎯 Detection threshold: {DETECTION_THRESHOLD}")

# ----------------------------
# Routes
# ----------------------------
@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "model_loaded": True,
        "device": str(DEVICE),
        "threshold": DETECTION_THRESHOLD
    }

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    # Validate file extension
    allowed_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp'}
    file_ext = os.path.splitext(file.filename.lower())[1]

    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Invalid file type. Only images are allowed.")

    file_path = os.path.join(UPLOAD_DIR, f"{os.urandom(16).hex()}{file_ext}")

    try:
        # Save uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Check file size (max 10MB)
        if os.path.getsize(file_path) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 10MB.")

        # Preprocess
        image_tensor = preprocess_image(file_path, DEVICE)

        # Inference with mixed precision for faster processing
        with torch.no_grad():
            if DEVICE.type == 'cuda':
                with torch.amp.autocast(device_type='cuda'):
                    outputs = model(image_tensor)
            else:
                outputs = model(image_tensor)
            
            # Calculate probabilities
            probs = F.softmax(outputs, dim=1)

        # Extract probabilities
        real_prob = probs[0][0].item()
        fake_prob = probs[0][1].item()

        # Use configurable threshold for prediction
        is_fake = fake_prob > DETECTION_THRESHOLD
        prediction = "FAKE" if is_fake else "REAL"

        # Trust score: inverse of fake probability
        trust_score = int((1 - fake_prob) * 100)

        # Determine confidence (max of real or fake probability)
        confidence = max(real_prob, fake_prob)

        return {
            "trustScore": trust_score,
            "prediction": prediction,
            "real_probability": round(real_prob * 100, 2),
            "fake_probability": round(fake_prob * 100, 2),
            "threshold_used": DETECTION_THRESHOLD,
            "layers": [
                {
                    "name": "AI Deepfake Detection",
                    "status": "fail" if is_fake else "pass",
                    "confidence": round(confidence * 100, 2),
                    "details": f"{'Fake' if is_fake else 'Real'} with {confidence*100:.1f}% confidence"
                }
            ],
            "metadata": {
                "model": "Enhanced Deepfake Detector",
                "device": str(DEVICE),
                "threshold": DETECTION_THRESHOLD
            }
        }

    except Exception as e:
        print(f"❌ Analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

    finally:
        # ✅ Cleanup file
        if os.path.exists(file_path):
            os.remove(file_path)


@app.post("/analyze/batch")
async def analyze_batch(files: list[UploadFile] = File(...)):
    """Analyze multiple images at once"""
    if len(files) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 files allowed per batch")
    
    results = []
    for file in files:
        try:
            # Reuse analyze logic
            result = await analyze(file)
            results.append({
                "filename": file.filename,
                "result": result,
                "status": "success"
            })
        except Exception as e:
            results.append({
                "filename": file.filename,
                "error": str(e),
                "status": "error"
            })
    
    return {"results": results}


@app.get("/config")
async def get_config():
    """Get current API configuration"""
    return {
        "threshold": DETECTION_THRESHOLD,
        "device": str(DEVICE),
        "max_file_size_mb": 10,
        "allowed_extensions": ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
        "model_info": {
            "type": "Enhanced Deepfake Detector",
            "architecture": "EfficientNet-B0 based"
        }
    }