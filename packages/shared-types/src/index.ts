import * as express from "express";
import { IUser } from "./mongoose/user";
declare global {
  namespace Express {
    interface Request {
      userDetails: {
        _id: string;
        name: string;
        email: string;
        googleId?: string;
        friends: [];
        rating: number;
      };
      userDetails2: IUser;
    }
  }
}

export { IUser };
