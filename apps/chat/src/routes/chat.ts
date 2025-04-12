import { Router } from "express";
import {
  getMessage,
  createMessage,
  updateMessage,
  deleteMessage,
} from "../controller/chat";
// import { authenticate } from "../middleware/auth"; // Assuming you have an auth middleware

const messageRouter: Router = Router();

// Apply authentication middleware to all routes
// messageRouter.use(authenticate);

messageRouter.get("/:conversationId/:senderId", getMessage);


messageRouter.put("/:messageId", updateMessage);

messageRouter.delete("/:messageId", deleteMessage);

export default messageRouter;
