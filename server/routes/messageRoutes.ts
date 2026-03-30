import express from "express";
import { authMiddleware } from "../middleware/auth";
import {
  sendMessage,
  getMessages,
  getConversations,
} from "../controllers/messageController";

const router = express.Router();

router.post("/send", authMiddleware, sendMessage);
router.get("/with/:userId", authMiddleware, getMessages);
router.get("/conversations", authMiddleware, getConversations);

export default router;
