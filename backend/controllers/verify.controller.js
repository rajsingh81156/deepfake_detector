import { analyzeWithAI } from "../services/ai.services.js";
import Verification from "../models/Verification.js";
import fs from "fs";

export const verifyMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // 🔥 AI prediction
    const aiResult = await analyzeWithAI(req.file.path);

    // Optional: save to DB
    await Verification.create({
      trustScore: aiResult.trustScore,
      layers: aiResult.layers,
      // Add other fields if needed
    });

    res.json(aiResult);

    // Cleanup uploaded file
    fs.unlinkSync(req.file.path);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Verification failed" });
  }
};
