
import { getMessage, setCurrentUser, UserConversation } from "@/store/features/chat/chatSlice";
import Image from "next/image";

import { User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store"; // Adjust import based on your store structure
import { useAppDispatch } from "@/hooks/useAppDispatch";

const ChatPreview: React.FC<UserConversation> = (props) => {
  const {
    _id,
    participants,
    isGroup,
    groupName,
    groupAvatar,
    contactName,
    lastMessage = "Say hi! 👋",
    updatedAt,
    unread,
  } = props;

  const dispatch = useAppDispatch();
  const currentUserId = useSelector((state: RootState) => state.user.user?._id);


  const otherParticipant = participants.find((p) => p._id !== currentUserId);

  const chatName = isGroup
    ? groupName
    : contactName || otherParticipant?.name || "Unknown";

  const chatAvatar = isGroup
    ? groupAvatar
    : otherParticipant?.avatar || "/default-avatar.png";

  const handleConversation = () => {
    dispatch(getMessage(_id))
    dispatch(setCurrentUser({ ...props, contactName: chatName || '' }));
  };

  return (
    <div
      key={_id}
      className="flex items-center p-3 border-b border-gray-700 hover:bg-gray-800"
      onClick={handleConversation}
    >
      <div className="relative mr-3">
        <User />
        {/* <Image */}
        {/*   src={chatAvatar || ''} */}
        {/*   alt={chatName || ''} */}
        {/*   className="w-12 h-12 rounded-full object-cover" */}
        {/*   height={48} */}
        {/*   width={48} */}
        {/* /> */}
      </div>

      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-semibold">{chatName}</h3>
          <span className="text-xs text-gray-400">{new Date(updatedAt).toLocaleTimeString()}</span>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-400 truncate pr-2 max-w-xs">
            {lastMessage}
          </p>
          {unread > 0 && (
            <span className="bg-teal-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {unread}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPreview;
