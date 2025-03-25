import { Router } from "express";

import { addFavoriteUser, getUser, getUsersContacts } from "../controller/user";

const userRouter: Router = Router();

userRouter.get("/", getUser);
userRouter.get("/contacts", getUsersContacts);
userRouter.get("/addFav", addFavoriteUser);

export default userRouter;
