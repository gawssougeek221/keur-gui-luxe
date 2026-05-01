"use client";

import React, { useState, useEffect, useCallback } from "react";

/* ================================================================
   Theme Toggle — Dark / Light mode with localStorage + time-of-day
   ================================================================ */

type Theme = "dark" | "light";

const STORAGE_KEY = "keur-gui-luxe-theme";

const THEME_VARS: Record<Theme, Record<string, string>> = {
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

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";

  // 1. Check localStorage
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "dark" || saved === "light") return saved;

  // 2. Check time of day (6am–6pm = light, else dark)
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const body = document.body;

  // Set CSS variables
  const vars = THEME_VARS[theme];
  Object.entries(vars).forEach(([prop, value]) => {
    root.style.setProperty(prop, value);
  });

  // Add/remove light-theme class on body
  if (theme === "light") {
    body.classList.add("light-theme");
    body.classList.remove("dark-theme");
  } else {
    body.classList.remove("light-theme");
    body.classList.add("dark-theme");
  }

  // Update body background + color for smooth transition
  body.style.backgroundColor = vars["--color-bg"];
  body.style.color = vars["--color-text"];
  body.style.transition = "background-color 0.5s ease, color 0.5s ease";

  // Persist
  localStorage.setItem(STORAGE_KEY, theme);
}

/* ========== Sun/Moon SVG ========== */
function ThemeIcon({ theme }: { theme: Theme }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease",
        transform: theme === "light" ? "rotate(180deg) scale(1)" : "rotate(0deg) scale(1)",
      }}
    >
      {theme === "light" ? (
        /* Moon icon */
        <>
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            style={{
              transition: "d 0.5s ease, opacity 0.3s ease",
            }}
          />
        </>
      ) : (
        /* Sun icon */
        <>
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </>
      )}
    </svg>
  );
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = getInitialTheme();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe client initialization
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      applyTheme(next);
      return next;
    });
  }, []);

  if (!mounted) return null;

  const isLight = theme === "light";

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      title={`Switch to ${isLight ? "dark" : "light"} mode`}
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 1000,
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
        transition: "background 0.5s ease, border-color 0.5s ease, color 0.5s ease, box-shadow 0.3s ease, transform 0.2s ease",
        boxShadow: isLight
          ? "0 4px 20px rgba(0,0,0,0.08)"
          : "0 4px 20px rgba(255,0,127,0.15)",
        outline: "none",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = "scale(1.1)";
        el.style.boxShadow = isLight
          ? "0 6px 28px rgba(0,0,0,0.12)"
          : "0 6px 28px rgba(255,0,127,0.3)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = "scale(1)";
        el.style.boxShadow = isLight
          ? "0 4px 20px rgba(0,0,0,0.08)"
          : "0 4px 20px rgba(255,0,127,0.15)";
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,0,127,0.4)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = isLight
          ? "0 4px 20px rgba(0,0,0,0.08)"
          : "0 4px 20px rgba(255,0,127,0.15)";
      }}
    >
      <ThemeIcon theme={theme} />
    </button>
  );
}

export { ThemeToggle };
export type { Theme };
