"use client";

import React, { useState, useEffect } from "react";

/* ================================================================
   Countdown Collection — Flip-clock countdown to Dakar Fashion Week
   Target: December 15, 2026 19:00:00 GMT
   ================================================================ */

const TARGET_DATE = new Date("2026-12-15T19:00:00Z").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const now = Date.now();
  const diff = Math.max(0, TARGET_DATE - now);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/* Flip Digit — CSS 3D flip driven by key-based remount */
function FlipDigit({ value, label, flipKey }: { value: number; label: string; flipKey: string }) {
  const displayValue = String(value).padStart(2, "0");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.75rem",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "clamp(70px, 12vw, 120px)",
          height: "clamp(85px, 14vw, 140px)",
          perspective: "600px",
        }}
      >
        {/* Top half */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: "linear-gradient(180deg, #1a1a2e, #111118)",
            borderRadius: "12px 12px 0 0",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: "2px",
            overflow: "hidden",
            border: "1px solid rgba(212,175,55,0.1)",
            borderBottom: "1px solid rgba(0,0,0,0.4)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1,
              transform: "translateY(50%)",
            }}
          >
            {displayValue}
          </span>
        </div>

        {/* Bottom half */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: "linear-gradient(180deg, #111118, #0d0d14)",
            borderRadius: "0 0 12px 12px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "2px",
            overflow: "hidden",
            border: "1px solid rgba(212,175,55,0.08)",
            borderTop: "1px solid rgba(0,0,0,0.6)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1,
              transform: "translateY(-50%)",
            }}
          >
            {displayValue}
          </span>
        </div>

        {/* Flipping top overlay */}
        <div
          key={`ft-${flipKey}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: "linear-gradient(180deg, #1a1a2e, #111118)",
            borderRadius: "12px 12px 0 0",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: "2px",
            overflow: "hidden",
            border: "1px solid rgba(212,175,55,0.1)",
            borderBottom: "1px solid rgba(0,0,0,0.4)",
            transformOrigin: "bottom center",
            animation: "flipTop 0.3s ease-in forwards",
            backfaceVisibility: "hidden",
            zIndex: 2,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1,
              transform: "translateY(50%)",
            }}
          >
            {displayValue}
          </span>
        </div>

        {/* Flipping bottom overlay */}
        <div
          key={`fb-${flipKey}`}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%",
            background: "linear-gradient(180deg, #111118, #0d0d14)",
            borderRadius: "0 0 12px 12px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "2px",
            overflow: "hidden",
            border: "1px solid rgba(212,175,55,0.08)",
            borderTop: "1px solid rgba(0,0,0,0.6)",
            transformOrigin: "top center",
            animation: "flipBottom 0.3s 0.3s ease-out forwards",
            backfaceVisibility: "hidden",
            zIndex: 2,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1,
              transform: "translateY(-50%)",
            }}
          >
            {displayValue}
          </span>
        </div>

        {/* Center divider line */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            right: 0,
            height: "2px",
            background: "rgba(0,0,0,0.8)",
            zIndex: 3,
            transform: "translateY(-50%)",
          }}
        />

        {/* Gold glow accent */}
        <div
          key={`glow-${flipKey}`}
          style={{
            position: "absolute",
            inset: "-1px",
            borderRadius: "12px",
            boxShadow: "0 0 20px rgba(212,175,55,0.2), inset 0 0 20px rgba(212,175,55,0.05)",
            animation: "goldGlowPulse 0.6s ease-out forwards",
            pointerEvents: "none",
            zIndex: 4,
          }}
        />
      </div>

      <span
        style={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: "0.65rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#d4af37",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function CountdownCollection() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        padding: "6rem 8vw",
        background: "linear-gradient(180deg, #0a0a0a 0%, #0d0a08 50%, #0a0a0a 100%)",
        overflow: "hidden",
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* CSS-only gold particles */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              borderRadius: "50%",
              background:
                i % 3 === 0
                  ? "rgba(212,175,55,0.6)"
                  : i % 3 === 1
                  ? "rgba(212,175,55,0.3)"
                  : "rgba(255,255,255,0.15)",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animation: `goldParticleFloat ${4 + Math.random() * 6}s ease-in-out ${Math.random() * 4}s infinite`,
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* Subtle radial glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 60%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: "900px",
          width: "100%",
        }}
      >
        {/* Label */}
        <div
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "0.7rem",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#d4af37",
            marginBottom: "1rem",
          }}
        >
          Prochain Événement
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "var(--font-display), 'Cormorant Garamond', serif",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 300,
            color: "#fff",
            lineHeight: 1.1,
            marginBottom: "0.5rem",
          }}
        >
          Collection Hiver 2026
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: "0.85rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
            marginBottom: "3rem",
          }}
        >
          Dakar Fashion Week — Hiver 2026
        </p>

        {/* Countdown */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "clamp(12px, 3vw, 24px)",
            marginBottom: "3rem",
            flexWrap: "wrap",
          }}
        >
          <FlipDigit value={timeLeft.days} label="Jours" flipKey={`d${timeLeft.days}`} />
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              color: "#d4af37",
              alignSelf: "flex-start",
              marginTop: "clamp(20px, 4vw, 40px)",
            }}
          >
            :
          </span>
          <FlipDigit value={timeLeft.hours} label="Heures" flipKey={`h${timeLeft.hours}`} />
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              color: "#d4af37",
              alignSelf: "flex-start",
              marginTop: "clamp(20px, 4vw, 40px)",
            }}
          >
            :
          </span>
          <FlipDigit value={timeLeft.minutes} label="Minutes" flipKey={`m${timeLeft.minutes}`} />
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              color: "#d4af37",
              alignSelf: "flex-start",
              marginTop: "clamp(20px, 4vw, 40px)",
            }}
          >
            :
          </span>
          <FlipDigit value={timeLeft.seconds} label="Secondes" flipKey={`s${timeLeft.seconds}`} />
        </div>

        {/* CTA Button */}
        <a
          href="#"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 40px",
            background: "transparent",
            color: "#d4af37",
            border: "1px solid #d4af37",
            borderRadius: "999px",
            fontWeight: 600,
            fontSize: "0.8rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            marginBottom: "3rem",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.background = "rgba(212,175,55,0.1)";
            el.style.boxShadow = "0 0 30px rgba(212,175,55,0.2)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.background = "transparent";
            el.style.boxShadow = "none";
          }}
        >
          Réserver une invitation
        </a>

        {/* Sneak peek image strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginTop: "1rem",
            flexWrap: "wrap",
          }}
        >
          {[
            "/images/collection-printemps.png",
            "/images/collection-soiree.png",
            "/images/collection-elegance.png",
          ].map((img, i) => (
            <div
              key={i}
              style={{
                width: "clamp(100px, 20vw, 180px)",
                height: "clamp(120px, 24vw, 220px)",
                borderRadius: "0.75rem",
                overflow: "hidden",
                position: "relative",
                filter: "blur(3px)",
                opacity: 0.5,
                transition: "all 0.4s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.filter = "blur(0px)";
                el.style.opacity = "0.8";
                el.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.filter = "blur(3px)";
                el.style.opacity = "0.5";
                el.style.transform = "scale(1)";
              }}
            >
              <img
                src={img}
                alt={`Aperçu collection ${i + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                loading="lazy"
              />
              {/* Gold shimmer overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(135deg, rgba(212,175,55,0.1) 0%, transparent 50%, rgba(212,175,55,0.05) 100%)",
                  pointerEvents: "none",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Flip animation keyframes */}
      <style jsx>{`
        @keyframes flipTop {
          0% {
            transform: rotateX(0deg);
          }
          100% {
            transform: rotateX(-90deg);
          }
        }
        @keyframes flipBottom {
          0% {
            transform: rotateX(90deg);
          }
          100% {
            transform: rotateX(0deg);
          }
        }
        @keyframes goldGlowPulse {
          0% {
            box-shadow: 0 0 20px rgba(212,175,55,0.3), inset 0 0 20px rgba(212,175,55,0.1);
          }
          100% {
            box-shadow: 0 0 10px rgba(212,175,55,0.05);
          }
        }
        @keyframes goldParticleFloat {
          0%, 100% {
            opacity: 0;
            transform: translateY(0) scale(0.5);
          }
          25% {
            opacity: 0.8;
          }
          50% {
            opacity: 0.5;
            transform: translateY(-40px) scale(1);
          }
          75% {
            opacity: 0.3;
          }
        }
      `}</style>
    </section>
  );
}
