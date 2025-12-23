import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import verifyRoutes from "./routes/verify.routes.js";
import watermarkRoutes from "./routes/watermark.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Static uploads
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/verify", verifyRoutes);
app.use("/api/watermark", watermarkRoutes);

export default app;
