"use client";

import { ChatMain } from "./chat-main";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Suspense } from "react";
import { ChatMessage } from "@/lib/types";

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

  const transformedMessages: ChatMessage[] = initialMessages
    ? initialMessages.map((msg) => ({
        id: msg._id,
        role: msg.role,
        parts: msg.parts,
        metadata: {
          modelId: msg.response?.modelName,
          tokenUsage: msg.response?.tokens,
        },
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
