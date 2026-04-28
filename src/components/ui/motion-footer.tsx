"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import gsap from "gsap";

/* ========== Magnetic Button ========== */
function MagneticButton({
  children,
  className,
  style,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
}) {
  const btnRef = useRef<HTMLAnchorElement>(null);

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

  return (
    <a
      ref={btnRef}
      href={href || "#"}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "14px 32px",
        borderRadius: "999px",
        fontWeight: 600,
        fontSize: "0.8rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        textDecoration: "none",
        cursor: "pointer",
        perspective: "600px",
        transformStyle: "preserve-3d",
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </a>
  );
}

/* ========== Marquee ========== */
function MarqueeTicker() {
  const items = [
    "Keur Gui Luxe",
    "★",
    "Haute Couture",
    "★",
    "Dakar",
    "★",
    "Teranga",
    "★",
    "Luxe Sénégalais",
    "★",
    "Élégance",
    "★",
    "Savoir-Faire",
    "★",
    "Mode Premium",
    "★",
  ];

  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "1.25rem 0",
        position: "relative",
      }}
    >
      <div
        className="animate-marquee"
        style={{
          display: "flex",
          gap: "2rem",
          whiteSpace: "nowrap",
          width: "max-content",
        }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            style={{
              fontSize: "1rem",
              fontWeight: 300,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: i % 2 === 0 ? "#fff" : "#ff007f",
              opacity: 0.6,
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ========== Main Footer ========== */
export default function MotionFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const auroraOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 0.4]);

  const footerLinks = {
    collections: ["Printemps 2025", "Soirée Prestige", "Homme", "Accessoires", "Mariage"],
    maison: ["Notre Histoire", "Ateliers", "Artisans", "Défilés", "Presse"],
    services: ["Sur Mesure", "Livraison", "Conciergerie", "Événements", "Corporate"],
  };

  return (
    <footer
      ref={footerRef}
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(to bottom, #0a0a0a, #0d000d)",
      }}
    >
      {/* Aurora Glow */}
      <motion.div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "800px",
          background:
            "radial-gradient(ellipse, rgba(255,0,127,0.15) 0%, rgba(128,0,255,0.08) 40%, transparent 70%)",
          filter: "blur(100px)",
          pointerEvents: "none",
          opacity: auroraOpacity,
        }}
      />

      <div style={{ padding: "6rem 8vw 0", position: "relative", zIndex: 2 }}>
        {/* Giant Parallax Title */}
        <motion.div
          style={{
            y: titleY,
            opacity: titleOpacity,
            marginBottom: "4rem",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(4rem, 14vw, 12rem)",
              fontWeight: 900,
              lineHeight: 0.85,
              letterSpacing: "-0.04em",
              background: "linear-gradient(135deg, #fff 0%, #ff007f 50%, #ff00ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Keur Gui
            <br />
            Luxe
          </h2>
        </motion.div>

        {/* Marquee */}
        <MarqueeTicker />

        {/* Footer Content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "3rem",
            padding: "4rem 0",
          }}
        >
          {/* Brand Column */}
          <div>
            <div style={{ marginBottom: "1.5rem" }}>
              <img
                src="/images/logo.png"
                alt="Keur Gui Luxe"
                style={{ height: "40px", width: "auto" }}
              />
            </div>
            <p
              style={{
                color: "#a0a0b0",
                fontSize: "0.9rem",
                lineHeight: 1.8,
                maxWidth: "320px",
                marginBottom: "2rem",
              }}
            >
              L'essence du luxe sénégalais. Des créations qui transcendent le temps
              et célèbrent l'héritage du Sénégal, entre Teranga et élégance.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              {["Instagram", "Pinterest", "Twitter"].map((social) => (
                <a
                  key={social}
                  href="#"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#a0a0b0",
                    fontSize: "0.7rem",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.borderColor = "#ff007f";
                    (e.target as HTMLElement).style.color = "#ff007f";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                    (e.target as HTMLElement).style.color = "#a0a0b0";
                  }}
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#ff007f",
                  marginBottom: "1.25rem",
                }}
              >
                {title}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {links.map((link) => (
                  <li key={link} style={{ marginBottom: "0.75rem" }}>
                    <a
                      href="#"
                      style={{
                        color: "#a0a0b0",
                        textDecoration: "none",
                        fontSize: "0.9rem",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.color = "#a0a0b0";
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            padding: "2rem 0 3rem",
          }}
        >
          <MagneticButton
            href="#"
            style={{
              background: "#ff007f",
              color: "#fff",
              border: "none",
            }}
          >
            Réserver un Rendez-vous
          </MagneticButton>
          <MagneticButton
            href="#"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            Nous Contacter
          </MagneticButton>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "2rem 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <p style={{ color: "#555", fontSize: "0.8rem", marginBottom: "4px" }}>
              © 2025 Keur Gui Luxe. Tous droits réservés.
            </p>
            <p style={{ color: "#777", fontSize: "0.7rem", letterSpacing: "0.02em" }}>
              Site créé par <span style={{ color: "#ff007f", fontWeight: 600 }}>Keur'Geek Digital</span> — Startup sénégalaise spécialisée dans l'IA et les solutions digitales pour les PME
            </p>
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Mentions légales", "Confidentialité", "CGV"].map((item) => (
              <a
                key={item}
                href="#"
                style={{
                  color: "#555",
                  fontSize: "0.8rem",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = "#a0a0b0";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = "#555";
                }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style jsx>{`
        @media (max-width: 768px) {
          footer > div > div:nth-child(3) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
