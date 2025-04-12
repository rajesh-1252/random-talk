import { IUser } from "@repo/shared-types";
import mongoose, { Schema, Document, Mongoose } from "mongoose";

export interface IConversation {
  participants: IUser[];
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  // lastMessage?: {
  //   sender: mongoose.Types.ObjectId;
  //   text?: string;
  //   media?: string;
  //   timestamp: Date;
  // };
  lastMessage: mongoose.Types.ObjectId;
  unreadCount: Map<string, number>;
  isPinned: Map<string, boolean>;
  isMuted: Map<string, boolean>;
  archived: Map<string, boolean>;
  deletedFor: mongoose.Types.ObjectId[];
  typingUsers: mongoose.Types.ObjectId[];
  contactName: string;
  createdAt: Date;
  updatedAt: Date;
  pendingMessages: mongoose.Types.ObjectId[] | string[];
}

interface MConversation extends IConversation, Document {}

const ConversationSchema = new Schema<MConversation>(
  {
    participants: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ],
    isGroup: { type: Boolean, default: false },
    groupName: { type: String },
    groupAvatar: { type: String },
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    unreadCount: { type: Map, of: Number, default: {} },
    isPinned: { type: Map, of: Boolean, default: {} },
    isMuted: { type: Map, of: Boolean, default: {} },
    archived: { type: Map, of: Boolean, default: {} },
    deletedFor: [{ type: Schema.Types.ObjectId, ref: "User" }],
    typingUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    contactName: { type: String },
    pendingMessages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  },
  { timestamps: true },
);

export const ConversationModel = mongoose.model<MConversation>(
  "Conversation",
  ConversationSchema,
);
