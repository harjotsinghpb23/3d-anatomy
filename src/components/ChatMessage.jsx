function ChatMessage({ message }) {
  const isUser = message.role === "user";
  const isError = message.isError;
  const isSystemNotice = message.isSystemNotice;

  if (isSystemNotice) {
    return (
      <div className="chat-message-notice" role="status">
        <span>{message.text}</span>
      </div>
    );
  }

  return (
    <div
      className={`chat-message ${isUser ? "user" : "assistant"} ${
        isError ? "error" : ""
      }`}
    >
      <div className="chat-avatar" aria-hidden="true">
        {isUser ? "👤" : "🤖"}
      </div>
      <div className="chat-bubble">
        <div className="chat-sender-name">
          {isUser ? "You" : "Anatomy AI"}
        </div>
        <div className="chat-text">{renderFormattedText(message.text)}</div>
        {message.time && (
          <div className="chat-time">{message.time}</div>
        )}
      </div>
    </div>
  );
}

/** Simple parser for bold markdown (**text**), code (`text`), and line breaks. */
function renderFormattedText(text) {
  if (!text) return null;

  const lines = text.split("\n");
  return lines.map((line, lIdx) => {
    // Process inline bolding **word**
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const lineContent = parts.map((part, pIdx) => {
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    return (
      <span key={lIdx}>
        {lineContent}
        {lIdx < lines.length - 1 && <br />}
      </span>
    );
  });
}

export default ChatMessage;