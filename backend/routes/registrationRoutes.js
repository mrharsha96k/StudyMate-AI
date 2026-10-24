
import express from "express";
import {
  startRegistration,
  verifyRegistration,
} from "../controllers/registrationController.js";

const router = express.Router();

router.post("/start", startRegistration);
router.post("/verify", verifyRegistration);

export default router;
