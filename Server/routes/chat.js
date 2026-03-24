import express from "express";
import { askQuestion, getHistory } from "../controllers/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, askQuestion);
router.get("/history", authMiddleware, getHistory);

export default router;