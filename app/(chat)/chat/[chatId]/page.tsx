import { ChatMain } from "@/components/chat-main";
import { DEFAULT_MODEL } from "@/lib/ai/models";
import { UIMessage } from "ai";
import { cookies } from "next/headers";

export const ChatPage = async ({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) => {
  const { chatId } = await params;

  const cookieStore = await cookies();
  const modelIdFromCookie =
    cookieStore.get("chat-model")?.value || DEFAULT_MODEL;

  const initialMessages: UIMessage[] = [
    {
      id: "1",
      role: "user",
      parts: [{ type: "text", text: "You are a helpful assistant." }],
    },
  ];

  return (
    <>
      <ChatMain
        id={chatId}
        initialChatModel={modelIdFromCookie}
        initialMessages={initialMessages}
      />
    </>
  );
};

export default ChatPage;
