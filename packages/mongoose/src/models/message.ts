import mongoose, { Schema, Document } from "mongoose";

export type MessageStatus = "delivered" | "seen" | "sent" | "sending";

export interface IMessage {
  sender: mongoose.Types.ObjectId | string;
  receiver: mongoose.Types.ObjectId | string;
  text?: string;
  video?: string;
  audio?: string;
  file?: string;
  conversationId: mongoose.Types.ObjectId | string;
  status: MessageStatus;
}
interface MMessage extends IMessage, Document {
  timestamp: Date;
}

const MessageSchema = new Schema<MMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, trim: true },
    video: { type: String },
    audio: { type: String },
    file: { type: String },
    status: {
      type: String,
      enum: ["delivered", "sent", "seen"],
      default: "sent",
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const MessageModel = mongoose.model<MMessage>("Message", MessageSchema);
