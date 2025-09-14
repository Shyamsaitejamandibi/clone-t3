import { ChatHeader } from "@/components/chat-header";
import { ChatLayout } from "@/components/chat-layout";
import { ChatSidebar } from "@/components/sidebar/chat-sidebar";
import { DEFAULT_MODEL } from "@/lib/ai/models";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { preloadQuery, preloadedQueryResult } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export const ChatPage = async ({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) => {
  const { chatId } = await params;
  const { userId } = await auth();
  const cookieStore = await cookies();
  const modelIdFromCookie =
    cookieStore.get("chat-model")?.value || DEFAULT_MODEL;

  const preloaded = await preloadQuery(api.threads.userThreads, {
    userId: userId!,
  });

  return (
    <>
      <div className="flex h-screen w-full  relative">
        <ChatSidebar preloaded={preloaded} />
        <div className="flex-1 flex flex-col">
          <ChatHeader />
          <div className="flex flex-col min-w-0 h-dvh bg-background">
            <ChatLayout
              id={chatId}
              userId={userId!}
              initialChatModel={modelIdFromCookie}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
