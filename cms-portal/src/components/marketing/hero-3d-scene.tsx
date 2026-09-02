"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, Eye, RotateCcw } from "lucide-react";

export function Hero3DScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeDepartment, setActiveDepartment] = useState<"all" | "basa" | "nesa" | "matsa">("all");
  const [isWireframe, setIsWireframe] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 550;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3, 14);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(10, 15, 10);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x3b82f6, 3, 25);
    fillLight.position.set(-10, -5, -5);
    scene.add(fillLight);

    const goldRimLight = new THREE.PointLight(0xddb771, 4, 30);
    goldRimLight.position.set(5, 8, -8);
    scene.add(goldRimLight);

    // 5. Main 3D Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // ── 3D Object 1: The Central Geometric Academic Prism / Briefcase ──
    const prismGeo = new THREE.BoxGeometry(3.2, 2.4, 1.4);
    const prismMat = new THREE.MeshPhysicalMaterial({
      color: 0x0c2340,
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
      wireframe: isWireframe,
    });
    const centralPrism = new THREE.Mesh(prismGeo, prismMat);
    centralPrism.position.y = 0.5;
    centralPrism.castShadow = true;
    centralPrism.receiveShadow = true;
    rootGroup.add(centralPrism);

    // Gold Bevel Edge Trim on Briefcase
    const trimGeo = new THREE.BoxGeometry(3.3, 0.12, 1.46);
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0xddb771,
      metalness: 0.95,
      roughness: 0.2,
    });
    const trim = new THREE.Mesh(trimGeo, trimMat);
    trim.position.y = 0.5;
    rootGroup.add(trim);

    // Briefcase Handle
    const handleGeo = new THREE.TorusGeometry(0.55, 0.08, 16, 32, Math.PI);
    const handle = new THREE.Mesh(handleGeo, trimMat);
    handle.position.set(0, 1.7, 0);
    handle.rotation.z = Math.PI;
    rootGroup.add(handle);

    // ── 3D Object 2: Financial Cityscape Bar Charts (Growth & Analytics) ──
    const barsGroup = new THREE.Group();
    rootGroup.add(barsGroup);

    const barData = [
      { x: -2.4, z: -1.2, h: 2.2, color: 0x1d4ed8 }, // BASA blue
      { x: -2.8, z: 0.6, h: 3.0, color: 0x0c2340 },
      { x: 2.4, z: -1.0, h: 2.8, color: 0x059669 },  // NESA emerald
      { x: 2.7, z: 0.8, h: 3.5, color: 0xddb771 },   // MATSA gold
      { x: 0, z: -2.2, h: 4.0, color: 0x1e3a8a },
      { x: -1.2, z: -2.0, h: 1.8, color: 0x3b82f6 },
      { x: 1.2, z: -2.0, h: 2.5, color: 0x10b981 },
    ];

    const barMeshes: THREE.Mesh[] = [];

    barData.forEach((b) => {
      const geo = new THREE.BoxGeometry(0.55, b.h, 0.55);
      const mat = new THREE.MeshStandardMaterial({
        color: b.color,
        metalness: 0.7,
        roughness: 0.25,
        wireframe: isWireframe,
      });
      const bar = new THREE.Mesh(geo, mat);
      bar.position.set(b.x, -1.2 + b.h / 2, b.z);
      bar.castShadow = true;
      barsGroup.add(bar);
      barMeshes.push(bar);
    });

    // ── 3D Object 3: Orbiting Departmental Orbital Rings ──
    const orbitGroup = new THREE.Group();
    rootGroup.add(orbitGroup);

    const ringGeo1 = new THREE.TorusGeometry(4.2, 0.025, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.45,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2.6;
    orbitGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(4.8, 0.02, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xddb771,
      transparent: true,
      opacity: 0.4,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 3.2;
    ring2.rotation.y = Math.PI / 6;
    orbitGroup.add(ring2);

    // Orbiting Department Spheres (BASA, NESA, MATSA)
    const sphereGeo = new THREE.SphereGeometry(0.28, 32, 32);

    const basaSphere = new THREE.Mesh(
      sphereGeo,
      new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.9, roughness: 0.1 })
    );
    const nesaSphere = new THREE.Mesh(
      sphereGeo,
      new THREE.MeshStandardMaterial({ color: 0x059669, metalness: 0.9, roughness: 0.1 })
    );
    const matsaSphere = new THREE.Mesh(
      sphereGeo,
      new THREE.MeshStandardMaterial({ color: 0xddb771, metalness: 0.9, roughness: 0.1 })
    );

    orbitGroup.add(basaSphere);
    orbitGroup.add(nesaSphere);
    orbitGroup.add(matsaSphere);

    // ── 3D Object 4: Floating Particle Field ──
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 16;
      particlePositions[i + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i + 2] = (Math.random() - 0.5) * 12;
    }

    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMat = new THREE.PointsMaterial({
      color: 0x0c2340,
      size: 0.08,
      transparent: true,
      opacity: 0.5,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Interactive Mouse Physics
    let targetRotationX = 0.15;
    let targetRotationY = -0.3;
    let currentRotationX = 0;
    let currentRotationY = 0;

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else {
        const rect = container.getBoundingClientRect();
        const mouseNormX = (e.clientX - rect.left) / rect.width - 0.5;
        const mouseNormY = (e.clientY - rect.top) / rect.height - 0.5;
        targetRotationY = mouseNormX * 0.7;
        targetRotationX = mouseNormY * 0.5;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // 7. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth inertia rotation
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;

      rootGroup.rotation.x = currentRotationX;
      rootGroup.rotation.y = currentRotationY + (isDragging ? 0 : Math.sin(elapsedTime * 0.5) * 0.1);

      // Central Briefcase Floating Levitation
      centralPrism.position.y = 0.5 + Math.sin(elapsedTime * 1.5) * 0.12;
      trim.position.y = centralPrism.position.y;
      handle.position.y = centralPrism.position.y + 1.2;

      // Orbital rotation of department nodes
      const angle1 = elapsedTime * 0.7;
      const angle2 = elapsedTime * 0.7 + (Math.PI * 2) / 3;
      const angle3 = elapsedTime * 0.7 + (Math.PI * 4) / 3;

      basaSphere.position.set(
        Math.cos(angle1) * 4.2,
        Math.sin(angle1) * 1.4,
        Math.sin(angle1) * 3.2
      );

      nesaSphere.position.set(
        Math.cos(angle2) * 4.8,
        -Math.sin(angle2) * 1.6,
        Math.sin(angle2) * 3.6
      );

      matsaSphere.position.set(
        Math.cos(angle3) * 4.4,
        Math.sin(angle3) * 1.8,
        Math.sin(angle3) * 3.4
      );

      // Bar Chart Staggered Breathing
      barMeshes.forEach((bar, idx) => {
        const offset = idx * 0.4;
        bar.scale.y = 1 + Math.sin(elapsedTime * 1.8 + offset) * 0.12;
      });

      // Subtle particle float
      particles.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Responsive Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isWireframe]);

  return (
    <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[620px] rounded-3xl bg-gradient-to-br from-white/90 via-slate-50/80 to-blue-50/40 border border-slate-200/80 shadow-2xl shadow-slate-900/10 backdrop-blur-xl overflow-hidden flex flex-col justify-between">
      {/* 3D Canvas Mount Point */}
      <div
        ref={mountRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
      />

      {/* Top Floating Control Bar */}
      <div className="relative z-10 p-5 flex items-center justify-between pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/90 border border-slate-200 shadow-md backdrop-blur-md text-xs font-mono font-bold text-[#0A192F] pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>3D COLLEGIATE MODEL // INTERACTIVE</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsWireframe(!isWireframe)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer shadow-xs flex items-center gap-1.5 ${
              isWireframe
                ? "bg-[#0C2340] text-white border-transparent"
                : "bg-white/90 text-slate-700 border-slate-200 hover:bg-white"
            }`}
          >
            <Eye size={13} />
            <span>{isWireframe ? "Solid" : "Wireframe"}</span>
          </button>
        </div>
      </div>

      {/* Bottom Floating Interactive Legend */}
      <div className="relative z-10 p-5 pointer-events-none">
        <div className="p-4 rounded-2xl bg-white/95 border border-slate-200/80 shadow-xl backdrop-blur-md max-w-sm ml-auto pointer-events-auto space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#0A192F]">
            <span className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#B89758]" />
              Interactive Departmental Nexus
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              DRAG TO ROTATE 360°
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="p-2 rounded-lg bg-blue-50/80 border border-blue-200 text-center">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block mb-1" />
              <p className="font-mono text-xs font-bold text-blue-900">BASA</p>
              <p className="text-[9px] text-blue-700">Business</p>
            </div>

            <div className="p-2 rounded-lg bg-emerald-50/80 border border-emerald-200 text-center">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block mb-1" />
              <p className="font-mono text-xs font-bold text-emerald-900">NESA</p>
              <p className="text-[9px] text-emerald-700">Economics</p>
            </div>

            <div className="p-2 rounded-lg bg-amber-50/80 border border-amber-200 text-center">
              <span className="w-2 h-2 rounded-full bg-amber-600 inline-block mb-1" />
              <p className="font-mono text-xs font-bold text-amber-900">MATSA</p>
              <p className="text-[9px] text-amber-800">Tax &amp; Brand</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
