import { BadRequestError } from "@repo/errors";
import { apiResponse } from "@repo/helper";
import { MessageModel, ConversationModel } from "@repo/mongoose";
import { Request, Response } from "express";
import { pushToPendingMessage } from "./conversation";
import mongoose from "mongoose";
import redisClient from "../redis";

export const getMessage = async (req: Request, res: Response) => {
  const conversationId = req.params.conversationId;
  const senderId = req.params.senderId
  console.log({ senderId, params: req.params, conversationId })


  if (!conversationId) {
    throw new BadRequestError("Chat ID is required");
  }

  const messages = await MessageModel.find({
    conversationId: conversationId,
  }).sort({ timestamp: 1 });
  // .populate("sender", "name avatar")
  // .populate("receiver", "name avatar");
  //

  // get online of the userr
  const userId = req.userDetails._id
  const isOnline = await redisClient.exists(`online:${senderId}`)
  console.log({ isOnline, userId })

  apiResponse(res, { messages, isOnline: isOnline === 1 });
};

export const createMessage = async (params: any) => {
  const userId = params.sender;
  const { receiver, text, video, audio, file, conversationId } = params;

  if (!receiver) {
    throw new BadRequestError("Receiver is required");
  }

  if (!text) {
    throw new BadRequestError("Cannot send empty message");
  }

  if (!conversationId) {
    throw new BadRequestError("Chat ID is required");
  }

  // Check if at least one content type is provided
  // if (!content && !video && !audio && !file) {
  //   throw new BadRequestError(
  //     "Message must contain content, video, audio, or file",
  //   );
  // }
  // Verify if conversation exists and user is a participant
  let conversation = await ConversationModel.findById(conversationId);
  if (!conversation) {
    throw new BadRequestError("Conversation not found");
  }


  if (!conversation.participants.includes(userId)) {
    throw new BadRequestError("You are not a participant in this conversation");
  }

  // Create the message
  const message = await MessageModel.create({
    sender: userId,
    receiver: receiver,
    text,
    video,
    audio,
    file,
    conversationId,
  });


  if (!message) {
    throw new BadRequestError("Error creating messsage");
  }
  await ConversationModel.findByIdAndUpdate(
    conversationId,
    { lastMessage: message._id },
    { new: true }
  );
  await pushToPendingMessage({ conversationId, messageId: message._id as string })
  const populatedMessage = await MessageModel.findById(message._id)
    .populate("sender", "name avatar")
    .populate("receiver", "name avatar");

  console.log("message created");
  return populatedMessage;
  // apiResponse(res, populatedMessage);
};

export const updateMessage = async (req: Request, res: Response) => {
  const userId = req.userDetails._id;
  const messageId = req.params.messageId;
  const { content } = req.body;

  if (!messageId) {
    throw new BadRequestError("Message ID is required");
  }

  if (!content) {
    throw new BadRequestError("Content is required for update");
  }

  // Find the message
  const message = await MessageModel.findById(messageId);

  if (!message) {
    throw new BadRequestError("Message not found");
  }

  // Verify if user is the sender
  if (message.sender.toString() !== userId.toString()) {
    throw new BadRequestError("You can only update your own messages");
  }

  // Update the message content
  message.text = content;
  await message.save();

  const updatedMessage = await MessageModel.findById(messageId)
    .populate("sender", "name avatar")
    .populate("receiver", "name avatar");

  apiResponse(res, updatedMessage);
};


export const updateMessageStatus = async (params: any) => {
  const { messageId, status } = params;

  if (!messageId || !status) {
    throw new BadRequestError("Message ID and status are required");
  }

  const allowedStatuses = ["sent", "delivered", "seen"];
  if (!allowedStatuses.includes(status)) {
    throw new BadRequestError("Invalid message status");
  }

  const message = await MessageModel.findById(messageId);

  if (!message) {
    throw new BadRequestError("Message not found");
  }

  message.status = status;
  await message.save();

}

export const deleteMessage = async (req: Request, res: Response) => {
  const userId = req.userDetails._id;
  const messageId = req.params.messageId;

  if (!messageId) {
    throw new BadRequestError("Message ID is required");
  }

  // Find the message
  const message = await MessageModel.findById(messageId);

  if (!message) {
    throw new BadRequestError("Message not found");
  }

  // Verify if user is the sender
  if (message.sender.toString() !== userId.toString()) {
    throw new BadRequestError("You can only delete your own messages");
  }

  // Delete the message
  await MessageModel.findByIdAndDelete(messageId);

  apiResponse(res, { message: "Message deleted successfully" });
};

// export const sendImageMessage = async (req, res) => {};
// export const sendAudioMessage = async (req, res) => {};
