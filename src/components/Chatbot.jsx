import { useState, useEffect, useRef } from "react";
import { useMatch } from "react-router-dom";
import models from "../data/models.json";
import { useChatbot } from "./ChatbotContext";
import { askGemini, getApiKey } from "../services/geminiClient";
import { buildSystemInstruction } from "./chatbotPrompts";
import ChatMessage from "./ChatMessage";

function Chatbot() {
  const { isOpen, toggle, close } = useChatbot();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Detect which model is currently open based on the URL route /anatomy/:id
  const match = useMatch("/anatomy/:id");
  const modelId = match?.params?.id;
  const currentModel = models.find((m) => m.id === modelId) || null;

  const hasApiKey = Boolean(getApiKey());

  // Auto-scroll when messages update or panel opens
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) close();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  // Handle send message
  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    if (!hasApiKey) {
      const systemNoticeMsg = {
        id: Date.now(),
        role: "assistant",
        text: "⚠️ Google Gemini API key missing. Please set VITE_GEMINI_API_KEY in your environment to enable AI answers.",
        isError: true,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, { role: "user", text: query, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }, systemNoticeMsg]);
      setInput("");
      return;
    }

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMsg = { role: "user", text: query, time };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    // Build chat history for context (last 6 turns, converted to Gemini format)
    const history = messages
      .filter((m) => !m.isError && !m.isSystemNotice)
      .slice(-6)
      .map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

    const systemInstruction = buildSystemInstruction(currentModel);

    try {
      const replyText = await askGemini(query, systemInstruction, history);
      const assistantMsg = {
        id: Date.now(),
        role: "assistant",
        text: replyText,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg = {
        id: Date.now(),
        role: "assistant",
        text: `❌ ${err.message || "Failed to reach Gemini API."}`,
        isError: true,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  // Suggested questions based on context
  const getSuggestions = () => {
    if (currentModel) {
      if (currentModel.id === "heart") {
        return [
          "What are the 4 chambers of the heart?",
          "Explain the blood flow through valves",
          "What is the function of the septum?",
        ];
      }
      if (currentModel.id === "brain") {
        return [
          "What are the main functions of the frontal lobe?",
          "How does the cerebellum maintain balance?",
          "What connects the two cerebral hemispheres?",
        ];
      }
      if (currentModel.id === "skull") {
        return [
          "What bones form the cranium?",
          "Where is the foramen magnum located?",
        ];
      }
      return [
        `What are the key functions of the ${currentModel.name}?`,
        `Describe the main structure groups in this model`,
      ];
    }
    return [
      "Which 3D models can I explore?",
      "How do I open the Heart model?",
    ];
  };

  return (
    <div className="chatbot-root">
      {/* Floating Action Button */}
      <button
        className={`chatbot-fab ${isOpen ? "active" : ""}`}
        onClick={toggle}
        aria-label={isOpen ? "Close AI Tutor Chat" : "Open AI Tutor Chat"}
        title="Open AI Anatomy Tutor"
      >
        <span className="fab-icon">{isOpen ? "✕" : "🤖"}</span>
        {!isOpen && <span className="fab-label">AI Tutor</span>}
        {currentModel && !isOpen && (
          <span className="fab-model-dot" title={`Scoped to ${currentModel.name}`} />
        )}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <aside
          className="chatbot-window"
          role="dialog"
          aria-label="AI Anatomy Tutor Chat"
        >
          {/* Header */}
          <header className="chatbot-header">
            <div className="chatbot-header-title">
              <span className="chatbot-header-icon">🤖</span>
              <div>
                <h2>Anatomy AI Tutor</h2>
                <div className="chatbot-scope-badge">
                  {currentModel ? (
                    <span className="scope-active" title="Scoped exclusively to this model">
                      ● Scoped: <strong>{currentModel.name}</strong>
                    </span>
                  ) : (
                    <span className="scope-inactive">
                      ○ No model open (Refusal mode)
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="chatbot-header-actions">
              {messages.length > 0 && (
                <button
                  className="chatbot-action-btn"
                  onClick={handleClear}
                  title="Clear conversation"
                  aria-label="Clear conversation"
                >
                  🗑️
                </button>
              )}
              <button
                className="chatbot-action-btn"
                onClick={close}
                title="Close AI Chat"
                aria-label="Close AI Chat"
              >
                ✕
              </button>
            </div>
          </header>

          {/* Model Context Alert Banner */}
          <div className="chatbot-context-banner">
            {currentModel ? (
              <p>
                🎯 Responding <strong>ONLY</strong> to questions about{" "}
                <strong>{currentModel.name}</strong>. Other organ questions will be politely refused.
              </p>
            ) : (
              <p>
                ℹ️ Open a 3D model from the catalogue to ask specific anatomical questions!
              </p>
            )}
          </div>

          {!hasApiKey && (
            <div className="chatbot-api-warning">
              ⚡ <strong>Demo Mode:</strong> No Google Gemini API key detected. Set{" "}
              <code>VITE_GEMINI_API_KEY</code> in <code>.env</code> to activate live AI answers.
            </div>
          )}

          {/* Message List */}
          <div className="chatbot-messages">
            {messages.length === 0 ? (
              <div className="chatbot-welcome">
                <span className="welcome-icon">💡</span>
                <h3>Ask about {currentModel ? currentModel.name : "the Catalogue"}</h3>
                <p>
                  {currentModel
                    ? `I am programmed using Google Gemini to answer questions exclusively about the ${currentModel.name}.`
                    : "Open a model in the viewer to unlock organ-specific AI questions."}
                </p>

                <div className="chatbot-suggestions">
                  <p className="suggestions-label">Try asking:</p>
                  {getSuggestions().map((s, idx) => (
                    <button
                      key={idx}
                      className="suggestion-chip"
                      onClick={() => handleSend(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <ChatMessage key={msg.id || index} message={msg} />
              ))
            )}

            {loading && (
              <div className="chat-message assistant typing">
                <div className="chat-avatar" aria-hidden="true">
                  🤖
                </div>
                <div className="chat-bubble">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form
            className="chatbot-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                currentModel
                  ? `Ask about ${currentModel.name}...`
                  : "Ask about available models..."
              }
              disabled={loading}
            />
            <button
              type="submit"
              className="chatbot-send-btn"
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              ➔
            </button>
          </form>
        </aside>
      )}
    </div>
  );
}

export default Chatbot;