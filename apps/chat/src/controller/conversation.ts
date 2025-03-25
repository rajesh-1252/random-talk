import { BadRequestError } from "@repo/errors";
import { ConversationModel } from "@repo/mongoose";
import { Request, Response } from "express";
import { apiResponse } from "@repo/helper";

export const createConversation = async (req: Request, res: Response) => {
  const userId = req.userDetails._id;
  const { participants, isGroup, groupName, groupAvatar } = req.body;

  if (!Array.isArray(participants) || participants.length < 1) {
    throw new BadRequestError("At least one participant should be provided.");
  }

  const allParticipants = [...new Set([userId, ...participants])];

  if (!isGroup) {
    if (allParticipants.length !== 2) {
      throw new BadRequestError(
        "Only one participant should be provided for a single chat.",
      );
    }

    const existingConversation = await ConversationModel.findOne({
      participants: { $all: allParticipants, $size: 2 },
      isGroup: false,
    });

    if (existingConversation) {
      throw new BadRequestError("Conversation already exists.");
    }

    const conversation = await ConversationModel.create({
      participants: allParticipants,
      isGroup: false,
    });

    apiResponse(res, conversation);
    return;
  }

  if (allParticipants.length < 3) {
    throw new BadRequestError("A group chat requires at least 3 participants.");
  }

  if (!groupName) {
    throw new BadRequestError("A group name is required.");
  }

  const existingGroup = await ConversationModel.findOne({
    participants: { $all: allParticipants, $size: allParticipants.length },
    isGroup: true,
  });

  if (existingGroup) {
    throw new BadRequestError(
      "A group with the same participants already exists.",
    );
  }

  const conversation = await ConversationModel.create({
    participants: allParticipants,
    isGroup: true,
    groupName,
    groupAvatar: groupAvatar || null,
  });

  apiResponse(res, conversation);
};

export const getUserConversations = async (req: Request, res: Response) => {
  const userId = req.userDetails._id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  if (!userId) {
    throw new BadRequestError("User ID is required.");
  }

  const conversations = await ConversationModel.find({ participants: userId })
    .populate("participants", "_id name avatar")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await ConversationModel.countDocuments({
    participants: userId,
  });

  apiResponse(res, {
    conversations,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};
