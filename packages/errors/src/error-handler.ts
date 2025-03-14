import { NextFunction, Request, Response } from "express";
import StatusCodes from "http-status";

const errorHandlerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("error handler middleware called");
  const defaultError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again later",
  };
  console.log(err.message);
  if (err.name === "ValidationError") {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    // defaultError.msg = err.message
    defaultError.msg = Object.values(err.errors)
      .map((item: any) => item.message)
      .join(",");
  }
  if (err.name === "ReferenceError") {
    if (process.env.NODE_ENV === "prod") {
      defaultError.statusCode = StatusCodes.BAD_REQUEST;
      defaultError.msg = "Something went wrong, try again later";
    }
  }
  if (err.code && err.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`;
  }

  res.status(defaultError.statusCode).json({ err: defaultError.msg });
};

export default errorHandlerMiddleware;
