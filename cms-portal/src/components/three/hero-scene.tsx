"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a08, 0.04);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.offsetWidth / container.offsetHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.2, 7.5);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const goldPointLight = new THREE.PointLight(0xc9a24b, 3, 20);
    goldPointLight.position.set(2, 3, 4);
    scene.add(goldPointLight);

    const bluePointLight = new THREE.PointLight(0x3b82f6, 2, 20);
    bluePointLight.position.set(-3, -1, 3);
    scene.add(bluePointLight);

    const centralLight = new THREE.DirectionalLight(0xffffff, 1.5);
    centralLight.position.set(0, 5, 5);
    scene.add(centralLight);

    // 4. Centerpiece — 3D Metallic Gold Briefcase
    const briefcaseGroup = new THREE.Group();

    // Body of the briefcase
    const bodyGeometry = new THREE.BoxGeometry(1.6, 1.1, 0.45);
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xc9a24b,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x221804,
    });
    const briefcaseBody = new THREE.Mesh(bodyGeometry, goldMaterial);
    briefcaseGroup.add(briefcaseBody);

    // Metallic Trims & Edge Accents
    const rimGeometry = new THREE.BoxGeometry(1.64, 0.05, 0.47);
    const trimMaterial = new THREE.MeshStandardMaterial({
      color: 0xe0c068,
      metalness: 0.95,
      roughness: 0.15,
    });
    const centerRim = new THREE.Mesh(rimGeometry, trimMaterial);
    briefcaseGroup.add(centerRim);

    // Latches / Locks
    const latchGeo = new THREE.BoxGeometry(0.12, 0.08, 0.04);
    const leftLatch = new THREE.Mesh(latchGeo, trimMaterial);
    leftLatch.position.set(-0.45, 0.05, 0.24);
    const rightLatch = new THREE.Mesh(latchGeo, trimMaterial);
    rightLatch.position.set(0.45, 0.05, 0.24);
    briefcaseGroup.add(leftLatch, rightLatch);

    // Handle
    const handleCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-0.25, 0.55, 0),
      new THREE.Vector3(-0.25, 0.82, 0),
      new THREE.Vector3(0.25, 0.82, 0),
      new THREE.Vector3(0.25, 0.55, 0)
    );
    const handleGeometry = new THREE.TubeGeometry(handleCurve, 24, 0.035, 8, false);
    const handle = new THREE.Mesh(handleGeometry, trimMaterial);
    briefcaseGroup.add(handle);

    // Position briefcase centrally
    briefcaseGroup.position.set(0.5, 0.2, 0);
    scene.add(briefcaseGroup);

    // 5. Background Layer — Rising Bar Chart City
    const cityGroup = new THREE.Group();
    const cityCount = 38;
    const cityBars: THREE.Mesh[] = [];

    const cityBarMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.4,
      metalness: 0.7,
      transparent: true,
      opacity: 0.65,
    });

    const glowingCapMaterial = new THREE.MeshBasicMaterial({
      color: 0xb8860b,
      transparent: true,
      opacity: 0.85,
    });

    for (let i = 0; i < cityCount; i++) {
      const height = 0.8 + Math.random() * 2.8;
      const width = 0.22 + Math.random() * 0.18;
      const barGeo = new THREE.BoxGeometry(width, height, width);
      const bar = new THREE.Mesh(barGeo, cityBarMaterial);

      const angle = (i / cityCount) * Math.PI * 1.5 - Math.PI * 0.75;
      const radius = 3.2 + Math.random() * 2.5;

      const posX = Math.sin(angle) * radius;
      const posZ = -1.5 - Math.cos(angle) * radius * 0.6;
      const posY = -1.2 + height / 2;

      bar.position.set(posX, posY, posZ);
      cityBars.push(bar);
      cityGroup.add(bar);

      // Add a small glowing cap on top of every bar
      const capGeo = new THREE.BoxGeometry(width * 1.05, 0.04, width * 1.05);
      const cap = new THREE.Mesh(capGeo, glowingCapMaterial);
      cap.position.set(posX, posY + height / 2, posZ);
      cityGroup.add(cap);
    }
    scene.add(cityGroup);

    // 6. Five Colored Particle Streams flowing into briefcase
    // Gold: Finance, Blue: Economics, Teal: Marketing, Violet: HR, White: Management
    const streamColors = [
      0xe0c068, // Gold - Finance
      0x3b82f6, // Blue - Economics
      0x10b981, // Teal - Marketing
      0x8b5cf6, // Violet - HR
      0xf0ede6, // White - Management
    ];

    const streams: {
      points: THREE.Points;
      positions: Float32Array;
      speeds: Float32Array;
      origins: THREE.Vector3[];
    }[] = [];

    streamColors.forEach((color, streamIdx) => {
      const pCount = 50;
      const positions = new Float32Array(pCount * 3);
      const speeds = new Float32Array(pCount);
      const origins: THREE.Vector3[] = [];

      const angle = (streamIdx / streamColors.length) * Math.PI * 2;
      const originDist = 4.5 + Math.random() * 1.5;
      const origin = new THREE.Vector3(
        Math.cos(angle) * originDist,
        (Math.random() - 0.3) * 3,
        Math.sin(angle) * originDist - 1
      );

      for (let i = 0; i < pCount; i++) {
        const t = Math.random();
        origins.push(origin);

        const currentPos = new THREE.Vector3().lerpVectors(
          origin,
          briefcaseGroup.position,
          t
        );
        positions[i * 3] = currentPos.x + (Math.random() - 0.5) * 0.3;
        positions[i * 3 + 1] = currentPos.y + (Math.random() - 0.5) * 0.3;
        positions[i * 3 + 2] = currentPos.z + (Math.random() - 0.5) * 0.3;
        speeds[i] = 0.008 + Math.random() * 0.012;
      }

      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const pMat = new THREE.PointsMaterial({
        color,
        size: 0.07,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(pGeo, pMat);
      scene.add(points);
      streams.push({ points, positions, speeds, origins });
    });

    // 7. Holographic Dashboard HUD Layer (Floating Ring & Wireframe Elements)
    const hudGroup = new THREE.Group();

    // Holographic Donut / Torus
    const donutGeo = new THREE.TorusGeometry(0.7, 0.02, 16, 60);
    const hudMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const donut = new THREE.Mesh(donutGeo, hudMat);
    donut.position.set(-2.2, 1.2, 1);
    donut.rotation.x = Math.PI / 4;
    hudGroup.add(donut);

    // Orbit Ring around Briefcase
    const orbitRingGeo = new THREE.RingGeometry(2.1, 2.13, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xc9a24b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const orbitRing = new THREE.Mesh(orbitRingGeo, ringMat);
    orbitRing.rotation.x = Math.PI / 2.5;
    orbitRing.position.copy(briefcaseGroup.position);
    hudGroup.add(orbitRing);

    scene.add(hudGroup);

    // 8. Interactivity & Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / container.offsetWidth) * 2 - 1;
      mouseY = -(((event.clientY - rect.top) / container.offsetHeight) * 2 - 1);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.offsetWidth / container.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.offsetWidth, container.offsetHeight);
    };
    window.addEventListener("resize", handleResize);

    // 9. Animation Loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      // Rotate Briefcase gently & apply floating bob
      briefcaseGroup.rotation.y = Math.sin(elapsedTime * 0.6) * 0.35;
      briefcaseGroup.rotation.x = targetY * 0.15;
      briefcaseGroup.position.y = 0.2 + Math.sin(elapsedTime * 1.2) * 0.08;

      // Parallax HUD & City
      hudGroup.rotation.z = elapsedTime * 0.15;
      hudGroup.position.x = targetX * 0.4;
      hudGroup.position.y = targetY * 0.3;
      donut.rotation.y = elapsedTime * 0.4;

      cityGroup.position.x = -targetX * 0.2;
      cityGroup.position.y = targetY * 0.15;

      // Animate Particle Streams flowing in
      streams.forEach((st) => {
        const pos = st.positions;
        const count = pos.length / 3;

        for (let i = 0; i < count; i++) {
          const current = new THREE.Vector3(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
          const target = briefcaseGroup.position;

          const dir = new THREE.Vector3().subVectors(target, current);
          const dist = dir.length();

          if (dist < 0.25) {
            // Respawn near origin
            const orig = st.origins[i];
            pos[i * 3] = orig.x + (Math.random() - 0.5) * 0.5;
            pos[i * 3 + 1] = orig.y + (Math.random() - 0.5) * 0.5;
            pos[i * 3 + 2] = orig.z + (Math.random() - 0.5) * 0.5;
          } else {
            dir.normalize();
            pos[i * 3] += dir.x * st.speeds[i] * 3;
            pos[i * 3 + 1] += dir.y * st.speeds[i] * 3;
            pos[i * 3 + 2] += dir.z * st.speeds[i] * 3;
          }
        }
        st.points.geometry.attributes.position.needsUpdate = true;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
