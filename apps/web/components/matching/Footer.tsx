import { MatchingState } from "@/store/features/matching/matchingSlice";

export const Footer = ({
  searchingStatus,
}: Pick<MatchingState, "searchingStatus">) => {
  return (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <p className="text-center text-gray-500 text-sm">
        {searchingStatus === "idle" && "Click to find a random chat partner"}
        {searchingStatus === "searching" && "Looking for someone to chat with..."}
        {searchingStatus === "matched" &&
          "You found a match! Start chatting or find someone else."}
        {searchingStatus === "timeout" && "No match found within 60 seconds."}
      </p>
    </div>
  );
};
