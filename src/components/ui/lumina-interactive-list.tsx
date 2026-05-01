"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";

export function Component() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // --- WebGL capability check ---
    const isWebGLAvailable = () => {
      try {
        const canvas = document.createElement("canvas");
        return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
      } catch {
        return false;
      }
    };

    // --- Mobile detection for performance tuning ---
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;

    if (!isWebGLAvailable()) {
      // Fallback: show first slide as static background
      const wrapper = containerRef.current?.querySelector(".slider-wrapper");
      if (wrapper) {
        wrapper.classList.add("loaded");
        wrapper.style.backgroundImage = `url(/images/slide-senegal-1.png)`;
        wrapper.style.backgroundSize = "cover";
        wrapper.style.backgroundPosition = "center";
      }
      return;
    }

    // --- MAIN LOGIC ---
    const SLIDER_CONFIG: Record<string, any> = {
      settings: {
        transitionDuration: 2.5,
        autoSlideSpeed: 5000,
        currentEffect: "glass",
        currentEffectPreset: "Default",
        globalIntensity: 1.0,
        speedMultiplier: 1.0,
        distortionStrength: 1.0,
        colorEnhancement: 1.0,
        glassRefractionStrength: 1.0,
        glassChromaticAberration: 1.0,
        glassBubbleClarity: 1.0,
        glassEdgeGlow: 1.0,
        glassLiquidFlow: 1.0,
        frostIntensity: 1.5,
        frostCrystalSize: 1.0,
        frostIceCoverage: 1.0,
        frostTemperature: 1.0,
        frostTexture: 1.0,
        rippleFrequency: 25.0,
        rippleAmplitude: 0.08,
        rippleWaveSpeed: 1.0,
        rippleRippleCount: 1.0,
        rippleDecay: 1.0,
        plasmaIntensity: 1.2,
        plasmaSpeed: 0.8,
        plasmaEnergyIntensity: 0.4,
        plasmaContrastBoost: 0.3,
        plasmaTurbulence: 1.0,
        timeshiftDistortion: 1.6,
        timeshiftBlur: 1.5,
        timeshiftFlow: 1.4,
        timeshiftChromatic: 1.5,
        timeshiftTurbulence: 1.4,
      },
      effectPresets: {
        glass: {
          Subtle: { glassRefractionStrength: 0.6, glassChromaticAberration: 0.5, glassBubbleClarity: 1.3, glassEdgeGlow: 0.7, glassLiquidFlow: 0.8 },
          Default: { glassRefractionStrength: 1.0, glassChromaticAberration: 1.0, glassBubbleClarity: 1.0, glassEdgeGlow: 1.0, glassLiquidFlow: 1.0 },
          Crystal: { glassRefractionStrength: 1.5, glassChromaticAberration: 1.8, glassBubbleClarity: 0.7, glassEdgeGlow: 1.4, glassLiquidFlow: 0.5 },
          Liquid: { glassRefractionStrength: 0.8, glassChromaticAberration: 0.4, glassBubbleClarity: 1.2, glassEdgeGlow: 0.8, glassLiquidFlow: 1.8 },
        },
        frost: {
          Light: { frostIntensity: 0.8, frostCrystalSize: 1.3, frostIceCoverage: 0.6, frostTemperature: 0.7, frostTexture: 0.8 },
          Default: { frostIntensity: 1.5, frostCrystalSize: 1.0, frostIceCoverage: 1.0, frostTemperature: 1.0, frostTexture: 1.0 },
          Heavy: { frostIntensity: 2.2, frostCrystalSize: 0.7, frostIceCoverage: 1.4, frostTemperature: 1.5, frostTexture: 1.3 },
          Arctic: { frostIntensity: 2.8, frostCrystalSize: 0.5, frostIceCoverage: 1.8, frostTemperature: 2.0, frostTexture: 1.6 },
        },
        ripple: {
          Gentle: { rippleFrequency: 15.0, rippleAmplitude: 0.05, rippleWaveSpeed: 0.7, rippleRippleCount: 0.8, rippleDecay: 1.2 },
          Default: { rippleFrequency: 25.0, rippleAmplitude: 0.08, rippleWaveSpeed: 1.0, rippleRippleCount: 1.0, rippleDecay: 1.0 },
          Strong: { rippleFrequency: 35.0, rippleAmplitude: 0.12, rippleWaveSpeed: 1.4, rippleRippleCount: 1.3, rippleDecay: 0.8 },
          Tsunami: { rippleFrequency: 45.0, rippleAmplitude: 0.18, rippleWaveSpeed: 1.8, rippleRippleCount: 1.6, rippleDecay: 0.6 },
        },
        plasma: {
          Calm: { plasmaIntensity: 0.8, plasmaSpeed: 0.5, plasmaEnergyIntensity: 0.2, plasmaContrastBoost: 0.1, plasmaTurbulence: 0.6 },
          Default: { plasmaIntensity: 1.2, plasmaSpeed: 0.8, plasmaEnergyIntensity: 0.4, plasmaContrastBoost: 0.3, plasmaTurbulence: 1.0 },
          Storm: { plasmaIntensity: 1.8, plasmaSpeed: 1.3, plasmaEnergyIntensity: 0.7, plasmaContrastBoost: 0.5, plasmaTurbulence: 1.5 },
          Nuclear: { plasmaIntensity: 2.5, plasmaSpeed: 1.8, plasmaEnergyIntensity: 1.0, plasmaContrastBoost: 0.8, plasmaTurbulence: 2.0 },
        },
        timeshift: {
          Subtle: { timeshiftDistortion: 0.5, timeshiftBlur: 0.6, timeshiftFlow: 0.5, timeshiftChromatic: 0.4, timeshiftTurbulence: 0.6 },
          Default: { timeshiftDistortion: 1.6, timeshiftBlur: 1.5, timeshiftFlow: 1.4, timeshiftChromatic: 1.5, timeshiftTurbulence: 1.4 },
          Intense: { timeshiftDistortion: 2.2, timeshiftBlur: 2.0, timeshiftFlow: 2.0, timeshiftChromatic: 2.2, timeshiftTurbulence: 2.0 },
          Dreamlike: { timeshiftDistortion: 2.8, timeshiftBlur: 2.5, timeshiftFlow: 2.5, timeshiftChromatic: 2.6, timeshiftTurbulence: 2.5 },
        },
      },
    };

    // --- GLOBAL STATE ---
    let currentSlideIndex = 0;
    let isTransitioning = false;
    let shaderMaterial: THREE.ShaderMaterial;
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.OrthographicCamera;
    let slideTextures: THREE.Texture[] = [];
    let texturesLoaded = false;
    let autoSlideTimer: ReturnType<typeof setTimeout> | null = null;
    let progressAnimation: ReturnType<typeof setInterval> | null = null;
    let sliderEnabled = false;
    let animFrameId: number;

    const SLIDE_DURATION = () => SLIDER_CONFIG.settings.autoSlideSpeed;
    const PROGRESS_UPDATE_INTERVAL = 50;
    const TRANSITION_DURATION = () => SLIDER_CONFIG.settings.transitionDuration;

    const slides = [
      { title: "Lumière Wolof", description: "Un éclat radieux qui illumine l'âme du Sénégal, entre tradition et modernité.", media: "/images/slide-senegal-1.png" },
      { title: "Teranga Rose", description: "Perdue dans un désert de rêves éclos et d'horizons sans fin, l'esprit de la Teranga.", media: "/images/slide-senegal-2.png" },
      { title: "Velours Mystique", description: "Enlacé dans l'étreinte profonde et luxueuse de la nuit dakaroise.", media: "/images/slide-senegal-3.png" },
      { title: "Heure Dorée", description: "Ce moment fugace où le monde est trempé d'or, du coucher de soleil sur l'île de Gorée.", media: "/images/slide-senegal-4.png" },
      { title: "Rêves Minuit", description: "La où la réalité s'efface et l'imagination prend son envol sous les étoiles du Sahel.", media: "/images/slide-senegal-5.png" },
      { title: "Lumière d'Argent", description: "Un éclat métallique et frais qui reflête le pouls urbain de Dakar.", media: "/images/slide-senegal-6.png" },
    ];

    // --- SHADERS ---
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D uTexture1, uTexture2;
      uniform float uProgress;
      uniform vec2 uResolution, uTexture1Size, uTexture2Size;
      uniform int uEffectType;
      uniform float uGlobalIntensity, uSpeedMultiplier, uDistortionStrength, uColorEnhancement;
      uniform float uGlassRefractionStrength, uGlassChromaticAberration, uGlassBubbleClarity, uGlassEdgeGlow, uGlassLiquidFlow;
      uniform float uFrostIntensity, uFrostCrystalSize, uFrostIceCoverage, uFrostTemperature, uFrostTexture;
      uniform float uRippleFrequency, uRippleAmplitude, uRippleWaveSpeed, uRippleRippleCount, uRippleDecay;
      uniform float uPlasmaIntensity, uPlasmaSpeed, uPlasmaEnergyIntensity, uPlasmaContrastBoost, uPlasmaTurbulence;
      uniform float uTimeshiftDistortion, uTimeshiftBlur, uTimeshiftFlow, uTimeshiftChromatic, uTimeshiftTurbulence;
      varying vec2 vUv;

      vec2 getCoverUV(vec2 uv, vec2 textureSize) {
        vec2 s = uResolution / textureSize;
        float scale = max(s.x, s.y);
        vec2 scaledSize = textureSize * scale;
        vec2 offset = (uResolution - scaledSize) * 0.5;
        return (uv * uResolution - offset) / scaledSize;
      }

      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      vec4 glassEffect(vec2 uv, float progress) {
        float time = progress * 5.0 * uSpeedMultiplier;
        vec2 uv1 = getCoverUV(uv, uTexture1Size);
        vec2 uv2 = getCoverUV(uv, uTexture2Size);
        float maxR = length(uResolution) * 0.85;
        float br = progress * maxR;
        vec2 p = uv * uResolution;
        vec2 c = uResolution * 0.5;
        float d = length(p - c);
        float nd = d / max(br, 0.001);
        float param = smoothstep(br + 3.0, br - 3.0, d);
        vec4 img;
        if (param > 0.0) {
          float ro = 0.08 * uGlassRefractionStrength * uDistortionStrength * uGlobalIntensity * pow(smoothstep(0.3 * uGlassBubbleClarity, 1.0, nd), 1.5);
          vec2 dir = (d > 0.0) ? (p - c) / d : vec2(0.0);
          vec2 distUV = uv2 - dir * ro;
          distUV += vec2(sin(time + nd * 10.0), cos(time * 0.8 + nd * 8.0)) * 0.015 * uGlassLiquidFlow * uSpeedMultiplier * nd * param;
          float ca = 0.02 * uGlassChromaticAberration * uGlobalIntensity * pow(smoothstep(0.3, 1.0, nd), 1.2);
          img = vec4(
            texture2D(uTexture2, distUV + dir * ca * 1.2).r,
            texture2D(uTexture2, distUV + dir * ca * 0.2).g,
            texture2D(uTexture2, distUV - dir * ca * 0.8).b,
            1.0
          );
          if (uGlassEdgeGlow > 0.0) {
            float rim = smoothstep(0.95, 1.0, nd) * (1.0 - smoothstep(1.0, 1.01, nd));
            img.rgb += rim * 0.08 * uGlassEdgeGlow * uGlobalIntensity;
          }
        } else {
          img = texture2D(uTexture2, uv2);
        }
        vec4 oldImg = texture2D(uTexture1, uv1);
        if (progress > 0.95) img = mix(img, texture2D(uTexture2, uv2), (progress - 0.95) / 0.05);
        return mix(oldImg, img, param);
      }

      vec4 frostEffect(vec2 uv, float progress) {
        vec2 uv1 = getCoverUV(uv, uTexture1Size);
        vec2 uv2 = getCoverUV(uv, uTexture2Size);
        float t = progress * 3.0 * uSpeedMultiplier;
        float frostN = noise(floor(uv2 * 40.0) + floor(t * 3.0));
        vec2 frostUv = uv2 + vec2(frostN - 0.5) * 0.04 * uFrostIntensity * uDistortionStrength * uGlobalIntensity;
        vec4 newImg = texture2D(uTexture2, frostUv);
        vec3 frostCol = vec3(0.85, 0.88, 0.95) * frostN * 0.25 * uFrostTexture * uGlobalIntensity;
        newImg.rgb = mix(newImg.rgb, frostCol, 0.15 * uFrostIceCoverage);
        float iceEdge = smoothstep(0.4, 0.6, progress) * uFrostTemperature * 0.1;
        newImg.rgb += iceEdge;
        vec4 oldImg = texture2D(uTexture1, uv1);
        return mix(oldImg, newImg, progress);
      }

      vec4 rippleEffect(vec2 uv, float progress) {
        vec2 uv1 = getCoverUV(uv, uTexture1Size);
        vec2 uv2 = getCoverUV(uv, uTexture2Size);
        vec2 center = vec2(0.5);
        float dist = length(uv - center);
        float ripple = sin(dist * uRippleFrequency * uRippleRippleCount - progress * 10.0 * uRippleWaveSpeed) * uRippleAmplitude * uDistortionStrength * uGlobalIntensity / (dist * uRippleDecay * 4.0 + 1.0);
        vec2 rippleUv = uv2 + normalize(uv2 - center) * ripple;
        vec4 newImg = texture2D(uTexture2, rippleUv);
        newImg.rgb += 0.05 * sin(dist * 10.0 - progress * 5.0) * uColorEnhancement * uGlobalIntensity;
        vec4 oldImg = texture2D(uTexture1, uv1);
        float vig = 1.0 - smoothstep(0.2, 1.0, dist);
        newImg.rgb *= 0.8 + vig * 0.4;
        return mix(oldImg, newImg, progress);
      }

      vec4 plasmaEffect(vec2 uv, float progress) {
        vec2 uv1 = getCoverUV(uv, uTexture1Size);
        vec2 uv2 = getCoverUV(uv, uTexture2Size);
        float t = progress * 3.0 * uPlasmaSpeed * uSpeedMultiplier;
        float plasma = sin(uv.x * 10.0 + t) + sin(uv.y * 10.0 + t);
        plasma += sin((uv.x + uv.y) * 10.0 + t * 1.5);
        plasma += sin(length(uv - 0.5) * 20.0 - t * 2.0);
        plasma *= 0.25;
        vec2 plasmaUv = uv2 + vec2(sin(plasma), cos(plasma)) * 0.02 * uPlasmaTurbulence * uDistortionStrength * uGlobalIntensity;
        vec4 newImg = texture2D(uTexture2, plasmaUv);
        newImg.rgb += vec3(0.8, 0.0, 0.5) * uPlasmaEnergyIntensity * uGlobalIntensity * (0.5 + 0.5 * sin(plasma));
        newImg.rgb *= 1.0 + uPlasmaContrastBoost * uColorEnhancement * 0.3;
        vec4 oldImg = texture2D(uTexture1, uv1);
        return mix(oldImg, newImg, progress);
      }

      vec4 timeshiftEffect(vec2 uv, float progress) {
        vec2 uv1 = getCoverUV(uv, uTexture1Size);
        vec2 uv2 = getCoverUV(uv, uTexture2Size);
        float shift = sin(progress * 5.0 * uSpeedMultiplier) * 0.01 * uTimeshiftChromatic * uDistortionStrength * uGlobalIntensity;
        float r = texture2D(uTexture2, uv2 + vec2(shift, 0.0)).r;
        float g = texture2D(uTexture2, uv2).g;
        float b = texture2D(uTexture2, uv2 - vec2(shift, 0.0)).b;
        vec3 col = vec3(r, g, b);
        float scanline = sin(uv.y * 800.0) * 0.03 * uTimeshiftBlur * uGlobalIntensity;
        col -= scanline;
        float glitch = step(0.97, sin(uv.y * 100.0 + progress * 30.0)) * uTimeshiftTurbulence * 0.1;
        col += glitch;
        col *= 1.0 + uTimeshiftDistortion * uColorEnhancement * 0.05 * sin(progress * 5.0);
        vec4 newImg = vec4(col, 1.0);
        vec4 oldImg = texture2D(uTexture1, uv1);
        return mix(oldImg, newImg, progress);
      }

      void main() {
        if (uEffectType == 0) gl_FragColor = glassEffect(vUv, uProgress);
        else if (uEffectType == 1) gl_FragColor = frostEffect(vUv, uProgress);
        else if (uEffectType == 2) gl_FragColor = rippleEffect(vUv, uProgress);
        else if (uEffectType == 3) gl_FragColor = plasmaEffect(vUv, uProgress);
        else gl_FragColor = timeshiftEffect(vUv, uProgress);
      }
    `;

    // --- CORE FUNCTIONS ---
    const getEffectIndex = (n: string) => ({ glass: 0, frost: 1, ripple: 2, plasma: 3, timeshift: 4 } as Record<string, number>)[n] || 0;

    const updateShaderUniforms = () => {
      if (!shaderMaterial) return;
      const s = SLIDER_CONFIG.settings;
      const u = shaderMaterial.uniforms;
      for (const key in s) {
        const uName = "u" + key.charAt(0).toUpperCase() + key.slice(1);
        if (u[uName]) u[uName].value = s[key];
      }
      u.uEffectType.value = getEffectIndex(s.currentEffect);
    };

    const splitText = (text: string) => {
      return text
        .split("")
        .map((char) => `<span style="display: inline-block; opacity: 0;">${char === " " ? "&nbsp;" : char}</span>`)
        .join("");
    };

    const updateContent = (idx: number) => {
      const titleEl = document.getElementById("mainTitle");
      const descEl = document.getElementById("mainDesc");
      if (titleEl && descEl) {
        gsap.to(titleEl.children, { y: -20, opacity: 0, duration: 0.5, stagger: 0.02, ease: "power2.in" });
        gsap.to(descEl, { y: -10, opacity: 0, duration: 0.4, ease: "power2.in" });

        setTimeout(() => {
          titleEl.innerHTML = splitText(slides[idx].title);
          descEl.textContent = slides[idx].description;

          gsap.set(titleEl.children, { opacity: 0 });
          gsap.set(descEl, { y: 20, opacity: 0 });

          const children = titleEl.children;
          switch (idx) {
            case 0: // Stagger Up
              gsap.set(children, { y: 20 });
              gsap.to(children, { y: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: "power3.out" });
              gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
              break;
            case 1: // Stagger Down
              gsap.set(children, { y: -20 });
              gsap.to(children, { y: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: "back.out(1.7)" });
              gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
              break;
            case 2: // Blur Reveal
              gsap.set(children, { filter: "blur(10px)", scale: 1.5, y: 0 });
              gsap.to(children, { filter: "blur(0px)", scale: 1, opacity: 1, duration: 1, stagger: { amount: 0.5, from: "random" }, ease: "power2.out" });
              gsap.to(descEl, { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power2.out" });
              break;
            case 3: // Scale In
              gsap.set(children, { scale: 0, y: 0 });
              gsap.to(children, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.05, ease: "back.out(1.5)" });
              gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
              break;
            case 4: // Rotate X (Flip)
              gsap.set(children, { rotationX: 90, y: 0, transformOrigin: "50% 50%" });
              gsap.to(children, { rotationX: 0, opacity: 1, duration: 0.8, stagger: 0.04, ease: "power2.out" });
              gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power2.out" });
              break;
            case 5: // Side Reveal
              gsap.set(children, { x: 30, y: 0 });
              gsap.to(children, { x: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: "power3.out" });
              gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
              break;
            default:
              gsap.set(children, { y: 20 });
              gsap.to(children, { y: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: "power3.out" });
              gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
          }
        }, 500);
      }
    };

    const navigateToSlide = (targetIndex: number) => {
      if (isTransitioning || targetIndex === currentSlideIndex) return;
      stopAutoSlideTimer();
      quickResetProgress(currentSlideIndex);

      const currentTexture = slideTextures[currentSlideIndex];
      const targetTexture = slideTextures[targetIndex];
      if (!currentTexture || !targetTexture) return;

      isTransitioning = true;
      shaderMaterial.uniforms.uTexture1.value = currentTexture;
      shaderMaterial.uniforms.uTexture2.value = targetTexture;
      shaderMaterial.uniforms.uTexture1Size.value.set(
        (currentTexture as THREE.Texture & { userData: { size: THREE.Vector2 } }).userData.size.x,
        (currentTexture as THREE.Texture & { userData: { size: THREE.Vector2 } }).userData.size.y
      );
      shaderMaterial.uniforms.uTexture2Size.value.set(
        (targetTexture as THREE.Texture & { userData: { size: THREE.Vector2 } }).userData.size.x,
        (targetTexture as THREE.Texture & { userData: { size: THREE.Vector2 } }).userData.size.y
      );

      updateContent(targetIndex);

      currentSlideIndex = targetIndex;
      updateCounter(currentSlideIndex);
      updateNavigationState(currentSlideIndex);

      gsap.fromTo(
        shaderMaterial.uniforms.uProgress,
        { value: 0 },
        {
          value: 1,
          duration: TRANSITION_DURATION(),
          ease: "power2.inOut",
          onComplete: () => {
            shaderMaterial.uniforms.uProgress.value = 0;
            shaderMaterial.uniforms.uTexture1.value = targetTexture;
            shaderMaterial.uniforms.uTexture1Size.value.set(
              (targetTexture as THREE.Texture & { userData: { size: THREE.Vector2 } }).userData.size.x,
              (targetTexture as THREE.Texture & { userData: { size: THREE.Vector2 } }).userData.size.y
            );
            isTransitioning = false;
            safeStartTimer(100);
          },
        }
      );
    };

    const handleSlideChange = () => {
      if (isTransitioning || !texturesLoaded || !sliderEnabled) return;
      navigateToSlide((currentSlideIndex + 1) % slides.length);
    };

    const createSlidesNavigation = () => {
      const nav = document.getElementById("slidesNav");
      if (!nav) return;
      nav.innerHTML = "";
      slides.forEach((slide, i) => {
        const item = document.createElement("div");
        item.className = `slide-nav-item${i === 0 ? " active" : ""}`;
        item.dataset.slideIndex = String(i);
        item.innerHTML = `<div class="slide-progress-line"><div class="slide-progress-fill"></div></div><div class="slide-nav-title">${slide.title}</div>`;
        item.addEventListener("click", (e) => {
          e.stopPropagation();
          if (!isTransitioning && i !== currentSlideIndex) {
            stopAutoSlideTimer();
            quickResetProgress(currentSlideIndex);
            navigateToSlide(i);
          }
        });
        nav.appendChild(item);
      });
    };

    const updateNavigationState = (idx: number) =>
      document.querySelectorAll(".slide-nav-item").forEach((el, i) => el.classList.toggle("active", i === idx));

    const updateSlideProgress = (idx: number, prog: number) => {
      const el = document.querySelectorAll(".slide-nav-item")[idx]?.querySelector(".slide-progress-fill") as HTMLElement;
      if (el) {
        el.style.width = `${prog}%`;
        el.style.opacity = "1";
      }
    };

    const fadeSlideProgress = (idx: number) => {
      const el = document.querySelectorAll(".slide-nav-item")[idx]?.querySelector(".slide-progress-fill") as HTMLElement;
      if (el) {
        el.style.opacity = "0";
        setTimeout(() => (el.style.width = "0%"), 300);
      }
    };

    const quickResetProgress = (idx: number) => {
      const el = document.querySelectorAll(".slide-nav-item")[idx]?.querySelector(".slide-progress-fill") as HTMLElement;
      if (el) {
        el.style.transition = "width 0.2s ease-out";
        el.style.width = "0%";
        setTimeout(() => (el.style.transition = "width 0.1s ease, opacity 0.3s ease"), 200);
      }
    };

    const updateCounter = (idx: number) => {
      const sn = document.getElementById("slideNumber");
      if (sn) sn.textContent = String(idx + 1).padStart(2, "0");
      const st = document.getElementById("slideTotal");
      if (st) st.textContent = String(slides.length).padStart(2, "0");
    };

    const startAutoSlideTimer = () => {
      if (!texturesLoaded || !sliderEnabled) return;
      stopAutoSlideTimer();
      let progress = 0;
      const increment = (100 / SLIDE_DURATION()) * PROGRESS_UPDATE_INTERVAL;
      progressAnimation = setInterval(() => {
        if (!sliderEnabled) {
          stopAutoSlideTimer();
          return;
        }
        progress += increment;
        updateSlideProgress(currentSlideIndex, progress);
        if (progress >= 100) {
          if (progressAnimation) clearInterval(progressAnimation);
          progressAnimation = null;
          fadeSlideProgress(currentSlideIndex);
          if (!isTransitioning) handleSlideChange();
        }
      }, PROGRESS_UPDATE_INTERVAL);
    };

    const stopAutoSlideTimer = () => {
      if (progressAnimation) clearInterval(progressAnimation);
      if (autoSlideTimer) clearTimeout(autoSlideTimer);
      progressAnimation = null;
      autoSlideTimer = null;
    };

    const safeStartTimer = (delay = 0) => {
      stopAutoSlideTimer();
      if (sliderEnabled && texturesLoaded) {
        if (delay > 0) autoSlideTimer = setTimeout(startAutoSlideTimer, delay);
        else startAutoSlideTimer();
      }
    };

    const loadImageTexture = (src: string): Promise<THREE.Texture & { userData: { size: THREE.Vector2 } }> =>
      new Promise((resolve, reject) => {
        const loader = new THREE.TextureLoader();
        loader.load(
          src,
          (texture) => {
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            const sizedTexture = texture as THREE.Texture & { userData: { size: THREE.Vector2 } };
            sizedTexture.userData = { size: new THREE.Vector2(texture.image.width, texture.image.height) };
            resolve(sizedTexture);
          },
          undefined,
          reject
        );
      });

    const initRenderer = async () => {
      const canvas = document.querySelector(".webgl-canvas") as HTMLCanvasElement;
      if (!canvas) return;

      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: isMobile ? "low-power" : "high-performance" });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

      shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTexture1: { value: null },
          uTexture2: { value: null },
          uProgress: { value: 0 },
          uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          uTexture1Size: { value: new THREE.Vector2(1, 1) },
          uTexture2Size: { value: new THREE.Vector2(1, 1) },
          uEffectType: { value: 0 },
          uGlobalIntensity: { value: 1.0 },
          uSpeedMultiplier: { value: 1.0 },
          uDistortionStrength: { value: 1.0 },
          uColorEnhancement: { value: 1.0 },
          uGlassRefractionStrength: { value: 1.0 },
          uGlassChromaticAberration: { value: 1.0 },
          uGlassBubbleClarity: { value: 1.0 },
          uGlassEdgeGlow: { value: 1.0 },
          uGlassLiquidFlow: { value: 1.0 },
          uFrostIntensity: { value: 1.0 },
          uFrostCrystalSize: { value: 1.0 },
          uFrostIceCoverage: { value: 1.0 },
          uFrostTemperature: { value: 1.0 },
          uFrostTexture: { value: 1.0 },
          uRippleFrequency: { value: 25.0 },
          uRippleAmplitude: { value: 0.08 },
          uRippleWaveSpeed: { value: 1.0 },
          uRippleRippleCount: { value: 1.0 },
          uRippleDecay: { value: 1.0 },
          uPlasmaIntensity: { value: 1.2 },
          uPlasmaSpeed: { value: 0.8 },
          uPlasmaEnergyIntensity: { value: 0.4 },
          uPlasmaContrastBoost: { value: 0.3 },
          uPlasmaTurbulence: { value: 1.0 },
          uTimeshiftDistortion: { value: 1.6 },
          uTimeshiftBlur: { value: 1.5 },
          uTimeshiftFlow: { value: 1.4 },
          uTimeshiftChromatic: { value: 1.5 },
          uTimeshiftTurbulence: { value: 1.4 },
        },
        vertexShader,
        fragmentShader,
      });
      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial));

      for (const s of slides) {
        try {
          slideTextures.push(await loadImageTexture(s.media));
        } catch {
          console.warn("Failed to load texture:", s.media);
        }
      }

      if (slideTextures.length >= 2) {
        shaderMaterial.uniforms.uTexture1.value = slideTextures[0];
        shaderMaterial.uniforms.uTexture2.value = slideTextures[1];
        shaderMaterial.uniforms.uTexture1Size.value.set(
          (slideTextures[0] as THREE.Texture & { userData: { size: THREE.Vector2 } }).userData.size.x,
          (slideTextures[0] as THREE.Texture & { userData: { size: THREE.Vector2 } }).userData.size.y
        );
        shaderMaterial.uniforms.uTexture2Size.value.set(
          (slideTextures[1] as THREE.Texture & { userData: { size: THREE.Vector2 } }).userData.size.x,
          (slideTextures[1] as THREE.Texture & { userData: { size: THREE.Vector2 } }).userData.size.y
        );
        texturesLoaded = true;
        sliderEnabled = true;
        updateShaderUniforms();
        const wrapper = document.querySelector(".slider-wrapper");
        if (wrapper) wrapper.classList.add("loaded");
        safeStartTimer(500);
      }

      const render = () => {
        animFrameId = requestAnimationFrame(render);
        renderer.render(scene, camera);
      };
      render();
    };

    createSlidesNavigation();
    updateCounter(0);

    // Init text content
    const tEl = document.getElementById("mainTitle");
    const dEl = document.getElementById("mainDesc");
    if (tEl && dEl) {
      tEl.innerHTML = splitText(slides[0].title);
      dEl.textContent = slides[0].description;
      gsap.fromTo(tEl.children, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.03, ease: "power3.out", delay: 0.5 });
      gsap.fromTo(dEl, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.8 });
    }

    initRenderer();

    // Listeners
    const onVisibilityChange = () => (document.hidden ? stopAutoSlideTimer() : !isTransitioning && safeStartTimer());
    document.addEventListener("visibilitychange", onVisibilityChange);

    const onResize = () => {
      if (renderer) {
        renderer.setSize(window.innerWidth, window.innerHeight);
        shaderMaterial.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener("resize", onResize);

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", onResize);
      stopAutoSlideTimer();
      cancelAnimationFrame(animFrameId);
      if (renderer) renderer.dispose();
      if (shaderMaterial) shaderMaterial.dispose();
      slideTextures.forEach((t) => t.dispose());
    };
  }, []);

  return (
    <main className="slider-wrapper" ref={containerRef}>
      <canvas className="webgl-canvas"></canvas>
      <span className="slide-number" id="slideNumber">
        01
      </span>
      <span className="slide-total" id="slideTotal">
        06
      </span>

      <div className="slide-content">
        <h1 className="slide-title" id="mainTitle"></h1>
        <p className="slide-description" id="mainDesc"></p>
      </div>

      <nav className="slides-navigation" id="slidesNav"></nav>
    </main>
  );
}

// Default export for backward compatibility
export default Component;
