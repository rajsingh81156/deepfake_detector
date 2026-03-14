"""
Deepfake Detection Model Architecture
Matches the training_model.py checkpoint architecture
"""

import torch
import torch.nn as nn
from torchvision import models
from typing import Optional

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")


class DeepfakeDetector(nn.Module):
    """
    EfficientNet-based deepfake detector optimized for low VRAM
    Uses EfficientNet-B0 as backbone (lightweight and efficient)
    Matches the training_model.py implementation exactly
    """
    def __init__(self, num_classes: int = 2, pretrained: bool = True):
        super(DeepfakeDetector, self).__init__()
        
        # Use EfficientNet-B0 (smallest, most memory efficient)
        if pretrained:
            self.backbone = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)
        else:
            self.backbone = models.efficientnet_b0(weights=None)
        
        # Get the number of features from the last layer
        num_features = self.backbone.classifier[1].in_features
        
        # Replace classifier with custom head (NO inplace operations)
        self.backbone.classifier = nn.Sequential(
            nn.Dropout(p=0.3, inplace=False),
            nn.Linear(num_features, 512),
            nn.ReLU(inplace=False),
            nn.Dropout(p=0.2, inplace=False),
            nn.Linear(512, num_classes)
        )
        
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.backbone(x)


def load_model(model_path: str = "./models/best_model.pth", 
               model_type: str = "auto",  # For backward compatibility
               device: Optional[torch.device] = None) -> DeepfakeDetector:
    """
    Load the trained deepfake detection model
    
    Args:
        model_path: Path to the trained model checkpoint (.pth file)
        model_type: Legacy parameter, kept for backward compatibility (ignored)
        device: Device to load the model on (cuda/cpu). If None, auto-detects.
    
    Returns:
        Loaded model ready for inference
        
    Example:
        >>> model = load_model("./models/best_model.pth")
        >>> model.eval()
    """
    if device is None:
        device = DEVICE
    
    print(f"Loading model from: {model_path}")
    print(f"Device: {device}")
    
    # Load checkpoint
    try:
        checkpoint = torch.load(model_path, map_location=device, weights_only=False)
    except Exception as e:
        print(f"❌ Error loading checkpoint: {e}")
        raise
    
    # Initialize model
    model = DeepfakeDetector(num_classes=2, pretrained=False)
    
    # Load state dict
    if "model_state_dict" in checkpoint:
        # Checkpoint from training script (includes metadata)
        model.load_state_dict(checkpoint["model_state_dict"])
        
        # Print training info if available
        print(f"✓ Model loaded successfully!")
        if "epoch" in checkpoint:
            print(f"  Trained Epochs: {checkpoint['epoch'] + 1}")
        if "val_acc" in checkpoint:
            print(f"  Validation Accuracy: {checkpoint['val_acc']:.2f}%")
        if "train_acc" in checkpoint:
            print(f"  Training Accuracy: {checkpoint['train_acc']:.2f}%")
    else:
        # Direct state dict (older format)
        model.load_state_dict(checkpoint)
        print(f"✓ Model loaded successfully!")
    
    # Move to device
    model.to(device)
    model.eval()  # Set to evaluation mode
    
    # Count parameters
    total_params = sum(p.numel() for p in model.parameters())
    print(f"  Total Parameters: {total_params:,}")
    
    return model


if __name__ == "__main__":
    # Test loading
    print("="*70)
    print("DEEPFAKE DETECTOR MODEL LOADER - TEST")
    print("="*70)
    
    try:
        model = load_model("./models/best_model.pth")
        print("\n✅ Model ready for inference!")
    except FileNotFoundError:
        print("\n⚠ Model file not found.")
    except Exception as e:
        print(f"\n❌ Error: {e}")