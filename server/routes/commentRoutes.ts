import express from "express";
import { authMiddleware } from "../middleware/auth";
import { addComment, getComments, deleteComment } from "../controllers/commentController";

const router = express.Router();

router.post("/:postId/comments", authMiddleware, addComment);
router.get("/:postId/comments", authMiddleware, getComments);
router.delete("/comment/:commentId", authMiddleware, deleteComment);

export default router;
