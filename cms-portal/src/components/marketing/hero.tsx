"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

/* ──────────────────────────────────────────────────
   Particle Canvas Background
   ────────────────────────────────────────────────── */

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // Particle types with association colors
    const colors = [
      "rgba(201, 162, 75, 0.5)",   // Gold — Finance
      "rgba(59, 130, 246, 0.4)",    // Blue — Economics
      "rgba(16, 185, 129, 0.4)",    // Teal — Marketing
      "rgba(139, 92, 246, 0.35)",   // Violet — HR
      "rgba(240, 237, 230, 0.2)",   // White — Management
    ];

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      life: number;
      maxLife: number;
    };

    const particles: Particle[] = [];
    const maxParticles = 60;

    const spawnParticle = () => {
      if (particles.length >= maxParticles) return;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      particles.push({
        x: Math.random() * w,
        y: h + 10,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(0.3 + Math.random() * 0.6),
        size: 1.5 + Math.random() * 2.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: 200 + Math.random() * 300,
      });
    };

    const animate = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Spawn new particles
      if (Math.random() < 0.3) spawnParticle();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        const progress = p.life / p.maxLife;

        // Mouse influence
        const dx = mouseRef.current.x * w - p.x;
        const dy = mouseRef.current.y * h - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          p.vx += (dx / dist) * 0.02;
          p.vy += (dy / dist) * 0.02;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Fade based on life
        const alpha = progress < 0.1
          ? progress / 0.1
          : progress > 0.8
            ? 1 - (progress - 0.8) / 0.2
            : 1;

        if (p.life >= p.maxLife || p.y < -10) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha * 0.8;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3 * alpha, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha * 0.1;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.y = (e.clientY - rect.top) / rect.height;
    };
    canvas.addEventListener("mousemove", handleMouse);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "auto" }}
    />
  );
}

/* ──────────────────────────────────────────────────
   Animated Counter
   ────────────────────────────────────────────────── */

function useCountUp(target: number, durationMs = 1400) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / durationMs, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, durationMs]);

  return { value, ref };
}

/* ──────────────────────────────────────────────────
   Hero Component
   ────────────────────────────────────────────────── */

const stats = [
  { label: "Active Members", value: 500, suffix: "+" },
  { label: "Associations", value: 3, suffix: "" },
  { label: "Events Yearly", value: 20, suffix: "+" },
  { label: "Graduates Placed", value: 50, suffix: "+" },
];

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute inset-0 grain-overlay" />
      <ParticleCanvas />

      {/* Floating Decorative Elements */}
      <div className="absolute top-20 right-[15%] w-64 h-64 rounded-full bg-gold-500/5 blur-3xl animate-float" />
      <div className="absolute bottom-20 left-[10%] w-48 h-48 rounded-full bg-blue-500/5 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-[40%] left-[60%] w-32 h-32 rounded-full bg-matsa/5 blur-3xl animate-float" style={{ animationDelay: "4s" }} />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28 w-full">
        <div className="max-w-3xl">
          {/* Chip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-gold-500/10 text-gold-400 border border-gold-500/20">
              <Sparkles size={12} />
              2026/2027 Academic Session
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight"
          >
            Shaping Future{" "}
            <span className="gradient-gold-text">Leaders</span>{" "}
            in Management Sciences
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-6 text-lg sm:text-xl text-text-secondary leading-relaxed max-w-[56ch]"
          >
            The College of Management Sciences brings together Business
            Administration, Economics, Marketing, Accounting & Taxation
            students under one roof — united by ambition, driven by
            excellence.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 text-bg-primary hover:from-gold-400 hover:to-gold-500 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/35 transition-all duration-300"
            >
              Explore COLMANS
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/payments"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium rounded-lg text-text-primary border border-border hover:border-gold-500/30 hover:bg-gold-500/5 transition-all duration-300"
            >
              Pay Your Dues
            </Link>
          </motion.div>
        </div>

        {/* Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10 pt-10 border-t border-border"
        >
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function StatItem({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix: string;
}) {
  const { value: animated, ref } = useCountUp(value);
  return (
    <div>
      <dd className="tabular font-display text-3xl sm:text-4xl font-bold text-text-primary">
        <span ref={ref}>{animated.toLocaleString()}</span>
        <span className="text-gold-400">{suffix}</span>
      </dd>
      <dt className="mt-1.5 text-sm text-text-secondary">{label}</dt>
    </div>
  );
}
