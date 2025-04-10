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
        return <Check className="w-4 h-4 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      case "seen":
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      case "sending":
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const { user } = useSelector((state: RootState) => state.user);
  const userId = user?._id;
  const senderId = message.sender;
  const self = senderId === userId;
  return (
    <div
      className={`flex ${senderId === userId ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`relative max-w-[75%] ${
          self
            ? "bg-indigo-500 text-white rounded-t-lg rounded-bl-lg"
            : "bg-white text-gray-800 rounded-t-lg rounded-br-lg"
        } px-4 py-2 shadow-sm`}
      >
        {/* {message.replyTo && ( */}
        {/*   <div */}
        {/*     className={`text-xs p-2 mb-2 border-l-2 ${self */}
        {/*       ? "border-indigo-300 bg-indigo-600" */}
        {/*       : "border-gray-300 bg-gray-100" */}
        {/*       }`} */}
        {/*   > */}
        {/*     <p className="font-medium">{message.replyTo.sender === "self" ? "You" : "Alex"}</p> */}
        {/*     <p className="truncate">{message.replyTo.text}</p> */}
        {/*   </div> */}
        {/* )} */}
        <p>{message.text}</p>
        <div className="flex items-center justify-end mt-1 space-x-1">
          <span
            className={`text-xs ${self ? "text-indigo-100" : "text-gray-500"}`}
          >
            {new Date(message.createdAt).toLocaleTimeString()}
          </span>
          {self && <span>{renderMessageStatus(message.status)}</span>}
        </div>
        <button
          onClick={() => console.log("")}
          className="absolute top-1 right-1 text-xs text-gray-500 hover:text-gray-700"
        >
          Reply
        </button>
      </div>
    </div>
  );
}

export default MessageItem;
