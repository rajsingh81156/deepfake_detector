import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import verifyRoutes from "./routes/verify.routes.js";
import watermarkRoutes from "./routes/watermark.routes.js";

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static uploads
app.use("/uploads", express.static("uploads"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/verify", verifyRoutes);
app.use("/api/watermark", watermarkRoutes);

export default app;
