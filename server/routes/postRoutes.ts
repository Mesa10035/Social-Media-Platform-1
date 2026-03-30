import express from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createPost,
  getFeed,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  getUserPosts,
} from "../controllers/postController";

const router = express.Router();

// Specific routes first (before :postId)
router.post("/", authMiddleware, createPost);
router.get("/feed", authMiddleware, getFeed);
router.get("/user/:userId", authMiddleware, getUserPosts);

// Dynamic routes (/:postId)
router.get("/:postId", authMiddleware, getPostById);
router.put("/:postId", authMiddleware, updatePost);
router.delete("/:postId", authMiddleware, deletePost);
router.post("/:postId/like", authMiddleware, likePost);

export default router;
