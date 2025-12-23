import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const embedMetadataWatermark = async (file) => {
  const inputPath = file.path;
  const outputDir = path.join(__dirname, "../uploads/watermarked");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const hash = crypto
    .createHash("sha256")
    .update(fs.readFileSync(inputPath))
    .digest("hex");

  const outputPath = path.join(
    outputDir,
    `wm_${Date.now()}_${file.originalname}`
  );

  // Copy file (metadata watermark simulation)
  fs.copyFileSync(inputPath, outputPath);

  // Save metadata separately (C2PA-style)
  fs.writeFileSync(
    `${outputPath}.json`,
    JSON.stringify(
      {
        hash,
        creator: "VeriMedia",
        timestamp: new Date().toISOString(),
      },
      null,
      2
    )
  );

  return outputPath;
};
