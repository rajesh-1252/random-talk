"use client";

import { useState } from "react";
import { UserSearch, Users, Loader2, MessageSquare, X } from "lucide-react";
import Image from "next/image";

// Types
type SearchingStatus = "idle" | "searching" | "matched";

interface MatchedUser {
  name: string;
  avatar: string;
  online: boolean;
}

export default function Home() {
  const [searchingStatus, setSearchingStatus] = useState<SearchingStatus>("idle");
  const [matchedUser, setMatchedUser] = useState<MatchedUser | null>(null);

  const startSearch = () => {
    setSearchingStatus("searching");

    const randomTime = Math.floor(Math.random() * 2000) + 2000;
    setTimeout(() => {
      const randomNames = [
        "Alex Thompson",
        "Jamie Rivera",
        "Sam Wilson",
        "Taylor Smith",
        "Jordan Lee",
        "Casey Jones",
        "Morgan Davis",
        "Riley Johnson",
        "Quinn Miller",
      ];
      const randomName = randomNames[Math.floor(Math.random() * randomNames.length)] || ''
      setMatchedUser({
        name: randomName,
        avatar: `/api/placeholder/40/40?text=${randomName.charAt(0)}`,
        online: true,
      });
      setSearchingStatus("matched");
    }, randomTime);
  };

  const cancelSearch = () => {
    setSearchingStatus("idle");
  };

  const startChat = () => {
    console.log('called')
    // alert(`Starting chat with ${matchedUser?.name}`);
  };

  const resetSearch = () => {
    setSearchingStatus("idle");
    setMatchedUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white">
          <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Users className="w-6 h-6" />
            Random Chat
          </h1>
          <p className="text-center text-indigo-100 mt-2">Connect with someone new</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {searchingStatus === "idle" && (
            <div className="text-center">
              <div className="bg-indigo-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <UserSearch className="w-12 h-12 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Find a random chat partner</h2>
              <p className="text-gray-600 mb-6">
                Click the button below to be matched with a random user to start chatting.
              </p>
              <button
                onClick={startSearch}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Users className="w-5 h-5" />
                Find Random User
              </button>
            </div>
          )}

          {searchingStatus === "searching" && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-6" />
              <h2 className="text-xl font-semibold mb-2">Searching for a match...</h2>
              <p className="text-gray-600 mb-6">
                Please wait while we find someone for you to chat with.
              </p>
              <button
                onClick={cancelSearch}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 mx-auto transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}

          {searchingStatus === "matched" && matchedUser && (
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <Image
                    src={matchedUser.avatar}
                    alt={matchedUser.name}
                    className="w-20 h-20 rounded-full border-4 border-indigo-100"
                    height={80}
                    width={80}
                  />
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-1">{matchedUser.name}</h2>
              <p className="text-green-500 text-sm mb-6 flex items-center justify-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                Online now
              </p>

              <div className="flex gap-3">
                <button
                  onClick={startChat}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-5 h-5" />
                  Start Chat hello
                </button>
                <button
                  onClick={resetSearch}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <UserSearch className="w-5 h-5" />
                  Find Another
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            {searchingStatus === "idle" &&
              "Click to find a random chat partner"}
            {searchingStatus === "searching" &&
              "Looking for someone to chat with..."}
            {searchingStatus === "matched" &&
              "You found a match! Start chatting or find someone else."}
          </p>
        </div>
      </div>
    </div>
  );
}
