"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ================================================================
   Instagram Feed — Mock grid with hover overlays & GSAP stagger
   6 posts in 3x2 grid
   ================================================================ */

interface InstagramPost {
  image: string;
  likes: string;
  comments: number;
  alt: string;
}

const posts: InstagramPost[] = [
  {
    image: "/images/collection-printemps.png",
    likes: "2.4K",
    comments: 89,
    alt: "Collection Printemps — Keur Gui Luxe",
  },
  {
    image: "/images/collection-soiree.png",
    likes: "3.1K",
    comments: 124,
    alt: "Collection Soirée — Keur Gui Luxe",
  },
  {
    image: "/images/collection-elegance.png",
    likes: "1.8K",
    comments: 67,
    alt: "Collection Élégance — Keur Gui Luxe",
  },
  {
    image: "/images/collection-mariage.png",
    likes: "4.2K",
    comments: 201,
    alt: "Collection Mariage — Keur Gui Luxe",
  },
  {
    image: "/images/collection-tradition.png",
    likes: "2.9K",
    comments: 156,
    alt: "Collection Tradition — Keur Gui Luxe",
  },
  {
    image: "/images/collection-soies.png",
    likes: "1.5K",
    comments: 54,
    alt: "Collection Soies — Keur Gui Luxe",
  },
];

/* Heart icon SVG */
function HeartIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/* Comment icon SVG */
function CommentIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

/* Instagram icon SVG */
function InstagramIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function InstagramCard({ post, index }: { post: InstagramPost; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.fromTo(
      card,
      { opacity: 0, y: 50, scale: 0.92 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        delay: index * 0.1,
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
    <div
      ref={cardRef}
      style={{
        position: "relative",
        borderRadius: "0.75rem",
        overflow: "hidden",
        aspectRatio: "1/1",
        cursor: "pointer",
        background: "#111118",
        border: "1px solid rgba(255,255,255,0.05)",
        opacity: 0,
      }}
      className="instagram-card"
    >
      {/* Image */}
      <img
        src={post.image}
        alt={post.alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
        loading="lazy"
      />

      {/* Bottom gradient overlay (always visible, Instagram-style) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Hover overlay */}
      <div
        className="instagram-hover-overlay"
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          opacity: 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          <HeartIcon />
          <span>{post.likes}</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          <CommentIcon />
          <span>{post.comments}</span>
        </div>
      </div>
    </div>
  );
}

export default function InstagramFeed() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const title = section.querySelector(".ig-title");
    if (title) {
      gsap.fromTo(
        title,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: title,
            start: "top 85%",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        padding: "6rem 8vw",
        background: "linear-gradient(180deg, #0a0a0a 0%, #0d0008 50%, #0a0a0a 100%)",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "10%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 60%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div
          className="ig-title"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "3rem",
            opacity: 0,
          }}
        >
          <InstagramIcon />
          <h3
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: "1rem",
              letterSpacing: "0.1em",
              color: "#fff",
              fontWeight: 400,
            }}
          >
            @keurguiluxe
          </h3>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
          }}
          className="instagram-grid"
        >
          {posts.map((post, i) => (
            <InstagramCard key={post.image} post={post} index={i} />
          ))}
        </div>

        {/* CTA Button */}
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <a
            href="#"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 32px",
              background: "transparent",
              color: "#d4af37",
              border: "1px solid rgba(212,175,55,0.3)",
              borderRadius: "999px",
              fontWeight: 600,
              fontSize: "0.8rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "all 0.4s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = "rgba(212,175,55,0.08)";
              el.style.borderColor = "#d4af37";
              el.style.boxShadow = "0 0 20px rgba(212,175,55,0.15)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = "transparent";
              el.style.borderColor = "rgba(212,175,55,0.3)";
              el.style.boxShadow = "none";
            }}
          >
            <InstagramIcon />
            Voir plus sur Instagram
          </a>
        </div>
      </div>

      {/* Hover effect styles + responsive */}
      <style jsx>{`
        .instagram-card:hover img {
          transform: scale(1.08);
        }
        .instagram-card:hover .instagram-hover-overlay {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .instagram-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.75rem !important;
          }
        }

        @media (max-width: 480px) {
          .instagram-grid {
            grid-template-columns: 1fr !important;
            gap: 0.75rem !important;
          }
        }
      `}</style>
    </section>
  );
}
