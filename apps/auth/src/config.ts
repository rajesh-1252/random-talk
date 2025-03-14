import dotenv from "dotenv";
dotenv.config();

export const config = {
  JWT_SECRET: process.env.JWT_SECRET || "supersecret",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  BASE_URL: process.env.BASE_URL || "http://localhost:4000",
};
