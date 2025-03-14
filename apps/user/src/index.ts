import express from "express";
import "express-async-errors";
import { connectDB } from "@repo/mongoose";
import { auth } from '@repo/middleware'
import dotenv from 'dotenv'
import cors from "cors";
import { errorHandlerMiddleware } from "@repo/errors";
import userRouter from './routes/user'
import morgan from 'morgan'
dotenv.config()
const app = express();

app.use(morgan("dev"));
app.use(auth)

app.use(express.json());
app.use(cors());
app.use('/', userRouter)

app.use(errorHandlerMiddleware);

const port = process.env.PORT;
const server = app.listen(port, () =>
  console.log(`server listening on port ${port}`),
);


connectDB(process.env.MONGO_URI as string)
  .then(() => console.log("connected to db"))
  .catch((error) => console.log(error));
