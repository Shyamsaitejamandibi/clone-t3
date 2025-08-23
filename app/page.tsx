import { ChatLayout } from "@/components/chat-layout";
import { cookies } from "next/headers";
import { generateUUID } from "@/lib/utils";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SignInButton } from "@clerk/nextjs";

export default async function Home() {
  const session = await auth();
  console.log("Session:", session.userId);
  if (!session.userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <SignInButton />
      </div>
    );
  }

  const id = generateUUID();

  const cookieStore = await cookies();
  const isActive = cookieStore.get("sidebar_state")?.value === "true";
  const modelIdFromCookie = cookieStore.get("chat-model");

  return (
    <>
      <SidebarProvider defaultOpen={isActive}>
        <ChatLayout />
      </SidebarProvider>
    </>
  );
}
