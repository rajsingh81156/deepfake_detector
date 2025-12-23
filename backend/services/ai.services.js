import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { AI_SERVICE_URL } from "../config/ai.config.js";

export const analyzeWithAI = async (filePath) => {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new Error("Uploaded file not found");
    }

    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    const response = await axios.post(AI_SERVICE_URL, formData, {
      headers: formData.getHeaders(),
      timeout: 30000, // 30 second timeout
      maxContentLength: 50 * 1024 * 1024, // 50MB max
    });

    return response.data;
  } catch (error) {
    console.error("AI Service Error:", error.message);

    if (error.code === 'ECONNREFUSED') {
      throw new Error("AI service is not available. Please ensure the AI service is running.");
    }

    if (error.response) {
      // AI service returned an error
      throw new Error(`AI analysis failed: ${error.response.data?.message || error.response.statusText}`);
    }

    throw new Error(`AI analysis failed: ${error.message}`);
  }
};
