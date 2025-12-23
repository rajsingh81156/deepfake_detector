import express from "express";
import multer from "multer";
import { watermarkMedia } from "../controllers/watermark.controller.js";

const router = express.Router();

const upload = multer({ dest: "uploads/originals" });

router.post("/", upload.single("file"), watermarkMedia);

export default router;
