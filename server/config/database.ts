import mongoose from "mongoose";

export async function connectDB() {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/social_media_platform";
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected successfully at:", mongoURI);
    return true;
  } catch (error) {
    console.warn("⚠️  MongoDB connection failed:", (error as any).message);
    console.warn("💡 Make sure MongoDB is running: mongod");
    console.warn("📍 Expected connection string: mongodb://127.0.0.1:27017/social_media_platform");
    return false;
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("MongoDB disconnection failed:", error);
  }
}
