import express from "express";
import multer from "multer";
import { verifyMedia } from "../controllers/verify.controller.js";

const router = express.Router();

// multer config
const upload = multer({ dest: "uploads/" });

// POST /api/verify
router.post("/", upload.single("file"), verifyMedia);

export default router;
