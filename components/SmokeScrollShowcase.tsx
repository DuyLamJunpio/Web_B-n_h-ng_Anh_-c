"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import * as THREE from "three";
import { useCart } from "@/lib/CartContext";
import { PRODUCTS, Product } from "@/lib/data";
import {
  Sparkles,
  Flame,
  ShoppingBag,
  Eye,
  ChevronDown,
  Star,
  Compass,
  Wind,
  Check,
  ArrowRight,
} from "lucide-react";

interface ShowcaseStage {
  product: Product;
  stageName: string;
  stageSub: string;
  glowColor: string;
  accentColor: string;
  scrollRange: [number, number]; // Active trigger window
}

export default function SmokeScrollShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addToCart, openProductModal } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  // Mouse Parallax coordinates for 3D tilt
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  // Setup scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth scroll spring for ultra-fluid 60fps response
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 24,
    restDelta: 0.001,
  });

  // Pick top 3 signature products for the 3D scroll story
  const showcaseStages: ShowcaseStage[] = useMemo(() => {
    const p1 = PRODUCTS.find((p) => p.id === "p1") || PRODUCTS[0];
    const p2 = PRODUCTS.find((p) => p.id === "p2") || PRODUCTS[1];
    const p3 = PRODUCTS.find((p) => p.id === "p3") || PRODUCTS[2];

    return [
      {
        product: p1,
        stageName: "Khởi Nguồn / Gỗ Thánh Palo Santo",
        stageSub: "Peru Harvest • Thanh Tẩy Trường Khí",
        glowColor: "rgba(212, 163, 115, 0.4)",
        accentColor: "#d4a373",
        scrollRange: [0.18, 0.48],
      },
      {
        product: p2,
        stageName: "Tịnh Hóa / Xô Thơm Trắng",
        stageSub: "California Sage • Đại Tẩy Uế",
        glowColor: "rgba(212, 163, 115, 0.35)",
        accentColor: "#d4a373",
        scrollRange: [0.48, 0.74],
      },
      {
        product: p3,
        stageName: "Hơi Ấm / Nến Sáp Bấc Gỗ",
        stageSub: "Tuyết Tùng & Hổ Phách • An Định",
        glowColor: "rgba(212, 163, 115, 0.45)",
        accentColor: "#d4a373",
        scrollRange: [0.74, 0.98],
      },
    ];
  }, []);

  // Update active stage dot indicator
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (v) => {
      if (v < 0.18) {
        setActiveStageIndex(0);
      } else if (v < 0.48) {
        setActiveStageIndex(1);
      } else if (v < 0.74) {
        setActiveStageIndex(2);
      } else {
        setActiveStageIndex(3);
      }
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  // Handle Add to cart with feedback state
  const handleAddToCart = (productId: string) => {
    addToCart(productId);
    setAddedId(productId);
    setTimeout(() => setAddedId(null), 1800);
  };

  // ─────────────────────────────────────────────────────────────
  // 1. THREE.JS REALISTIC VOLUMETRIC SMOKE & EMBER PARTICLES
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf7f8f4, 0.022);

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // A. Lighting for botanical morning mist realism
    const ambientLight = new THREE.AmbientLight(0xdce8de, 1.2);
    scene.add(ambientLight);

    const amberPointLight = new THREE.PointLight(0xa3c4aa, 2.2, 14, 1.2);
    amberPointLight.position.set(0, 1, 2);
    scene.add(amberPointLight);

    // B. Generate High-Res Realistic Morning Herbal Mist Texture
    const smokeCanvas = document.createElement("canvas");
    smokeCanvas.width = 256;
    smokeCanvas.height = 256;
    const sctx = smokeCanvas.getContext("2d");
    if (sctx) {
      const grad = sctx.createRadialGradient(128, 128, 0, 128, 128, 120);
      grad.addColorStop(0, "rgba(205, 222, 210, 0.65)");
      grad.addColorStop(0.25, "rgba(185, 205, 190, 0.4)");
      grad.addColorStop(0.55, "rgba(165, 188, 172, 0.18)");
      grad.addColorStop(0.85, "rgba(145, 170, 152, 0.05)");
      grad.addColorStop(1, "rgba(247, 248, 244, 0)");
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, 256, 256);
    }
    const smokeTexture = new THREE.CanvasTexture(smokeCanvas);

    // C. Create Layered Realistic Smoke Mesh Clusters
    const smokePuffsCount = 28;
    const smokeGroup = new THREE.Group();
    const smokePuffs: Array<{
      mesh: THREE.Mesh;
      baseX: number;
      baseY: number;
      baseZ: number;
      rotSpeed: number;
      driftSpeed: number;
      scaleSpeed: number;
    }> = [];

    const smokeGeo = new THREE.PlaneGeometry(5.8, 5.8);

    for (let i = 0; i < smokePuffsCount; i++) {
      const mat = new THREE.MeshLambertMaterial({
        map: smokeTexture,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
        blending: THREE.NormalBlending,
      });

      const mesh = new THREE.Mesh(smokeGeo, mat);
      const bx = (Math.random() - 0.5) * 8;
      const by = (Math.random() - 0.5) * 5;
      const bz = (Math.random() - 0.5) * 6;

      mesh.position.set(bx, by, bz);
      mesh.rotation.z = Math.random() * Math.PI * 2;
      const s = 1.0 + Math.random() * 0.8;
      mesh.scale.set(s, s, s);

      smokeGroup.add(mesh);
      smokePuffs.push({
        mesh,
        baseX: bx,
        baseY: by,
        baseZ: bz,
        rotSpeed: (Math.random() - 0.5) * 0.0025,
        driftSpeed: (Math.random() - 0.5) * 0.001,
        scaleSpeed: 0.8 + Math.random() * 0.4,
      });
    }
    scene.add(smokeGroup);

    // D. Realistic Glowing Incense Embers System
    const emberCount = 90;
    const emberGeo = new THREE.BufferGeometry();
    const emberPositions = new Float32Array(emberCount * 3);
    const emberVelocities: Array<{ x: number; y: number; z: number; phase: number }> = [];

    for (let i = 0; i < emberCount; i++) {
      emberPositions[i * 3] = (Math.random() - 0.5) * 10;
      emberPositions[i * 3 + 1] = -3 + Math.random() * 6;
      emberPositions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      emberVelocities.push({
        x: (Math.random() - 0.5) * 0.006,
        y: 0.008 + Math.random() * 0.012,
        z: (Math.random() - 0.5) * 0.006,
        phase: Math.random() * Math.PI * 2,
      });
    }

    emberGeo.setAttribute("position", new THREE.BufferAttribute(emberPositions, 3));

    // Ember point sprite
    const emberCanvas = document.createElement("canvas");
    emberCanvas.width = 64;
    emberCanvas.height = 64;
    const ectx = emberCanvas.getContext("2d");
    if (ectx) {
      const egrad = ectx.createRadialGradient(32, 32, 0, 32, 32, 28);
      egrad.addColorStop(0, "rgba(255, 240, 200, 1)");
      egrad.addColorStop(0.3, "rgba(255, 140, 40, 0.8)");
      egrad.addColorStop(0.7, "rgba(200, 60, 20, 0.3)");
      egrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ectx.fillStyle = egrad;
      ectx.fillRect(0, 0, 64, 64);
    }
    const emberTexture = new THREE.CanvasTexture(emberCanvas);

    const emberMat = new THREE.PointsMaterial({
      size: 0.35,
      map: emberTexture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const emberPoints = new THREE.Points(emberGeo, emberMat);
    scene.add(emberPoints);

    // E. Dynamic Render Loop with Scroll Progress Dispersion
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      const elapsedTime = clock.getElapsedTime();
      const progress = smoothProgress.get(); // 0 to 1

      // 1. Camera fly-through on Z axis as user scrolls
      camera.position.z = 8 - progress * 3.5;
      camera.position.y = -progress * 1.2;

      // 2. Smoke Dispersal Physics:
      // At progress = 0: Thick, mysterious smoke cloud centered
      // As progress increases: Smoke expands outwards to the sides and opacity fades
      smokePuffs.forEach((puff, idx) => {
        puff.mesh.rotation.z += puff.rotSpeed;

        // Disperse outwards horizontally as progress increases
        const disperseDirection = puff.baseX > 0 ? 1 : -1;
        const disperseAmount = Math.pow(progress, 1.4) * 9.0 * disperseDirection;
        puff.mesh.position.x = puff.baseX + disperseAmount + Math.sin(elapsedTime * 0.4 + idx) * 0.15;
        puff.mesh.position.y = puff.baseY + Math.cos(elapsedTime * 0.3 + idx) * 0.15;

        // Dissolve / Fade out opacity as user scrolls
        const currentMat = puff.mesh.material as THREE.MeshLambertMaterial;
        const baseOpacity = 0.75;
        // At progress 0: 0.75. At progress 0.5: 0.35. At progress 1.0: 0.08
        currentMat.opacity = Math.max(0.04, baseOpacity * (1 - progress * 0.92));

        // Smoke expands as it dissolves
        const expansion = 1 + progress * 1.8 * puff.scaleSpeed;
        puff.mesh.scale.set(expansion, expansion, expansion);
      });

      // 3. Floating Embers Update
      const ePos = emberPoints.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < emberCount; i++) {
        const v = emberVelocities[i];
        ePos[i * 3 + 1] += v.y;
        ePos[i * 3] += v.x + Math.sin(elapsedTime * 1.5 + v.phase) * 0.005;

        // Respawn when reaching top
        if (ePos[i * 3 + 1] > 5) {
          ePos[i * 3 + 1] = -4;
          ePos[i * 3] = (Math.random() - 0.5) * 10;
        }
      }
      emberPoints.geometry.attributes.position.needsUpdate = true;

      // Pulse ember light
      amberPointLight.intensity = 2.0 + Math.sin(elapsedTime * 2) * 0.6;

      renderer.render(scene, camera);
    };

    render();

    // Window resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      smokeGeo.dispose();
      smokeTexture.dispose();
      emberGeo.dispose();
      emberMat.dispose();
      emberTexture.dispose();
    };
  }, [smoothProgress]);

  // Handle Mouse movement for 3D card tilt
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 2;
    const y = (clientY / window.innerHeight - 0.5) * 2;
    setMousePos({ x, y });
  };

  // Scroll to stage helper
  const scrollToStage = (stageIdx: number) => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const containerHeight = containerRef.current.scrollHeight - window.innerHeight;
    const targets = [0, 0.32, 0.6, 0.88];
    const targetY = containerTop + containerHeight * targets[stageIdx];
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  // ─────────────────────────────────────────────────────────────
  // 2. FRAMER MOTION OPACITY & TRANSFORM CURVES
  // ─────────────────────────────────────────────────────────────
  // Hero Title Layer: Visible at start (0% - 15%), dissolves & flies up by 25%
  const titleOpacity = useTransform(smoothProgress, [0, 0.12, 0.22], [1, 0.7, 0]);
  const titleY = useTransform(smoothProgress, [0, 0.22], [0, -90]);
  const titleScale = useTransform(smoothProgress, [0, 0.22], [1, 1.08]);
  const titleBlur = useTransform(smoothProgress, [0, 0.15, 0.22], ["0px", "5px", "14px"]);

  // Stage 1: Palo Santo (Emerges ~18%, Peaks at 32%, Departs ~46%)
  const p1Opacity = useTransform(smoothProgress, [0.16, 0.24, 0.38, 0.46], [0, 1, 1, 0]);
  const p1Y = useTransform(smoothProgress, [0.16, 0.24, 0.38, 0.46], [80, 0, 0, -80]);
  const p1Scale = useTransform(smoothProgress, [0.16, 0.24, 0.38, 0.46], [0.92, 1, 1, 0.94]);

  // Stage 2: White Sage (Emerges ~46%, Peaks at 58%, Departs ~72%)
  const p2Opacity = useTransform(smoothProgress, [0.46, 0.54, 0.66, 0.74], [0, 1, 1, 0]);
  const p2Y = useTransform(smoothProgress, [0.46, 0.54, 0.66, 0.74], [80, 0, 0, -80]);
  const p2Scale = useTransform(smoothProgress, [0.46, 0.54, 0.66, 0.74], [0.92, 1, 1, 0.94]);

  // Stage 3: Soy Candle (Emerges ~72%, Peaks at 84%, Departs ~98%)
  const p3Opacity = useTransform(smoothProgress, [0.72, 0.8, 0.92, 0.98], [0, 1, 1, 0]);
  const p3Y = useTransform(smoothProgress, [0.72, 0.8, 0.92, 0.98], [80, 0, 0, -80]);
  const p3Scale = useTransform(smoothProgress, [0.72, 0.8, 0.92, 0.98], [0.92, 1, 1, 0.94]);

  // Final Reveal Banner at end of scroll
  const finalBannerOpacity = useTransform(smoothProgress, [0.92, 0.98], [0, 1]);
  const finalBannerY = useTransform(smoothProgress, [0.92, 0.98], [40, 0]);

  return (
    <div
      ref={containerRef}
      id="showcase"
      onMouseMove={handleMouseMove}
      className="relative w-full h-[380vh] bg-linen-base"
    >
      {/* ─────────────────────────────────────────────────────────────
          STICKY FULL-SCREEN 3D VIEWPORT (Apple-Grade Scrollytelling)
         ───────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">
        {/* Realistic Three.js Volumetric Smoke & Embers Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />

        {/* Ambient Botanical Mist Vignette */}
        <div className="absolute inset-0 pointer-events-none z-1 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(240,243,235,0.75)_100%)]" />

        {/* ─────────────────────────────────────────────────────────
            A. SMOKE-BORN BRAND TITLE (Scroll 0% - 20%)
           ───────────────────────────────────────────────────────── */}
        <motion.div
          style={{
            opacity: titleOpacity,
            y: titleY,
            scale: titleScale,
            filter: `blur(${titleBlur})`,
          }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none select-none"
        >
          {/* Subtle Top Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/90 backdrop-blur-xl border border-forest-800/15 text-forest-800 text-[11px] sm:text-xs tracking-[0.35em] uppercase shadow-md mb-6">
            <Sparkles className="w-3.5 h-3.5 text-forest-600 animate-pulse" />
            <span>Nơi Khói Thiêng Đánh Thức Giác Quan</span>
          </div>

          {/* SMOKE TEXT EFFECT FOR STORE NAME: "TRẦM & KHÓI" */}
          <div className="relative my-2">
            {/* Background glowing aura behind text */}
            <div className="absolute inset-0 -m-8 bg-forest-200/40 rounded-full blur-[80px] pointer-events-none" />

            {/* Glowing Vapor Text */}
            <h1 className="font-serif text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] font-light tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-forest-950 via-forest-850 to-forest-700 drop-shadow-sm relative z-10 descender-safe">
              TRẦM &amp; KHÓI
            </h1>
          </div>

          {/* Subtitle with poetry */}
          <p className="max-w-xl mx-auto mt-4 text-forest-800/85 font-light text-base sm:text-lg md:text-xl tracking-wide leading-relaxed">
            Trở về với <span className="italic text-forest-700 font-normal">sự tĩnh tại</span>.
            <br />
            Làn khói mờ ảo khai mở hành trình thanh tẩy tâm trí và không gian.
          </p>

          {/* Subtle Zen Scroll Line */}
          <div className="mt-14 flex flex-col items-center gap-2.5 opacity-70 hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-forest-700 font-medium">Cuộn Để Khám Phá</span>
            <div className="w-[1px] h-10 bg-gradient-to-b from-forest-700 to-transparent" />
          </div>
        </motion.div>

        {/* ─────────────────────────────────────────────────────────
            B. STAGE 1: GỖ THÁNH PALO SANTO PERU (Scroll 20% - 46%)
           ───────────────────────────────────────────────────────── */}
        <motion.div
          style={{
            opacity: p1Opacity,
            y: p1Y,
            scale: p1Scale,
            transformPerspective: 1000,
            rotateX: mousePos.y * -5,
            rotateY: mousePos.x * 6,
          }}
          className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-8 lg:px-16 pointer-events-auto"
        >
          <ProductRevealCard
            stage={showcaseStages[0]}
            mousePos={mousePos}
            onAddToCart={() => handleAddToCart(showcaseStages[0].product.id)}
            onOpenModal={() => openProductModal(showcaseStages[0].product.id)}
            isAdded={addedId === showcaseStages[0].product.id}
          />
        </motion.div>

        {/* ─────────────────────────────────────────────────────────
            C. STAGE 2: BÓ XÔ THƠM TRẮNG CALIFORNIA (Scroll 46% - 72%)
           ───────────────────────────────────────────────────────── */}
        <motion.div
          style={{
            opacity: p2Opacity,
            y: p2Y,
            scale: p2Scale,
            transformPerspective: 1000,
            rotateX: mousePos.y * -5,
            rotateY: mousePos.x * 6,
          }}
          className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-8 lg:px-16 pointer-events-auto"
        >
          <ProductRevealCard
            stage={showcaseStages[1]}
            mousePos={mousePos}
            onAddToCart={() => handleAddToCart(showcaseStages[1].product.id)}
            onOpenModal={() => openProductModal(showcaseStages[1].product.id)}
            isAdded={addedId === showcaseStages[1].product.id}
          />
        </motion.div>

        {/* ─────────────────────────────────────────────────────────
            D. STAGE 3: NẾN THƠM SÁP ĐẬU NÀNH (Scroll 72% - 98%)
           ───────────────────────────────────────────────────────── */}
        <motion.div
          style={{
            opacity: p3Opacity,
            y: p3Y,
            scale: p3Scale,
            transformPerspective: 1000,
            rotateX: mousePos.y * -5,
            rotateY: mousePos.x * 6,
          }}
          className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-8 lg:px-16 pointer-events-auto"
        >
          <ProductRevealCard
            stage={showcaseStages[2]}
            mousePos={mousePos}
            onAddToCart={() => handleAddToCart(showcaseStages[2].product.id)}
            onOpenModal={() => openProductModal(showcaseStages[2].product.id)}
            isAdded={addedId === showcaseStages[2].product.id}
          />
        </motion.div>

        {/* ─────────────────────────────────────────────────────────
            E. FINAL STAGE TRANSITION: SMOKE CLEARED
           ───────────────────────────────────────────────────────── */}
        <motion.div
          style={{
            opacity: finalBannerOpacity,
            y: finalBannerY,
          }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-auto text-center w-full max-w-xl px-4"
        >
          <div className="bg-white/95 p-6 rounded-2xl border border-forest-800/15 shadow-xl backdrop-blur-xl flex flex-col items-center gap-3">
            <div className="inline-flex items-center gap-2 text-forest-700 text-xs tracking-widest uppercase font-medium">
              <Sparkles className="w-4 h-4 text-forest-600" />
              <span>Khói Đã Tan • Không Gian Thanh Tịnh Rộng Mở</span>
            </div>
            <p className="text-forest-800/85 text-sm font-light">
              Bạn đã vén trọn làn sương bí ẩn. Hãy tiếp tục khám phá toàn bộ bộ sưu tập vật phẩm chữa lành.
            </p>
            <a
              href="#collections"
              className="mt-2 px-7 py-3 bg-forest-800 hover:bg-forest-700 text-white font-semibold text-xs tracking-[0.25em] uppercase rounded-full transition-all duration-300 shadow-xl shadow-forest-900/15 flex items-center gap-2 group cursor-pointer"
            >
              <span>Xem Toàn Bộ Tuyển Tập</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>

        {/* ─────────────────────────────────────────────────────────
            F. SCROLL PROGRESS HUD INDICATOR (Right Edge)
           ───────────────────────────────────────────────────────── */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-4">
          <div className="text-[10px] uppercase tracking-widest text-forest-700 font-semibold -rotate-90 origin-center mb-8 whitespace-nowrap">
            Khói Thiêng 3D
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: "Mở Đầu Khói", icon: "💨" },
              { label: "Gỗ Palo Santo", icon: "🪵" },
              { label: "Xô Thơm Trắng", icon: "🌿" },
              { label: "Nến Thơm Rừng", icon: "🕯️" },
            ].map((stg, i) => (
              <button
                key={i}
                onClick={() => scrollToStage(i)}
                title={stg.label}
                className={`group relative flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 cursor-pointer ${
                  activeStageIndex === i
                    ? "border-forest-700 bg-forest-100 text-forest-900 shadow-md shadow-forest-800/15 scale-110"
                    : "border-forest-800/15 bg-white/90 text-forest-700/60 hover:text-forest-900 hover:border-forest-600 shadow-sm"
                }`}
              >
                <span className="text-xs">{stg.icon}</span>
                <span className="absolute right-10 whitespace-nowrap px-3 py-1 rounded-full bg-forest-900 text-[10px] tracking-wider uppercase text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                  {stg.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPONENT: REALISTIC 3D PRODUCT REVEAL CARD
// ─────────────────────────────────────────────────────────────
function ProductRevealCard({
  stage,
  mousePos,
  onAddToCart,
  onOpenModal,
  isAdded,
}: {
  stage: ShowcaseStage;
  mousePos: { x: number; y: number };
  onAddToCart: () => void;
  onOpenModal: () => void;
  isAdded: boolean;
}) {
  const { product, stageName, stageSub, glowColor, accentColor } = stage;

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
      {/* LEFT / CENTER: PHOTOREALISTIC 3D PRODUCT DISPLAY WITH DEPTH & GLOW */}
      <div className="lg:col-span-7 relative group flex items-center justify-center">
        {/* Multi-layered Aura & Realistic Glow behind product */}
        <div
          style={{ background: "rgba(56, 107, 79, 0.25)" }}
          className="absolute w-[80%] h-[80%] rounded-full blur-[90px] pointer-events-none transition-all duration-1000 opacity-60 group-hover:opacity-85 group-hover:scale-105"
        />

        {/* 3D Floating Stand with Depth & Tilt */}
        <div
          style={{
            transform: `perspective(1000px) rotateX(${mousePos.y * -8}deg) rotateY(${
              mousePos.x * 10
            }deg) translateZ(30px)`,
            transition: "transform 0.2s cubic-bezier(0.2, 0, 0.2, 1)",
          }}
          className="relative w-full aspect-[4/3.5] sm:aspect-[4/3] max-w-[540px] rounded-2xl overflow-hidden bg-white/95 backdrop-blur-md border border-forest-800/15 shadow-xl p-4 sm:p-6 flex items-center justify-center"
        >
          {/* Actual High-Resolution Product Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center rounded-xl filter drop-shadow-[0_12px_25px_rgba(20,40,28,0.15)] brightness-105 contrast-105 transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Soft Glass Shine Reflection Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none rounded-xl" />

          {/* Floating Origin & Badge Tag in 3D Space */}
          <div className="absolute top-8 left-8 flex flex-col gap-2 z-10">
            <span className="px-3 py-1 rounded-full bg-forest-900 text-white text-[10px] font-semibold tracking-wider uppercase shadow-md">
              {product.badge || "Tuyển Chọn"}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/90 text-forest-800 text-[10px] tracking-wider uppercase border border-forest-800/15 backdrop-blur-md shadow-sm">
              {product.origin}
            </span>
          </div>

          {/* Click to inspect badge */}
          <button
            onClick={onOpenModal}
            className="absolute bottom-8 right-8 px-4 py-2 rounded-full bg-white/90 hover:bg-forest-800 text-forest-800 hover:text-white text-xs font-medium tracking-wider uppercase border border-forest-800/20 flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Phóng To 360°</span>
          </button>
        </div>
      </div>

      {/* RIGHT: STORY & REVEAL DETAILS */}
      <div className="lg:col-span-5 space-y-5 text-left">
        {/* Stage Header */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase font-semibold text-forest-700">
            <Sparkles className="w-3.5 h-3.5 text-forest-600" />
            <span>{stageSub}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-forest-950 font-light leading-tight">
            {product.name}
          </h2>
        </div>

        {/* Scent & Aroma Pyramid Highlights */}
        <div className="bg-white/90 p-4 rounded-xl border border-forest-800/15 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-forest-700">
            <span className="text-forest-800 font-semibold">Hương Thơm Đặc Trưng:</span>
            <div className="flex items-center gap-1 text-amberWood">
              <Star className="w-3.5 h-3.5 fill-amberWood" />
              <span className="text-forest-900 font-bold">{product.rating}</span>
              <span className="text-forest-600 font-serif">({product.reviewsCount})</span>
            </div>
          </div>
          <p className="text-xs text-forest-700 font-serif italic font-medium">
            ✦ {product.notes}
          </p>
          <div className="pt-2 border-t border-forest-800/10 grid grid-cols-3 gap-2 text-[10px] text-forest-700">
            <div>
              <span className="text-forest-500 block">Tầng đầu:</span>
              <span className="text-forest-900 font-medium line-clamp-1">{product.scentPyramid.top}</span>
            </div>
            <div>
              <span className="text-forest-500 block">Tầng giữa:</span>
              <span className="text-forest-900 font-medium line-clamp-1">{product.scentPyramid.middle}</span>
            </div>
            <div>
              <span className="text-forest-500 block">Tầng đáy:</span>
              <span className="text-forest-900 font-medium line-clamp-1">{product.scentPyramid.base}</span>
            </div>
          </div>
        </div>

        {/* Narrative Description */}
        <p className="text-forest-800/85 font-light text-sm sm:text-base leading-relaxed line-clamp-3">
          {product.desc}
        </p>

        {/* Price & Primary Call to Action */}
        <div className="pt-3 border-t border-forest-800/15 flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] tracking-wider uppercase text-forest-600 font-medium">Giá Niêm Yết</div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl sm:text-3xl text-forest-900 font-semibold">
                {product.price.toLocaleString("vi-VN")} đ
              </span>
              {product.originalPrice && (
                <span className="text-xs text-forest-500 line-through font-serif">
                  {product.originalPrice.toLocaleString("vi-VN")} đ
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenModal}
              className="px-4 py-3 border border-forest-800/20 hover:border-forest-700 text-forest-800 hover:text-forest-950 text-xs tracking-widest uppercase font-medium rounded-full transition-all bg-white/90 cursor-pointer shadow-sm"
            >
              Chi Tiết
            </button>
            <button
              onClick={onAddToCart}
              className="px-6 py-3 bg-forest-800 hover:bg-forest-700 text-white font-semibold text-xs tracking-[0.2em] uppercase rounded-full transition-all duration-300 shadow-xl shadow-forest-900/15 hover:shadow-forest-900/25 flex items-center gap-2 cursor-pointer"
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>Đã Thêm</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>+ Giỏ Hàng</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
