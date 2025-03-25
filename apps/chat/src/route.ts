import { Router } from "express";
import conversationRouter from "./routes/conversation";

const AppRouter = Router();
AppRouter.use("/conversation", conversationRouter);
export default AppRouter;
