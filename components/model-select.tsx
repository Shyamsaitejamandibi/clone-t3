"use client";

import {
  useState,
  useMemo,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronUp, GemIcon, Search } from "lucide-react";
import { getDefaultModels } from "@/lib/ai/models";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const ModelSelect = ({
  selectedModelId,
  setInitialChatModel,
}: {
  selectedModelId: string;
  setInitialChatModel: Dispatch<SetStateAction<string>>;
}) => {
  const [showAllModels, setShowAllModels] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Flat list of models filtered by search and sorted by name
  const filteredModels = useMemo(() => {
    return getDefaultModels()
      .filter((model) =>
        model.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [searchQuery]);

  const favoriteModels = useMemo(() => {
    return getDefaultModels()
      .filter((model) =>
        [
          "google/gemini-2.0-flash",
          "openai/gpt-4o",
          "anthropic/claude-sonnet-4",
        ].includes(model.id)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const handleModelSelect = (modelId: string) => {
    localStorage.setItem("chat-model", modelId);
    setInitialChatModel(modelId);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <Select
      value={selectedModelId}
      onValueChange={handleModelSelect}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <SelectTrigger className="w-48 h-8 text-xs bg-transparent border border-border text-foreground/60 hover:text-foreground focus:ring-0 focus:ring-offset-0 rounded-lg">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <SelectValue placeholder="Select model">
            <span className="truncate">
              {getDefaultModels().find((m) => m.id === selectedModelId)?.name ||
                "Select model"}
            </span>
          </SelectValue>
        </div>
      </SelectTrigger>

      <SelectContent className={`bg-sidebar w-96`}>
        <div className="border-b">
          <div className="relative">
            <Search className="absolute left-1 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Search your models..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowAllModels(true);
              }}
              className="pl-8 !bg-transparent placeholder:text-sm placeholder:text-muted-foreground/50 placeholder:font-medium focus-visible:ring-0 focus-visible:ring-offset-0 border-0 border-b-2 border-sidebar-accent rounded-none text-2xl focus:bg-transparent focus:border-b-2 focus-visible:border-b-2 focus-visible:border-sidebar-accent"
            />
          </div>
        </div>

        <ScrollArea className="h-80">
          <div className="p-1">
            {showAllModels
              ? filteredModels.map((model) => (
                  <SelectItem
                    key={model.id}
                    value={model.id}
                    className="text-foreground focus:bg-accent/15 py-3.5"
                  >
                    <div className="flex items-center justify-between w-full">
                      <GemIcon className="size-4 mr-2 text-muted-foreground" />
                      <span className="font-medium  truncate">
                        {model.name}
                      </span>
                    </div>
                  </SelectItem>
                ))
              : favoriteModels.map((model) => (
                  <SelectItem
                    key={model.id}
                    value={model.id}
                    className="text-foreground focus:bg-accent/15 py-3.5"
                  >
                    <div className="flex items-center justify-between w-full">
                      <GemIcon className="size-4 mr-2 text-muted-foreground" />
                      <span className="font-medium  truncate">
                        {model.name}
                      </span>
                    </div>
                  </SelectItem>
                ))}
          </div>
        </ScrollArea>
        <Separator className="my-2" />
        <div className="">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllModels(!showAllModels)}
            className="w-24 justify-start text-xs text-muted-foreground hover:text-foreground"
          >
            {showAllModels ? (
              <>
                <ChevronUp className="h-3 w-3 mr-2" />
                Favorites
              </>
            ) : (
              <>
                <ChevronUp className="h-3 w-3 mr-2 rotate-180" />
                Show all
              </>
            )}
          </Button>
        </div>
      </SelectContent>
    </Select>
  );
};

export default ModelSelect;
