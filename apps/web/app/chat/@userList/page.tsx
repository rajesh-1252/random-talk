"use client";
import React, { useEffect, } from "react";
import ChatPreview from "@/components/chat/ChatPreview";
import ChatLoadingScreen from "@/components/chat/ChatLoading";
import { getChatPreview } from "@/store/features/chatPreview/chatPreviewSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import ChatPreviewHeader from "@/components/chatPreview/ChatPreviewHeader";
import ChatPreviewSearch from "@/components/chatPreview/ChatPreviewSearch";
import ChatPreviewFilterTabs from "@/components/chatPreview/ChatPreviewFilterTabs";

const ChatApp = () => {
  const { loading, chatOrder, chatMap } = useSelector(
    (state: RootState) => state.chatPreview,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getChatPreview());
  }, []);


  if (loading) return <ChatLoadingScreen />;

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <ChatPreviewHeader />
      <ChatPreviewSearch />
      <ChatPreviewFilterTabs />
      {chatOrder.map((chatId) => {
        const chat = chatMap[chatId];
        return <ChatPreview key={chat?._id} {...chat} />;
      })}
    </div>
  );
};

export default ChatApp;
