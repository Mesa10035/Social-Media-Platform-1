import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import Message from "../models/Message";

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { receiverId, message, image } = req.body;

    if (!receiverId || !message) {
      return res
        .status(400)
        .json({ error: "Receiver ID and message are required" });
    }

    const newMessage = new Message({
      senderId: req.userId,
      receiverId,
      message,
      image: image || "",
    });

    await newMessage.save();
    const populatedMessage = await newMessage.populate(
      "senderId receiverId",
      "username name profilePic"
    );

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: req.userId, receiverId: userId },
        { senderId: userId, receiverId: req.userId },
      ],
    })
      .populate("senderId receiverId", "username name profilePic")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const getConversations = async (req: AuthRequest, res: Response) => {
  try {
    const messages = await Message.find({
      $or: [{ senderId: req.userId }, { receiverId: req.userId }],
    }).sort({ createdAt: -1 });

    const conversationMap = new Map();

    messages.forEach((msg) => {
      const otherUserId =
        msg.senderId.toString() === req.userId
          ? msg.receiverId.toString()
          : msg.senderId.toString();

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, msg);
      }
    });

    const conversations = Array.from(conversationMap.values());
    const populatedConversations = await Message.populate(conversations, [
      { path: "senderId", select: "username name profilePic" },
      { path: "receiverId", select: "username name profilePic" },
    ]);

    res.json(populatedConversations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};
