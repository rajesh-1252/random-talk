"use client";
import React, { useEffect, useState } from "react";
import { PhoneCall, Search, Star, UserPlus } from "lucide-react";
import { getUserContacts } from "../api/userService";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/types/user";

interface ContactsType {
  callFav: (userId: string) => void;
}

const Contacts = ({ callFav }: ContactsType) => {
  const [contacts, setContacts] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await getUserContacts();
        setContacts(data);
      } catch {
        console.error("Failed to fetch contacts.");
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  // Filter contacts based on search query and favorites toggle
  const filteredContacts = contacts.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!favoritesOnly || user.isFavorite),
  );

  // Function to generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Function to generate a consistent color based on user ID
  const getAvatarColor = (userId: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-indigo-500",
    ];
    const colorIndex = userId.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl rounded-xl border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Contacts</h2>
        <button
          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
          title="Add new contact"
        >
          <UserPlus size={20} />
        </button>
      </div>

      {/* Search and filter */}
      <div className="mb-6">
        <div className="relative mb-3">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={`flex items-center text-sm ${favoritesOnly ? "text-yellow-600" : "text-gray-500"}`}
          >
            <Star
              size={16}
              className={`mr-1 ${favoritesOnly ? "fill-yellow-500" : ""}`}
            />
            {favoritesOnly ? "Showing favorites" : "Show favorites only"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200 border border-gray-100"
              >
                <div className="flex items-center">
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-medium ${getAvatarColor(user._id)}`}
                  >
                    {getInitials(user.name)}
                  </div>
                  <div className="ml-4">
                    <p className="text-lg font-medium text-gray-800">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => callFav(user._id)}
                  className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition shadow-md hover:shadow-lg"
                  title="Call"
                >
                  <PhoneCall size={18} />
                </button>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-10 bg-white rounded-xl">
              <div className="flex justify-center mb-4">
                <Search size={32} className="text-gray-400" />
              </div>
              <p className="font-medium">No contacts found</p>
              <p className="text-sm mt-1">
                Try adjusting your search or filter
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Contacts;
