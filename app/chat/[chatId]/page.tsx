export const ChatPage = async ({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) => {
  const { chatId } = await params;
  return (
    <div>
      <h1>Chat Page {chatId}</h1>
    </div>
  );
};

export default ChatPage;
