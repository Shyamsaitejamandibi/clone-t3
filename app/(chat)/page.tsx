import { generateUUID } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { ChatLayout } from "@/components/chat-layout";

export default async function Home() {
  const id = generateUUID();
  const { userId } = await auth();

  return (
    <>
      <ChatLayout id={id} userId={userId!} />
    </>
  );
}
