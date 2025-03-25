import { Router } from "express";
import {
  createConversation,
  getUserConversations,
} from "../controller/conversation";

const conversationRouter: Router = Router();

conversationRouter.post("/", createConversation);
conversationRouter.get("/", getUserConversations);

export default conversationRouter;
