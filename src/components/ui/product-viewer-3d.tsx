"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

/* ================================================================
   3D Product Viewer — Procedural dress silhouette using Three.js
   - LatheGeometry dress shape with gold→magenta vertex color gradient
   - Sparkle particles
   - Auto-rotation + mouse drag/scroll interaction
   - 3-point lighting (warm gold, cool white, pink accent)
   - Transparent background
   ================================================================ */

export default function ProductViewer3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || isInitializedRef.current) return;
    isInitializedRef.current = true;

    /* ---- Scene Setup ---- */
    const scene = new THREE.Scene();

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5);
    camera.lookAt(0, 0.5, 0);

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: !isMobile,
      powerPreference: isMobile ? "low-power" : "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    /* ---- Dress Profile Curve (LatheGeometry) ---- */
    const points: THREE.Vector2[] = [];

    // Neckline (narrow top)
    points.push(new THREE.Vector2(0.15, 2.8));
    points.push(new THREE.Vector2(0.2, 2.7));
    // Shoulders/bust area (wider)
    points.push(new THREE.Vector2(0.55, 2.5));
    points.push(new THREE.Vector2(0.7, 2.3));
    points.push(new THREE.Vector2(0.75, 2.1));
    // Waist (narrower)
    points.push(new THREE.Vector2(0.5, 1.8));
    points.push(new THREE.Vector2(0.45, 1.5));
    // Hips (slight expansion)
    points.push(new THREE.Vector2(0.55, 1.2));
    // Skirt (flares out)
    points.push(new THREE.Vector2(0.75, 0.9));
    points.push(new THREE.Vector2(1.0, 0.6));
    points.push(new THREE.Vector2(1.3, 0.3));
    points.push(new THREE.Vector2(1.6, 0.1));
    // Hem
    points.push(new THREE.Vector2(1.7, 0.0));

    const dressGeometry = new THREE.LatheGeometry(points, 64);

    /* ---- Vertex Color Gradient (gold → magenta) ---- */
    const positionAttr = dressGeometry.getAttribute("position");
    const vertexCount = positionAttr.count;
    const colors = new Float32Array(vertexCount * 3);

    const goldColor = new THREE.Color("#d4af37");
    const magentaColor = new THREE.Color("#ff007f");

    // Find Y range
    let minY = Infinity;
    let maxY = -Infinity;
    for (let i = 0; i < vertexCount; i++) {
      const y = positionAttr.getY(i);
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    const yRange = maxY - minY || 1;

    for (let i = 0; i < vertexCount; i++) {
      const y = positionAttr.getY(i);
      const t = (y - minY) / yRange; // 0 = bottom, 1 = top

      // Bottom = magenta, top = gold
      const color = new THREE.Color().copy(magentaColor).lerp(goldColor, t);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    dressGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );

    const dressMaterial = isMobile
      ? new THREE.MeshStandardMaterial({
          vertexColors: true,
          metalness: 0.5,
          roughness: 0.3,
          transparent: true,
          opacity: 0.92,
          side: THREE.DoubleSide,
        })
      : new THREE.MeshPhysicalMaterial({
          vertexColors: true,
          metalness: 0.6,
          roughness: 0.25,
          clearcoat: 0.4,
          clearcoatRoughness: 0.2,
          transparent: true,
          opacity: 0.92,
          side: THREE.DoubleSide,
          envMapIntensity: 0.8,
        });

    const dressMesh = new THREE.Mesh(dressGeometry, dressMaterial);
    dressMesh.position.y = -1.4;
    scene.add(dressMesh);

    /* ---- Sparkle Particles ---- */
    const particleCount = isMobile ? 80 : 200;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const particleOpacities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Random positions around the dress
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 2.0;
      const y = -1.4 + Math.random() * 4.2;

      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;

      particleSizes[i] = 1.5 + Math.random() * 3.0;
      particleOpacities[i] = Math.random();
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.03,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    /* ---- Lighting ---- */
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x333333, 0.5);
    scene.add(ambientLight);

    // Warm gold key light
    const keyLight = new THREE.PointLight(0xd4af37, 25, 20);
    keyLight.position.set(3, 3, 3);
    scene.add(keyLight);

    // Cool white fill light
    const fillLight = new THREE.PointLight(0xffffff, 12, 20);
    fillLight.position.set(-3, 2, 2);
    scene.add(fillLight);

    // Pink accent rim light
    const rimLight = new THREE.PointLight(0xff007f, 15, 20);
    rimLight.position.set(0, -1, -4);
    scene.add(rimLight);

    /* ---- Mouse Interaction ---- */
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let rotationY = 0;
    let rotationX = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;
    let cameraDistance = 5;
    let targetCameraDistance = 5;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouseX;
      const deltaY = e.clientY - previousMouseY;
      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.005;
      targetRotationX = Math.max(-0.5, Math.min(0.5, targetRotationX));
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetCameraDistance += e.deltaY * 0.005;
      targetCameraDistance = Math.max(3, Math.min(8, targetCameraDistance));
    };

    /* Touch support */
    let touchStartX = 0;
    let touchStartY = 0;
    let lastTouchDistance = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastTouchDistance = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - touchStartX;
        const deltaY = e.touches[0].clientY - touchStartY;
        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.005;
        targetRotationX = Math.max(-0.5, Math.min(0.5, targetRotationX));
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const delta = lastTouchDistance - distance;
        targetCameraDistance += delta * 0.01;
        targetCameraDistance = Math.max(3, Math.min(8, targetCameraDistance));
        lastTouchDistance = distance;
      }
    };

    const canvas = canvasRef.current;
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });

    /* ---- Resize ---- */
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    /* ---- Animation Loop ---- */
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Auto-rotation (when not dragging)
      if (!isDragging) {
        targetRotationY += 0.003;
      }

      // Smooth interpolation
      rotationY += (targetRotationY - rotationY) * 0.06;
      rotationX += (targetRotationX - rotationX) * 0.06;
      cameraDistance += (targetCameraDistance - cameraDistance) * 0.06;

      // Apply rotation to dress
      dressMesh.rotation.y = rotationY;
      dressMesh.rotation.x = rotationX;

      // Sparkle particle animation
      const posAttr = particleGeometry.getAttribute("position");
      for (let i = 0; i < particleCount; i++) {
        const baseY = posAttr.getY(i);
        // Gentle floating
        posAttr.setY(i, baseY + Math.sin(elapsed * 0.5 + i) * 0.0008);
      }
      posAttr.needsUpdate = true;

      // Subtle particle opacity pulsing
      particleMaterial.opacity = 0.4 + Math.sin(elapsed * 1.5) * 0.2;

      // Light subtle animation
      rimLight.intensity = 12 + Math.sin(elapsed * 0.8) * 3;

      // Update camera distance
      camera.position.z = cameraDistance;
      camera.lookAt(0, 0.5, 0);

      renderer.render(scene, camera);
    };

    animate();

    /* ---- Cleanup ---- */
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseUp);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);

      // Dispose Three.js resources
      dressGeometry.dispose();
      dressMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: "100%",
          maxWidth: "500px",
          aspectRatio: "1 / 1",
          position: "relative",
          borderRadius: "1rem",
          overflow: "hidden",
          cursor: "grab",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
        {/* Subtle gradient overlay at edges */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at center, transparent 50%, rgba(10,10,10,0.4) 100%)",
          }}
        />
      </div>

      {/* Label */}
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "#d4af37",
            letterSpacing: "0.08em",
          }}
        >
          Robe Dakar Sunset — Rotation 3D
        </p>
        <p
          style={{
            fontSize: "0.7rem",
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.05em",
            marginTop: "4px",
          }}
        >
          Glissez pour tourner • Scrollez pour zoomer
        </p>
      </div>
    </div>
  );
}

export { ProductViewer3D };
