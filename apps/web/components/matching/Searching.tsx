import { useAppDispatch } from "@/hooks/useAppDispatch";
import { cancelMatch } from "@/store/features/matching/matchingSlice";
import { Loader2 } from "lucide-react";

export const Searching = () => {
  const dispatch = useAppDispatch()
  return (
    <div className="text-center">
      <div className="animate-spin w-16 h-16 mx-auto mb-6">
        <Loader2 className="w-16 h-16 text-indigo-600" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Finding a match...</h2>
      <p className="text-gray-600 mb-6">
        Please wait while we find someone for you to chat with.
      </p>
      <button
        onClick={() => dispatch(cancelMatch())}
        className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
      >
        Cancel Search
      </button>
    </div>
  );
};
