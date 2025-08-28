"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInput } from "@/components/chat-input";
import { PreviewMessage } from "./message";
import { Attachment, ChatMessage } from "@/lib/types";
import { redirect, useSearchParams } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { fetchWithErrorHandlers, generateUUID } from "@/lib/utils";
import { DefaultChatTransport } from "ai";
import { toast } from "sonner";
import { ChatSDKError } from "@/lib/errors";
import { useDataStream } from "./data-stream-provider";

const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.replace(
  /.cloud$/,
  ".site"
);

export function ChatMain({
  id,
  initialMessages,
  initialChatModel,
}: {
  id: string;
  initialMessages: ChatMessage[];
  initialChatModel: string;
}) {
  const { setDataStream } = useDataStream();

  const [input, setInput] = useState<string>("");
  const {
    messages,
    setMessages,
    sendMessage,
    status,
    stop,
    regenerate,
    resumeStream,
  } = useChat<ChatMessage>({
    id,
    messages: initialMessages,
    experimental_throttle: 100,
    generateId: generateUUID,
    transport: new DefaultChatTransport({
      api: `${convexSiteUrl}/chat-stream`,
      // fetch: fetchWithErrorHandlers,
      prepareSendMessagesRequest({ messages, id, body }) {
        return {
          body: {
            id,
            messages: messages,
            selectedChatModel: initialChatModel,
            ...body,
          },
        };
      },
    }),
    onData: (dataPart) => {
      setDataStream((ds) => (ds ? [...ds, dataPart] : []));
    },
    onFinish: () => {},
    onError: (error) => {
      if (error instanceof ChatSDKError) {
        toast(error.message);
      }
    },
  });

  // const { messages, sendMessage, setMessages, status, stop } = useChat({
  //   transport: new DefaultChatTransport({
  //     api: `${convexSiteUrl}/chat-stream`,
  //   }),
  //   messages: initialMessages,
  // });

  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const [hasAppendedQuery, setHasAppendedQuery] = useState(false);

  useEffect(() => {
    if (query && !hasAppendedQuery) {
      sendMessage({
        role: "user" as const,
        parts: [{ type: "text", text: query }],
      });

      setHasAppendedQuery(true);
      redirect("/chat/" + id);
    }
  }, [query, sendMessage, hasAppendedQuery, id]);

  // const [attachments, setAttachments] = useState<Array<Attachment>>([]);

  useDataStream();

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 h-0">
        <div className="p-16">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground">
                Start a conversation
              </div>
            )}

            {messages.map((message, index) => (
              <PreviewMessage
                key={message.id}
                message={message}
                isLoading={false}
              />
            ))}
          </div>
        </div>
      </ScrollArea>

      <ChatInput
        chatId={id}
        input={input}
        setInput={setInput}
        status={status}
        stop={stop}
        messages={messages}
        setMessages={setMessages}
        sendMessage={sendMessage}
      />
    </div>
  );
}
