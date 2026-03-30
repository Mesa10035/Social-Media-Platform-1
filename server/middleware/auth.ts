import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
  user?: { userId: string; [key: string]: unknown };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      return res.status(500).json({ error: "JWT_SECRET is not configured" });
    }

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, jwtSecret);
    const data = decoded as { userId?: string };

    if (!data.userId) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.userId = data.userId;
    req.user = { userId: data.userId };
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
