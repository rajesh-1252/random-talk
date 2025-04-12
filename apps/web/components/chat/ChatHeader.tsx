import { setCurrentUser } from "@/store/features/chat/chatSlice";
import { RootState } from "@/store/store";
import { ArrowLeft, User, Phone, Video, MoreVertical } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

export function ChatHeader() {
  const dispatch = useDispatch();
  const { currentUser, isOnline } = useSelector((state: RootState) => state.chat);
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
      <button className="p-1 rounded-full hover:bg-gray-100 mr-3">
        <ArrowLeft onClick={() => dispatch(setCurrentUser(null))} className="w-6 h-6" />
      </button>
      <div className="flex-1 flex items-center">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <User className="w-6 h-6 text-indigo-600" />
          </div>
          {isOnline ?
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            :
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-500 rounded-full border-2 border-white"></div>
          }
        </div>
        <div className="ml-3">
          <h1 className="font-medium">{currentUser?.contactName} </h1>
          {isOnline ?
            <p className="text-xs text-green-500">online</p>
            :
            <p className="text-xs text-gray-500">offline</p>
          }
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Phone className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Video className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader
