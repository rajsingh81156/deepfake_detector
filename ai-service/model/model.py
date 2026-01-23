import torch
import torch.nn as nn
from torchvision import models

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class ImprovedDeepfakeDetector(nn.Module):
    """Enhanced model with attention to fake features - matches training architecture"""
    def __init__(self, num_classes: int = 2, dropout_rate: float = 0.4):
        super(ImprovedDeepfakeDetector, self).__init__()
        
        # Use EfficientNet for better feature extraction
        self.backbone = models.efficientnet_b0(weights=None)  # weights=None since we're loading checkpoint
        in_features = self.backbone.classifier[1].in_features
        
        # Enhanced classifier with more capacity - MUST match training architecture
        self.backbone.classifier = nn.Sequential(
            nn.Dropout(dropout_rate),
            nn.Linear(in_features, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(),
            nn.Dropout(dropout_rate),
            nn.Linear(512, 256),
            nn.BatchNorm1d(256),
            nn.ReLU(),
            nn.Dropout(dropout_rate * 0.75),  # Less dropout in final layer
            nn.Linear(256, num_classes)
        )
    
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.backbone(x)


# Legacy MobileNet model for backward compatibility
class MobileNetDeepfake(nn.Module):
    """Original MobileNet architecture - kept for backward compatibility"""
    def __init__(self):
        super().__init__()
        self.model = models.mobilenet_v2(weights=None)
        self.model.classifier = nn.Sequential(
            nn.Dropout(0.7),
            nn.Linear(self.model.last_channel, 128),
            nn.ReLU(),
            nn.Dropout(0.6),
            nn.Linear(128, 2)
        )

    def forward(self, x):
        return self.model(x)


def load_model(model_path: str = "model/best_deepfake_model.pth", 
               model_type: str = "auto"):
    """
    Load deepfake detection model
    
    Args:
        model_path: Path to the model checkpoint
        model_type: 'auto', 'enhanced', or 'mobilenet'
                   'auto' will try to detect from checkpoint
    
    Returns:
        Loaded model ready for inference
    """
    # Load checkpoint first to inspect it
    checkpoint = torch.load(model_path, map_location=DEVICE, weights_only=False)
    
    # Auto-detect model type from checkpoint if possible
    if model_type == "auto":
        state_dict = checkpoint.get("model_state_dict", checkpoint)
        
        # Check if it's the enhanced model (has backbone.classifier structure with 512, 256 layers)
        if any("backbone.classifier" in key for key in state_dict.keys()):
            model_type = "enhanced"
            print("✅ Detected enhanced EfficientNet model")
        else:
            model_type = "mobilenet"
            print("✅ Detected legacy MobileNet model")
    
    # Initialize the appropriate model
    if model_type == "enhanced":
        model = ImprovedDeepfakeDetector(num_classes=2, dropout_rate=0.4)
        print(f"📦 Loaded ImprovedDeepfakeDetector (EfficientNet-B0)")
    else:
        model = MobileNetDeepfake()
        print(f"📦 Loaded MobileNetDeepfake (MobileNet-V2)")
    
    # Load state dict
    if "model_state_dict" in checkpoint:
        model.load_state_dict(checkpoint["model_state_dict"])
        
        # Print additional info if available
        if "recall_fake" in checkpoint:
            print(f"   Fake Detection Recall: {checkpoint['recall_fake']:.4f}")
        if "val_acc" in checkpoint:
            print(f"   Validation Accuracy: {checkpoint['val_acc']:.2f}%")
        if "epoch" in checkpoint:
            print(f"   Trained for {checkpoint['epoch']+1} epochs")
    else:
        # Older checkpoint format
        model.load_state_dict(checkpoint)
    
    model.to(DEVICE)
    return model