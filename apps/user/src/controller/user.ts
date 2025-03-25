import express, { Request, Response } from "express";
import { UserModel } from "@repo/mongoose";
import { BadRequestError } from "@repo/errors";
import { apiResponse } from "@repo/helper";

export const getUser = async (req: Request, res: Response) => {
  const user = req.userDetails;
  const users = await UserModel.findById(user._id);
  apiResponse(res, users);
};

export const getUsersContacts = async (req: Request, res: Response) => {
  const user = req.userDetails;
  const users = await UserModel.findById(user._id).populate("friends");
  apiResponse(res, users?.friends);
};

export const addFavoriteUser = async (req: Request, res: Response) => {
  const userId = req.userDetails._id;
  const { favUserId } = req.query;
  console.log(favUserId);

  const favUser = await UserModel.findOne({
    _id: userId,
    friends: favUserId,
  });
  if (favUser) {
    throw new BadRequestError("User already added as a friend");
  }
  if (!favUser) {
    throw new BadRequestError("Faviroute user not found");
  }

  const isFriend = await UserModel.findById(userId);

  const updateUser = await UserModel.findOneAndUpdate(
    { _id: userId },
    { $addToSet: { friends: favUserId } },
    { new: true },
  ).lean();
  apiResponse(res, updateUser);
  res.send(updateUser);
};
