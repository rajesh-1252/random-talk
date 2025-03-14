import express, { Request, Response } from "express";
import { UserModal } from "@repo/mongoose";
import { BadRequestError } from "@repo/errors";
import { apiResponse } from "@repo/helper";

export const getUsersContacts = async (req: Request, res: Response) => {
  const user = req.userDetails;
  const users = await UserModal.findById(user._id).populate("friends");
  apiResponse(res, users?.friends);
};

export const addFavoriteUser = async (req: Request, res: Response) => {
  const userId = req.userDetails._id;
  const { favUserId } = req.query;
  console.log(favUserId);

  const favUser = await UserModal.findById(favUserId);
  if (!favUser) {
    throw new BadRequestError("Faviroute user not found");
  }

  const updateUser = await UserModal.findOneAndUpdate(
    { _id: userId },
    { $addToSet: { friends: favUserId } },
    { new: true },
  ).lean();
  apiResponse(res, updateUser);
  res.send(updateUser);
};
