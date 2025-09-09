import { cookies } from "next/headers";
import { generateUUID } from "@/lib/utils";
import { DEFAULT_MODEL } from "@/lib/ai/models";
import { ChatMain } from "@/components/chat-main";

export default async function Home() {
  const id = generateUUID();

  const cookieStore = await cookies();
  const modelIdFromCookie =
    cookieStore.get("chat-model")?.value || DEFAULT_MODEL;

  return (
    <>
      <ChatMain
        id={id}
        initialChatModel={modelIdFromCookie}
        initialMessages={[]}
      />
    </>
  );
}
