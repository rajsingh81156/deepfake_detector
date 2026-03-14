"""
Image Preprocessing for Deepfake Detection
Matches the exact preprocessing used in deepfake_detector_final.py training script
"""

from torchvision import transforms
from PIL import Image
import torch
import numpy as np
from typing import Union, Tuple
import os


# CRITICAL: These values MUST match training
IMAGE_SIZE = 224
MEAN = [0.485, 0.456, 0.406]  # ImageNet normalization
STD = [0.229, 0.224, 0.225]   # ImageNet normalization


# Inference transform (NO augmentation - same as validation during training)
inference_transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=MEAN, std=STD)
])


# Training transform (with augmentation) - for reference only
training_transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(10),
    transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
    transforms.ToTensor(),
    transforms.Normalize(mean=MEAN, std=STD)
])


def preprocess_image(image_path: str, 
                    device: torch.device = None) -> torch.Tensor:
    """
    Preprocess a single image for inference
    
    Args:
        image_path: Path to the image file
        device: Device to load tensor on (cuda/cpu). If None, auto-detects.
        
    Returns:
        Preprocessed image tensor ready for model input [1, 3, 224, 224]
        
    Raises:
        FileNotFoundError: If image file doesn't exist
        ValueError: If image cannot be loaded or is invalid
        
    Example:
        >>> from model import load_model
        >>> model = load_model("./models/best_model.pth")
        >>> image_tensor = preprocess_image("test_image.jpg")
        >>> with torch.no_grad():
        ...     output = model(image_tensor)
        ...     prediction = torch.argmax(output, dim=1)
    """
    if device is None:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    # Check if file exists
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found: {image_path}")
    
    try:
        # Load and convert to RGB
        image = Image.open(image_path).convert("RGB")
        
        # Apply transformations
        tensor = inference_transform(image)
        
        # Add batch dimension and move to device
        tensor = tensor.unsqueeze(0).to(device)
        
        return tensor
        
    except Exception as e:
        raise ValueError(f"Error preprocessing image {image_path}: {str(e)}")


def preprocess_image_from_pil(image: Image.Image, 
                              device: torch.device = None) -> torch.Tensor:
    """
    Preprocess a PIL Image object for inference
    
    Args:
        image: PIL Image object
        device: Device to load tensor on (cuda/cpu)
        
    Returns:
        Preprocessed image tensor [1, 3, 224, 224]
    """
    if device is None:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    # Ensure RGB mode
    if image.mode != "RGB":
        image = image.convert("RGB")
    
    # Apply transformations
    tensor = inference_transform(image)
    
    # Add batch dimension and move to device
    tensor = tensor.unsqueeze(0).to(device)
    
    return tensor


def preprocess_image_from_numpy(image_array: np.ndarray, 
                                device: torch.device = None) -> torch.Tensor:
    """
    Preprocess a numpy array image for inference
    
    Args:
        image_array: Numpy array in format [H, W, C] with values 0-255
        device: Device to load tensor on (cuda/cpu)
        
    Returns:
        Preprocessed image tensor [1, 3, 224, 224]
    """
    if device is None:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    # Convert numpy array to PIL Image
    if image_array.dtype != np.uint8:
        image_array = image_array.astype(np.uint8)
    
    image = Image.fromarray(image_array)
    
    return preprocess_image_from_pil(image, device)


def preprocess_batch(image_paths: list, 
                    device: torch.device = None,
                    batch_size: int = 16) -> torch.Tensor:
    """
    Preprocess multiple images in a batch
    
    Args:
        image_paths: List of paths to image files
        device: Device to load tensors on
        batch_size: Number of images to process at once (for memory management)
        
    Returns:
        Batched tensor [N, 3, 224, 224] where N is number of images
        
    Example:
        >>> images = ["img1.jpg", "img2.jpg", "img3.jpg"]
        >>> batch_tensor = preprocess_batch(images)
        >>> outputs = model(batch_tensor)
    """
    if device is None:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    tensors = []
    for img_path in image_paths:
        try:
            image = Image.open(img_path).convert("RGB")
            tensor = inference_transform(image)
            tensors.append(tensor)
        except Exception as e:
            print(f"Warning: Skipping {img_path} due to error: {e}")
            continue
    
    if len(tensors) == 0:
        raise ValueError("No valid images to process")
    
    # Stack all tensors into a batch
    batch_tensor = torch.stack(tensors).to(device)
    
    return batch_tensor


def denormalize_image(tensor: torch.Tensor) -> np.ndarray:
    """
    Convert a normalized tensor back to a displayable numpy array
    Useful for visualization
    
    Args:
        tensor: Normalized tensor [C, H, W] or [1, C, H, W]
        
    Returns:
        Numpy array [H, W, C] with values 0-255
    """
    # Remove batch dimension if present
    if tensor.dim() == 4:
        tensor = tensor.squeeze(0)
    
    # Move to CPU and convert to numpy
    tensor = tensor.cpu().clone()
    
    # Denormalize
    mean = torch.tensor(MEAN).view(3, 1, 1)
    std = torch.tensor(STD).view(3, 1, 1)
    tensor = tensor * std + mean
    
    # Clip to valid range and convert to uint8
    tensor = torch.clamp(tensor, 0, 1)
    array = (tensor.permute(1, 2, 0).numpy() * 255).astype(np.uint8)
    
    return array


def get_image_info(image_path: str) -> dict:
    """
    Get information about an image file
    
    Args:
        image_path: Path to image file
        
    Returns:
        Dictionary with image metadata
    """
    image = Image.open(image_path)
    
    return {
        'path': image_path,
        'format': image.format,
        'mode': image.mode,
        'size': image.size,
        'width': image.width,
        'height': image.height,
    }


if __name__ == "__main__":
    # Example usage and testing
    print("="*70)
    print("DEEPFAKE DETECTOR - IMAGE PREPROCESSING")
    print("="*70)
    
    print(f"\nPreprocessing Configuration:")
    print(f"  Image Size: {IMAGE_SIZE}x{IMAGE_SIZE}")
    print(f"  Normalization Mean: {MEAN}")
    print(f"  Normalization Std: {STD}")
    
    # Example: Test preprocessing with a sample image
    import sys
    
    if len(sys.argv) > 1:
        test_image_path = sys.argv[1]
        
        if os.path.exists(test_image_path):
            print(f"\nTesting preprocessing on: {test_image_path}")
            
            # Get image info
            info = get_image_info(test_image_path)
            print(f"\nImage Info:")
            for key, value in info.items():
                print(f"  {key}: {value}")
            
            # Preprocess
            tensor = preprocess_image(test_image_path)
            print(f"\nPreprocessed Tensor Shape: {tensor.shape}")
            print(f"Tensor Device: {tensor.device}")
            print(f"Tensor dtype: {tensor.dtype}")
            print(f"Tensor min/max: {tensor.min():.3f} / {tensor.max():.3f}")
            
            print("\n✓ Preprocessing successful!")
        else:
            print(f"\n❌ File not found: {test_image_path}")
    else:
        print("\nUsage: python preprocess.py <image_path>")
        print("Example: python preprocess.py test_image.jpg")