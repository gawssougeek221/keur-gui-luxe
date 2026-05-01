"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

/* ================================================================
   Magnetic Button — 3D tilt + magnetic cursor follow + elastic snap
   ================================================================ */

type MagneticButtonVariant = "primary" | "secondary" | "outline";

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  style?: React.CSSProperties;
  variant?: MagneticButtonVariant;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const variantStyles: Record<MagneticButtonVariant, React.CSSProperties> = {
  primary: {
    background: "#ff007f",
    color: "#ffffff",
    border: "none",
  },
  secondary: {
    background: "rgba(255,255,255,0.05)",
    color: "#ffffff",
    border: "1px solid rgba(255,255,255,0.15)",
  },
  outline: {
    background: "transparent",
    color: "#ff007f",
    border: "1px solid #ff007f",
  },
};

function MagneticButton({
  children,
  href,
  className,
  style,
  variant = "primary",
  onClick,
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        rotateX: -y * 0.15,
        rotateY: x * 0.15,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const onLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
      });
    };

    btn.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseleave", onLeave);
    return () => {
      btn.removeEventListener("mousemove", onMove);
      btn.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const mergedStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 32px",
    borderRadius: "999px",
    fontWeight: 600,
    fontSize: "0.8rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    textDecoration: "none",
    cursor: "pointer",
    transformStyle: "preserve-3d",
    willChange: "transform",
    transition: "background 0.3s ease, border-color 0.3s ease, color 0.3s ease",
    ...variantStyles[variant],
    ...style,
  };

  return (
    <span
      ref={wrapperRef}
      style={{ perspective: "600px", display: "inline-block" }}
    >
      <a
        ref={btnRef}
        href={href || "#"}
        className={className}
        style={mergedStyle}
        onClick={onClick}
      >
        {children}
      </a>
    </span>
  );
}

export default MagneticButton;
export { MagneticButton };
export type { MagneticButtonProps, MagneticButtonVariant };
