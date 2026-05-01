"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

/* ================================================================
   Theme Toggle — 3 modes: Sombre / Blanc / Adapté
   - Sombre: forced dark
   - Blanc: forced light
   - Adapté: auto based on time of day (6am–6pm = light, else dark)
   - Cycles through modes on click
   - Shows current mode label on hover
   ================================================================ */

type ThemeMode = "dark" | "light" | "auto";

const STORAGE_KEY = "keur-gui-luxe-theme-mode";

const THEME_VARS: Record<"dark" | "light", Record<string, string>> = {
  dark: {
    "--color-bg": "#0a0a0a",
    "--color-text": "#ffffff",
    "--color-text-muted": "rgba(255, 255, 255, 0.7)",
    "--color-card": "#111118",
    "--color-border": "#2a2a3a",
  },
  light: {
    "--color-bg": "#faf5eb",
    "--color-text": "#1a1a2e",
    "--color-text-muted": "rgba(26, 26, 46, 0.6)",
    "--color-card": "#ffffff",
    "--color-border": "rgba(26, 26, 46, 0.12)",
  },
};

const MODE_LABELS: Record<ThemeMode, string> = {
  dark: "Sombre",
  light: "Blanc",
  auto: "Adapté",
};

const MODE_ICONS: Record<ThemeMode, React.ReactNode> = {
  dark: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  light: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  auto: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
};

function getResolvedTheme(mode: ThemeMode): "dark" | "light" {
  if (mode === "auto") {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18 ? "light" : "dark";
  }
  return mode;
}

function getInitialMode(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "dark" || saved === "light" || saved === "auto") return saved;
  return "auto";
}

function applyTheme(resolved: "dark" | "light") {
  const root = document.documentElement;
  const body = document.body;

  const vars = THEME_VARS[resolved];
  Object.entries(vars).forEach(([prop, value]) => {
    root.style.setProperty(prop, value);
  });

  if (resolved === "light") {
    body.classList.add("light-theme");
    body.classList.remove("dark-theme");
  } else {
    body.classList.remove("light-theme");
    body.classList.add("dark-theme");
  }

  body.style.backgroundColor = vars["--color-bg"];
  body.style.color = vars["--color-text"];
  body.style.transition = "background-color 0.5s ease, color 0.5s ease";

  localStorage.setItem(STORAGE_KEY, resolved === "light" ? "light" : "dark");
}

const MODE_CYCLE: ThemeMode[] = ["dark", "light", "auto"];

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("dark");
  const [mounted, setMounted] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("dark");
  const labelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const initial = getInitialMode();
    const resolved = getResolvedTheme(initial);
    setMode(initial);
    setResolvedTheme(resolved);
    applyTheme(resolved);
    setMounted(true);
  }, []);

  /* In auto mode, re-check every minute */
  useEffect(() => {
    if (mode !== "auto") return;
    const interval = setInterval(() => {
      const resolved = getResolvedTheme("auto");
      setResolvedTheme(resolved);
      applyTheme(resolved);
    }, 60000);
    return () => clearInterval(interval);
  }, [mode]);

  const cycleMode = useCallback(() => {
    setMode((prev) => {
      const idx = MODE_CYCLE.indexOf(prev);
      const next = MODE_CYCLE[(idx + 1) % MODE_CYCLE.length];
      const resolved = getResolvedTheme(next);
      setResolvedTheme(resolved);
      applyTheme(resolved);
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
    setShowLabel(true);
    if (labelTimeoutRef.current) clearTimeout(labelTimeoutRef.current);
    labelTimeoutRef.current = setTimeout(() => setShowLabel(false), 2000);
  }, []);

  if (!mounted) return null;

  const isLight = resolvedTheme === "light";
  const currentLabel = MODE_LABELS[mode];

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
      {/* Mode label popup */}
      <div
        style={{
          position: "absolute",
          bottom: "58px",
          left: "50%",
          transform: "translateX(-50%)",
          background: isLight ? "rgba(26,26,46,0.9)" : "rgba(0,0,0,0.88)",
          backdropFilter: "blur(12px)",
          color: isLight ? "#faf5eb" : "#d4af37",
          fontSize: "0.7rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase" as const,
          fontFamily: "var(--font-geist-mono)",
          padding: "6px 14px",
          borderRadius: "8px",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          opacity: showLabel ? 1 : 0,
          transition: "opacity 0.3s ease, transform 0.3s ease",
          transform: showLabel ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(6px)",
          border: isLight
            ? "1px solid rgba(212,175,55,0.2)"
            : "1px solid rgba(212,175,55,0.15)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        }}
      >
        {currentLabel}
      </div>

      {/* Toggle button */}
      <button
        onClick={cycleMode}
        onMouseEnter={() => setShowLabel(true)}
        onMouseLeave={() => {
          if (labelTimeoutRef.current) clearTimeout(labelTimeoutRef.current);
          labelTimeoutRef.current = setTimeout(() => setShowLabel(false), 800);
        }}
        aria-label={`Thème : ${currentLabel} — cliquer pour changer`}
        title={`Thème : ${currentLabel}`}
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          border: isLight
            ? "1px solid rgba(26, 26, 46, 0.15)"
            : "1px solid rgba(255, 255, 255, 0.1)",
          background: isLight
            ? "rgba(26, 26, 46, 0.08)"
            : "rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(12px)",
          color: isLight ? "#1a1a2e" : "#ffffff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          transition: "all 0.3s ease",
          outline: "none",
          boxShadow: isLight
            ? "0 4px 20px rgba(0,0,0,0.08)"
            : "0 4px 20px rgba(212,175,55,0.12)",
          position: "relative",
        }}
      >
        {/* Icon with rotation animation */}
        <div
          key={mode}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "themeIconPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {MODE_ICONS[mode]}
        </div>

        {/* Auto badge — small dot indicator */}
        {mode === "auto" && (
          <div
            style={{
              position: "absolute",
              top: "6px",
              right: "6px",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#d4af37",
              boxShadow: "0 0 6px rgba(212,175,55,0.6)",
            }}
          />
        )}
      </button>

      {/* Inline keyframes */}
      <style>{`
        @keyframes themeIconPop {
          0% { transform: scale(0.5) rotate(-90deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export { ThemeToggle };
