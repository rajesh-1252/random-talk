import { Message } from "@/store/features/chat/chatSlice";
import { RootState } from "@/store/store";
import { MessageStatus } from "@repo/mongoose";
import { Check, CheckCheck, Clock } from "lucide-react";
import { useSelector } from "react-redux";

interface MessageItemProps {
  message: Message;
}

function MessageItem({ message }: MessageItemProps) {
  const renderMessageStatus = (status: MessageStatus) => {
    switch (status) {
      case "sent":
        return <Check className="w-3.5 h-3.5 opacity-70" />;
      case "delivered":
        return <CheckCheck className="w-3.5 h-3.5 opacity-70" />;
      case "seen":
        return <CheckCheck className="w-3.5 h-3.5 text-blue-400" />;
      case "sending":
        return <Clock className="w-3.5 h-3.5 opacity-70" />;
    }
  };

  const { user } = useSelector((state: RootState) => state.user);
  const userId = user?._id;
  const senderId = message.sender;
  const self = senderId === userId;

  return (
    <div className={`flex ${self ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`relative max-w-[75%] ${!self
          ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-tl-2xl rounded-tr-lg rounded-bl-lg rounded-br-2xl"
          : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tr-2xl rounded-tl-lg rounded-br-lg rounded-bl-2xl border border-gray-100 dark:border-gray-700"
          } px-4 py-3 shadow-md transition-all hover:shadow-lg`}
      >
        {/* {message.replyTo && (
          <div
            className={`text-xs p-2 mb-2 rounded-md ${self
              ? "bg-opacity-20 bg-white border-l-2 border-white"
              : "bg-gray-50 dark:bg-gray-700 border-l-2 border-gray-300 dark:border-gray-500"
            }`}
          >
            <p className="font-medium">{message.replyTo.sender === "self" ? "You" : "Alex"}</p>
            <p className="truncate">{message.replyTo.text}</p>
          </div>
        )} */}
        <p className="text-sm">{message.text}</p>
        <div className="flex items-center justify-end mt-1.5 space-x-1">
          <span
            className={`text-xs ${self ? "text-opacity-70 text-white" : "text-gray-500 dark:text-gray-400"}`}
          >
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {self && <span className="ml-1">{renderMessageStatus(message.status)}</span>}
        </div>
        <button
          onClick={() => console.log("")}
          className={`absolute top-1 right-1 p-1 rounded-full transition-colors ${self
            ? "text-white text-opacity-60 hover:text-opacity-100 hover:bg-white hover:bg-opacity-10"
            : "text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          aria-label="Reply to message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 17 4 12 9 7" />
            <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default MessageItem;
