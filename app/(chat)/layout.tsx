import { ChatHeader } from "@/components/chat-header";
import { ChatSidebar } from "@/components/sidebar/chat-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();
  if (!userId) {
    return (
      <div className="flex items-center justify-center h-screen">
        Please sign in to access the chat.
        <SignInButton mode="modal" />
      </div>
    );
  }
  const cookieStore = await cookies();
  const isActive = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <>
      <SidebarProvider defaultOpen={isActive}>
        <div className="flex h-screen w-full  relative">
          <ChatSidebar />
          <div className="flex-1 flex flex-col">
            <ChatHeader />
            <div className="flex flex-col min-w-0 h-dvh bg-background">
              {children}
            </div>
          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
