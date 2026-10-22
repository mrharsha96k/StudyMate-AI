import express from "express";

import upload from "../middleware/upload.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

import {
  uploadPDF,
  getUploadedPDFs,
} from "../controllers/uploadController.js";

const router = express.Router();

// Authentication required to upload PDFs
router.post("/", authMiddleware, upload.single("pdf"), uploadPDF);

// Authentication required to retrieve the user's PDFs
router.get("/", authMiddleware, getUploadedPDFs);

export default router;