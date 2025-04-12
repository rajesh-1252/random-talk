import {
  getMessage,
  setCurrentUser,
  UserConversation,
} from "@/store/features/chat/chatSlice";

import { User } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAppDispatch } from "@/hooks/useAppDispatch";

const ChatPreview: React.FC<UserConversation> = (props) => {
  const {
    _id,
    participants,
    isGroup,
    groupName,
    groupAvatar,
    contactName,
    lastMessage,
    updatedAt,
    pendingMessages,
  } = props;

  const dispatch = useAppDispatch();
  const currentUserId = useSelector((state: RootState) => state.user.user?._id);

  const otherParticipant = participants.find((p) => p._id !== currentUserId)

  const chatName = isGroup
    ? groupName
    : contactName || otherParticipant?.name || "Unknown";

  const chatAvatar = isGroup
    ? groupAvatar
    : otherParticipant?.avatar || "/default-avatar.png";

  const handleConversation = () => {
    // in future if unread message call this
    dispatch(getMessage({ conversationId: _id, senderId: otherParticipant?._id }));
    dispatch(setCurrentUser({ ...props, contactName: chatName || "" }));
    dispatch({
      type: "chatWebsocket/markAsSeen",
      payload: {
        conversationId: _id,
        seenById: currentUserId,
        status: "seen",
        receiverId: otherParticipant?._id,
      },
    });
  };

  const unread = pendingMessages.filter((m) => m != currentUserId).length;

  return (
    <div
      key={_id}
      className="flex items-center p-4 border-b border-gray-700/30 hover:bg-gray-800/40 rounded-lg transition-all duration-200 cursor-pointer"
      onClick={handleConversation}
    >
      <div className="relative mr-4">
        {!chatAvatar ? (
          <img
            src={chatAvatar}
            alt={chatName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-700/50"
            height={48}
            width={48}
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
            <User size={24} />
          </div>
        )}

        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-teal-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium border border-gray-900">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-semibold text-gray-100 truncate">{chatName}</h3>
          <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
            {new Date(updatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <p className="text-sm text-gray-400 truncate pr-2">
          {lastMessage?.text || "No messages yet"}
        </p>
      </div>
    </div>
  );
};

export default ChatPreview;
