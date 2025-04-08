import { useAppDispatch } from "@/hooks/useAppDispatch";
import { resetSearch } from "@/store/features/matching/matchingSlice";
import { RootState } from "@/store/store";
import { X, UserSearch } from "lucide-react";
import { useSelector } from "react-redux";

export const Timeout = () => {
  const { error } = useSelector(
    (state: RootState) => state.matching
  );
  const dispatch = useAppDispatch()
  return (
    <div className="text-center">
      <div className="mb-6">
        <X className="w-16 h-16 text-red-500 mx-auto" />
      </div>
      <h2 className="text-xl font-semibold mb-2">No Match Found</h2>
      <p className="text-gray-600 mb-6">{error}</p>
      <button
        onClick={() => dispatch(resetSearch())}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
      >
        <UserSearch className="w-5 h-5" />
        Try Again
      </button>
    </div>
  );
};
