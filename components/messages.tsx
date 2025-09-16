import { PreviewMessage, ThinkingMessage } from "./message";
import { Greeting } from "./greeting";
import { Dispatch, memo, SetStateAction } from "react";
import equal from "fast-deep-equal";
import type { UIMessage, UseChatHelpers } from "@ai-sdk/react";

interface MessagesProps {
  chatId: string;
  status: UseChatHelpers<UIMessage>["status"];
  messages: UIMessage[];
  setMessages: UseChatHelpers<UIMessage>["setMessages"];
  regenerate: UseChatHelpers<UIMessage>["regenerate"];
  selectedModelId: string;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
}

function PureMessages({
  chatId,
  status,
  messages,
  setMessages,
  regenerate,
  selectedModelId,
  input,
  setInput,
}: MessagesProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {messages.length === 0 && input.trim().length === 0 && (
        <Greeting onSelectSuggestion={(text) => setInput(text)} />
      )}

      {messages.map((message, index) => (
        <PreviewMessage
          key={message.id}
          // chatId={chatId}
          message={message}
          isLoading={status === "streaming" && messages.length - 1 === index}
          // setMessages={setMessages}
          // regenerate={regenerate}
        />
      ))}

      {status === "submitted" &&
        messages.length > 0 &&
        messages[messages.length - 1].role === "user" &&
        selectedModelId !== "chat-model-reasoning" && <ThinkingMessage />}
    </div>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.selectedModelId !== nextProps.selectedModelId) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;
  if (prevProps.input !== nextProps.input) return false;

  return false;
});
