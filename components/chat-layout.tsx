import { ChatSidebar } from "@/components/chat-sidebar";
import { ChatMain } from "@/components/chat-main";
import { ChatHeader } from "@/components/chat-header";
import { ChatMessage } from "@/lib/types";

export function ChatLayout({
  id,
  initialMessages,
  initialChatModel,
}: {
  id: string;
  initialMessages: ChatMessage[];
  initialChatModel: string;
}) {
  return (
    <div className="flex h-screen w-full  relative">
      <ChatSidebar />
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <div className="flex flex-col min-w-0 h-dvh bg-background">
          <ChatMain
            id={id}
            initialMessages={initialMessages}
            initialChatModel={initialChatModel}
          />
        </div>
      </div>
    </div>
  );
}
