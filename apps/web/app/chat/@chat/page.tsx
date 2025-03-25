"use client"
import { useState, useEffect, useRef } from "react";
import { Check, CheckCheck, Clock } from "lucide-react";
import MessagesArea from "@/components/chat/MessagesArea";
import { AttachmentMenu } from "@/components/chat/AttachmentMenu";
import { InputArea } from "@/components/chat/InputArea";
import { ReplyUI } from "@/components/chat/ReplyUI";
import ChatHeader from "@/components/chat/ChatHeader";

export interface ChatMessage {
  id: number;
  text: string;
  timestamp: string;
  sender: "",
  read: boolean;
  reactions: string[];
}
export default function Chat() {

  const [isTyping, setIsTyping] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages update
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  // Simulate partner typing
  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  const cancelReply = () => {
    setReplyingTo(null);
  };


  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <ChatHeader />
      <MessagesArea
        isTyping={isTyping}
        messagesEndRef={messagesEndRef}
      />
      {replyingTo && <ReplyUI replyingTo={replyingTo} onCancel={cancelReply} />}
      {showAttachments && <AttachmentMenu />}
      <InputArea
      />
    </div>
  );
}
