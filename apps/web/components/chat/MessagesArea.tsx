import MessageItem from "./MessageItem";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface MessagesAreaProps {
  isTyping: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}
export function MessagesArea({ isTyping, messagesEndRef }: MessagesAreaProps) {
  const { messages } = useSelector((state: RootState) => state.chat)
  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-100">
      <div className="space-y-3 pb-3">
        {messages.map((message) => (
          <MessageItem
            key={message?.id}
            message={message}
          />
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-lg px-4 py-2 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default MessagesArea;
