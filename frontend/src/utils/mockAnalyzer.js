/**
 * Enhanced Mock Media Analysis Function
 * Simulates comprehensive multi-layer verification with realistic data
 */

export const mockAnalyzeMedia = (fileType = 'image', fileName = 'media.jpg') =>
  new Promise((resolve) => {
    setTimeout(() => {
      // Core trust metrics with weighted randomization
      const trustScore = Math.floor(Math.random() * 35) + 65; // 65-100 range
      const hasWatermark = Math.random() > 0.25; // 75% chance of watermark
      const isAuthentic = trustScore > 75;
      const hasManipulation = Math.random() > 0.7; // 30% chance of manipulation
      
      // Sophisticated layer analysis
      const layers = [
        {
          name: "C2PA Watermark Detection",
          status: hasWatermark ? "pass" : "fail",
          confidence: hasWatermark ? Math.floor(Math.random() * 5) + 95 : 0,
          verdict: hasWatermark 
            ? "Valid C2PA content credentials detected with cryptographic signature"
            : "No C2PA watermark found - authenticity cannot be cryptographically verified",
          icon: "🔒",
          processingTime: `${Math.floor(Math.random() * 300) + 200}ms`,
          details: hasWatermark ? {
            standard: "C2PA v1.3",
            issuer: "Adobe Content Authenticity Initiative",
            certificateValid: true,
            chainOfCustody: "Verified"
          } : null
        },
        {
          name: "Forensic Metadata Analysis",
          status: "pass",
          confidence: Math.floor(Math.random() * 10) + 88,
          verdict: "EXIF and metadata patterns consistent with authentic capture device",
          icon: "📊",
          processingTime: `${Math.floor(Math.random() * 200) + 150}ms`,
          details: {
            exifConsistency: "High",
            thumbnailMatch: true,
            timestampVerified: true,
            gpsCoordinates: Math.random() > 0.5 ? "Present" : "Not available"
          }
        },
        {
          name: "AI Deepfake Detection",
          status: isAuthentic ? "pass" : hasManipulation ? "warning" : "pass",
          confidence: trustScore,
          verdict: isAuthentic 
            ? "No AI-generated artifacts detected in neural network analysis"
            : "Potential AI manipulation indicators found - requires human review",
          icon: "🤖",
          processingTime: `${Math.floor(Math.random() * 500) + 800}ms`,
          details: {
            model: "DeepFake Detection v4.2",
            faceAnalysis: fileType.includes('image') ? "Completed" : "N/A",
            temporalConsistency: fileType.includes('video') ? "Analyzed" : "N/A",
            artifactScore: Math.random().toFixed(3)
          }
        },
        {
          name: "Blockchain Provenance",
          status: hasWatermark ? "pass" : "unknown",
          confidence: hasWatermark ? Math.floor(Math.random() * 8) + 92 : 0,
          verdict: hasWatermark
            ? "Content hash verified on Ethereum blockchain - immutable provenance confirmed"
            : "No blockchain record found - provenance cannot be independently verified",
          icon: "⛓️",
          processingTime: `${Math.floor(Math.random() * 400) + 300}ms`,
          details: hasWatermark ? {
            network: "Ethereum Mainnet",
            blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
            transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
            confirmations: Math.floor(Math.random() * 500) + 100
          } : null
        },
        {
          name: "Error Level Analysis (ELA)",
          status: hasManipulation ? "warning" : "pass",
          confidence: hasManipulation ? 65 : 91,
          verdict: hasManipulation
            ? "Compression inconsistencies detected - possible local editing in specific regions"
            : "Uniform compression levels throughout - no splicing detected",
          icon: "🔬",
          processingTime: `${Math.floor(Math.random() * 250) + 200}ms`,
          details: {
            compressionLevel: "JPEG Quality " + (Math.floor(Math.random() * 20) + 75),
            suspiciousRegions: hasManipulation ? Math.floor(Math.random() * 3) + 1 : 0,
            noisePattern: hasManipulation ? "Inconsistent" : "Uniform"
          }
        },
        {
          name: "Source Attribution & Licensing",
          status: hasWatermark ? "pass" : "warning",
          confidence: hasWatermark ? Math.floor(Math.random() * 8) + 85 : 55,
          verdict: hasWatermark
            ? "Original creator and licensing information verified through content credentials"
            : "Source attribution unavailable - usage rights cannot be confirmed",
          icon: "📝",
          processingTime: `${Math.floor(Math.random() * 150) + 100}ms`,
          details: hasWatermark ? {
            licenseType: ["CC BY 4.0", "All Rights Reserved", "Editorial Use"][Math.floor(Math.random() * 3)],
            attributionRequired: Math.random() > 0.5,
            commercialUse: Math.random() > 0.4
          } : null
        }
      ];

      // Camera/device data
      const cameras = [
        { brand: "Canon", model: "EOS R5", type: "Professional DSLR" },
        { brand: "Sony", model: "A7R IV", type: "Mirrorless Camera" },
        { brand: "Nikon", model: "Z9", type: "Professional DSLR" },
        { brand: "iPhone", model: "15 Pro Max", type: "Smartphone" },
        { brand: "DJI", model: "Mavic 3 Pro", type: "Drone Camera" },
        { brand: "GoPro", model: "Hero 12", type: "Action Camera" },
        { brand: "Unknown", model: "Generic Device", type: "Unidentified" }
      ];

      const creators = [
        "Sarah Mitchell - Professional Photographer",
        "James Chen - Photojournalist",
        "Maria Rodriguez - Content Creator",
        "Alex Thompson - Wildlife Photographer",
        "Emma Williams - Visual Artist",
        "Unknown Creator"
      ];

      const selectedCamera = hasWatermark 
        ? cameras[Math.floor(Math.random() * (cameras.length - 1))]
        : cameras[cameras.length - 1];

      const selectedCreator = hasWatermark
        ? creators[Math.floor(Math.random() * (creators.length - 1))]
        : creators[creators.length - 1];

      // Location data
      const locations = [
        { city: "San Francisco", country: "USA", coords: "37.7749°N, 122.4194°W" },
        { city: "Tokyo", country: "Japan", coords: "35.6762°N, 139.6503°E" },
        { city: "London", country: "UK", coords: "51.5074°N, 0.1278°W" },
        { city: "Sydney", country: "Australia", coords: "33.8688°S, 151.2093°E" },
        { city: "Unknown", country: "Unknown", coords: null }
      ];

      const location = hasWatermark && Math.random() > 0.3
        ? locations[Math.floor(Math.random() * (locations.length - 1))]
        : locations[locations.length - 1];

      // Generate realistic timestamp
      const captureDate = new Date();
      captureDate.setDate(captureDate.getDate() - Math.floor(Math.random() * 365));

      // Comprehensive analysis result
      resolve({
        // Overall metrics
        trustScore,
        verdict: trustScore > 85 ? "AUTHENTIC" : trustScore > 70 ? "LIKELY AUTHENTIC" : "QUESTIONABLE",
        riskLevel: trustScore > 85 ? "LOW" : trustScore > 70 ? "MEDIUM" : "HIGH",
        
        // Watermark & verification
        hasWatermark,
        c2paVerified: hasWatermark,
        blockchainVerified: hasWatermark,
        
        // Layer analysis
        layers,
        layersSummary: {
          total: layers.length,
          passed: layers.filter(l => l.status === "pass").length,
          warnings: layers.filter(l => l.status === "warning").length,
          failed: layers.filter(l => l.status === "fail").length
        },
        
        // Temporal data
        timestamp: new Date().toISOString(),
        captureDate: captureDate.toISOString(),
        analysisDate: new Date().toISOString(),
        processingTime: `${(Math.random() * 2 + 1.5).toFixed(2)}s`,
        
        // Source information
        source: {
          device: `${selectedCamera.brand} ${selectedCamera.model}`,
          type: selectedCamera.type,
          firmware: hasWatermark ? `v${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}` : "Unknown"
        },
        
        // Creator information
        creator: {
          name: selectedCreator,
          verified: hasWatermark,
          digitalSignature: hasWatermark ? `SHA-256: ${Math.random().toString(16).substr(2, 16)}...` : null
        },
        
        // Location data
        location: location.coords ? location : null,
        
        // Technical details
        technical: {
          resolution: fileType.includes('image') 
            ? `${Math.floor(Math.random() * 2000) + 4000} × ${Math.floor(Math.random() * 1500) + 3000}px`
            : `${[1920, 3840, 7680][Math.floor(Math.random() * 3)]}p`,
          fileSize: `${(Math.random() * 10 + 2).toFixed(2)} MB`,
          format: fileType.includes('image') ? ['JPEG', 'PNG', 'RAW'][Math.floor(Math.random() * 3)] : 'MP4',
          colorSpace: ['sRGB', 'Adobe RGB', 'ProPhoto RGB'][Math.floor(Math.random() * 3)],
          bitDepth: ['8-bit', '10-bit', '12-bit'][Math.floor(Math.random() * 3)]
        },
        
        // Modification history
        modifications: {
          count: hasManipulation ? Math.floor(Math.random() * 4) + 1 : 0,
          detected: hasManipulation,
          types: hasManipulation ? [
            "Color adjustment",
            "Crop/Resize",
            "Filter applied",
            "Local editing"
          ].slice(0, Math.floor(Math.random() * 3) + 1) : [],
          software: hasManipulation ? ["Adobe Photoshop", "Lightroom", "GIMP"][Math.floor(Math.random() * 3)] : null
        },
        
        // Additional flags
        flags: {
          possibleDeepfake: !isAuthentic,
          suspiciousEditing: hasManipulation,
          missingMetadata: !hasWatermark,
          anomaliesDetected: Math.random() > 0.7,
          requiresHumanReview: trustScore < 75
        },
        
        // Recommendations
        recommendations: generateRecommendations(trustScore, hasWatermark, hasManipulation),
        
        // Compliance & standards
        compliance: {
          c2paCompliant: hasWatermark,
          gdprCompliant: true,
          copyrightVerified: hasWatermark,
          journalisticStandards: trustScore > 80
        }
      });
    }, 2800); // Slightly longer processing time for realism
  });

/**
 * Generate contextual recommendations based on analysis results
 */
function generateRecommendations(trustScore, hasWatermark, hasManipulation) {
  const recommendations = [];
  
  if (!hasWatermark) {
    recommendations.push({
      priority: "HIGH",
      message: "Consider adding C2PA watermark for future content authentication",
      action: "Enable C2PA signing in camera settings or post-processing software"
    });
  }
  
  if (trustScore < 75) {
    recommendations.push({
      priority: "CRITICAL",
      message: "Content authenticity is questionable - verify source before publication",
      action: "Cross-reference with original source or contact creator directly"
    });
  }
  
  if (hasManipulation) {
    recommendations.push({
      priority: "MEDIUM",
      message: "Editing detected - ensure modifications are disclosed if publishing",
      action: "Add editorial note about image adjustments for transparency"
    });
  }
  
  if (hasWatermark && trustScore > 85) {
    recommendations.push({
      priority: "INFO",
      message: "Content is verified authentic with strong provenance",
      action: "Safe to use with proper attribution to original creator"
    });
  }
  
  return recommendations;
}