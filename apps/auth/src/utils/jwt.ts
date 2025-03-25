import express from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import {  IUser } from "@repo/mongoose";
import dotenv from "dotenv";

dotenv.config();

const verifyToken = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
  }
};

export const createToken = (user: IUser) => {
  const token = jwt.sign(
    { userId: user._id, rating : user.rating },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_EXPIRATION as string,
    } as SignOptions,
  );
  return token;
};

export default verifyToken;
