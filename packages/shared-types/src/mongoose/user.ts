import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId | string;
  name: string;
  email: string;
  password: string;
  profilePicture?: string;
  bio?: string;
  phone?: string;
  googleId?: string;
  friends: Types.ObjectId[] | IUser[];
  blockedUsers?: Types.ObjectId[] | IUser[];
  rating: number;
  status?: "online" | "offline" | "away" | "busy";
  lastSeen?: Date;
  device?: {
    platform?: string;
    token?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
