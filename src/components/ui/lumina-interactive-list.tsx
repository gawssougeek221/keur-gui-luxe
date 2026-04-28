"use client";

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import * as THREE from "three";

/* ========== GLSL SHADERS ========== */

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glassFragment = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform sampler2D uTexture;
  uniform float uTransition;
  uniform vec3 uAccent;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.3;
    vec2 distortion = vec2(
      sin(uv.y * 10.0 + t) * 0.015,
      cos(uv.x * 10.0 + t) * 0.015
    );
    vec4 tex = texture2D(uTexture, uv + distortion);
    float frost = sin(uv.x * 40.0 + t * 2.0) * cos(uv.y * 40.0 + t * 1.5) * 0.04;
    vec3 col = tex.rgb + frost;
    col += uAccent * 0.08 * (1.0 + sin(t * 2.0));
    float vig = 1.0 - smoothstep(0.3, 1.2, length(uv - 0.5));
    col *= vig;
    col = mix(col, col * 0.3, uTransition);
    gl_FragColor = vec4(col, 1.0);
  }
`;

const frostFragment = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform sampler2D uTexture;
  uniform float uTransition;
  uniform vec3 uAccent;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.2;
    float noise = hash(floor(uv * 60.0) + floor(t * 3.0));
    vec2 frostUv = uv + vec2(noise - 0.5) * 0.03;
    vec4 tex = texture2D(uTexture, frostUv);
    vec3 frost = vec3(0.85, 0.88, 0.95) * noise * 0.3;
    vec3 col = mix(tex.rgb, frost, 0.2 + sin(t) * 0.1);
    col += uAccent * 0.05;
    col = mix(col, col * 0.3, uTransition);
    gl_FragColor = vec4(col, 1.0);
  }
`;

const rippleFragment = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform sampler2D uTexture;
  uniform float uTransition;
  uniform vec3 uAccent;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float t = uTime;
    vec2 center = vec2(0.5);
    float dist = length(uv - center);
    float ripple = sin(dist * 30.0 - t * 3.0) * 0.02 / (dist * 4.0 + 1.0);
    vec2 rippleUv = uv + normalize(uv - center) * ripple;
    vec4 tex = texture2D(uTexture, rippleUv);
    vec3 col = tex.rgb;
    col += uAccent * 0.1 * sin(dist * 10.0 - t * 2.0) * 0.5;
    float vig = 1.0 - smoothstep(0.2, 1.0, dist);
    col *= 0.8 + vig * 0.4;
    col = mix(col, col * 0.3, uTransition);
    gl_FragColor = vec4(col, 1.0);
  }
`;

const plasmaFragment = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform sampler2D uTexture;
  uniform float uTransition;
  uniform vec3 uAccent;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.5;
    float plasma = sin(uv.x * 10.0 + t) + sin(uv.y * 10.0 + t);
    plasma += sin((uv.x + uv.y) * 10.0 + t * 1.5);
    plasma += sin(length(uv - 0.5) * 20.0 - t * 2.0);
    plasma *= 0.25;
    vec2 plasmaUv = uv + vec2(sin(plasma), cos(plasma)) * 0.015;
    vec4 tex = texture2D(uTexture, plasmaUv);
    vec3 col = tex.rgb;
    col += uAccent * 0.15 * (0.5 + 0.5 * sin(plasma));
    col = mix(col, col * 0.3, uTransition);
    gl_FragColor = vec4(col, 1.0);
  }
`;

const timeshiftFragment = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform sampler2D uTexture;
  uniform float uTransition;
  uniform vec3 uAccent;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.4;
    float shift = sin(t) * 0.008;
    float r = texture2D(uTexture, uv + vec2(shift, 0.0)).r;
    float g = texture2D(uTexture, uv).g;
    float b = texture2D(uTexture, uv - vec2(shift, 0.0)).b;
    vec3 col = vec3(r, g, b);
    float scanline = sin(uv.y * 800.0) * 0.03;
    col -= scanline;
    col += uAccent * 0.06 * sin(t * 3.0);
    float glitch = step(0.98, sin(uv.y * 100.0 + t * 10.0));
    col += glitch * 0.1;
    col = mix(col, col * 0.3, uTransition);
    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ========== SLIDER CONFIG ========== */

const fragmentShaders = [glassFragment, frostFragment, rippleFragment, plasmaFragment, timeshiftFragment];

interface SlideConfig {
  title: string;
  subtitle: string;
  description: string;
  accent: [number, number, number];
  shaderIndex: number;
}

const SLIDER_CONFIG: SlideConfig[] = [
  {
    title: "AfriqueLuxe",
    subtitle: "Haute Couture Africaine",
    description: "L'essence du luxe africain, redéfinie pour le monde moderne.",
    accent: [1.0, 0.0, 0.5],
    shaderIndex: 0,
  },
  {
    title: "Héritage",
    subtitle: "Collections Printemps 2025",
    description: "Des créations qui célèbrent l'héritage ancestral avec une vision contemporaine.",
    accent: [1.0, 0.0, 1.0],
    shaderIndex: 1,
  },
  {
    title: "Élégance",
    subtitle: "Soirées Prestige",
    description: "L'art de la haute couture africaine dans sa forme la plus raffinée.",
    accent: [0.5, 0.0, 1.0],
    shaderIndex: 2,
  },
  {
    title: "Avant-Garde",
    subtitle: "Tendances 2025",
    description: "Repousser les frontières de la mode avec audace et créativité.",
    accent: [1.0, 0.0, 0.5],
    shaderIndex: 3,
  },
  {
    title: "Savoir-Faire",
    subtitle: "Artisanat d'Exception",
    description: "Chaque pièce est une oeuvre d'art, façonnée par des mains expertes.",
    accent: [0.8, 0.0, 1.0],
    shaderIndex: 4,
  },
  {
    title: "Dakar",
    subtitle: "Fashion Week 2025",
    description: "Le monde contemple la capitale du style africain.",
    accent: [1.0, 0.0, 0.5],
    shaderIndex: 0,
  },
];

/* ========== COMPONENT ========== */

export default function LuminaInteractiveList() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);
  const animFrameRef = useRef<number>(0);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---- Text Split ---- */
  const splitText = useCallback((text: string) => {
    return text.split("").map((char, i) => (
      <span
        key={i}
        className="char"
        style={{
          display: "inline-block",
          transitionDelay: `${i * 40}ms`,
        }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  }, []);

  /* ---- Animate Characters ---- */
  const animateChars = useCallback((container: HTMLElement | null, show: boolean) => {
    if (!container) return;
    const chars = container.querySelectorAll(".char");
    chars.forEach((char, i) => {
      const el = char as HTMLElement;
      setTimeout(() => {
        if (show) {
          el.classList.add("visible");
        } else {
          el.classList.remove("visible");
        }
      }, show ? i * 40 : 0);
    });
  }, []);

  /* ---- Init Three.js ---- */
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(rect.width, rect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const clock = new THREE.Clock();
    clockRef.current = clock;

    /* Load background texture */
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("/images/hero-bg.png");
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const config = SLIDER_CONFIG[0];
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: fragmentShaders[config.shaderIndex],
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(rect.width, rect.height) },
        uTexture: { value: texture },
        uTransition: { value: 0 },
        uAccent: { value: new THREE.Vector3(...config.accent) },
      },
    });
    materialRef.current = material;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    /* Animate */
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      if (clockRef.current && materialRef.current) {
        materialRef.current.uniforms.uTime.value = clockRef.current.getElapsedTime();
      }
      renderer.render(scene, camera);
    };
    animate();

    /* Resize */
    const onResize = () => {
      const r = container.getBoundingClientRect();
      renderer.setSize(r.width, r.height);
      if (materialRef.current) {
        materialRef.current.uniforms.uResolution.value.set(r.width, r.height);
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, []);

  /* ---- Slide Change ---- */
  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentSlide) return;
      setIsTransitioning(true);

      const titleEl = document.getElementById(`slide-title-${currentSlide}`);

      /* Fade out current chars */
      if (titleEl) animateChars(titleEl, false);

      /* Transition shader */
      if (materialRef.current) {
        const mat = materialRef.current;
        const startTransition = mat.uniforms.uTransition.value;
        const startTime = performance.now();
        const duration = 600;

        const transitionOut = () => {
          const elapsed = performance.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          mat.uniforms.uTransition.value = startTransition + progress * 0.7;

          if (progress < 1) {
            requestAnimationFrame(transitionOut);
          } else {
            /* Switch slide */
            setCurrentSlide(index);

            /* Update shader */
            const config = SLIDER_CONFIG[index];
            mat.fragmentShader = fragmentShaders[config.shaderIndex];
            mat.uniforms.uAccent.value.set(...config.accent);
            mat.needsUpdate = true;

            /* Transition back in */
            const startTime2 = performance.now();
            const transitionIn = () => {
              const elapsed2 = performance.now() - startTime2;
              const progress2 = Math.min(elapsed2 / duration, 1);
              mat.uniforms.uTransition.value = 0.7 * (1 - progress2);

              if (progress2 < 1) {
                requestAnimationFrame(transitionIn);
              } else {
                setIsTransitioning(false);
              }
            };
            requestAnimationFrame(transitionIn);
          }
        };
        requestAnimationFrame(transitionOut);
      } else {
        setCurrentSlide(index);
        setIsTransitioning(false);
      }
    },
    [currentSlide, isTransitioning, animateChars]
  );

  /* ---- Auto-slide ---- */
  useEffect(() => {
    const startTimer = () => {
      timerRef.current = setTimeout(() => {
        const next = (currentSlide + 1) % SLIDER_CONFIG.length;
        goToSlide(next);
      }, 5000);
    };

    startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSlide, goToSlide]);

  /* ---- Animate chars on slide change ---- */
  useEffect(() => {
    setTimeout(() => {
      const titleEl = document.getElementById(`slide-title-${currentSlide}`);
      animateChars(titleEl, true);
    }, 100);
  }, [currentSlide, animateChars]);

  /* ---- Keyboard nav ---- */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        goToSlide((currentSlide + 1) % SLIDER_CONFIG.length);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        goToSlide((currentSlide - 1 + SLIDER_CONFIG.length) % SLIDER_CONFIG.length);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentSlide, goToSlide]);

  const currentConfig = SLIDER_CONFIG[currentSlide];

  return (
    <div ref={containerRef} className="hero-slider">
      <canvas ref={canvasRef} />

      {/* Content */}
      <div className="slider-content">
        <div style={{ maxWidth: "700px" }}>
          <div className="slide-subtitle">{currentConfig.subtitle}</div>
          <div id={`slide-title-${currentSlide}`} className="slide-title">
            {splitText(currentConfig.title)}
          </div>
          <p className="slide-description">{currentConfig.description}</p>
          <div style={{ marginTop: "2rem" }}>
            <a
              href="#collections"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 36px",
                background: "#ff007f",
                color: "#fff",
                borderRadius: "999px",
                fontWeight: 600,
                fontSize: "0.875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                textDecoration: "none",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = "#ff00ff";
                (e.target as HTMLElement).style.boxShadow = "0 0 30px rgba(255,0,127,0.5)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = "#ff007f";
                (e.target as HTMLElement).style.boxShadow = "none";
              }}
            >
              Découvrir
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="slider-nav">
        {SLIDER_CONFIG.map((_, i) => (
          <button
            key={i}
            className={`slider-nav-dot ${i === currentSlide ? "active" : ""}`}
            onClick={() => goToSlide(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="slide-counter">
        <span className="slide-counter-current">
          {String(currentSlide + 1).padStart(2, "0")}
        </span>
        <span className="slide-counter-total">/{String(SLIDER_CONFIG.length).padStart(2, "0")}</span>
      </div>

      {/* Bottom gradient overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "200px",
          background: "linear-gradient(to top, #000, transparent)",
          zIndex: 5,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
