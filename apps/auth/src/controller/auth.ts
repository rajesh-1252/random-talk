import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { UserModal } from "@repo/mongoose";
import jwt, { SignOptions } from "jsonwebtoken";
import { BadRequestError } from "@repo/errors";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  console.log({ name, email, password });
  if (!name || !email || !password) throw new BadRequestError("missing values");
  const existingUser = await UserModal.findOne({ email });
  if (existingUser) {
    throw new BadRequestError("User already exist");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserModal({ name, email, password: hashedPassword });
  await newUser.save();
  res.status(201).json({ message: "User registered" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) res.status(400).json({ error: "Missing fields" });

  const user = await UserModal.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new BadRequestError("Invalid creds");
  }
  if (!user) {
    throw new BadRequestError("no user found");
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_EXPIRATION as string,
    } as SignOptions,
  );

  res.json({ message: "Login successful", token });
};
export const googleCallback = (req: Request, res: Response) => {
  if (!req.user) res.status(401).json({ error: "Authentication failed" });

  const secret: string | undefined = process.env.JWT_SECRET;
  const expiresIn: string | number = process.env.JWT_EXPIRATION
    ? Number(process.env.JWT_EXPIRATION) || process.env.JWT_EXPIRATION
    : "1h";

  if (!secret) {
    console.error("JWT_SECRET is not defined!");
    return res.status(500).json({ error: "Server configuration error" });
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      id: (req.user as any).id,
      email: (req.user as any).emails[0].value,
    },
    secret,
    { expiresIn } as SignOptions, // Now correctly typed
  );
  res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
};
