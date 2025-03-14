import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  googleId?: string; // Optional for Google OAuth
  friends: [];
  rating: number;
}
