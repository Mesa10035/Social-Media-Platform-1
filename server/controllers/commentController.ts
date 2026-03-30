import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Comment from "../models/Comment";
import Post from "../models/Post";

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Comment text is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = new Comment({
      postId,
      userId: req.userId,
      text,
    });

    await comment.save();
    post.commentsCount += 1;
    await post.save();

    const populatedComment = await comment.populate(
      "userId",
      "username name profilePic"
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment" });
  }
};

export const getComments = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId })
      .populate("userId", "username name profilePic bio")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.userId.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Comment.findByIdAndDelete(commentId);

    const post = await Post.findById(comment.postId);
    if (post) {
      post.commentsCount = Math.max(0, post.commentsCount - 1);
      await post.save();
    }

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
};
