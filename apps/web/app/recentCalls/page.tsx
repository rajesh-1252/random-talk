"use client";
import { useState } from "react";
import {
  Clock,
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  User,
  UserPlus,
  Star,
  MoreHorizontal,
  Calendar,
  Search,
} from "lucide-react";
import Image from "next/image";

export default function RecentCalls() {
  // Sample call history data
  const [callHistory, setCallHistory] = useState([
    {
      id: 1,
      name: "Alex Thompson",
      timestamp: "Today, 10:23 AM",
      duration: "5:12",
      type: "incoming", // incoming, outgoing, missed
      status: "answered",
      avatar: "/api/placeholder/40/40?text=AT",
      isFavorite: false,
    },
    {
      id: 2,
      name: "Jamie Rivera",
      timestamp: "Today, 9:15 AM",
      duration: "12:45",
      type: "outgoing",
      status: "answered",
      avatar: "/api/placeholder/40/40?text=JR",
      isFavorite: true,
    },
    {
      id: 3,
      name: "Unknown User",
      timestamp: "Yesterday, 7:30 PM",
      duration: "0:00",
      type: "incoming",
      status: "missed",
      avatar: "/api/placeholder/40/40?text=?",
      isFavorite: false,
    },
    {
      id: 4,
      name: "Taylor Smith",
      timestamp: "Yesterday, 6:45 PM",
      duration: "3:21",
      type: "outgoing",
      status: "answered",
      avatar: "/api/placeholder/40/40?text=TS",
      isFavorite: false,
    },
    {
      id: 5,
      name: "Morgan Davis",
      timestamp: "Yesterday, 2:12 PM",
      duration: "8:05",
      type: "incoming",
      status: "answered",
      avatar: "/api/placeholder/40/40?text=MD",
      isFavorite: false,
    },
    {
      id: 6,
      name: "Unknown User",
      timestamp: "Mar 18, 4:30 PM",
      duration: "1:17",
      type: "outgoing",
      status: "answered",
      avatar: "/api/placeholder/40/40?text=?",
      isFavorite: false,
    },
    {
      id: 7,
      name: "Quinn Miller",
      timestamp: "Mar 17, 11:05 AM",
      duration: "0:00",
      type: "outgoing",
      status: "missed",
      avatar: "/api/placeholder/40/40?text=QM",
      isFavorite: true,
    },
  ]);

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Toggle favorite status
  const toggleFavorite = (id) => {
    setCallHistory((prevHistory) =>
      prevHistory.map((call) =>
        call.id === id ? { ...call, isFavorite: !call.isFavorite } : call,
      ),
    );
  };

  // Add as friend function
  const addAsFriend = (id) => {
    // In a real app, this would send a friend request
    alert(`Friend request sent to user ID: ${id}`);
  };

  // Filter calls based on active tab
  const filteredCalls = callHistory
    .filter((call) => {
      if (activeTab === "all") return true;
      if (activeTab === "missed") return call.status === "missed";
      if (activeTab === "incoming") return call.type === "incoming";
      if (activeTab === "outgoing") return call.type === "outgoing";
      return true;
    })
    .filter((call) => {
      if (!searchQuery) return true;
      return call.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

  // Render call icon based on type and status
  const renderCallIcon = (type, status) => {
    if (status === "missed")
      return <PhoneMissed className="w-5 h-5 text-red-500" />;
    if (type === "incoming")
      return <PhoneIncoming className="w-5 h-5 text-green-500" />;
    return <PhoneOutgoing className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-indigo-600 p-6 text-white">
        <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <Clock className="w-6 h-6" />
          Recent Calls
        </h1>
        <p className="text-center text-indigo-100 mt-2">Your call history</p>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search calls..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          className={`flex-1 py-3 text-sm font-medium ${activeTab === "all" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${activeTab === "missed" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("missed")}
        >
          Missed
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${activeTab === "incoming" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("incoming")}
        >
          Incoming
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${activeTab === "outgoing" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
          onClick={() => setActiveTab("outgoing")}
        >
          Outgoing
        </button>
      </div>

      {/* Call List */}
      <div className="bg-white divide-y divide-gray-100">
        {filteredCalls.length > 0 ? (
          filteredCalls.map((call) => (
            <div key={call.id} className="px-4 py-3 hover:bg-gray-50">
              <div className="flex items-center">
                {/* Avatar */}
                <div className="relative">
                  <Image
                    src={call.avatar}
                    alt={call.name}
                    className="w-20 h-20 rounded-full"
                    width={50}
                    height={50}
                  />
                  <div className="absolute bottom-0 right-0 bg-gray-100 rounded-full p-0.5">
                    {renderCallIcon(call.type, call.status)}
                  </div>
                </div>

                {/* Call Info */}
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{call.name}</h3>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-2 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {call.timestamp}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center">
                      {call.status !== "missed" ? (
                        <span className="text-xs text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {call.duration}
                        </span>
                      ) : (
                        <span className="text-xs text-red-500">
                          Missed Call
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleFavorite(call.id)}
                        className={`p-1.5 rounded-full ${call.isFavorite ? "bg-yellow-100 text-yellow-500" : "hover:bg-gray-200 text-gray-400"}`}
                      >
                        <Star className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => addAsFriend(call.id)}
                        className="p-1.5 rounded-full hover:bg-gray-200 text-gray-600"
                      >
                        <UserPlus className="w-5 h-5" />
                      </button>

                      <button className="p-1.5 rounded-full hover:bg-gray-200 text-gray-600">
                        <PhoneCall className="w-5 h-5" />
                      </button>

                      <button className="p-1.5 rounded-full hover:bg-gray-200 text-gray-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Phone className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-500 font-medium">No calls found</h3>
            <p className="text-gray-400 text-sm mt-2">
              {searchQuery
                ? "Try a different search query"
                : "Your recent calls will appear here"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
