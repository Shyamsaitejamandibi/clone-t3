"use client";

import { UIMessage } from "ai";
import { ChatMain } from "./chat-main";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Suspense } from "react";

export const ChatLayout = ({
  id,
  userId,
  initialChatModel,
}: {
  id: string;
  userId: string;
  initialChatModel: string;
}) => {
  const initialMessages = useQuery(api.threads.getInitialMessages, {
    chatId: id,
  });
  if (initialMessages === undefined) {
    return <div>Loading chat...</div>;
  }
  const transformedMessages: UIMessage[] = initialMessages
    ? initialMessages.map((msg) => ({
        id: msg._id,
        role: msg.role,
        parts: msg.parts,
      }))
    : [];
  return (
    <ChatMain
      id={id}
      userId={userId}
      initialMessages={transformedMessages}
      initialChatModel={initialChatModel}
    />
  );
};
