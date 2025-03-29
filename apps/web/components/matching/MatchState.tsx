import { Link, MessageSquare, UserSearch } from "lucide-react";
import Image from "next/image";

type User = {
  name: string;
  avatar: string;
  online: boolean;
};

export const MatchedState = ({
  user,
  startChat,
  resetSearch,
}: {
  user: User;
  startChat: () => void;
  resetSearch: () => void;
}) => (
  <div className="text-center">
    <div className="flex items-center justify-center mb-6">
      <div className="relative">
        <Image
          src={user.avatar}
          alt={user.name}
          className="w-20 h-20 rounded-full border-4 border-indigo-100"
          height={40}
          width={40}
        />
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
      </div>
    </div>

    <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
    <p className="text-green-500 text-sm mb-6 flex items-center justify-center gap-1">
      <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
      Online now
    </p>

    <div className="flex gap-3">
      <Link
        href="/chat"
        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
      >
        <MessageSquare className="w-5 h-5" />
        Start Chat
      </Link>
      <button
        onClick={resetSearch}
        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
      >
        <UserSearch className="w-5 h-5" />
        Find Another
      </button>
    </div>
  </div>
);
