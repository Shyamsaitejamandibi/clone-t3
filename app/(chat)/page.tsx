import { cookies } from "next/headers";
import { generateUUID } from "@/lib/utils";
import { DEFAULT_MODEL } from "@/lib/ai/models";
import { ChatMain } from "@/components/chat-main";
import { auth } from "@clerk/nextjs/server";
import { ChatLayout } from "@/components/chat-layout";

export default async function Home() {
  const id = generateUUID();
  const { userId } = await auth();
  const cookieStore = await cookies();
  const modelIdFromCookie =
    cookieStore.get("chat-model")?.value || DEFAULT_MODEL;

  return (
    <>
      <ChatLayout
        id={id}
        userId={userId!}
        initialChatModel={modelIdFromCookie}
      />
    </>
  );
}
