import { useState } from "react";
import { mockAnalyzeMedia } from "../utils/mockAnalyzer";

export const useMediaVerification = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const verifyMedia = async () => {
    setLoading(true);
    const data = await mockAnalyzeMedia();
    setResult(data);
    setLoading(false);
  };

  return { result, loading, verifyMedia };
};
