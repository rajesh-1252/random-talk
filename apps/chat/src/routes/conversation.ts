import { Router } from "express";
import {
  createConversation,
  getUserConversations,
  isOnline,
} from "../controller/conversation";

const conversationRouter: Router = Router();

conversationRouter.post("/", createConversation);
conversationRouter.get("/", getUserConversations);
conversationRouter.get("/online/:userId/", isOnline);

export default conversationRouter;
