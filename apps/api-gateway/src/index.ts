import express, { Request, Response, Application } from "express";
import proxy from "express-http-proxy";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
  res.send("API Gateway is running");
});

const {
  AUTHURL = "",
  CHATURL = "",
  SIGNALINGURL = "",
  USERURL = "",
} = process.env;
console.log({ AUTHURL, USERURL });

app.use("/auth", proxy(AUTHURL));
app.use("/chat", proxy(CHATURL));
app.use("/signal", proxy(SIGNALINGURL));
app.use("/user", proxy(USERURL));

app.listen(8000, () => console.log("API Gateway running on port 8000"));
