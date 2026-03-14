import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms, models
from torch.amp import autocast, GradScaler
import numpy as np
import os
from PIL import Image
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns
from tqdm import tqdm
import json
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

# Set random seeds for reproducibility
torch.manual_seed(42)
np.random.seed(42)

class DeepfakeDataset(Dataset):
    """Custom Dataset for loading deepfake images"""
    def __init__(self, real_dir, fake_dir, transform=None):
        self.transform = transform
        self.images = []
        self.labels = []
        
        # Load real images (label 0)
        if os.path.exists(real_dir):
            real_images = [os.path.join(real_dir, f) for f in os.listdir(real_dir) 
                          if f.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp'))]
            self.images.extend(real_images)
            self.labels.extend([0] * len(real_images))
            print(f"Loaded {len(real_images)} real images from {real_dir}")
        
        # Load fake images (label 1)
        if os.path.exists(fake_dir):
            fake_images = [os.path.join(fake_dir, f) for f in os.listdir(fake_dir) 
                          if f.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp'))]
            self.images.extend(fake_images)
            self.labels.extend([1] * len(fake_images))
            print(f"Loaded {len(fake_images)} fake images from {fake_dir}")
        
        print(f"Total dataset size: {len(self.images)} images")
        
    def __len__(self):
        return len(self.images)
    
    def __getitem__(self, idx):
        img_path = self.images[idx]
        label = self.labels[idx]
        
        try:
            image = Image.open(img_path).convert('RGB')
            if self.transform:
                image = self.transform(image)
            return image, label
        except Exception as e:
            print(f"Error loading image {img_path}: {e}")
            # Return a black image in case of error
            if self.transform:
                return self.transform(Image.new('RGB', (224, 224))), label
            return Image.new('RGB', (224, 224)), label


class DeepfakeDetector(nn.Module):
    """
    EfficientNet-based deepfake detector optimized for low VRAM
    Uses EfficientNet-B0 as backbone (lightweight and efficient)
    """
    def __init__(self, num_classes=2, pretrained=True):
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
        
    def forward(self, x):
        return self.backbone(x)


class MetricsTracker:
    """Track and store training metrics"""
    def __init__(self):
        self.train_losses = []
        self.train_accs = []
        self.val_losses = []
        self.val_accs = []
        self.best_epoch = 0
        self.best_val_acc = 0.0
        self.learning_rates = []
        
    def update(self, epoch, train_loss, train_acc, val_loss, val_acc, lr):
        self.train_losses.append(train_loss)
        self.train_accs.append(train_acc)
        self.val_losses.append(val_loss)
        self.val_accs.append(val_acc)
        self.learning_rates.append(lr)
        
        if val_acc > self.best_val_acc:
            self.best_val_acc = val_acc
            self.best_epoch = epoch
    
    def save_metrics(self, filepath):
        metrics = {
            'train_losses': self.train_losses,
            'train_accs': self.train_accs,
            'val_losses': self.val_losses,
            'val_accs': self.val_accs,
            'learning_rates': self.learning_rates,
            'best_epoch': self.best_epoch,
            'best_val_acc': self.best_val_acc
        }
        with open(filepath, 'w') as f:
            json.dump(metrics, f, indent=4)
        print(f"\nMetrics saved to {filepath}")


def plot_confusion_matrix(y_true, y_pred, save_path='confusion_matrix.png'):
    """Generate and save confusion matrix"""
    cm = confusion_matrix(y_true, y_pred)
    
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=['Real', 'Fake'],
                yticklabels=['Real', 'Fake'])
    plt.title('Confusion Matrix - Deepfake Detection', fontsize=16, fontweight='bold')
    plt.ylabel('True Label', fontsize=12)
    plt.xlabel('Predicted Label', fontsize=12)
    plt.tight_layout()
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Confusion matrix saved to {save_path}")
    
    # Print detailed metrics
    print("\n" + "="*60)
    print("CONFUSION MATRIX ANALYSIS")
    print("="*60)
    print(f"\nTrue Negatives (Real correctly classified): {cm[0][0]}")
    print(f"False Positives (Real misclassified as Fake): {cm[0][1]}")
    print(f"False Negatives (Fake misclassified as Real): {cm[1][0]}")
    print(f"True Positives (Fake correctly classified): {cm[1][1]}")
    
    # Calculate metrics
    accuracy = accuracy_score(y_true, y_pred)
    precision_fake = cm[1][1] / (cm[1][1] + cm[0][1]) if (cm[1][1] + cm[0][1]) > 0 else 0
    recall_fake = cm[1][1] / (cm[1][1] + cm[1][0]) if (cm[1][1] + cm[1][0]) > 0 else 0
    f1_fake = 2 * (precision_fake * recall_fake) / (precision_fake + recall_fake) if (precision_fake + recall_fake) > 0 else 0
    
    print(f"\nOverall Accuracy: {accuracy*100:.2f}%")
    print(f"Precision (Fake Detection): {precision_fake*100:.2f}%")
    print(f"Recall (Fake Detection): {recall_fake*100:.2f}%")
    print(f"F1-Score (Fake Detection): {f1_fake*100:.2f}%")
    print("="*60)
    
    return cm


def plot_training_history(metrics_tracker, save_path='training_history.png'):
    """Plot training and validation metrics"""
    epochs = range(1, len(metrics_tracker.train_losses) + 1)
    
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 5))
    
    # Plot losses
    ax1.plot(epochs, metrics_tracker.train_losses, 'b-', label='Training Loss', linewidth=2)
    ax1.plot(epochs, metrics_tracker.val_losses, 'r-', label='Validation Loss', linewidth=2)
    ax1.set_xlabel('Epoch', fontsize=12)
    ax1.set_ylabel('Loss', fontsize=12)
    ax1.set_title('Training and Validation Loss', fontsize=14, fontweight='bold')
    ax1.legend(fontsize=10)
    ax1.grid(True, alpha=0.3)
    
    # Plot accuracies
    ax2.plot(epochs, metrics_tracker.train_accs, 'b-', label='Training Accuracy', linewidth=2)
    ax2.plot(epochs, metrics_tracker.val_accs, 'r-', label='Validation Accuracy', linewidth=2)
    ax2.axvline(x=metrics_tracker.best_epoch + 1, color='g', linestyle='--', 
                label=f'Best Epoch ({metrics_tracker.best_epoch + 1})', linewidth=2)
    ax2.set_xlabel('Epoch', fontsize=12)
    ax2.set_ylabel('Accuracy (%)', fontsize=12)
    ax2.set_title('Training and Validation Accuracy', fontsize=14, fontweight='bold')
    ax2.legend(fontsize=10)
    ax2.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Training history plot saved to {save_path}")


def train_epoch(model, dataloader, criterion, optimizer, scaler, device, use_amp):
    """Train for one epoch"""
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0
    
    pbar = tqdm(dataloader, desc='Training', leave=False)
    for images, labels in pbar:
        images, labels = images.to(device), labels.to(device)
        
        optimizer.zero_grad()
        
        # Mixed precision training (only if CUDA available)
        if use_amp:
            with autocast(device_type='cuda'):
                outputs = model(images)
                loss = criterion(outputs, labels)
            
            scaler.scale(loss).backward()
            scaler.step(optimizer)
            scaler.update()
        else:
            # Standard training (CPU or non-AMP)
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
        
        # Statistics
        running_loss += loss.item() * images.size(0)
        _, predicted = torch.max(outputs.data, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()
        
        # Update progress bar
        pbar.set_postfix({'loss': f'{loss.item():.4f}', 
                         'acc': f'{100*correct/total:.2f}%'})
    
    epoch_loss = running_loss / total
    epoch_acc = 100 * correct / total
    
    return epoch_loss, epoch_acc


def validate(model, dataloader, criterion, device, use_amp, return_predictions=False):
    """Validate the model"""
    model.eval()
    running_loss = 0.0
    correct = 0
    total = 0
    all_predictions = []
    all_labels = []
    
    with torch.no_grad():
        pbar = tqdm(dataloader, desc='Validation', leave=False)
        for images, labels in pbar:
            images, labels = images.to(device), labels.to(device)
            
            if use_amp:
                with autocast(device_type='cuda'):
                    outputs = model(images)
                    loss = criterion(outputs, labels)
            else:
                outputs = model(images)
                loss = criterion(outputs, labels)
            
            running_loss += loss.item() * images.size(0)
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
            
            if return_predictions:
                all_predictions.extend(predicted.cpu().numpy())
                all_labels.extend(labels.cpu().numpy())
            
            pbar.set_postfix({'loss': f'{loss.item():.4f}', 
                            'acc': f'{100*correct/total:.2f}%'})
    
    epoch_loss = running_loss / total
    epoch_acc = 100 * correct / total
    
    if return_predictions:
        return epoch_loss, epoch_acc, all_predictions, all_labels
    return epoch_loss, epoch_acc


def main():
    """Main training pipeline"""
    print("="*70)
    print("DEEPFAKE DETECTION MODEL TRAINING")
    print("Optimized for RTX 3050 (4GB VRAM)")
    print("="*70)
    
    # Configuration
    config = {
        'train_real_dir': './dataset/train/real',
        'train_fake_dir': './dataset/train/fake',
        'val_real_dir': './dataset/val/real',
        'val_fake_dir': './dataset/val/fake',
        'batch_size': 16,  # Small batch size for 4GB VRAM
        'num_epochs': 25,
        'learning_rate': 0.001,
        'num_workers': 6,
        'image_size': 224,
        'save_dir': './models',
        'pretrained': True
    }
    
    # Create save directory
    os.makedirs(config['save_dir'], exist_ok=True)
    
    # Device configuration with better GPU detection
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    use_amp = torch.cuda.is_available()  # Only use AMP if CUDA is available
    
    print(f"\n✓ Using device: {device}")
    if torch.cuda.is_available():
        print(f"✓ GPU: {torch.cuda.get_device_name(0)}")
        print(f"✓ CUDA Version: {torch.version.cuda}")
        print(f"✓ VRAM Available: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.2f} GB")
        print(f"✓ Mixed Precision (AMP): Enabled")
    else:
        print("⚠ WARNING: CUDA not available! Training on CPU will be VERY slow.")
        print("⚠ To use GPU, install PyTorch with CUDA:")
        print("  pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118")
        print(f"✓ Mixed Precision (AMP): Disabled")
    
    # Data transforms with augmentation
    train_transform = transforms.Compose([
        transforms.Resize((config['image_size'], config['image_size'])),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomRotation(10),
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    val_transform = transforms.Compose([
        transforms.Resize((config['image_size'], config['image_size'])),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    
    # Load datasets
    print("\n" + "-"*70)
    print("LOADING DATASETS")
    print("-"*70)
    train_dataset = DeepfakeDataset(
        config['train_real_dir'], 
        config['train_fake_dir'], 
        transform=train_transform
    )
    val_dataset = DeepfakeDataset(
        config['val_real_dir'], 
        config['val_fake_dir'], 
        transform=val_transform
    )
    
    # Check if datasets are not empty
    if len(train_dataset) == 0:
        print("\n❌ ERROR: Training dataset is empty!")
        print("Please check that the following directories exist and contain images:")
        print(f"  - {config['train_real_dir']}")
        print(f"  - {config['train_fake_dir']}")
        return
    
    if len(val_dataset) == 0:
        print("\n❌ ERROR: Validation dataset is empty!")
        print("Please check that the following directories exist and contain images:")
        print(f"  - {config['val_real_dir']}")
        print(f"  - {config['val_fake_dir']}")
        return
    
    # Create dataloaders
    train_loader = DataLoader(
        train_dataset, 
        batch_size=config['batch_size'], 
        shuffle=True,
        num_workers=config['num_workers'],
        pin_memory=use_amp  # Only pin memory if using GPU
    )
    val_loader = DataLoader(
        val_dataset, 
        batch_size=config['batch_size'], 
        shuffle=False,
        num_workers=config['num_workers'],
        pin_memory=use_amp
    )
    
    print(f"\n✓ Training batches: {len(train_loader)}")
    print(f"✓ Validation batches: {len(val_loader)}")
    
    # Initialize model
    print("\n" + "-"*70)
    print("INITIALIZING MODEL")
    print("-"*70)
    model = DeepfakeDetector(num_classes=2, pretrained=config['pretrained']).to(device)
    print(f"✓ Model: EfficientNet-B0 based Deepfake Detector")
    print(f"✓ Parameters: {sum(p.numel() for p in model.parameters()):,}")
    
    # Loss function and optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=config['learning_rate'])
    
    # Learning rate scheduler (FIXED: removed verbose parameter)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(
        optimizer, 
        mode='max', 
        factor=0.5, 
        patience=5
    )
    
    # Mixed precision training (only if CUDA available)
    scaler = GradScaler('cuda') if use_amp else None
    
    # Metrics tracker
    metrics_tracker = MetricsTracker()
    
    # Training loop
    print("\n" + "="*70)
    print("STARTING TRAINING")
    print("="*70)
    
    for epoch in range(config['num_epochs']):
        print(f"\n{'='*70}")
        print(f"EPOCH {epoch + 1}/{config['num_epochs']}")
        print(f"{'='*70}")
        
        # Train
        train_loss, train_acc = train_epoch(model, train_loader, criterion, 
                                           optimizer, scaler, device, use_amp)
        
        # Validate
        val_loss, val_acc = validate(model, val_loader, criterion, device, use_amp)
        
        # Get current learning rate
        current_lr = optimizer.param_groups[0]['lr']
        
        # Update learning rate
        scheduler.step(val_acc)
        
        # Check if learning rate was reduced
        new_lr = optimizer.param_groups[0]['lr']
        if new_lr < current_lr:
            print(f"\n📉 Learning rate reduced: {current_lr:.6f} → {new_lr:.6f}")
        
        # Update metrics
        metrics_tracker.update(epoch, train_loss, train_acc, val_loss, val_acc, new_lr)
        
        # Print epoch summary
        print(f"\n{'─'*70}")
        print(f"EPOCH {epoch + 1} SUMMARY:")
        print(f"{'─'*70}")
        print(f"Training   → Loss: {train_loss:.4f} | Accuracy: {train_acc:.2f}%")
        print(f"Validation → Loss: {val_loss:.4f} | Accuracy: {val_acc:.2f}%")
        print(f"Learning Rate: {new_lr:.6f}")
        print(f"{'─'*70}")
        
        # Save best model
        if epoch == metrics_tracker.best_epoch:
            best_model_path = os.path.join(config['save_dir'], 'best_model.pth')
            torch.save({
                'epoch': epoch,
                'model_state_dict': model.state_dict(),
                'optimizer_state_dict': optimizer.state_dict(),
                'train_loss': train_loss,
                'train_acc': train_acc,
                'val_loss': val_loss,
                'val_acc': val_acc,
            }, best_model_path)
            print(f"✓ New best model saved! (Validation Accuracy: {val_acc:.2f}%)")
    
    # Final results
    print("\n" + "="*70)
    print("TRAINING COMPLETED")
    print("="*70)
    print(f"\n🏆 BEST EPOCH: {metrics_tracker.best_epoch + 1}")
    print(f"🏆 BEST VALIDATION ACCURACY: {metrics_tracker.best_val_acc:.2f}%")
    print(f"\nBest model saved at: {best_model_path}")
    
    # Load best model for final evaluation
    print("\n" + "-"*70)
    print("FINAL EVALUATION ON VALIDATION SET (Best Model)")
    print("-"*70)
    checkpoint = torch.load(best_model_path)
    model.load_state_dict(checkpoint['model_state_dict'])
    
    # Get predictions for confusion matrix
    _, final_acc, predictions, true_labels = validate(model, val_loader, criterion, 
                                                      device, use_amp, return_predictions=True)
    
    print(f"\n✓ Final Validation Accuracy: {final_acc:.2f}%")
    
    # Generate confusion matrix
    print("\n" + "-"*70)
    print("GENERATING CONFUSION MATRIX")
    print("-"*70)
    cm_path = os.path.join(config['save_dir'], 'confusion_matrix.png')
    plot_confusion_matrix(true_labels, predictions, save_path=cm_path)
    
    # Plot training history
    history_path = os.path.join(config['save_dir'], 'training_history.png')
    plot_training_history(metrics_tracker, save_path=history_path)
    
    # Save metrics
    metrics_path = os.path.join(config['save_dir'], 'training_metrics.json')
    metrics_tracker.save_metrics(metrics_path)
    
    # Save final report
    report_path = os.path.join(config['save_dir'], 'training_report.txt')
    with open(report_path, 'w') as f:
        f.write("="*70 + "\n")
        f.write("DEEPFAKE DETECTION MODEL - TRAINING REPORT\n")
        f.write("="*70 + "\n\n")
        f.write(f"Training Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"Device: {device}\n")
        f.write(f"Total Epochs: {config['num_epochs']}\n")
        f.write(f"Batch Size: {config['batch_size']}\n")
        f.write(f"Learning Rate: {config['learning_rate']}\n\n")
        f.write(f"Best Epoch: {metrics_tracker.best_epoch + 1}\n")
        f.write(f"Best Validation Accuracy: {metrics_tracker.best_val_acc:.2f}%\n\n")
        f.write(f"Final Training Accuracy: {metrics_tracker.train_accs[-1]:.2f}%\n")
        f.write(f"Final Validation Accuracy: {metrics_tracker.val_accs[-1]:.2f}%\n")
    
    print(f"\n✓ Training report saved to {report_path}")
    
    print("\n" + "="*70)
    print("ALL OUTPUTS SAVED SUCCESSFULLY")
    print("="*70)
    print(f"📁 Model: {best_model_path}")
    print(f"📊 Confusion Matrix: {cm_path}")
    print(f"📈 Training History: {history_path}")
    print(f"📋 Metrics: {metrics_path}")
    print(f"📄 Report: {report_path}")
    print("="*70)


if __name__ == "__main__":
    main()