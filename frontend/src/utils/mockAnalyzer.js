export const mockAnalyzeMedia = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      const trustScore = Math.floor(Math.random() * 40) + 60;
      const hasWatermark = Math.random() > 0.3;

      resolve({
        trustScore,
        hasWatermark,
        layers: [
          { name: "C2PA Watermark", status: hasWatermark ? "pass" : "fail", confidence: hasWatermark ? 98 : 0 },
          { name: "Metadata Analysis", status: "pass", confidence: 92 },
          { name: "AI Detection", status: trustScore > 70 ? "pass" : "warning", confidence: trustScore },
          { name: "Blockchain Verification", status: hasWatermark ? "pass" : "unknown", confidence: hasWatermark ? 95 : 0 },
          { name: "Source Attribution", status: "pass", confidence: 88 }
        ],
        timestamp: new Date().toISOString(),
        source: hasWatermark ? "Canon EOS R5" : "Unknown",
        creator: hasWatermark ? "John Photographer" : "Unknown",
        modifications: Math.floor(Math.random() * 3)
      });
    }, 2500);
  });
