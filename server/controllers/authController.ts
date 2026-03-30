import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Email or username already exists" });
    }

    const user = new User({
      name,
      username,
      email,
      password,
    });

    await user.save();

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return res
        .status(500)
        .json({ error: "Server is not configured for token signing" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePic: user.profilePic,
        followers: user.followers,
        following: user.following,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return res
        .status(500)
        .json({ error: "Server is not configured for token signing" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePic: user.profilePic,
        followers: user.followers,
        following: user.following,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};
