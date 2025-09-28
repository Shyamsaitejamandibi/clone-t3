import { ChatLayout } from "@/components/chat-layout";
import { auth } from "@clerk/nextjs/server";

export const ChatPage = async ({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) => {
  const { chatId } = await params;
  const { userId } = await auth();

  return (
    <>
      <ChatLayout id={chatId} userId={userId!} />
    </>
  );
};

export default ChatPage;
