import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  image: string;
  likes: mongoose.Types.ObjectId[];
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const PostModel =
  (mongoose.models.Post as mongoose.Model<IPost>) ||
  mongoose.model<IPost>("Post", PostSchema);

export default PostModel;
