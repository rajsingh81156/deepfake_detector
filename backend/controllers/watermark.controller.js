import path from "path";
import { fileURLToPath } from "url";
import { embedMetadataWatermark } from "../services/watermark.service.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const watermarkMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const outputPath = await embedMetadataWatermark(req.file);

    res.sendFile(path.resolve(outputPath));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Watermark failed" });
  }
};
