"use client";
import React, { useState } from "react";

const ChatPreviewFilterTabs = () => {
  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "Unread", "Favorites", "Groups"];
  return (
    <div className="flex gap-2 px-4 pb-2 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-4 py-1 rounded-full text-sm ${
            activeTab === tab
              ? "bg-teal-600 text-white"
              : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default ChatPreviewFilterTabs;
