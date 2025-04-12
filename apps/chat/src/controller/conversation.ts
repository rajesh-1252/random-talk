import { BadRequestError } from "@repo/errors";
import { ConversationModel, MessageModel } from "@repo/mongoose";
import { Request, Response } from "express";
import { apiResponse } from "@repo/helper";
import redisClient from "../redis";

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
    .populate('lastMessage', 'text')
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

export const pushToPendingMessage = async ({
  conversationId,
  messageId,
}: {
  conversationId: string;
  messageId: string;
}) => {
  try {
    await ConversationModel.updateOne(
      { _id: conversationId },
      { $push: { pendingMessages: messageId } },
    );
  } catch (error) {
    console.log(error);
  }
};

export const batchUpdateStatus = async ({
  conversationId,
  seenById,
  status,
  // socket,
}: {
  conversationId: string;
  seenById: string;
  status: "delivered" | "seen";
  // socket: Socket;
}) => {
  try {
    const conversation = await ConversationModel.findById(conversationId);

    if (!conversation || !conversation.pendingMessages.length) return;

    const messageIds = conversation.pendingMessages;

    const message = await MessageModel.findOne({ _id: messageIds[0] });
    console.log({ messageId: message?.receiver.toString(), seenById });
    if (message?.receiver.toString() !== seenById) {
      console.log("not seen by receiver");
      return;
    }

    // socket.emit(MESSAGE_SEEN_BY_RECEIVER_SEND_TO_SENDER)
    console.log("seen by receiver");
    // 1. Update all messages' status in bulk
    await MessageModel.updateMany(
      { _id: { $in: messageIds }, receiver: seenById },
      { $set: { status } },
    );

    // 2. If status === seen, pull all those messages from pendingMessages array
    if (status === "seen") {
      await ConversationModel.updateOne(
        { _id: conversationId },
        { $set: { pendingMessages: [] } },
      );
    }
  } catch (error) {
    console.error("batchUpdateStatus error:", error);
  }
};


export const isOnline = async (req: Request, res: Response) => {
  const userId = req.params.userId
  const isOnline = await redisClient.exists(`online:${userId}`)
  console.log({ isOnline })
  apiResponse(res, {
    isOnline: isOnline === 1
  })
}
