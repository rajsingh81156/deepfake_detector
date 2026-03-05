import { analyzeWithAI } from "../services/ai.services.js";
import Verification from "../models/Verification.js";
import fs from "fs";

export const verifyMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Get metadata from form fields (sent via FormData)
    const source = req.body?.source?.trim() || "Unknown Device";
    const creator = req.body?.creator?.trim() || "Unknown";
    const modifications = parseInt(req.body?.modifications ?? 0) || 0;

    //  AI prediction
    const aiResult = await analyzeWithAI(req.file.path);

    // Save to DB with metadata
    const verification = await Verification.create({
      trustScore: aiResult.trustScore,
      source: source,
      creator: creator,
      modifications: modifications,
      layers: aiResult.layers,
      hasWatermark: aiResult.hasWatermark || false
    });

    res.json({
      ...aiResult,
      source: source,
      creator: creator,
      modifications: modifications,
      timestamp: verification.createdAt,
      verificationId: verification._id
    });

    // Cleanup uploaded file
    fs.unlinkSync(req.file.path);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Verification failed" });
  }
};
