import mongoose, { Schema, Document } from "mongoose";

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  lastMessage?: {
    sender: mongoose.Types.ObjectId;
    text?: string;
    media?: string;
    timestamp: Date;
  };
  unreadCount: Map<string, number>;
  isPinned: Map<string, boolean>;
  isMuted: Map<string, boolean>;
  archived: Map<string, boolean>;
  deletedFor: mongoose.Types.ObjectId[];
  typingUsers: mongoose.Types.ObjectId[];
  contactName: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    isGroup: { type: Boolean, default: false },
    groupName: { type: String },
    groupAvatar: { type: String },
    lastMessage: {
      sender: { type: Schema.Types.ObjectId, ref: "User" },
      text: { type: String },
      media: { type: String },
      timestamp: { type: Date },
    },
    unreadCount: { type: Map, of: Number, default: {} },
    isPinned: { type: Map, of: Boolean, default: {} },
    isMuted: { type: Map, of: Boolean, default: {} },
    archived: { type: Map, of: Boolean, default: {} },
    deletedFor: [{ type: Schema.Types.ObjectId, ref: "User" }],
    typingUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    contactName: { type: String },
  },
  { timestamps: true },
);

export const ConversationModel = mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema,
);
