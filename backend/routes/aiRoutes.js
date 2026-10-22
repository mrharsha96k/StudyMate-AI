import express from "express";

import {
  chatWithAI,
  generateSmartNotes,
  generateQuiz,
} from "../controllers/aiController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// AI Chat — authenticated users only
router.post("/", authMiddleware, chatWithAI);

// Smart Notes — authenticated users only
router.post("/notes", authMiddleware, generateSmartNotes);

// AI Quiz — authenticated users only
router.post("/quiz", authMiddleware, generateQuiz);

export default router;