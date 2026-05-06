interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tr-sm bg-blue-600 text-white text-sm leading-relaxed">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start items-start gap-3">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">
        🏥
      </div>
      {/* Bubble */}
      <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-sm bg-white border border-gray-200 shadow-sm text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
    </div>
  );
}
