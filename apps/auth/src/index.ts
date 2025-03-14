import express, { Application, Request, Response } from "express";
import "express-async-errors";
import AuthRouter from "./routes/auth";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import "./config/passport";
import { connectDB } from "@repo/mongoose";

import { errorHandlerMiddleware } from "@repo/errors";

const app: Application = express();

app.use(
  session({
    secret: process.env.JWT_SECRET as string,
    resave: false,
    saveUninitialized: true,
  }),
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.session());

app.use(express.json());
app.use(cors());
app.use("/", AuthRouter);
app.use(errorHandlerMiddleware);

connectDB(process.env.MONGO_URI as string)
  .then(() => console.log("connected to db"))
  .catch((error) => console.log(error));

const port = process.env.PORT;
app.listen(port, () => console.log(`auth listening on ${port}`));
