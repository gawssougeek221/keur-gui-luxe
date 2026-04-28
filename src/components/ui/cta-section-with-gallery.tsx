"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";

const heritageImages = [
  { src: "/images/gallery-heritage-1.png", alt: "Heritage - Tissage traditionnel" },
  { src: "/images/gallery-heritage-2.png", alt: "Heritage - Broderie artisanale" },
  { src: "/images/gallery-heritage-3.png", alt: "Heritage - Motifs ancestraux" },
  { src: "/images/gallery-heritage-4.png", alt: "Heritage - Soieries d'Afrique" },
];

const stats = [
  { value: "30+", label: "Années d'excellence" },
  { value: "150", label: "Artisans experts" },
  { value: "12", label: "Collections par an" },
  { value: "48", label: "Pays desservis" },
];

export default function CtaSectionWithGallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: "100vh",
        padding: "6rem 8vw",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "30%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(255,0,127,0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {/* Left: CTA Content */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="section-label">Notre Héritage</div>
          <h2
            style={{
              fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: "1.5rem",
            }}
          >
            Un Héritage{" "}
            <span style={{ color: "#ff007f" }}>Millénaire</span>
          </h2>
          <p
            style={{
              color: "#a0a0b0",
              fontSize: "1.05rem",
              lineHeight: 1.8,
              marginBottom: "2rem",
              maxWidth: "480px",
            }}
          >
            Depuis trois décennies, AfriqueLuxe incarne l'excellence de la haute couture africaine.
            Chaque création est le fruit d'un savoir-faire ancestral transmis de génération en génération,
            marié à une vision résolument contemporaine. Nos artisans, héritiers de techniques séculaires,
            transforment les plus belles étoffes en oeuvres d'art vestimentaires.
          </p>

          {/* Stats Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1.5rem",
              marginBottom: "2.5rem",
            }}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                style={{
                  padding: "1.25rem",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "#ff007f",
                    fontFamily: "var(--font-geist-mono)",
                    lineHeight: 1.2,
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ color: "#a0a0b0", fontSize: "0.85rem", marginTop: "4px" }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.a
            href="#collections"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "16px 40px",
              background: "transparent",
              color: "#ff007f",
              border: "1px solid #ff007f",
              borderRadius: "999px",
              fontWeight: 600,
              fontSize: "0.875rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Explorer l'Héritage
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 7h12M8 3l5 4-5 4" />
            </svg>
          </motion.a>
        </motion.div>

        {/* Right: Gallery Grid */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ height: "600px" }}
        >
          <div className="heritage-gallery">
            {heritageImages.map((img, i) => (
              <motion.div
                key={img.src}
                className="heritage-gallery-item"
                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                animate={isInView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <img src={img.src} alt={img.alt} loading="lazy" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Responsive override for mobile */}
      <style jsx>{`
        @media (max-width: 768px) {
          section > div:last-of-type {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
