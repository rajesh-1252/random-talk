"use client";
import { useDispatch, useSelector } from "react-redux";
import { Users } from "lucide-react";
import { Footer } from "./Footer";
import { MatchedState } from "./MatchState";
import {
  startSearch,
  matchFound,
  cancelSearch,
  resetSearch,
} from "@/store/features/randomChat/matchingSlice";
import { RootState } from "@/store/store";
import { SearchIdle } from "./SearchIdle";
import { Searching } from "./Searching";
import { Timeout } from "./Timeout";

export default function RandomChat() {
  const dispatch = useDispatch();
  const { searchingStatus, matchedUser, error } = useSelector(
    (state: RootState) => state.matching,
  );

  const handleStartSearch = () => {
    dispatch(startSearch());

    setTimeout(() => {
      const mockUser = {
        name: "John Doe",
        avatar: "https://via.placeholder.com/100",
        online: true,
      };
      dispatch(matchFound(mockUser));
    }, 3000);
  };

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
            <SearchIdle onStart={handleStartSearch} />
          )}
          {searchingStatus === "searching" && (
            <Searching onCancel={() => dispatch(cancelSearch())} />
          )}
          {searchingStatus === "matched" && matchedUser && (
            <MatchedState
              user={matchedUser}
              startChat={() => alert("Starting chat")}
              resetSearch={() => dispatch(resetSearch())}
            />
          )}
          {searchingStatus === "timeout" && (
            <Timeout error={error} onRetry={() => dispatch(resetSearch())} />
          )}
        </div>

        <Footer searchingStatus={searchingStatus} />
      </div>
    </div>
  );
}
