import React, { useState, useMemo, Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getDefaultModels } from "@/lib/ai/models";

const ModelSelect = ({
  selectedModelId,
  setInitialChatModel,
}: {
  selectedModelId: string;
  setInitialChatModel: Dispatch<SetStateAction<string>>;
}) => {
  const selectedModel = getDefaultModels();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const selectedMod = getDefaultModels().find((m) => m.id === selectedModelId);

  // Group models by provider and filter by search
  const groupedModels = useMemo(() => {
    const grouped = getDefaultModels().reduce((acc, model) => {
      const provider = model.provider;
      if (!acc[provider]) {
        acc[provider] = [];
      }
      acc[provider].push(model);
      return acc;
    }, {} as Record<string, typeof selectedModel>);

    // Sort providers alphabetically
    const sortedProviders = Object.keys(grouped).sort();
    const result: Record<string, typeof selectedModel> = {};
    sortedProviders.forEach((provider) => {
      result[provider] = grouped[provider].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    });

    return result;
  }, []);

  const handleModelSelect = (modelId: string) => {
    localStorage.setItem("chat-model", modelId);
    setInitialChatModel(modelId);
    setIsOpen(false);
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
            {selectedMod ? (
              <span className="truncate">
                {selectedMod.name.includes(":")
                  ? selectedMod.name.split(":")[1].trim()
                  : selectedMod.name}
              </span>
            ) : (
              "Select model"
            )}
          </SelectValue>
        </div>
      </SelectTrigger>

      <SelectContent className="bg-card border-border w-80">
        {/* Header */}
        <div className="p-2 border-b border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-7 w-7 p-0 hover:bg-accent mx-auto"
            title={isExpanded ? "Compact view" : "Expanded view"}
          >
            {isExpanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
        </div>

        {/* Models List */}
        <div className="max-h-80 overflow-y-auto">
          {Object.keys(groupedModels).length &&
            Object.entries(groupedModels).map(([provider, models]) => (
              <div key={provider} className="py-1">
                {/* Provider Header */}
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-muted/30">
                  {provider}
                </div>

                {/* Models in this provider */}
                {models.map((model) => (
                  <SelectItem
                    key={model.id}
                    value={model.id}
                    className="text-foreground focus:bg-accent cursor-pointer"
                  >
                    {isExpanded ? (
                      <div className="flex flex-col gap-1 py-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">
                            {model.name.includes(":")
                              ? model.name.split(":")[1].trim()
                              : model.name}
                          </span>
                          <div className="flex items-center gap-2">
                            {model.context_length && (
                              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                {model.context_length.toLocaleString()} ctx
                              </span>
                            )}
                          </div>
                        </div>
                        {model.pricing && (
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>Input: ${model.pricing.prompt}/1K</span>
                            <span>Output: ${model.pricing.completion}/1K</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium text-sm truncate">
                          {model.name.includes(":")
                            ? model.name.split(":")[1].trim()
                            : model.name}
                        </span>
                        {model.context_length && (
                          <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                            {model.context_length >= 1000000
                              ? `${(model.context_length / 1000000).toFixed(
                                  1
                                )}M`
                              : model.context_length >= 1000
                              ? `${(model.context_length / 1000).toFixed(0)}K`
                              : model.context_length}
                          </span>
                        )}
                      </div>
                    )}
                  </SelectItem>
                ))}
              </div>
            ))}
        </div>
      </SelectContent>
    </Select>
  );
};

export default ModelSelect;
