import express from "express";
import { authMiddleware } from "../middleware/auth";
import {
  getProfile,
  getUserById,
  getAllUsers,
  updateProfile,
  getFollowers,
  getFollowing,
} from "../controllers/userController";

const router = express.Router();

// Specific routes first (before :userId)
router.get("/profile", authMiddleware, getProfile);
router.get("/all", authMiddleware, getAllUsers);
router.put("/update", authMiddleware, updateProfile);

// Dynamic routes (/:userId)
router.get("/:userId", authMiddleware, getUserById);
router.get("/:userId/followers", authMiddleware, getFollowers);
router.get("/:userId/following", authMiddleware, getFollowing);

export default router;
