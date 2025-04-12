"use client";
import { Message, sendMessage } from "@/store/features/chat/chatSlice";
import { updateConverstaion } from "@/store/features/chatPreview/chatPreviewSlice";
import { RootState } from "@/store/store";
import { Paperclip, Smile, Send, Mic } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function InputArea() {
  const [showAttachments, setShowAttachments] = useState(false);
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state: RootState) => state.user);
  const { currentUser } = useSelector((state: RootState) => state.chat);
  if (!currentUser) {
    console.log("no current user");
    return;
  }
  const { participants } = currentUser || {};
  console.log({ currentUser, participants });
  const { _id } = user! || {};
  const receiverId = participants.find((p) => p._id !== _id) || {
    _id: "",
    name: "",
  };
  const toggleAttachments = () => {
    setShowAttachments(!showAttachments);
  };

  const handleSendMessage = () => {
    if (text.trim() === "") return;
    const messagePayload: Message = {
      _id: "",
      sender: _id,
      receiver: receiverId._id,
      conversationId: currentUser._id,
      text,
      createdAt: new Date(),
      status: "sending",
    };
    dispatch(sendMessage({ ...messagePayload }));
    dispatch({
      type: "chatWebsocket/send",
      payload: messagePayload,
    });
    dispatch(
      updateConverstaion({
        _id: currentUser._id,
        lastMessage: { _id: "", text },
      }),
    );
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  if (loading) return <p>loading</p>;

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3">
      <div className="flex items-center">
        <button
          onClick={toggleAttachments}
          className={`p-2 rounded-full ${showAttachments ? "bg-gray-200" : "hover:bg-gray-100"}`}
        >
          <Paperclip className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1 mx-3 bg-gray-100 rounded-full">
          <div className="flex items-center px-3 py-2">
            <textarea
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent flex-1 outline-none resize-none max-h-20 overflow-auto"
              rows={1}
            />
            <button className="p-1 rounded-full hover:bg-gray-200">
              <Smile className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        <button
          onClick={handleSendMessage}
          disabled={text.trim() === ""}
          className={`p-2 rounded-full ${
            text.trim() === ""
              ? "bg-gray-200 text-gray-400"
              : "bg-indigo-500 text-white"
          }`}
        >
          {text.trim() === "" ? (
            <Mic className="w-5 h-5" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
