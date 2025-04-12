import { Search } from "lucide-react";
import React from "react";

const ChatPreviewSearch = () => {
  return (
    <div className="px-4 py-2">
      <div className="flex items-center bg-gray-700 rounded-lg px-3 py-2">
        <Search className="w-5 h-5 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent border-none outline-none text-white w-full"
        />
      </div>
    </div>
  );
};

export default ChatPreviewSearch;
