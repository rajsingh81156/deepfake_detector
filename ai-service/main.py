from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import torch

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
# Load model ONCE (IMPORTANT)
# ----------------------------
model = load_model()
model.eval()  # ✅ VERY IMPORTANT

# ----------------------------
# Routes
# ----------------------------
@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": True}

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

        # Inference
        with torch.no_grad():
            outputs = model(image_tensor)
            probs = torch.softmax(outputs, dim=1)

        fake_prob = probs[0][1].item()
        real_prob = probs[0][0].item()

        trust_score = int((1 - fake_prob) * 100)

        return {
            "trustScore": trust_score,
            "prediction": "FAKE" if fake_prob > 0.5 else "REAL",
            "real_probability": round(real_prob * 100, 2),
            "fake_probability": round(fake_prob * 100, 2),
            "layers": [
                {
                    "name": "AI Deepfake Detection",
                    "status": "fail" if fake_prob > 0.5 else "pass",
                    "confidence": round(max(real_prob, fake_prob) * 100, 2)
                }
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

    finally:
        # ✅ Cleanup file
        if os.path.exists(file_path):
            os.remove(file_path)
