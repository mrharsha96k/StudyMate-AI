import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getProfile,
  updateProfile,
} from "../controllers/profileController.js";

const router = express.Router();

// Get the logged-in user's profile
router.get("/", authMiddleware, getProfile);

// Update the logged-in user's profile
router.put("/", authMiddleware, updateProfile);

export default router;