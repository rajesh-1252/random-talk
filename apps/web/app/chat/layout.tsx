'use client'
import NoChatSelected from "@/components/chat/NoChatSelected";
import { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";

interface ChatLayoutProps {
  chat: React.ReactNode;
  userList: React.ReactNode;
}

const ChatLayout = ({ chat, userList }: ChatLayoutProps) => {
  const { currentUser } = useSelector((state: RootState) => state.chat)

  return (
    <div className="flex">
      <div className="w-[400px]">{userList}</div>
      {currentUser ?
        <div className="w-full">{chat}</div> : <NoChatSelected />
      }
    </div>
  );
};

export default ChatLayout;
