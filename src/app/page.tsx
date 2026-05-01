"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Component as LuminaInteractiveList } from "@/components/ui/lumina-interactive-list";
import CtaSectionWithGallery from "@/components/ui/cta-section-with-gallery";
import MotionFooter from "@/components/ui/motion-footer";
import MorphingPreloader from "@/components/ui/morphing-preloader";
import BrandStoryScroll from "@/components/ui/brand-story-scroll";
import CountdownCollection from "@/components/ui/countdown-collection";
import NewsletterCinematic from "@/components/ui/newsletter-cinematic";
import InstagramFeed from "@/components/ui/instagram-feed";
import AmbientSound from "@/components/ui/ambient-sound";
import AiStyliste from "@/components/ui/ai-styliste";
import ProductViewer3D from "@/components/ui/product-viewer-3d";
import ThemeToggle from "@/components/ui/theme-toggle";
import MagneticButton from "@/components/ui/magnetic-buttons";
import ExpandableGallery from "@/components/ui/expandable-gallery";
import { RotatingText } from "@/components/ui/rotating-text";

gsap.registerPlugin(ScrollTrigger);

/* ========== DATA ========== */
const collections = [
  { name: "Printemps Éclat", category: "Femme", img: "/images/collection-printemps.png" },
  { name: "Élégance Noire", category: "Soirée", img: "/images/collection-elegance.png" },
  { name: "Nuit Dorée", category: "Cocktail", img: "/images/collection-soiree.png" },
  { name: "Homme Prestige", category: "Homme", img: "/images/collection-homme.png" },
  { name: "Accessoires Rare", category: "Accessoires", img: "/images/collection-accessoires.png" },
  { name: "Pas Royaux", category: "Chaussures", img: "/images/collection-chaussures.png" },
  { name: "Blanc Nuptial", category: "Mariage", img: "/images/collection-mariage.png" },
  { name: "Héritage Vivant", category: "Traditionnel", img: "/images/collection-tradition.png" },
  { name: "Urban Luxe", category: "Streetwear", img: "/images/collection-streetwear.png" },
  { name: "Resort Collection", category: "Voyage", img: "/images/collection-resort.png" },
  { name: "Soies Impériales", category: "Soie", img: "/images/collection-soies.png" },
  { name: "Couture Sur Mesure", category: "Premium", img: "/images/collection-couture.png" },
];

const tendances = [
  {
    title: "Wax Réinventé",
    description: "Le tissu emblématique africain se réinvente dans des silhouettes audacieuses et contemporaines.",
    trend: "+340%",
  },
  {
    title: "Or & Terre",
    description: "Les palettes minérales inspirent des créations où l'or rencontre les terres d'Afrique.",
    trend: "+220%",
  },
  {
    title: "Silhouettes Fluides",
    description: "Le mouvement libre s'impose, des drapés majestueux aux coupes épurées.",
    trend: "+180%",
  },
  {
    title: "Broderie Digitale",
    description: "L'artisanat traditionnel fusionne avec la technologie pour des motifs révolutionnaires.",
    trend: "+290%",
  },
  {
    title: "Afro-Futurisme",
    description: "Le futur s'écrit en africain, entre innovation textile et héritage culturel.",
    trend: "+410%",
  },
  {
    title: "Minimal Luxe",
    description: "L'épure comme luxe suprême, chaque détail compte dans la simplicité raffinée.",
    trend: "+160%",
  },
];

const featuredSpecs = [
  "Soie éthiopienne tissée à la main",
  "Broderie au fil d'or 24 carats",
  "Teinture végétale naturelle",
  "120 heures de travail artisanal",
  "Édition limitée - 12 pièces",
  "Certificat d'authenticité inclus",
];

/* ========== COLLECTION CARD ========== */
function CollectionCard({ collection, index }: { collection: typeof collections[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.fromTo(
      card,
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: index * 0.05,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === card) t.kill();
      });
    };
  }, [index]);

  return (
    <div ref={cardRef} className="collection-card" style={{ opacity: 0 }}>
      <img
        src={collection.img}
        alt={collection.name}
        className="collection-card-img"
        loading="lazy"
      />
      <div className="collection-card-overlay">
        <span
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#ff007f",
            marginBottom: "0.5rem",
          }}
        >
          {collection.category}
        </span>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 700 }}>{collection.name}</h3>
      </div>
    </div>
  );
}

/* ========== TENDANCE CARD (3D tilt + glow + border anim) ========== */
function TendanceCard({ tendance, index }: { tendance: typeof tendances[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  /* Scroll-triggered entrance */
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const direction = index % 2 === 0 ? -60 : 60;

    gsap.fromTo(
      card,
      { opacity: 0, x: direction, rotateY: index % 2 === 0 ? -5 : 5 },
      {
        opacity: 1,
        x: 0,
        rotateY: 0,
        duration: 0.9,
        delay: index * 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === card) t.kill();
      });
    };
  }, [index]);

  /* 3D tilt + glow follow on mouse move */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    /* Tilt angles — max ±8° */
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 800,
    });

    /* Glow follows cursor */
    if (glow) {
      gsap.to(glow, {
        x: x - rect.width * 0.4,
        y: y - rect.height * 0.4,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, []);

  /* Touch fallback — gentle tilt based on touch position */
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !e.touches[0]) return;

    const rect = card.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.3,
      ease: "power2.out",
      transformPerspective: 800,
    });

    if (glow) {
      gsap.to(glow, {
        x: x - rect.width * 0.4,
        y: y - rect.height * 0.4,
        opacity: 0.7,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (card) {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
        transformPerspective: 800,
      });
    }
    if (glow) {
      gsap.to(glow, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className="tendance-card"
      style={{ opacity: 0, transformStyle: "preserve-3d", willChange: "transform" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
    >
      {/* Glow follower */}
      <div
        ref={glowRef}
        style={{
          position: "absolute",
          width: "80%",
          height: "80%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,0,127,0.12) 0%, rgba(212,175,55,0.06) 40%, transparent 70%)",
          pointerEvents: "none",
          opacity: 0,
          filter: "blur(30px)",
          zIndex: 0,
          transition: "none",
        }}
      />

      {/* Animated border glow */}
      <div
        className="tendance-card-border-glow"
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: "1rem",
          background: "conic-gradient(from var(--border-angle, 0deg), transparent 60%, rgba(255,0,127,0.3) 75%, rgba(212,175,55,0.3) 85%, transparent 100%)",
          zIndex: -1,
          opacity: 0,
          transition: "opacity 0.5s ease",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1.5rem",
          }}
        >
          <span className="tendance-counter">0{index + 1}</span>
          <span
            style={{
              background: "rgba(255,0,127,0.15)",
              color: "#ff007f",
              padding: "6px 14px",
              borderRadius: "999px",
              fontSize: "0.85rem",
              fontWeight: 700,
              fontFamily: "var(--font-geist-mono)",
              transition: "all 0.3s ease",
            }}
          >
            {tendance.trend}
          </span>
        </div>
        <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem", transform: "translateZ(20px)" }}>
          {tendance.title}
        </h3>
        <p style={{ color: "#a0a0b0", fontSize: "0.9rem", lineHeight: 1.7, transform: "translateZ(10px)" }}>
          {tendance.description}
        </p>
      </div>
    </div>
  );
}

/* ========== ANIMATED COUNTER ========== */
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(
      { val: 0 },
      { val: value },
      {
        val: value,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        onUpdate: function () {
          if (el) el.textContent = Math.round(this.targets()[0].val) + suffix;
        },
      }
    );
  }, [value, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

/* ========== MAIN PAGE ========== */
export default function HomePage() {
  const collectionsRef = useRef<HTMLElement>(null);
  const tendancesRef = useRef<HTMLElement>(null);
  const featuredRef = useRef<HTMLElement>(null);
  const [preloaderDone, setPreloaderDone] = useState(false);

  /* Section title animations */
  useEffect(() => {
    if (!preloaderDone) return;

    const sections = [
      { ref: collectionsRef, id: "collections-title" },
      { ref: tendancesRef, id: "tendances-title" },
      { ref: featuredRef, id: "featured-title" },
    ];

    sections.forEach(({ ref }) => {
      if (!ref.current) return;
      const title = ref.current.querySelector(".section-title");
      const label = ref.current.querySelector(".section-label");
      if (title) {
        gsap.fromTo(
          title,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: title,
              start: "top 80%",
            },
          }
        );
      }
      if (label) {
        gsap.fromTo(
          label,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: label,
              start: "top 82%",
            },
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [preloaderDone]);

  return (
    <>
      {/* Morphing Preloader */}
      <MorphingPreloader onComplete={() => setPreloaderDone(true)} />

      <main style={{ opacity: preloaderDone ? 1 : 0, transition: "opacity 1s ease", visibility: preloaderDone ? "visible" : "hidden" }}>
      {/* ========== HERO SLIDER ========== */}
      <LuminaInteractiveList />

      {/* ========== HERITAGE CTA + GALLERY ========== */}
      <CtaSectionWithGallery />

      {/* ========== NOS COLLECTIONS ========== */}
      <section
        id="collections"
        ref={collectionsRef}
        style={{ padding: "6rem 0", position: "relative" }}
      >
        <div
          className="collection-glow"
          style={{
            position: "absolute",
            top: "50%",
            left: "10%",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(255,0,255,0.04) 0%, transparent 60%)",
            filter: "blur(100px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative" }}>
          <div className="section-label" style={{ paddingLeft: "8vw" }}>Nos Collections</div>
          <h2 className="section-title" style={{ marginBottom: "3rem", paddingLeft: "8vw" }}>
            L'Art de la{" "}
            <span style={{ color: "#ff007f" }}>Couture</span>{" "}
            <RotatingText
              words={["Africaine", "Contemporaine", "Royale", "Originelle"]}
              mode="flip"
              interval={3000}
              className="section-title"
              style={{ color: "#d4af37" }}
            />
          </h2>

          <ExpandableGallery />
        </div>
      </section>

      {/* ========== TENDANCES 2025 ========== */}
      <section
        ref={tendancesRef}
        data-section-id="tendances"
        style={{
          padding: "6rem 8vw",
          background: "linear-gradient(180deg, #0a0a0a 0%, #0d000d 50%, #0a0a0a 100%)",
          position: "relative",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div className="section-label">Tendances 2025</div>
          <h2 className="section-title" style={{ marginBottom: "3rem" }}>
            Les Tendances qui{" "}
            <RotatingText
              words={["Révolutionnent", "Transforment", "Réinventent", "Redéfinissent"]}
              mode="slide"
              interval={2800}
              style={{ color: "#ff007f" }}
            />{" "}
            la Mode
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {tendances.map((tendance, i) => (
              <TendanceCard key={tendance.title} tendance={tendance} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== PRODUIT EN VEDETTE ========== */}
      <section
        ref={featuredRef}
        data-section-id="featured"
        style={{
          padding: "8rem 8vw",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="featured-glow"
          style={{
            position: "absolute",
            bottom: "-20%",
            right: "-10%",
            width: "700px",
            height: "700px",
            background: "radial-gradient(circle, rgba(255,0,127,0.06) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="featured-grid"
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
          }}
        >
          {/* Image */}
          <div className="featured-image-container" style={{ height: "clamp(300px, 50vw, 600px)" }}>
            <img
              src="/images/featured-dakar-sunset.png"
              alt="Robe Dakar Sunset - Pièce Vedette Keur Gui Luxe"
              loading="lazy"
            />
            <div
              style={{
                position: "absolute",
                bottom: "1.5rem",
                left: "1.5rem",
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(10px)",
                padding: "10px 20px",
                borderRadius: "999px",
                border: "1px solid rgba(255,0,127,0.3)",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#ff007f",
              }}
            >
              Pièce Unique
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="section-label">Produit Vedette</div>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: "0.5rem",
              }}
            >
              Robe{" "}
              <span style={{ color: "#ff007f" }}>Dakar Sunset</span>
            </h2>
            <p
              style={{
                color: "#a0a0b0",
                fontSize: "1rem",
                lineHeight: 1.8,
                marginBottom: "2rem",
              }}
            >
              Une création{" "}
              <RotatingText
                words={["magistrale", "unique", "envoûtante", "impériale"]}
                mode="blur"
                interval={2500}
                style={{ color: "#d4af37", fontWeight: 600 }}
              />
              {" "}qui capture l'essence des couchers de soleil dakarois.
              Confectionnée à la main dans nos ateliers de Dakar, cette pièce d'exception
              marie la soie éthiopienne à la broderie au fil d'or, créant une symphonie
              de lumière et de mouvement.
            </p>

            <div style={{ marginBottom: "2rem" }}>
              {featuredSpecs.map((spec, i) => (
                <div key={i} className="featured-spec">
                  <div className="featured-spec-dot" />
                  <span style={{ color: "#c0c0c8", fontSize: "0.9rem" }}>{spec}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                marginBottom: "2rem",
              }}
            >
              <span
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 800,
                  color: "#ff007f",
                  fontFamily: "var(--font-geist-mono)",
                }}
              >
                €12,500
              </span>
              <span
                style={{
                  color: "#a0a0b0",
                  fontSize: "0.85rem",
                  textDecoration: "line-through",
                }}
              >
                €15,000
              </span>
            </div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <MagneticButton variant="primary" href="#">
                Commander
              </MagneticButton>
              <MagneticButton variant="secondary" href="#">
                Détails
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      {/* ========== 3D PRODUCT VIEWER ========== */}
      <section
        data-section-id="3d-viewer"
        style={{
          padding: "6rem 8vw",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(180deg, #0a0a0a 0%, #0d0011 50%, #0a0a0a 100%)",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(212,175,55,0.04) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "600px", width: "100%", position: "relative", zIndex: 1 }}>
          <div className="section-label" style={{ textAlign: "center" }}>Visualisation 3D</div>
          <h2 className="section-title" style={{ marginBottom: "2rem", textAlign: "center" }}>
            Explorez en <span style={{ color: "#d4af37" }}>3 Dimensions</span>
          </h2>
          <ProductViewer3D />
        </div>
      </section>

      {/* ========== BRAND STORY SCROLL ========== */}
      <BrandStoryScroll />

      {/* ========== COUNTDOWN COLLECTION ========== */}
      <CountdownCollection />

      {/* ========== INSTAGRAM FEED ========== */}
      <InstagramFeed />

      {/* ========== NEWSLETTER CINEMATIQUE ========== */}
      <NewsletterCinematic />

      {/* ========== FOOTER CINEMATIQUE ========== */}
      <MotionFooter />

      {/* ========== FLOATING UI — Ambient Sound + AI Styliste + Theme Toggle ========== */}
      <AmbientSound />
      <AiStyliste />
      <ThemeToggle />

      {/* ========== MOBILE RESPONSIVE OVERRIDES ========== */}
      <style>{`
        @media (max-width: 768px) {
          .featured-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .featured-image-container {
            height: clamp(250px, 60vw, 400px) !important;
          }
          .tendance-card {
            padding: 1.25rem !important;
          }
          .tendance-counter {
            font-size: 2rem !important;
          }
          #collections section,
          section[data-section-id="tendances"],
          section[data-section-id="featured"],
          section[data-section-id="3d-viewer"] {
            padding-left: 4vw !important;
            padding-right: 4vw !important;
          }
          .collection-glow,
          .featured-glow {
            width: 300px !important;
            height: 300px !important;
          }
        }
        @media (max-width: 480px) {
          .tendance-card {
            padding: 1rem !important;
          }
          .tendance-counter {
            font-size: 1.5rem !important;
          }
        }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .tendance-card,
          .tendance-card-border-glow,
          .morph-particle {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </main>
    </>
  );
}
