"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import gsap from "gsap";

/* ================================================================
   AI Styliste Virtuel — Fashion chatbot for Keur Gui Luxe
   - Floating chat button at bottom-right (above theme toggle)
   - Chat panel with glassmorphism style
   - Quick reply buttons for preset options
   - Calls /api/styliste for AI responses
   - GSAP animations for messages
   ================================================================ */

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const QUICK_REPLIES = [
  "Je cherche une robe de soirée",
  "Style traditionnel sénégalais",
  "Cadeau pour une femme",
  "Look professionnel homme",
];

const INITIAL_MESSAGE: ChatMessage = {
  id: "initial",
  role: "assistant",
  content:
    "Bonjour ! Je suis votre styliste virtuel Keur Gui Luxe. Comment puis-je vous aider à trouver la tenue parfaite ? 🪡",
};

export default function AiStyliste() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Scroll to bottom of messages */
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  /* Animate panel open/close */
  useEffect(() => {
    if (panelRef.current) {
      if (isOpen) {
        gsap.fromTo(
          panelRef.current,
          { opacity: 0, y: 30, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.4)" }
        );
      }
    }
  }, [isOpen]);

  /* Animate new messages */
  useEffect(() => {
    if (messages.length <= 1) return;
    const lastMsg = document.querySelector(
      `[data-msg-id="${messages[messages.length - 1].id}"]`
    );
    if (lastMsg) {
      gsap.fromTo(
        lastMsg,
        { opacity: 0, y: 12, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power2.out" }
      );
    }
  }, [messages]);

  /* Focus input when panel opens */
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [isOpen]);

  /* Send a message */
  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      try {
        const res = await fetch("/api/styliste", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed }),
        });

        const data = await res.json();
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: data.response || "Je suis désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer.",
        };

        setMessages((prev) => [...prev, botMsg]);
      } catch {
        const errorMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content:
            "Je rencontre une difficulté technique. Notre collection Nuit Dorée est un choix magnifique en attendant — n'hésitez pas à réessayer ! ✨",
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsTyping(false);
      }
    },
    [isTyping]
  );

  /* Handle form submit */
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage(input);
    },
    [input, sendMessage]
  );

  /* Handle quick reply */
  const handleQuickReply = useCallback(
    (reply: string) => {
      sendMessage(reply);
    },
    [sendMessage]
  );

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          style={{
            position: "fixed",
            bottom: "84px",
            right: "24px",
            width: "min(380px, calc(100vw - 48px))",
            maxHeight: "500px",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            borderRadius: "20px",
            overflow: "hidden",
            background: "rgba(10, 10, 10, 0.88)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(212, 175, 55, 0.15)",
            boxShadow:
              "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px",
              borderBottom: "1px solid rgba(212,175,55,0.12)",
              background: "rgba(212,175,55,0.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* Scissors icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d4af37"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="6" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <line x1="20" y1="4" x2="8.12" y2="15.88" />
                <line x1="14.47" y1="14.48" x2="20" y2="20" />
                <line x1="8.12" y1="8.12" x2="12" y2="12" />
              </svg>
              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#d4af37",
                }}
              >
                Styliste IA
              </span>
            </div>

            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Fermer le chat"
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.5)",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "color 0.2s ease",
                outline: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#ff007f";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages area */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 16px 8px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              maxHeight: "320px",
              minHeight: "200px",
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                data-msg-id={msg.id}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "10px 14px",
                    borderRadius:
                      msg.role === "user"
                        ? "16px 16px 4px 16px"
                        : "16px 16px 16px 4px",
                    fontSize: "0.85rem",
                    lineHeight: 1.6,
                    wordBreak: "break-word",
                    ...(msg.role === "user"
                      ? {
                          background: "rgba(255, 0, 127, 0.2)",
                          color: "#ffb3d9",
                          border: "1px solid rgba(255, 0, 127, 0.15)",
                        }
                      : {
                          background: "rgba(17, 17, 24, 0.9)",
                          color: "#e0e0e8",
                          border: "1px solid rgba(212, 175, 55, 0.12)",
                        }),
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div
                  style={{
                    padding: "10px 16px",
                    borderRadius: "16px 16px 16px 4px",
                    background: "rgba(17, 17, 24, 0.9)",
                    border: "1px solid rgba(212, 175, 55, 0.12)",
                    display: "flex",
                    gap: "4px",
                    alignItems: "center",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#d4af37",
                        animation: `typingBounce 1.4s ease-in-out infinite ${i * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 2 && !isTyping && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                padding: "0 16px 8px",
              }}
            >
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleQuickReply(reply)}
                  style={{
                    background: "rgba(212,175,55,0.08)",
                    border: "1px solid rgba(212,175,55,0.2)",
                    color: "#d4af37",
                    borderRadius: "999px",
                    padding: "6px 12px",
                    fontSize: "0.72rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    outline: "none",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.background = "rgba(212,175,55,0.18)";
                    el.style.borderColor = "rgba(212,175,55,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.background = "rgba(212,175,55,0.08)";
                    el.style.borderColor = "rgba(212,175,55,0.2)";
                  }}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input area */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px",
              borderTop: "1px solid rgba(212,175,55,0.08)",
              background: "rgba(0,0,0,0.3)",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Votre question..."
              disabled={isTyping}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                padding: "10px 14px",
                color: "#fff",
                fontSize: "0.85rem",
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => {
                (e.target as HTMLElement).style.borderColor = "rgba(212,175,55,0.3)";
              }}
              onBlur={(e) => {
                (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
              }}
            />
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              aria-label="Envoyer le message"
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                border: "none",
                background:
                  input.trim() && !isTyping
                    ? "#d4af37"
                    : "rgba(255,255,255,0.05)",
                color:
                  input.trim() && !isTyping ? "#0a0a0a" : "rgba(255,255,255,0.3)",
                cursor:
                  input.trim() && !isTyping ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
                outline: "none",
                padding: 0,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Chat Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Fermer le styliste IA" : "Ouvrir le styliste IA"}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "84px",
          zIndex: 999,
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: isOpen
            ? "1px solid rgba(212,175,55,0.3)"
            : "1px solid rgba(212,175,55,0.15)",
          background: isOpen
            ? "rgba(212,175,55,0.15)"
            : "rgba(212,175,55,0.08)",
          backdropFilter: "blur(12px)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          transition: "all 0.3s ease",
          outline: "none",
          boxShadow: isOpen
            ? "0 4px 20px rgba(212,175,55,0.25)"
            : "0 4px 20px rgba(212,175,55,0.1)",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.transform = "scale(1.1)";
          el.style.boxShadow = "0 6px 28px rgba(212,175,55,0.35)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.transform = "scale(1)";
          el.style.boxShadow = isOpen
            ? "0 4px 20px rgba(212,175,55,0.25)"
            : "0 4px 20px rgba(212,175,55,0.1)";
        }}
      >
        {isOpen ? (
          /* Close icon */
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#d4af37"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          /* Hanger/fashion icon */
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#d4af37"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h7.5L20 9.5 12 16 4 9.5 3.5 7H11V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
            <path d="M4 9.5L12 16l8-6.5" />
          </svg>
        )}
      </button>

      {/* Typing bounce animation */}
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </>
  );
}

export { AiStyliste };
