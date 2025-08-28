import { Settings, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatHeader() {
  return (
    <div className="fixed top-3 right-3 z-30 flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-[#2C2C2C]/50 rounded-lg transition-colors duration-200 text-white"
      >
        <Settings className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-[#2C2C2C]/50 rounded-lg transition-colors duration-200 text-white"
      >
        <Sun className="w-4 h-4" />
      </Button>
    </div>
  );
}
