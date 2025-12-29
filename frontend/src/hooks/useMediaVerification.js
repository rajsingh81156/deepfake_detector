import { useState } from "react";

export const useMediaVerification = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const verifyMedia = async (file) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:5000/api/verify", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        throw new Error("Verification failed");
      }

      const raw = await res.json();

      // Format the response to match VeriMedia's expected structure
      const formattedResult = {
        trustScore: raw.trustScore ?? Math.floor((raw.confidence ?? 0.7) * 100),
        source: raw.source ?? "Unknown Device",
        creator: raw.creator ?? "Unknown",
        timestamp: raw.timestamp ?? new Date().toISOString(),
        modifications: raw.modifications ?? 0,
        layers: raw.layers ?? [
          {
            name: "AI Deepfake Detection",
            status: raw.prediction === "FAKE" ? "fail" : "pass",
            confidence: Math.round(raw.confidence * 100)
          },
          {
            name: "Metadata Analysis",
            status: "unknown",
            confidence: 0
          },
          {
            name: "Behavioral Signals",
            status: "unknown",
            confidence: 0
          }
        ]
      };

      setResult(formattedResult);
      return formattedResult;
    } catch (err) {
      const errorMessage = err.message || "Verification failed";
      setError(errorMessage);
      console.error("Verification error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetVerification = () => {
    setResult(null);
    setError(null);
    setLoading(false);
  };

  return { 
    result, 
    loading, 
    error, 
    verifyMedia,
    resetVerification 
  };
};