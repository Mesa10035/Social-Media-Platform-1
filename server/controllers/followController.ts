import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import User from "../models/User";
import mongoose from "mongoose";

export const followUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = String(req.params.userId);

    if (req.userId === userId) {
      return res.status(400).json({ error: "Cannot follow yourself" });
    }

    const currentUser = await User.findById(req.userId);
    const userToFollow = await User.findById(userId);

    if (!userToFollow) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if already following
    const userIdObj = new mongoose.Types.ObjectId(userId);
    const alreadyFollowing = currentUser!.following.some(
      (id) => id.toString() === userId
    );

    if (alreadyFollowing) {
      return res.status(400).json({ error: "Already following this user" });
    }

    currentUser!.following.push(userIdObj);
    userToFollow.followers.push(new mongoose.Types.ObjectId(req.userId!));

    await currentUser!.save();
    await userToFollow.save();

    res.json({
      message: "Followed successfully",
      user: currentUser,
    });
  } catch (error) {
    console.error("Follow error:", error);
    res.status(500).json({ error: "Failed to follow user" });
  }
};

export const unfollowUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = String(req.params.userId);

    const currentUser = await User.findById(req.userId);
    const userToUnfollow = await User.findById(userId);

    if (!userToUnfollow) {
      return res.status(404).json({ error: "User not found" });
    }

    currentUser!.following = currentUser!.following.filter(
      (id) => id.toString() !== userId
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== req.userId
    );

    await currentUser!.save();
    await userToUnfollow.save();

    res.json({
      message: "Unfollowed successfully",
      user: currentUser,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to unfollow user" });
  }
};
