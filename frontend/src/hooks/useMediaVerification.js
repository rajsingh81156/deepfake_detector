import { useState } from "react";
import { verificationAPI } from "../services/api";

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

      const response = await verificationAPI.verify(formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
      console.error("Verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, verifyMedia };
};
