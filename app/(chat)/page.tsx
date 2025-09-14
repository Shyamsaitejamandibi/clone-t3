import { cookies } from "next/headers";
import { generateUUID } from "@/lib/utils";
import { DEFAULT_MODEL } from "@/lib/ai/models";
import { ChatMain } from "@/components/chat-main";
import { auth } from "@clerk/nextjs/server";
import { ChatLayout } from "@/components/chat-layout";
import { ChatHeader } from "@/components/chat-header";
import { ChatSidebar } from "@/components/sidebar/chat-sidebar";
import { preloadQuery, preloadedQueryResult } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function Home() {
  const id = generateUUID();
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
              id={id}
              userId={userId!}
              initialChatModel={modelIdFromCookie}
            />
          </div>
        </div>
      </div>
    </>
  );
}
