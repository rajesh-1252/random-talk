import { UserSearch, Users } from "lucide-react";

export const SearchIdle = ({ onStart }: { onStart: () => void }) => (
  <div className="text-center">
    <div className="bg-indigo-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
      <UserSearch className="w-12 h-12 text-indigo-600" />
    </div>
    <h2 className="text-xl font-semibold mb-2">Find a random chat partner</h2>
    <p className="text-gray-600 mb-6">
      Click the button below to be matched with a random user to start chatting.
    </p>
    <button
      onClick={onStart}
      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
    >
      <Users className="w-5 h-5" />
      Find Random User
    </button>
  </div>
);
