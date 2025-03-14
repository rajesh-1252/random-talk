import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { UserModal } from "@repo/mongoose"; // Adjust the path as needed
import { UnAuthenticatedError } from "@repo/errors";
dotenv.config();

// Define a custom Request type with the user property
interface AuthenticatedRequest extends Request {
  user?: Record<string, any>;
}

export const auth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnAuthenticatedError("No token provided");
  }

  const token = authorization.split(" ")[1];
  console.log({ token });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    const userDetails = await UserModal.findById(decoded.userId).select(
      "-password",
    );
    console.log({ userDetails });

    if (!userDetails) {
      throw new UnAuthenticatedError("User not found");
    }

    req.userDetails = { ...userDetails, _id: userDetails._id as string };
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new UnAuthenticatedError("Token expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new UnAuthenticatedError("Invalid token");
    } else {
      console.log(error);
      throw new UnAuthenticatedError("Authentication failed");
    }
  }
};
