"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   Brand Story Scroll — Scroll-driven narrative with GSAP pinning
   4 chapters: Les Racines, L'Atelier, Le Défilé, L'Avenir
   ================================================================ */

interface Chapter {
  number: string;
  title: string;
  text: string;
  image: string;
  bgGradient: string;
}

const chapters: Chapter[] = [
  {
    number: "01",
    title: "Les Racines",
    text: "Tout a commencé dans les rues animées de Dakar, où les tissus vibrants racontaient des histoires millénaires. En 1995, Keur Gui Luxe naît de cette fusion entre tradition wolof et vision contemporaine, porté par la conviction que la mode africaine mérite sa place sur les plus grandes scènes mondiales.",
    image: "/images/gallery-heritage-2.png",
    bgGradient: "linear-gradient(135deg, #0a0a0a 0%, #1a1008 50%, #0a0a0a 100%)",
  },
  {
    number: "02",
    title: "L'Atelier",
    text: "Dans nos ateliers de la Médina, 150 artisans perpétuent un savoir-faire transmis de génération en génération. Chaque point de broderie, chaque coup de ciseaux est un acte de création conscient. 120 heures de travail artisanal pour une seule pièce, car l'excellence ne connaît pas de raccourci.",
    image: "/images/gallery-heritage-1.png",
    bgGradient: "linear-gradient(135deg, #0a0a0a 0%, #0d0a14 50%, #0a0a0a 100%)",
  },
  {
    number: "03",
    title: "Le Défilé",
    text: "De Dakar à Paris, de Milan à Tokyo, nos créations ont parcouru le monde. Chaque défilé est une célébration de l'identité africaine réinventée, où les motifs ancestraux dialoguent avec les silhouettes avant-gardistes. La mode devient langage universel.",
    image: "/images/gallery-heritage-4.png",
    bgGradient: "linear-gradient(135deg, #0a0a0a 0%, #140a08 50%, #0a0a0a 100%)",
  },
  {
    number: "04",
    title: "L'Avenir",
    text: "Le futur s'écrit en africain. Keur Gui Luxe investit dans l'innovation textile, les teintures végétales et la mode circulaire. Notre vision : prouver que le luxe durable et l'héritage culturel sont les piliers de la mode de demain. L'Afrique n'est plus l'inspiration, elle est l'inspiratrice.",
    image: "/images/gallery-heritage-3.png",
    bgGradient: "linear-gradient(135deg, #0a0a0a 0%, #08100a 50%, #0a0a0a 100%)",
  },
];

export default function BrandStoryScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chapterSections = container.querySelectorAll(".brand-story-chapter");

    chapterSections.forEach((chapter, index) => {
      const textEl = chapter.querySelector(".brand-story-text");
      const imageEl = chapter.querySelector(".brand-story-image");
      const numberEl = chapter.querySelector(".brand-story-number");

      // Pin each chapter and animate content
      ScrollTrigger.create({
        trigger: chapter as Element,
        start: "top top",
        end: "+=100%",
        pin: true,
        pinSpacing: true,
        onEnter: () => setActiveChapter(index),
        onEnterBack: () => setActiveChapter(index),
      });

      // Text animates from left
      if (textEl) {
        gsap.fromTo(
          textEl,
          { x: -80, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: chapter as Element,
              start: "top 80%",
              end: "top 30%",
              scrub: 1,
            },
          }
        );
      }

      // Image animates from right with parallax
      if (imageEl) {
        gsap.fromTo(
          imageEl,
          { x: 80, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: chapter as Element,
              start: "top 80%",
              end: "top 30%",
              scrub: 1,
            },
          }
        );

        // Parallax on the image
        gsap.to(imageEl, {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: chapter as Element,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      // Chapter number fades in
      if (numberEl) {
        gsap.fromTo(
          numberEl,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 0.04,
            scale: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: chapter as Element,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Section Header */}
      <div
        style={{
          padding: "6rem 8vw 2rem",
          position: "relative",
        }}
      >
        <div className="section-label">Notre Histoire</div>
        <h2
          className="section-title"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
          }}
        >
          L'Histoire{" "}
          <span style={{ color: "#d4af37" }}>Keur Gui Luxe</span>
        </h2>
      </div>

      {/* Progress Dots */}
      <div
        style={{
          position: "fixed",
          right: "2vw",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {chapters.map((ch, i) => (
          <div
            key={ch.number}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
            onClick={() => {
              const target = document.getElementById(`chapter-${i}`);
              if (target) {
                target.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            <span
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: i === activeChapter ? "#d4af37" : "rgba(255,255,255,0.3)",
                transition: "color 0.4s ease",
                whiteSpace: "nowrap",
                fontFamily: "var(--font-geist-mono)",
              }}
            >
              {ch.title}
            </span>
            <div
              style={{
                width: i === activeChapter ? "12px" : "8px",
                height: i === activeChapter ? "12px" : "8px",
                borderRadius: "50%",
                background: i === activeChapter ? "#d4af37" : "rgba(255,255,255,0.15)",
                boxShadow:
                  i === activeChapter
                    ? "0 0 12px rgba(212,175,55,0.6), 0 0 24px rgba(212,175,55,0.3)"
                    : "none",
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Chapters */}
      {chapters.map((chapter, index) => (
        <div
          key={chapter.number}
          id={`chapter-${index}`}
          className="brand-story-chapter"
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem 8vw",
            background: chapter.bgGradient,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Large chapter number in background */}
          <div
            className="brand-story-number"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "clamp(12rem, 25vw, 30rem)",
              fontWeight: 900,
              color: "#fff",
              opacity: 0,
              lineHeight: 1,
              pointerEvents: "none",
              userSelect: "none",
              fontFamily: "var(--font-geist-mono)",
              zIndex: 0,
            }}
          >
            {chapter.number}
          </div>

          {/* Decorative line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "8vw",
              right: "8vw",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)",
            }}
          />

          {/* Content */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4rem",
              alignItems: "center",
              maxWidth: "1400px",
              width: "100%",
              position: "relative",
              zIndex: 1,
            }}
            className="brand-story-content-grid"
          >
            {/* Text side */}
            <div
              className="brand-story-text"
              style={{ opacity: 0, willChange: "transform, opacity" }}
            >
              <div
                style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#d4af37",
                  marginBottom: "1.5rem",
                }}
              >
                Chapitre {chapter.number}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display), 'Cormorant Garamond', serif",
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  fontWeight: 300,
                  lineHeight: 1.1,
                  color: "#fff",
                  marginBottom: "2rem",
                }}
              >
                {chapter.title}
              </h3>
              <p
                style={{
                  fontSize: "clamp(0.9rem, 1.1vw, 1.1rem)",
                  lineHeight: 1.9,
                  color: "rgba(255,255,255,0.65)",
                  maxWidth: "520px",
                }}
              >
                {chapter.text}
              </p>

              {/* Decorative gold line */}
              <div
                style={{
                  width: "60px",
                  height: "1px",
                  background: "#d4af37",
                  marginTop: "2rem",
                }}
              />
            </div>

            {/* Image side */}
            <div
              className="brand-story-image"
              style={{
                opacity: 0,
                willChange: "transform, opacity",
                position: "relative",
              }}
            >
              <div
                style={{
                  borderRadius: "1rem",
                  overflow: "hidden",
                  aspectRatio: "4/5",
                  position: "relative",
                  boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.1)",
                }}
              >
                <img
                  src={chapter.image}
                  alt={`${chapter.title} — Keur Gui Luxe`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  }}
                  loading="lazy"
                />
                {/* Gradient overlay at bottom of image */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* Gold accent border */}
              <div
                style={{
                  position: "absolute",
                  top: "-1px",
                  right: "-1px",
                  width: "40%",
                  height: "2px",
                  background: "linear-gradient(90deg, transparent, #d4af37)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "-1px",
                  right: "-1px",
                  width: "2px",
                  height: "40%",
                  background: "linear-gradient(180deg, #d4af37, transparent)",
                }}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Responsive styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .brand-story-content-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .brand-story-chapter {
            padding: 3rem 5vw !important;
          }
        }
      `}</style>
    </section>
  );
}
