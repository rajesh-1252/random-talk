import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  content?: string;
  video?: string;
  audio?: string;
  file?: string;
  chatId: mongoose.Types.ObjectId;
  timestamp: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, trim: true },
    video: { type: String },
    audio: { type: String },
    file: { type: String },
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);
