"use client";

import React, { useState } from "react";

/* ================================================================
   Newsletter Cinématique — Envelope opening animation
   Click envelope → flap opens (3D rotateX) → form slides up
   ================================================================ */

export default function NewsletterCinematic() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <section
      style={{
        position: "relative",
        padding: "6rem 8vw",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a14 30%, #0a0a0a 60%, #0d0808 100%)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
      }}
    >
      {/* Gold shimmer background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(90deg, transparent, transparent 49%, rgba(212,175,55,0.02) 49%, rgba(212,175,55,0.02) 51%, transparent 51%)",
          backgroundSize: "60px 100%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 60%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        {/* Title */}
        <h2
          style={{
            fontFamily: "var(--font-display), 'Cormorant Garamond', serif",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 300,
            color: "#fff",
            lineHeight: 1.1,
            marginBottom: "1rem",
          }}
        >
          Restez{" "}
          <span style={{ color: "#d4af37" }}>Inspiré</span>
        </h2>

        <p
          style={{
            fontSize: "0.95rem",
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.7,
            marginBottom: "3rem",
            maxWidth: "450px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Recevez en exclusivité nos dernières créations et invitations
        </p>

        {/* Success state */}
        {isSubmitted ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1.5rem",
              animation: "fadeInUp 0.6s ease-out",
            }}
          >
            {/* Checkmark */}
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: "2px solid #d4af37",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "checkmarkPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s both",
              }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                style={{
                  animation: "drawCheck 0.4s ease-out 0.5s both",
                }}
              >
                <path
                  d="M8 18L15 25L28 11"
                  stroke="#d4af37"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="40"
                  strokeDashoffset="40"
                  style={{
                    animation: "drawCheck 0.4s ease-out 0.5s both",
                  }}
                />
              </svg>
            </div>

            <p
              style={{
                fontSize: "1.1rem",
                color: "#fff",
                lineHeight: 1.7,
                maxWidth: "400px",
              }}
            >
              Merci ! Vous faites maintenant partie de la famille{" "}
              <span style={{ color: "#d4af37", fontWeight: 600 }}>Keur Gui Luxe</span>
            </p>
          </div>
        ) : (
          /* Envelope */
          <div
            style={{
              perspective: "1200px",
              cursor: isOpen ? "default" : "pointer",
            }}
            onClick={() => {
              if (!isOpen) setIsOpen(true);
            }}
          >
            {/* Envelope body */}
            <div
              style={{
                position: "relative",
                width: "clamp(320px, 80vw, 500px)",
                height: "clamp(220px, 40vw, 300px)",
                margin: "0 auto",
              }}
            >
              {/* Envelope back (bottom) */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "100%",
                  background: "linear-gradient(180deg, #2a0a1a, #1a0812)",
                  borderRadius: "0 0 12px 12px",
                  border: "1px solid rgba(212,175,55,0.15)",
                  borderTop: "none",
                  overflow: "hidden",
                }}
              >
                {/* Inner content (form) */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "2rem 2rem 1.5rem",
                    transform: isOpen ? "translateY(0)" : "translateY(100%)",
                    opacity: isOpen ? 1 : 0,
                    transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s",
                  }}
                >
                  <form
                    onSubmit={handleSubmit}
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "center",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      required
                      style={{
                        flex: 1,
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(212,175,55,0.2)",
                        borderRadius: "999px",
                        padding: "12px 20px",
                        color: "#fff",
                        fontSize: "0.9rem",
                        outline: "none",
                        fontFamily: "var(--font-geist-sans)",
                        transition: "border-color 0.3s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#d4af37";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(212,175,55,0.2)";
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: "12px 24px",
                        background: "#d4af37",
                        color: "#0a0a0a",
                        border: "none",
                        borderRadius: "999px",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#e5c349";
                        e.currentTarget.style.boxShadow = "0 0 20px rgba(212,175,55,0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#d4af37";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      S&apos;abonner
                    </button>
                  </form>
                </div>

                {/* Decorative lines inside */}
                <div
                  style={{
                    position: "absolute",
                    top: "30%",
                    left: "15%",
                    right: "15%",
                    height: "1px",
                    background: "rgba(212,175,55,0.08)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "20%",
                    right: "30%",
                    height: "1px",
                    background: "rgba(212,175,55,0.06)",
                  }}
                />
              </div>

              {/* Envelope flap (top) */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "60%",
                  transformOrigin: "top center",
                  transform: isOpen ? "rotateX(180deg)" : "rotateX(0deg)",
                  transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  zIndex: 2,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Front of flap (visible when closed) */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, #3a1228, #2a0a1a)",
                    clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                    backfaceVisibility: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingTop: "10%",
                  }}
                >
                  {/* Wax seal */}
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      background: "radial-gradient(circle at 35% 35%, #d4af37, #8a6d1b)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 15px rgba(212,175,55,0.3), inset 0 1px 2px rgba(255,255,255,0.2)",
                      transition: "all 0.3s ease",
                      transform: isOpen ? "scale(0)" : "scale(1)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.2rem",
                        color: "#0a0a0a",
                        fontWeight: 700,
                        fontFamily: "var(--font-display), serif",
                      }}
                    >
                      K
                    </span>
                  </div>
                </div>

                {/* Back of flap (visible when open) */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, #1a0812, #2a0a1a)",
                    clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                    backfaceVisibility: "hidden",
                    transform: "rotateX(180deg)",
                  }}
                />
              </div>

              {/* Click prompt */}
              {!isOpen && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "-2.5rem",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    animation: "envelopePulse 2s ease-in-out infinite",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-geist-mono)",
                      fontSize: "0.7rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "rgba(212,175,55,0.5)",
                    }}
                  >
                    Cliquez pour ouvrir
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes checkmarkPop {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes drawCheck {
          from {
            stroke-dashoffset: 40;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes envelopePulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
