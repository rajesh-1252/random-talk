"use client";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  Mic,
  Image,
  Camera,
  Smile,
  Check,
  CheckCheck,
  Clock,
  FileText,
  MapPin,
  User,
  X,
} from "lucide-react";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! How are you doing today?",
      timestamp: "10:30 AM",
      sender: "other",
      read: true,
      reactions: [],
    },
    {
      id: 2,
      text: "I'm good, thanks for asking! Just finished a meeting.",
      timestamp: "10:32 AM",
      sender: "self",
      status: "read", // sent, delivered, read
      reactions: [],
    },
    {
      id: 3,
      text: "That's great! What are your plans for the weekend?",
      timestamp: "10:35 AM",
      sender: "other",
      read: true,
      reactions: [],
    },
    {
      id: 4,
      text: "Thinking of going hiking, if the weather's nice. What about you?",
      timestamp: "10:36 AM",
      sender: "self",
      status: "read",
      reactions: [],
    },
    {
      id: 5,
      text: "Sounds fun! I'll probably catch up on some reading and maybe watch a movie.",
      timestamp: "10:38 AM",
      sender: "other",
      read: false,
      reactions: [],
    },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  const messagesEndRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate partner typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isTyping]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const newMsg = {
      id: messages.length + 1,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sender: "self",
      status: "sent",
      reactions: [],
      replyTo: replyingTo,
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
    setReplyingTo(null);

    // Simulate partner typing
    setTimeout(() => {
      setIsTyping(true);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleAttachments = () => {
    setShowAttachments(!showAttachments);
  };

  const handleReply = (messageId) => {
    const messageToReply = messages.find((msg) => msg.id === messageId);
    setReplyingTo(messageToReply);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const renderMessageStatus = (status) => {
    switch (status) {
      case "sent":
        return <Check className="w-4 h-4 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      case "read":
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <button className="p-1 rounded-full hover:bg-gray-100 mr-3">
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex-1 flex items-center">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <User className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="ml-3">
            <h1 className="font-medium">Alex Thompson</h1>
            <p className="text-xs text-green-500">online</p>
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

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-100">
        <div className="space-y-3 pb-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "self" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] ${message.sender === "self" ? "bg-indigo-500 text-white rounded-t-lg rounded-bl-lg" : "bg-white text-gray-800 rounded-t-lg rounded-br-lg"} px-4 py-2 shadow-sm`}
              >
                {message.replyTo && (
                  <div
                    className={`text-xs p-2 mb-2 border-l-2 ${message.sender === "self" ? "border-indigo-300 bg-indigo-600" : "border-gray-300 bg-gray-100"}`}
                  >
                    <p className="font-medium">
                      {message.replyTo.sender === "self" ? "You" : "Alex"}
                    </p>
                    <p className="truncate">{message.replyTo.text}</p>
                  </div>
                )}
                <p>{message.text}</p>
                <div className="flex items-center justify-end mt-1 space-x-1">
                  <span
                    className={`text-xs ${message.sender === "self" ? "text-indigo-100" : "text-gray-500"}`}
                  >
                    {message.timestamp}
                  </span>
                  {message.sender === "self" && (
                    <span>{renderMessageStatus(message.status)}</span>
                  )}
                </div>

                {/* Message context menu would go here */}
                <div className="hidden group-hover:flex absolute right-0 bg-white rounded-lg shadow-md">
                  {/* Options for reply, forward, etc. */}
                </div>
              </div>
            </div>
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

      {/* Reply UI */}
      {replyingTo && (
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 flex items-center">
          <div className="flex-1 border-l-2 border-indigo-500 pl-2">
            <p className="text-xs font-medium text-indigo-600">
              Replying to {replyingTo.sender === "self" ? "yourself" : "Alex"}
            </p>
            <p className="text-sm truncate">{replyingTo.text}</p>
          </div>
          <button
            onClick={cancelReply}
            className="p-1 rounded-full hover:bg-gray-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      )}

      {/* Attachment Menu */}
      {showAttachments && (
        <div className="bg-white px-4 py-3 border-t border-gray-200 grid grid-cols-4 gap-4">
          <button className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-1">
              <Image className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-xs">Photo</span>
          </button>
          <button className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-1">
              <Camera className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-xs">Camera</span>
          </button>
          <button className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-1">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-xs">Document</span>
          </button>
          <button className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-1">
              <MapPin className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-xs">Location</span>
          </button>
        </div>
      )}

      {/* Input Area */}
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
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
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
            disabled={newMessage.trim() === ""}
            className={`p-2 rounded-full ${newMessage.trim() === "" ? "bg-gray-200 text-gray-400" : "bg-indigo-500 text-white"}`}
          >
            {newMessage.trim() === "" ? (
              <Mic className="w-5 h-5" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
