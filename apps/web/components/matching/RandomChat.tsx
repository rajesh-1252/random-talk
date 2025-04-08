"use client";
import { useSelector } from "react-redux";
import { Users } from "lucide-react";
import { Footer } from "./Footer";
import { MatchedState } from "./MatchState";
import { RootState } from "@/store/store";
import { SearchIdle } from "./SearchIdle";
import { Searching } from "./Searching";
import { Timeout } from "./Timeout";

export default function RandomChat() {
  const { searchingStatus, matchedUser } = useSelector(
    (state: RootState) => state.matching
  );

  const { user } = useSelector(
    (state: RootState) => state.user
  );
  console.log({ currentUser: user?._id })


  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white">
          <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Users className="w-6 h-6" />
            Random Chat
          </h1>
          <p className="text-center text-indigo-100 mt-2">
            Connect with someone new
          </p>
        </div>

        <div className="p-6">
          {searchingStatus === "idle" && (
            <SearchIdle />
          )}
          {searchingStatus === "searching" && (
            <Searching />
          )}
          {searchingStatus === "matched" && matchedUser && (
            <MatchedState
            />
          )}
          {searchingStatus === "timeout" || searchingStatus === "error" ? (
            <Timeout />
          ) : null}
        </div>

        <Footer searchingStatus={searchingStatus} />
      </div>
    </div>
  );
}
