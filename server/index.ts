import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer as createHttpServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/database";
import { setupSocket } from "./socket/socketHandler";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import followRoutes from "./routes/followRoutes";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";
import messageRoutes from "./routes/messageRoutes";

export function createServer() {
  const app = express();
  const httpServer = createHttpServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Connect to MongoDB (non-blocking, will retry)
  connectDB()
    .then(() => {
      console.log("MongoDB connection established");
    })
    .catch((error) => {
      console.warn(
        "MongoDB connection failed. Server will continue running. Make sure MongoDB is running on mongodb://127.0.0.1:27017"
      );
      console.warn("Error details:", error.message);
    });

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Socket.io setup
  setupSocket(io);

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/follow", followRoutes);
  app.use("/api/posts", postRoutes);
  app.use("/api/posts", commentRoutes);
  app.use("/api/messages", messageRoutes);

  // Health check
  // Health check
app.get("/ping", (_req, res) => {
  const ping = process.env.PING_MESSAGE ?? "pong";
  res.json({ message: ping });
});

// Optional 404 handler

  return { app, httpServer, io };
}
