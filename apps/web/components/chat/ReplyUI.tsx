import { X } from "lucide-react";

interface ReplyUIProps {
  replyingTo: {
    sender: string;
    text: string;
  };
  onCancel: () => void;
}

export function ReplyUI({ replyingTo, onCancel }: ReplyUIProps) {
  return (
    <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 flex items-center">
      <div className="flex-1 border-l-2 border-indigo-500 pl-2">
        <p className="text-xs font-medium text-indigo-600">
          Replying to {replyingTo.sender === "self" ? "yourself" : "Alex"}
        </p>
        <p className="text-sm truncate">{replyingTo.text}</p>
      </div>
      <button onClick={onCancel} className="p-1 rounded-full hover:bg-gray-200">
        <X className="w-5 h-5 text-gray-500" />
      </button>
    </div>
  );
}
