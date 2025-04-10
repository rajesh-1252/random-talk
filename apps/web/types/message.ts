import { Message } from "@/store/features/chat/chatSlice";

export type PopulatedMessage = Omit<Message, 'sender'> & {
  sender: { _id: string, name: string };
};
