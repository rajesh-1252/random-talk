import { Router } from "express";
import conversationRouter from "./routes/conversation";
import messageRouter from "./routes/chat";

const AppRouter = Router();
AppRouter.use("/conversation", conversationRouter);
AppRouter.use("/message", messageRouter);

export default AppRouter;
