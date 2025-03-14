import { Router } from "express";

import { addFavoriteUser, getUsersContacts } from "../controller/user";

const userRouter: Router = Router();

userRouter.get("/contacts", getUsersContacts);
userRouter.get("/addFav", addFavoriteUser);

export default userRouter;
