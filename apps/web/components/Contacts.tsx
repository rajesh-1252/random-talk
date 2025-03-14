"use client";

import React, { useEffect, useState } from "react";
import { PhoneCall } from "lucide-react";
import { getUserContacts } from "../api/userService";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/types/user";

interface ContactsType {
  callFav: (userId: string) => void;
}

const Contacts = ({ callFav }: ContactsType) => {
  const [contacts, setContacts] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Contacts</h2>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <ul className="space-y-3">
          {contacts.length > 0 ? (
            contacts.map((user) => (
              <li
                key={user._id}
                className="flex items-center justify-between p-3 bg-gray-100 rounded-lg shadow-sm"
              >
                <div>
                  <p className="text-lg font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <button
                  onClick={() => callFav(user._id)}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                  title="Call"
                >
                  <PhoneCall />
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-center">No contacts found.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default Contacts;
