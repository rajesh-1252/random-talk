import express, { Router } from "express";
import { googleCallback, login, register } from "../controller/auth";
import passport from "passport";
const AuthRouter: Router = express.Router();

AuthRouter.post("/login", login);
AuthRouter.post("/register", register);
AuthRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

AuthRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback,
);

export default AuthRouter;
