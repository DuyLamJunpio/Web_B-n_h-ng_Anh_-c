"use client";

import { useEffect, useRef } from "react";

export default function SmokeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; moved: boolean }>({
    x: 0,
    y: 0,
    moved: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        moved: true,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 1. Smoke Cloud Particle Class
    class SmokeParticle {
      x: number = 0;
      y: number = 0;
      vx: number = 0;
      vy: number = 0;
      size: number = 0;
      baseSize: number = 0;
      alpha: number = 0;
      maxAlpha: number = 0;
      life: number = 0;
      maxLife: number = 0;
      rotation: number = 0;
      rotSpeed: number = 0;

      constructor(initRandom = false) {
        this.reset(initRandom);
      }

      reset(randomLife = false) {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = -Math.random() * 0.5 - 0.2;
        this.baseSize = Math.random() * 140 + 90;
        this.size = this.baseSize;
        this.alpha = 0;
        this.maxAlpha = Math.random() * 0.12 + 0.04;
        this.maxLife = Math.random() * 600 + 400;
        this.life = randomLife ? Math.random() * this.maxLife : 0;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.002;
      }

      update() {
        // Natural drifting with slight horizontal turbulence
        this.x += this.vx + Math.sin(this.life * 0.008) * 0.3;
        this.y += this.vy;
        this.rotation += this.rotSpeed;
        this.life++;

        // Gentle reaction to cursor movement
        if (mouseRef.current.moved) {
          const dx = this.x - mouseRef.current.x;
          const dy = this.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180 && dist > 0) {
            const force = (180 - dist) / 180;
            this.x += (dx / dist) * force * 0.8;
            this.y += (dy / dist) * force * 0.5;
          }
        }

        // Fade In -> Stay Soft -> Fade Out
        if (this.life < 100) {
          this.alpha = (this.life / 100) * this.maxAlpha;
        } else if (this.life > this.maxLife - 120) {
          this.alpha = ((this.maxLife - this.life) / 120) * this.maxAlpha;
        }

        // Expansion as smoke rises
        this.size = this.baseSize + (this.life / this.maxLife) * 60;

        if (this.life >= this.maxLife || this.y < -this.size) {
          this.reset(false);
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, `rgba(212, 163, 115, ${this.alpha * 0.9})`);
        gradient.addColorStop(0.35, `rgba(140, 97, 57, ${this.alpha * 0.45})`);
        gradient.addColorStop(0.7, `rgba(40, 35, 30, ${this.alpha * 0.2})`);
        gradient.addColorStop(1, "rgba(15, 14, 13, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // 2. Glowing Amber Embers Class
    class EmberParticle {
      x: number = 0;
      y: number = 0;
      vx: number = 0;
      vy: number = 0;
      size: number = 0;
      alpha: number = 0;
      life: number = 0;
      maxLife: number = 0;

      constructor() {
        this.reset(true);
      }

      reset(randomLife = false) {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 50;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = -Math.random() * 0.8 - 0.4;
        this.size = Math.random() * 2 + 1;
        this.maxLife = Math.random() * 400 + 250;
        this.life = randomLife ? Math.random() * this.maxLife : 0;
        this.alpha = Math.random() * 0.7 + 0.3;
      }

      update() {
        this.x += this.vx + Math.sin(this.life * 0.02) * 0.4;
        this.y += this.vy;
        this.life++;

        if (this.life >= this.maxLife || this.y < -10) {
          this.reset(false);
        }
      }

      draw() {
        if (!ctx) return;
        const currentAlpha = Math.sin((this.life / this.maxLife) * Math.PI) * this.alpha;
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 197, 148, ${currentAlpha})`;
        ctx.shadowColor = "#d4a373";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }
    }

    const smokeCount = 38;
    const emberCount = 24;

    const smokeParticles: SmokeParticle[] = [];
    for (let i = 0; i < smokeCount; i++) {
      smokeParticles.push(new SmokeParticle(true));
    }

    const emberParticles: EmberParticle[] = [];
    for (let i = 0; i < emberCount; i++) {
      emberParticles.push(new EmberParticle());
    }

    let animationId: number;
    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Render smoke layer
      smokeParticles.forEach((p) => {
        p.update();
        p.draw();
      });

      // Render glowing embers
      emberParticles.forEach((e) => {
        e.update();
        e.draw();
      });

      animationId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1] opacity-60 transition-opacity duration-1000"
    />
  );
}
