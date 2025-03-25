"use client";
import React, { useState } from "react";
import { Search, Archive, Lock, MoreVertical, Plus } from "lucide-react";
import ChatPreview from "@/components/chat/ChatPreview";
import { useGetConversation } from "@/features/chat/queries";
import ChatLoadingScreen from "@/components/chat/ChatLoading";

const ChatApp = () => {
  const [activeTab, setActiveTab] = useState("All");
  const { data, isLoading, isError } = useGetConversation()

  const chats = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/api/placeholder/40/40",
      lastMessage: "I'll send you the files tomorrow",
      time: "9:15 AM",
      unread: 3,
      pinned: true,
    },
    {
      id: 2,
      name: "Design Team",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Jake: The mockups look great!",
      time: "1:21 PM",
      unread: 0,
      isGroup: true,
    },
    {
      id: 3,
      name: "Michael Chen",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Just sent the presentation",
      time: "9:24 AM",
      unread: 0,
    },
    {
      id: 4,
      name: "App Updates",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Increase your account security with a passkey...",
      time: "8:51 AM",
      unread: 4,
      isOfficial: true,
    },
    {
      id: 5,
      name: "Alex Rivera",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Sounds good!",
      time: "Yesterday",
      unread: 0,
    },
    {
      id: 6,
      name: "Project Alpha",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Meeting scheduled for tomorrow",
      time: "Yesterday",
      unread: 0,
      isGroup: true,
    },
  ];


  const tabs = ["All", "Unread", "Favorites", "Groups"];

  if (isLoading) return <ChatLoadingScreen />
  if (isError) return <p> Error</p>

  const conversations = data?.result.conversations
  console.log({ conversations })

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gray-800">
        <h1 className="text-xl font-bold">Chats</h1>
        <div className="flex gap-4">
          <Plus className="w-6 h-6" />
          <MoreVertical className="w-6 h-6" />
        </div>
      </div>

      {/* Search bar */}
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

      {/* Tabs */}
      <div className="flex gap-2 px-4 pb-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-1 rounded-full text-sm ${activeTab === tab
              ? "bg-teal-600 text-white"
              : "bg-gray-700 text-gray-300"
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Sections */}
      <div className="mt-4 border-b border-gray-700">
        <div className="flex items-center px-4 py-2">
          <Lock className="w-5 h-5 text-teal-500 mr-3" />
          <span>Locked chats</span>
        </div>
      </div>

      <div className="border-b border-gray-700">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center">
            <Archive className="w-5 h-5 text-teal-500 mr-3" />
            <span>Archived</span>
          </div>
          <span className="bg-teal-500 px-2 rounded-full text-xs">1</span>
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {conversations?.map((converstation) => (
          <ChatPreview key={converstation.id} {...converstation} />
        ))}
      </div>
    </div>
  );
};

export default ChatApp;
