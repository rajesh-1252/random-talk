import { Response } from "express";
export const apiResponse = (
  res: Response,
  result: any,
  status = 200,
  success = true,
) => {
  return res.status(status).json({
    success,
    result,
  });
};
