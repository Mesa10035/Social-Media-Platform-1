import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Post from "../models/Post";
import User from "../models/User";
import mongoose from "mongoose";

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { content, image } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const post = new Post({
      userId: req.userId,
      content,
      image: image || "",
    });

    await post.save();
    const populatedPost = await post.populate("userId", "username name profilePic");

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

export const getFeed = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId);

    const posts = await Post.find({
      $or: [
        { userId: req.userId },
        { userId: { $in: user?.following } },
      ],
    })
      .populate("userId", "username name profilePic bio")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch feed" });
  }
};

export const getPostById = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate(
      "userId",
      "username name profilePic bio"
    );

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const { content, image } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.userId.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    post.content = content || post.content;
    post.image = image !== undefined ? image : post.image;

    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to update post" });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.userId.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Post.findByIdAndDelete(postId);

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
};

export const likePost = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userId = req.userId!;
    const isLiked = post.likes.some((id) => id.toString() === userId);

    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(new mongoose.Types.ObjectId(userId));
    }

    await post.save();
    const updatedPost = await post.populate(
      "userId",
      "username name profilePic bio"
    );

    res.json(updatedPost);
  } catch (error) {
    console.error("Like post error:", error);
    res.status(500).json({ error: "Failed to like post" });
  }
};

export const getUserPosts = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ userId })
      .populate("userId", "username name profilePic bio")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user posts" });
  }
};
