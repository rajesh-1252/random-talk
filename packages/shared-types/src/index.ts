import * as express from "express";
import { IUser } from "./mongoose/user";

declare global {
  namespace Express {
    interface Request {
      userDetails: {
        _id: string;
        name: string;
        email: string;
        profilePicture?: string;
        bio?: string;
        phone?: string;
        googleId?: string;
        friends: string[] | any[]; // Using any[] instead of IUser[] to avoid circular references
        blockedUsers?: string[] | any[];
        rating: number;
        status?: "online" | "offline" | "away" | "busy";
        lastSeen?: Date;
        device?: {
          platform?: string;
          token?: string;
        };
      };
      userDetails2: IUser;
    }
  }
}

export { IUser };
