import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import User from "../models/User";

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .select("-password")
      .populate("followers", "username name profilePic")
      .populate("following", "username name profilePic");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, bio, profilePic } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, bio, profilePic },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export const getFollowers = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "followers",
      "username name profilePic bio"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.followers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch followers" });
  }
};

export const getFollowing = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "following",
      "username name profilePic bio"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.following);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch following" });
  }
};
