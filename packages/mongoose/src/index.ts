import { connectDB } from "./db/connect";
import { UserModel } from "./models/user";
import { ConversationModel, IConversation } from "./models/conversation";
import { MessageModel, IMessage } from "./models/message";

import type { IUser } from "@repo/shared-types";
export {
  connectDB,
  UserModel,
  IUser,
  MessageModel,
  IMessage,
  ConversationModel,
  IConversation,
};
