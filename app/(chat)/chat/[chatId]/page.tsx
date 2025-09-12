import { ChatLayout } from "@/components/chat-layout";
import { ChatMain } from "@/components/chat-main";
import { DEFAULT_MODEL } from "@/lib/ai/models";
import { auth } from "@clerk/nextjs/server";
import { UIMessage } from "ai";
import { cookies } from "next/headers";

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

  return (
    <>
      <ChatLayout
        id={chatId}
        userId={userId!}
        initialChatModel={modelIdFromCookie}
      />
    </>
  );
};

export default ChatPage;
