import express, { Application, Request, Response } from "express";
import "express-async-errors";
import cors from "cors";
import { connectDB } from "@repo/mongoose";
import { createServer } from "http";
import { errorHandlerMiddleware } from "@repo/errors";
import { setupSocketServer } from "./socket";
import "dotenv/config";
import AppRouter from "./route";
import { auth } from "@repo/middleware";

const app: Application = express();
const server = createServer(app);

app.use(auth);
app.use(express.json());
app.use(cors());
app.use("/", AppRouter);
app.use(errorHandlerMiddleware);

connectDB(process.env.MONGO_URI as string)
  .then(() => console.log("connected to db"))
  .catch((error) => console.log(error));
const port = process.env.PORT;
server.listen(port, () => console.log(`chat listening on ${port}`));
setupSocketServer(server);
