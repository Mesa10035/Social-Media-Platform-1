import express from "express";
import { authMiddleware } from "../middleware/auth";
import { followUser, unfollowUser } from "../controllers/followController";

const router = express.Router();

router.post("/:userId/follow", authMiddleware, followUser);
router.post("/:userId/unfollow", authMiddleware, unfollowUser);

export default router;
