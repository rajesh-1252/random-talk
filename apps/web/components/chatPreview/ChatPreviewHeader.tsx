import { Plus, MoreVertical } from "lucide-react";
import React from "react";

const ChatPreviewHeader = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-800">
      <h1 className="text-xl font-bold">Chats</h1>
      <div className="flex gap-4">
        <Plus className="w-6 h-6" />
        <MoreVertical className="w-6 h-6" />
      </div>
    </div>
  );
};

export default ChatPreviewHeader;
