import StatusCodes from "http-status";
import CustomAPIError from "./custom-api.js";

class UnAuthenticatedError extends CustomAPIError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default UnAuthenticatedError;
