import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  message: string;
  image?: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const MessageModel =
  (mongoose.models.Message as mongoose.Model<IMessage>) ||
  mongoose.model<IMessage>("Message", MessageSchema);

export default MessageModel;
