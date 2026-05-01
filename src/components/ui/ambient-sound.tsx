"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

/* ================================================================
   Ambient Sound Design — African-inspired ambient audio using Web Audio API
   - Floating button at bottom-left
   - OscillatorNode ambient pad (110Hz + 165Hz + 220Hz sine waves)
   - Scheduled rhythm thumps every ~2s
   - Scroll-triggered chime at section boundaries
   - prefers-reduced-motion respected
   ================================================================ */

type SoundState = "muted" | "playing";

interface AudioNodes {
  ctx: AudioContext;
  masterGain: GainNode;
  padGain: GainNode;
  rhythmGain: GainNode;
  chimeGain: GainNode;
  oscillators: OscillatorNode[];
  rhythmInterval: ReturnType<typeof setInterval> | null;
}

export default function AmbientSound() {
  const [state, setState] = useState<SoundState>("muted");
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const audioRef = useRef<AudioNodes | null>(null);
  const chimeCooldownRef = useRef(false);
  const sectionRefs = useRef<Set<string>>(new Set());
  const buttonRef = useRef<HTMLButtonElement>(null);

  /* Listen for prefers-reduced-motion changes */
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  /* Create the ambient pad: 3 layered sine oscillators */
  const createPad = useCallback((ctx: AudioContext, masterGain: GainNode) => {
    const padGain = ctx.createGain();
    padGain.gain.value = 0.1;
    padGain.connect(masterGain);

    const frequencies = [110, 165, 220];
    const oscillators: OscillatorNode[] = [];

    frequencies.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;

      // Slight detuning for warmth
      osc.detune.value = (Math.random() - 0.5) * 8;

      const oscGain = ctx.createGain();
      oscGain.gain.value = freq === 110 ? 0.5 : freq === 165 ? 0.3 : 0.2;
      osc.connect(oscGain);
      oscGain.connect(padGain);
      osc.start();
      oscillators.push(osc);
    });

    // Simple delay-based reverb effect
    const delay = ctx.createDelay(1.0);
    delay.delayTime.value = 0.4;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.25;
    const delayFilter = ctx.createBiquadFilter();
    delayFilter.type = "lowpass";
    delayFilter.frequency.value = 1200;

    padGain.connect(delay);
    delay.connect(delayFilter);
    delayFilter.connect(feedback);
    feedback.connect(delay);
    delay.connect(masterGain);

    return { padGain, oscillators };
  }, []);

  /* Create a subtle rhythm pattern — soft "thump" every ~2 seconds */
  const startRhythm = useCallback((ctx: AudioContext, masterGain: GainNode) => {
    const rhythmGain = ctx.createGain();
    rhythmGain.gain.value = 0.08;
    rhythmGain.connect(masterGain);

    const playThump = () => {
      const now = ctx.currentTime;

      // Main thump: short sine burst
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

      const env = ctx.createGain();
      env.gain.setValueAtTime(0.6, now);
      env.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(env);
      env.connect(rhythmGain);
      osc.start(now);
      osc.stop(now + 0.25);

      // Secondary click
      const click = ctx.createOscillator();
      click.type = "sine";
      click.frequency.value = 1200;
      const clickEnv = ctx.createGain();
      clickEnv.gain.setValueAtTime(0.15, now);
      clickEnv.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      click.connect(clickEnv);
      clickEnv.connect(rhythmGain);
      click.start(now);
      click.stop(now + 0.08);
    };

    // Play first thump immediately
    playThump();

    // Schedule recurring thumps
    const interval = setInterval(playThump, 2000);

    return { rhythmGain, interval };
  }, []);

  /* Play a section-chime (short sine wave at 880Hz with quick decay) */
  const playChime = useCallback(() => {
    if (!audioRef.current || chimeCooldownRef.current) return;

    chimeCooldownRef.current = true;
    setTimeout(() => {
      chimeCooldownRef.current = false;
    }, 3000); // Cooldown to prevent chiming too often

    const { ctx, masterGain } = audioRef.current;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.3);

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.12, now);
    env.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(env);
    env.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.5);
  }, []);

  /* Start the ambient audio */
  const startAudio = useCallback(() => {
    if (audioRef.current) return;

    const ctx = new AudioContext();
    const masterGain = ctx.createGain();
    masterGain.gain.value = 1.0;
    masterGain.connect(ctx.destination);

    // Fade in master gain
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 1.5);

    const { padGain, oscillators } = createPad(ctx, masterGain);
    const { rhythmGain, interval } = startRhythm(ctx, masterGain);

    const chimeGain = ctx.createGain();
    chimeGain.gain.value = 0.12;
    chimeGain.connect(masterGain);

    audioRef.current = {
      ctx,
      masterGain,
      padGain,
      rhythmGain,
      chimeGain,
      oscillators,
      rhythmInterval: interval,
    };

    setState("playing");
  }, [createPad, startRhythm]);

  /* Stop the ambient audio */
  const stopAudio = useCallback(() => {
    if (!audioRef.current) return;

    const { ctx, masterGain, oscillators, rhythmInterval } = audioRef.current;

    // Fade out
    masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);

    if (rhythmInterval) clearInterval(rhythmInterval);

    setTimeout(() => {
      oscillators.forEach((osc) => {
        try { osc.stop(); } catch { /* already stopped */ }
      });
      ctx.close().catch(() => {});
      audioRef.current = null;
    }, 600);

    setState("muted");
  }, []);

  /* Toggle audio */
  const toggle = useCallback(() => {
    if (reducedMotion) return;
    if (state === "muted") {
      startAudio();
    } else {
      stopAudio();
    }
  }, [state, reducedMotion, startAudio, stopAudio]);

  /* Scroll-triggered chimes: observe sections passing into view */
  useEffect(() => {
    if (state !== "playing") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id || (entry.target as HTMLElement).dataset?.sectionId;
            if (id && !sectionRefs.current.has(id)) {
              sectionRefs.current.add(id);
              playChime();
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    // Observe major sections
    const sections = document.querySelectorAll("section[id], [data-section-id]");
    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, [state, playChime]);

  /* Cleanup on unmount */
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        const { ctx, oscillators, rhythmInterval } = audioRef.current;
        if (rhythmInterval) clearInterval(rhythmInterval);
        oscillators.forEach((osc) => {
          try { osc.stop(); } catch { /* noop */ }
        });
        ctx.close().catch(() => {});
        audioRef.current = null;
      }
    };
  }, []);

  const isPlaying = state === "playing";

  return (
    <div style={{ position: "fixed", bottom: "24px", left: "24px", zIndex: 1000 }}>
      {/* Tooltip */}
      {!isPlaying && !reducedMotion && (
        <div
          style={{
            position: "absolute",
            bottom: "58px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
            color: "#d4af37",
            fontSize: "0.7rem",
            letterSpacing: "0.08em",
            padding: "6px 12px",
            borderRadius: "6px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            opacity: 1,
            transition: "opacity 0.3s ease",
            border: "1px solid rgba(212,175,55,0.2)",
          }}
        >
          Activer l&apos;ambiance
        </div>
      )}

      <button
        ref={buttonRef}
        onClick={toggle}
        aria-label={isPlaying ? "Désactiver l'ambiance sonore" : "Activer l'ambiance sonore"}
        disabled={reducedMotion}
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: `1px solid ${isPlaying ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.1)"}`,
          background: isPlaying
            ? "rgba(212,175,55,0.1)"
            : "rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
          cursor: reducedMotion ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          transition: "all 0.3s ease",
          outline: "none",
          boxShadow: isPlaying
            ? "0 4px 20px rgba(212,175,55,0.2)"
            : "0 4px 20px rgba(0,0,0,0.3)",
          opacity: reducedMotion ? 0.4 : 1,
        }}
        onMouseEnter={(e) => {
          if (reducedMotion) return;
          const el = e.currentTarget;
          el.style.transform = "scale(1.1)";
          el.style.boxShadow = isPlaying
            ? "0 6px 28px rgba(212,175,55,0.35)"
            : "0 6px 28px rgba(255,255,255,0.1)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.transform = "scale(1)";
          el.style.boxShadow = isPlaying
            ? "0 4px 20px rgba(212,175,55,0.2)"
            : "0 4px 20px rgba(0,0,0,0.3)";
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke={isPlaying ? "#d4af37" : "#666"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: "stroke 0.3s ease" }}
        >
          {/* Speaker icon */}
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />

          {isPlaying ? (
            <>
              {/* Animated sound waves */}
              <path
                d="M15.54 8.46a5 5 0 0 1 0 7.07"
                style={{
                  animation: "soundWave 1.5s ease-in-out infinite",
                  transformOrigin: "15.54px 12px",
                }}
              />
              <path
                d="M19.07 4.93a10 10 0 0 1 0 14.14"
                style={{
                  animation: "soundWave 1.5s ease-in-out infinite 0.3s",
                  transformOrigin: "19.07px 12px",
                }}
              />
            </>
          ) : (
            <>
              {/* Muted: line through speaker */}
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </>
          )}
        </svg>
      </button>

      {/* Inline keyframes for sound wave animation */}
      <style>{`
        @keyframes soundWave {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export { AmbientSound };
