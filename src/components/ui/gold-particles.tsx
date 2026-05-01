"use client";

import React, { useRef, useEffect, useCallback } from "react";

/* ================================================================
   Gold Particle System — canvas-based floating gold dust
   ================================================================ */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  hasTrail: boolean;
  trail: Array<{ x: number; y: number; opacity: number }>;
  phase: number; // sinusoidal drift
  speed: number;
}

const PARTICLE_COUNT = 60;
const COLORS = ["#d4af37", "#ffe4a0", "#ff007f"]; // gold, warm white, light pink
const TRAIL_MAX_LENGTH = 6;

function createParticle(width: number, height: number): Particle {
  const hasTrail = Math.random() < 0.25; // 25% of particles have trails
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -(Math.random() * 0.4 + 0.15), // float upward
    size: Math.random() * 3 + 1, // 1-4px
    opacity: Math.random() * 0.6 + 0.2, // 0.2-0.8
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    hasTrail,
    trail: [],
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.5 + 0.3,
  };
}

export default function GoldParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);

  const initParticles = useCallback((width: number, height: number) => {
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
      createParticle(width, height)
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (particlesRef.current.length === 0) {
        initParticles(window.innerWidth, window.innerHeight);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const mouse = mouseRef.current;

      for (const p of particlesRef.current) {
        // Magnetic effect: subtle pull toward cursor
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const magneticRadius = 200;

        if (dist < magneticRadius && dist > 1) {
          const force = (1 - dist / magneticRadius) * 0.015;
          p.vx += dx * force;
          p.vy += dy * force;
        }

        // Sinusoidal horizontal drift
        p.phase += 0.008 * p.speed;
        p.x += p.vx + Math.sin(p.phase) * 0.2;
        p.y += p.vy;

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.995;

        // Ensure particles keep floating upward
        if (p.vy > -0.1) {
          p.vy = -(Math.random() * 0.4 + 0.15);
        }

        // Trail update
        if (p.hasTrail) {
          p.trail.push({ x: p.x, y: p.y, opacity: p.opacity * 0.5 });
          if (p.trail.length > TRAIL_MAX_LENGTH) {
            p.trail.shift();
          }
        }

        // Draw trail
        if (p.hasTrail && p.trail.length > 1) {
          for (let i = 0; i < p.trail.length; i++) {
            const t = p.trail[i];
            const trailOpacity = (i / p.trail.length) * t.opacity * 0.6;
            const trailSize = p.size * (i / p.trail.length) * 0.7;
            ctx.beginPath();
            ctx.arc(t.x, t.y, Math.max(0.5, trailSize), 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = trailOpacity;
            ctx.fill();
          }
        }

        // Draw particle
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Soft glow for larger particles
        if (p.size > 2.5) {
          ctx.globalAlpha = p.opacity * 0.15;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        }

        // Reset if out of bounds
        if (p.y < -20 || p.x < -20 || p.x > w + 20) {
          p.x = Math.random() * w;
          p.y = h + 10;
          p.vx = (Math.random() - 0.5) * 0.3;
          p.vy = -(Math.random() * 0.4 + 0.15);
          p.trail = [];
          p.opacity = Math.random() * 0.6 + 0.2;
        }
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}

export { GoldParticles };
