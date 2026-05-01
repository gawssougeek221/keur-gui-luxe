"use client";

import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import React, { useState, useId, useRef } from "react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

// African haute couture collection photos
const PHOTOS = [
  {
    id: "collection-printemps",
    src: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=900&auto=format&fit=crop&q=60&q=80&w=800",
    alt: "Printemps Éclat - Collection Haute Couture",
    rotation: -12,
    x: -85,
    y: 8,
    zIndex: 10,
  },
  {
    id: "collection-elegance",
    src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=60&q=80&w=800",
    alt: "Élégance Noire - Collection Soirée",
    rotation: -2,
    x: -8,
    y: -12,
    zIndex: 20,
  },
  {
    id: "collection-soiree",
    src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&auto=format&fit=crop&q=60&q=80&w=800",
    alt: "Nuit Dorée - Collection Cocktail",
    rotation: 10,
    x: 70,
    y: 4,
    zIndex: 30,
  },
  {
    id: "collection-homme",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=60&q=80&w=800",
    alt: "Homme Prestige - Collection Homme",
  },
  {
    id: "collection-accessoires",
    src: "https://images.unsplash.com/photo-1611923134239-b9be5816e23c?w=900&auto=format&fit=crop&q=60&q=80&w=800",
    alt: "Accessoires Rare - Bijoux et Sacs",
  },
  {
    id: "collection-chaussures",
    src: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900&auto=format&fit=crop&q=60&q=80&w=800",
    alt: "Pas Royaux - Chaussures Luxe",
  },
  {
    id: "collection-mariage",
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop&q=60&q=80&w=800",
    alt: "Blanc Nuptial - Collection Mariage",
  },
  {
    id: "collection-tradition",
    src: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d44?w=900&auto=format&fit=crop&q=60&q=80&w=800",
    alt: "Héritage Vivant - Traditionnel",
  },
  {
    id: "collection-streetwear",
    src: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=900&auto=format&fit=crop&q=60&q=80&w=800",
    alt: "Urban Luxe - Streetwear Premium",
  },
];

const transition = {
  type: "spring",
  stiffness: 160,
  damping: 18,
  mass: 1,
} as const;

export function ExpandableGallery() {
  const [isExpanded, setIsExpanded] = useState(false);
  const layoutGroupId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(containerRef, () => {
    if (isExpanded) {
      setIsExpanded(false);
    }
  });

  return (
    <section
      className="relative w-full px-4 md:px-8 flex flex-col items-center justify-start min-h-[850px] overflow-hidden"
      style={{ background: "transparent" }}
    >
      <LayoutGroup id={layoutGroupId}>
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
          <div className="w-full h-12 flex items-center justify-between px-4 mb-2">
            <AnimatePresence>
              {isExpanded && (
                <motion.button
                  key="back-button"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={() => setIsExpanded(false)}
                  className="flex items-center gap-2 transition-all group z-50"
                  style={{ color: "#a0a0b0" }}
                >
                  <div
                    className="p-2 rounded-full transition-colors"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      color: "#fff",
                    }}
                  >
                    <HugeiconsIcon
                      icon={ArrowLeft01Icon}
                      width={20}
                      height={20}
                    />
                  </div>
                  <span className="font-medium" style={{ fontSize: "0.85rem" }}>
                    Retour
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <motion.div
            ref={containerRef}
            layout
            className={cn(
              "relative w-full",
              isExpanded
                ? "grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4"
                : "flex flex-col items-center justify-start pt-4"
            )}
            transition={transition}
          >
            <div
              className={cn(
                "relative",
                isExpanded
                  ? "contents"
                  : "h-[450px] w-full flex items-center justify-center mb-8"
              )}
            >
              {PHOTOS.map((photo, index) => {
                const isPrimary = index < 3;
                if (!isPrimary && !isExpanded) return null;

                return (
                  <motion.div
                    key={`card-${photo.id}`}
                    layoutId={`card-container-${photo.id}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: !isExpanded ? photo.rotation || 0 : 0,
                      x: !isExpanded ? photo.x || 0 : 0,
                      y: !isExpanded ? photo.y || 0 : 0,
                      zIndex: !isExpanded ? photo.zIndex || index : 10,
                    }}
                    transition={transition}
                    whileHover={
                      !isExpanded
                        ? {
                            scale: 1.05,
                            y: (photo.y || 0) - 15,
                            rotate: (photo.rotation || 0) * 0.8,
                            zIndex: 50,
                            transition: {
                              type: "spring",
                              stiffness: 400,
                              damping: 25,
                            },
                          }
                        : { scale: 1.02 }
                    }
                    className={cn(
                      "cursor-pointer overflow-hidden",
                      isExpanded
                        ? "relative aspect-square rounded-[2rem] md:rounded-[3rem] border-4 md:border-[6px] shadow-lg"
                        : "absolute w-44 h-44 md:w-60 md:h-60 rounded-[2.5rem] md:rounded-[3rem] border-[6px] shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
                    )}
                    style={
                      isExpanded
                        ? {
                            borderColor: "rgba(10,10,10,0.8)",
                            background: "rgba(255,255,255,0.04)",
                          }
                        : {
                            borderColor: "#0a0a0a",
                            background: "rgba(255,255,255,0.04)",
                          }
                    }
                    onClick={() => !isExpanded && setIsExpanded(true)}
                  >
                    <motion.div
                      layoutId={`image-inner-${photo.id}`}
                      layout="position"
                      className="w-full h-full relative"
                      transition={transition}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        className="object-cover select-none pointer-events-none"
                        sizes={
                          isExpanded
                            ? "(max-width: 1024px) 50vw, 33vw"
                            : "240px"
                        }
                        priority={isPrimary}
                      />
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            <AnimatePresence>
              {!isExpanded && (
                <motion.div
                  key="stack-content"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center max-w-2xl space-y-8"
                >
                  <h2
                    className="font-normal tracking-tight leading-tight"
                    style={{
                      fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
                      color: "rgba(255,255,255,0.9)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    L&apos;art ne se porte pas, il se vit.{" "}
                    <br className="hidden md:block" />
                    Chaque pièce raconte une histoire.
                  </h2>

                  <div className="flex justify-center">
                    <Button
                      onClick={() => setIsExpanded(true)}
                      className="rounded-full cursor-pointer py-6 px-8 font-normal group"
                      style={{
                        background: "linear-gradient(135deg, #d4af37, #ff007f)",
                        border: "none",
                        color: "#fff",
                        fontSize: "0.85rem",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Explorer nos collections
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        className="transition-transform group-hover:translate-x-1"
                        width={20}
                        height={20}
                      />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </LayoutGroup>
    </section>
  );
}

export default ExpandableGallery;
