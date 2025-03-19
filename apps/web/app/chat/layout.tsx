import React from "react";

interface ChatLayoutProps {
  chat: React.ReactNode;
  userList: React.ReactNode;
}

const ChatLayout = ({ chat, userList }: ChatLayoutProps) => {
  return (
    <div className="flex">
      <div className="w-[25%]">{userList}</div>
      <div className="w-[100%]">{chat}</div>
    </div>
  );
};

export default ChatLayout;
