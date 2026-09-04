"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

export type AtmosphereMode = "mystic" | "amber" | "mist";

interface HeroNature3DProps {
  atmosphere?: AtmosphereMode;
  onAtmosphereChange?: (mode: AtmosphereMode) => void;
}

interface AtmosphereTheme {
  name: string;
  label: string;
  icon: string;
  fogColor: number;
  fogDensity: number;
  ambientColor: number;
  ambientIntensity: number;
  coreColor: number;
  coreIntensity: number;
  rimColor: number;
  foliageColor: number;
  foliageEmissive: number;
  terrainColor: number;
  fireflyColor: string;
  fireflyGlow: string;
}

const THEMES: Record<AtmosphereMode, AtmosphereTheme> = {
  mystic: {
    name: "mystic",
    label: "Dạ Cảnh Rừng Thiêng",
    icon: "🌿",
    fogColor: 0x070f0b,
    fogDensity: 0.042,
    ambientColor: 0x0f241a,
    ambientIntensity: 1.6,
    coreColor: 0x2ee59d,
    coreIntensity: 3.5,
    rimColor: 0xd4a373,
    foliageColor: 0x18402b,
    foliageEmissive: 0x1b794b,
    terrainColor: 0x0a1610,
    fireflyColor: "rgba(110, 255, 180, 0.95)",
    fireflyGlow: "rgba(30, 200, 115, 0.3)",
  },
  amber: {
    name: "amber",
    label: "Ánh Lửa Trầm Hương",
    icon: "🔥",
    fogColor: 0x110b07,
    fogDensity: 0.038,
    ambientColor: 0x2b180d,
    ambientIntensity: 1.8,
    coreColor: 0xffaa33,
    coreIntensity: 4.2,
    rimColor: 0xff6622,
    foliageColor: 0x3d2716,
    foliageEmissive: 0x8a4512,
    terrainColor: 0x160f09,
    fireflyColor: "rgba(255, 195, 100, 0.95)",
    fireflyGlow: "rgba(230, 120, 30, 0.35)",
  },
  mist: {
    name: "mist",
    label: "Sương Mù Cổ Sơn",
    icon: "☁️",
    fogColor: 0x0a1219,
    fogDensity: 0.048,
    ambientColor: 0x132230,
    ambientIntensity: 1.7,
    coreColor: 0x7be5ff,
    coreIntensity: 3.2,
    rimColor: 0xe6c594,
    foliageColor: 0x1a2e3b,
    foliageEmissive: 0x266885,
    terrainColor: 0x0d1720,
    fireflyColor: "rgba(160, 230, 255, 0.95)",
    fireflyGlow: "rgba(80, 180, 230, 0.3)",
  },
};

export default function HeroNature3D({
  atmosphere = "mystic",
  onAtmosphereChange,
}: HeroNature3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentMode, setCurrentMode] = useState<AtmosphereMode>(atmosphere);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showInteractHint, setShowInteractHint] = useState(true);

  // Three.js object references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const coreLightRef = useRef<THREE.PointLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);
  const foliageMatsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const treeCoreMeshRef = useRef<THREE.Mesh | null>(null);
  const runesGroupRef = useRef<THREE.Group | null>(null);
  const stonesGroupRef = useRef<THREE.Group | null>(null);
  const firefliesPointsRef = useRef<THREE.Points | null>(null);
  const natureDustPointsRef = useRef<THREE.Points | null>(null);
  const clickRipplesRef = useRef<THREE.Points | null>(null);
  const terrainMeshRef = useRef<THREE.Mesh | null>(null);
  const fogRef = useRef<THREE.FogExp2 | null>(null);

  // Interaction & Physics state
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isMoving: false });
  const clickParticlesDataRef = useRef<
    Array<{ x: number; y: number; z: number; vx: number; vy: number; vz: number; life: number; maxLife: number }>
  >([]);
  const isIntersectingRef = useRef(true);
  const currentModeRef = useRef<AtmosphereMode>(currentMode);

  useEffect(() => {
    currentModeRef.current = currentMode;
  }, [currentMode]);

  // Create soft circular glowing sprite
  const createFireflyTexture = useCallback((glowColor: string, coreColor: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
      grad.addColorStop(0, coreColor);
      grad.addColorStop(0.25, glowColor);
      grad.addColorStop(0.65, "rgba(20, 20, 20, 0.15)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Mode changer handler
  const handleModeSelect = (mode: AtmosphereMode) => {
    setCurrentMode(mode);
    if (onAtmosphereChange) onAtmosphereChange(mode);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ─────────────────────────────────────────────────────────────
    // 1. SCENE & CAMERA SETUP
    // ─────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const initialTheme = THEMES[currentModeRef.current];
    const fog = new THREE.FogExp2(initialTheme.fogColor, initialTheme.fogDensity);
    scene.fog = fog;
    fogRef.current = fog;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.9, 7.2);
    camera.lookAt(0, 0.1, 0);
    cameraRef.current = camera;

    // ─────────────────────────────────────────────────────────────
    // 2. RENDERER SETUP
    // ─────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // ─────────────────────────────────────────────────────────────
    // 3. LIGHTING SYSTEM
    // ─────────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(initialTheme.ambientColor, initialTheme.ambientIntensity);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const coreLight = new THREE.PointLight(initialTheme.coreColor, initialTheme.coreIntensity, 14, 1.8);
    coreLight.position.set(0, 0.7, 0.2);
    coreLight.castShadow = true;
    scene.add(coreLight);
    coreLightRef.current = coreLight;

    const rimLight = new THREE.DirectionalLight(initialTheme.rimColor, 1.5);
    rimLight.position.set(-5, 6, -4);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    const moonLight = new THREE.DirectionalLight(0xa5c4d4, 1.0);
    moonLight.position.set(5, 8, 4);
    scene.add(moonLight);

    // ─────────────────────────────────────────────────────────────
    // 4. PROCEDURAL SACRED FOREST TERRAIN WITH ENERGY LAKE
    // ─────────────────────────────────────────────────────────────
    const terrainGeo = new THREE.PlaneGeometry(28, 28, 80, 80);
    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const distFromCenter = Math.sqrt(vx * vx + vy * vy);
      
      // Undulating mountain valleys & smooth center sanctuary hollow
      let elevation = (Math.sin(vx * 0.45) * Math.cos(vy * 0.45) * 0.65) + 
                      (Math.sin(vx * 0.9 + 1.2) * Math.sin(vy * 0.9) * 0.28);
      
      // Dip center for sacred water pool/altar
      if (distFromCenter < 2.5) {
        elevation *= (distFromCenter / 2.5);
      } else {
        elevation += (distFromCenter - 2.5) * 0.12;
      }

      pos.setZ(i, elevation);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: initialTheme.terrainColor,
      roughness: 0.88,
      metalness: 0.08,
      flatShading: false,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -1.65;
    terrain.receiveShadow = true;
    scene.add(terrain);
    terrainMeshRef.current = terrain;

    // Sacred Pond Mirror in Center
    const pondGeo = new THREE.CircleGeometry(2.3, 48);
    const pondMat = new THREE.MeshStandardMaterial({
      color: 0x051210,
      roughness: 0.15,
      metalness: 0.85,
    });
    const pond = new THREE.Mesh(pondGeo, pondMat);
    pond.rotation.x = -Math.PI / 2;
    pond.position.y = -1.62;
    scene.add(pond);

    // Pond Glowing Border Ring
    const pondRingGeo = new THREE.RingGeometry(2.26, 2.38, 48);
    const pondRingMat = new THREE.MeshBasicMaterial({
      color: initialTheme.coreColor,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    });
    const pondRing = new THREE.Mesh(pondRingGeo, pondRingMat);
    pondRing.rotation.x = -Math.PI / 2;
    pondRing.position.y = -1.61;
    scene.add(pondRing);

    // ─────────────────────────────────────────────────────────────
    // 5. THE SACRED TREE OF LIFE (ANCIENT WOOD & LUMINOUS CROWN)
    // ─────────────────────────────────────────────────────────────
    const treeGroup = new THREE.Group();
    treeGroup.position.set(0, -1.6, 0);

    // A. Sculpted Organic Trunk with Root Flair
    const trunkCurvePoints: THREE.Vector3[] = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.12, 0.8, -0.05),
      new THREE.Vector3(-0.15, 1.5, 0.08),
      new THREE.Vector3(0.05, 2.2, -0.02),
      new THREE.Vector3(-0.02, 2.8, 0.04),
    ];
    const trunkCurve = new THREE.CatmullRomCurve3(trunkCurvePoints);
    const trunkGeo = new THREE.TubeGeometry(trunkCurve, 32, 0.42, 16, false);

    // Deform trunk vertices for organic bark texture
    const trunkPos = trunkGeo.attributes.position;
    for (let i = 0; i < trunkPos.count; i++) {
      const tx = trunkPos.getX(i);
      const ty = trunkPos.getY(i);
      const tz = trunkPos.getZ(i);
      const rootExpansion = Math.max(0, (1.2 - ty) * 0.45);
      const barkNoise = (Math.sin(ty * 14) + Math.cos(tx * 12)) * 0.025;
      trunkPos.setX(i, tx * (1 + rootExpansion) + barkNoise);
      trunkPos.setZ(i, tz * (1 + rootExpansion) + barkNoise);
    }
    trunkGeo.computeVertexNormals();

    const barkMat = new THREE.MeshStandardMaterial({
      color: 0x221a14,
      roughness: 0.92,
      metalness: 0.05,
    });
    const trunkMesh = new THREE.Mesh(trunkGeo, barkMat);
    trunkMesh.castShadow = true;
    trunkMesh.receiveShadow = true;
    treeGroup.add(trunkMesh);

    // B. Major Arching Branches
    const branchConfigs = [
      { start: new THREE.Vector3(-0.02, 2.4, 0), end: new THREE.Vector3(-1.4, 3.2, 0.6), radius: 0.16 },
      { start: new THREE.Vector3(0.04, 2.5, -0.02), end: new THREE.Vector3(1.3, 3.3, -0.4), radius: 0.15 },
      { start: new THREE.Vector3(-0.08, 2.2, 0.05), end: new THREE.Vector3(-0.8, 2.9, -1.0), radius: 0.13 },
      { start: new THREE.Vector3(0.06, 2.3, 0.02), end: new THREE.Vector3(0.9, 3.1, 0.8), radius: 0.14 },
      { start: new THREE.Vector3(0, 2.8, 0), end: new THREE.Vector3(0.2, 3.8, 0.1), radius: 0.16 },
    ];

    branchConfigs.forEach((cfg) => {
      const mid = new THREE.Vector3()
        .addVectors(cfg.start, cfg.end)
        .multiplyScalar(0.5)
        .add(new THREE.Vector3((Math.random() - 0.5) * 0.4, 0.25, (Math.random() - 0.5) * 0.4));
      const bCurve = new THREE.CatmullRomCurve3([cfg.start, mid, cfg.end]);
      const bGeo = new THREE.TubeGeometry(bCurve, 16, cfg.radius, 10, false);
      const bMesh = new THREE.Mesh(bGeo, barkMat);
      bMesh.castShadow = true;
      treeGroup.add(bMesh);
    });

    // C. Ethereal Bioluminescent Foliage Clusters
    foliageMatsRef.current = [];
    const foliageClusterConfigs = [
      { pos: new THREE.Vector3(0.2, 3.85, 0.1), scale: 1.1 },
      { pos: new THREE.Vector3(-1.45, 3.25, 0.65), scale: 0.95 },
      { pos: new THREE.Vector3(1.35, 3.35, -0.45), scale: 0.92 },
      { pos: new THREE.Vector3(-0.85, 2.95, -1.05), scale: 0.82 },
      { pos: new THREE.Vector3(0.95, 3.15, 0.85), scale: 0.88 },
      { pos: new THREE.Vector3(-0.6, 3.6, 0.3), scale: 0.8 },
      { pos: new THREE.Vector3(0.7, 3.55, -0.2), scale: 0.85 },
    ];

    foliageClusterConfigs.forEach((c) => {
      const fGeo = new THREE.DodecahedronGeometry(0.7 * c.scale, 2);
      const fPos = fGeo.attributes.position;
      for (let i = 0; i < fPos.count; i++) {
        const fx = fPos.getX(i);
        const fy = fPos.getY(i);
        const fz = fPos.getZ(i);
        const fNoise = (Math.sin(fx * 10) + Math.cos(fy * 10) + Math.sin(fz * 10)) * 0.04;
        fPos.setXYZ(i, fx + fNoise, (fy + fNoise) * 0.75, fz + fNoise);
      }
      fGeo.computeVertexNormals();

      const fMat = new THREE.MeshStandardMaterial({
        color: initialTheme.foliageColor,
        emissive: initialTheme.foliageEmissive,
        emissiveIntensity: 0.6,
        roughness: 0.55,
        metalness: 0.15,
        transparent: true,
        opacity: 0.92,
      });
      foliageMatsRef.current.push(fMat);

      const fMesh = new THREE.Mesh(fGeo, fMat);
      fMesh.position.copy(c.pos);
      fMesh.castShadow = true;
      treeGroup.add(fMesh);
    });

    // D. The Glowing Heart / Sacred Core
    const coreGeo = new THREE.IcosahedronGeometry(0.35, 3);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: initialTheme.coreColor,
      emissiveIntensity: 2.5,
      roughness: 0.2,
      metalness: 0.1,
    });
    const treeCoreMesh = new THREE.Mesh(coreGeo, coreMat);
    treeCoreMesh.position.set(0, 2.3, 0.05);
    treeGroup.add(treeCoreMesh);
    treeCoreMeshRef.current = treeCoreMesh;

    // E. Floating Celestial Runes & Rings
    const runesGroup = new THREE.Group();
    runesGroup.position.copy(treeCoreMesh.position);

    const ring1Geo = new THREE.TorusGeometry(0.85, 0.015, 8, 36);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: initialTheme.rimColor, wireframe: true });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    runesGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(1.15, 0.012, 8, 36);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: initialTheme.coreColor, wireframe: true });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 5;
    runesGroup.add(ring2);

    treeGroup.add(runesGroup);
    runesGroupRef.current = runesGroup;

    scene.add(treeGroup);

    // ─────────────────────────────────────────────────────────────
    // 6. FLOATING SACRED ZEN STONES / MONOLITHS
    // ─────────────────────────────────────────────────────────────
    const stonesGroup = new THREE.Group();
    const stoneConfigs = [
      { pos: new THREE.Vector3(-2.4, 0.3, 0.8), rot: [0.3, 0.5, 0.1], scale: [0.35, 0.7, 0.3] },
      { pos: new THREE.Vector3(2.6, 0.6, -0.6), rot: [-0.2, 0.8, -0.3], scale: [0.4, 0.85, 0.38] },
      { pos: new THREE.Vector3(-1.8, -0.5, -1.5), rot: [0.5, -0.3, 0.4], scale: [0.3, 0.55, 0.28] },
      { pos: new THREE.Vector3(2.0, -0.3, 1.6), rot: [-0.4, -0.4, 0.2], scale: [0.38, 0.65, 0.32] },
    ];

    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0x1f1d1a,
      roughness: 0.85,
      metalness: 0.1,
      emissive: initialTheme.coreColor,
      emissiveIntensity: 0.2,
    });

    stoneConfigs.forEach((sc, idx) => {
      const sGeo = new THREE.DodecahedronGeometry(1, 1);
      const sMesh = new THREE.Mesh(sGeo, stoneMat);
      sMesh.position.copy(sc.pos);
      sMesh.rotation.set(sc.rot[0], sc.rot[1], sc.rot[2]);
      sMesh.scale.set(sc.scale[0], sc.scale[1], sc.scale[2]);
      sMesh.userData = { initialY: sc.pos.y, speed: 0.8 + idx * 0.25, phase: idx * 1.5 };
      stonesGroup.add(sMesh);
    });

    scene.add(stonesGroup);
    stonesGroupRef.current = stonesGroup;

    // ─────────────────────────────────────────────────────────────
    // 7. BIOLUMINESCENT FIREFLIES SYSTEM (220 DYNAMIC PARTICLES)
    // ─────────────────────────────────────────────────────────────
    const fireflyCount = 220;
    const fireflyGeo = new THREE.BufferGeometry();
    const fireflyPositions = new Float32Array(fireflyCount * 3);
    const fireflyVelocities: Array<{ x: number; y: number; z: number; phase: number; speed: number }> = [];

    for (let i = 0; i < fireflyCount; i++) {
      const radius = 0.5 + Math.random() * 5.2;
      const theta = Math.random() * Math.PI * 2;
      const y = -1.2 + Math.random() * 5.0;

      fireflyPositions[i * 3] = Math.cos(theta) * radius;
      fireflyPositions[i * 3 + 1] = y;
      fireflyPositions[i * 3 + 2] = Math.sin(theta) * radius;

      fireflyVelocities.push({
        x: (Math.random() - 0.5) * 0.008,
        y: 0.003 + Math.random() * 0.006,
        z: (Math.random() - 0.5) * 0.008,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 1.2,
      });
    }

    fireflyGeo.setAttribute("position", new THREE.BufferAttribute(fireflyPositions, 3));

    const fireflyTexture = createFireflyTexture(initialTheme.fireflyGlow, initialTheme.fireflyColor);

    const fireflyMat = new THREE.PointsMaterial({
      size: 0.45,
      map: fireflyTexture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const firefliesPoints = new THREE.Points(fireflyGeo, fireflyMat);
    scene.add(firefliesPoints);
    firefliesPointsRef.current = firefliesPoints;

    // ─────────────────────────────────────────────────────────────
    // 8. NATURE SPORES & CELESTIAL STARDUST (300 PARTICLES)
    // ─────────────────────────────────────────────────────────────
    const dustCount = 300;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 16;
      dustPositions[i * 3 + 1] = -1.5 + Math.random() * 9;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));

    const dustMat = new THREE.PointsMaterial({
      size: 0.12,
      color: initialTheme.rimColor,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const natureDust = new THREE.Points(dustGeo, dustMat);
    scene.add(natureDust);
    natureDustPointsRef.current = natureDust;

    // ─────────────────────────────────────────────────────────────
    // 9. INTERACTIVE CLICK BURST RIPPLES
    // ─────────────────────────────────────────────────────────────
    const clickPoolSize = 60;
    const clickGeo = new THREE.BufferGeometry();
    const clickPositions = new Float32Array(clickPoolSize * 3);
    clickPositions.fill(-999);
    clickGeo.setAttribute("position", new THREE.BufferAttribute(clickPositions, 3));

    const clickMat = new THREE.PointsMaterial({
      size: 0.35,
      map: fireflyTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const clickRipples = new THREE.Points(clickGeo, clickMat);
    scene.add(clickRipples);
    clickRipplesRef.current = clickRipples;

    // ─────────────────────────────────────────────────────────────
    // 10. DRIFTING FOREST FOG / MIST CLOUDS
    // ─────────────────────────────────────────────────────────────
    const fogPlanesGroup = new THREE.Group();
    const fogCanvas = document.createElement("canvas");
    fogCanvas.width = 128;
    fogCanvas.height = 128;
    const fctx = fogCanvas.getContext("2d");
    if (fctx) {
      const fgrad = fctx.createRadialGradient(64, 64, 0, 64, 64, 60);
      fgrad.addColorStop(0, "rgba(200, 240, 225, 0.25)");
      fgrad.addColorStop(0.5, "rgba(120, 180, 160, 0.08)");
      fgrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      fctx.fillStyle = fgrad;
      fctx.fillRect(0, 0, 128, 128);
    }
    const fogTexture = new THREE.CanvasTexture(fogCanvas);

    const fogPlaneMat = new THREE.MeshBasicMaterial({
      map: fogTexture,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    for (let i = 0; i < 8; i++) {
      const fpGeo = new THREE.PlaneGeometry(7.5, 4.2);
      const fp = new THREE.Mesh(fpGeo, fogPlaneMat);
      fp.position.set((Math.random() - 0.5) * 8, -1.0 + Math.random() * 0.8, (Math.random() - 0.5) * 6);
      fp.rotation.x = -0.2;
      fp.userData = { rotSpeed: (Math.random() - 0.5) * 0.001, driftSpeed: 0.002 + Math.random() * 0.003 };
      fogPlanesGroup.add(fp);
    }
    scene.add(fogPlanesGroup);

    // ─────────────────────────────────────────────────────────────
    // 11. EVENT LISTENERS
    // ─────────────────────────────────────────────────────────────
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = normX * 0.65;
      mouseRef.current.targetY = normY * 0.45;
      mouseRef.current.isMoving = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = container.getBoundingClientRect();
        const touch = e.touches[0];
        const normX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const normY = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
        mouseRef.current.targetX = normX * 0.8;
        mouseRef.current.targetY = normY * 0.5;
        mouseRef.current.isMoving = true;
      }
    };

    const handleClickOrTouch = (e: MouseEvent | TouchEvent) => {
      setShowInteractHint(false);
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const rect = container.getBoundingClientRect();
      const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((clientY - rect.top) / rect.height) * 2 - 1);

      const vector = new THREE.Vector3(nx, ny, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z + 2.5;
      const burstOrigin = camera.position.clone().add(dir.multiplyScalar(distance));

      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.04 + Math.random() * 0.08;
        clickParticlesDataRef.current.push({
          x: burstOrigin.x + (Math.random() - 0.5) * 0.2,
          y: burstOrigin.y + (Math.random() - 0.5) * 0.2,
          z: burstOrigin.z + (Math.random() - 0.5) * 0.2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + 0.02,
          vz: (Math.random() - 0.5) * speed,
          life: 0,
          maxLife: 45 + Math.random() * 30,
        });
      }

      if (clickParticlesDataRef.current.length > clickPoolSize) {
        clickParticlesDataRef.current.splice(0, clickParticlesDataRef.current.length - clickPoolSize);
      }
    };

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersectingRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    window.addEventListener("resize", handleResize);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("click", handleClickOrTouch);
    container.addEventListener("touchstart", handleClickOrTouch, { passive: true });

    setIsLoaded(true);

    // ─────────────────────────────────────────────────────────────
    // 12. ANIMATION / RENDER LOOP
    // ─────────────────────────────────────────────────────────────
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isIntersectingRef.current) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth camera parallax
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      camera.position.x = mouseRef.current.x * 1.8;
      camera.position.y = 0.9 + mouseRef.current.y * 0.8 + Math.sin(elapsedTime * 0.4) * 0.08;
      camera.position.z = 7.2 - Math.abs(mouseRef.current.x) * 0.4;
      camera.lookAt(0, 0.2, 0);

      // Breathing Tree Core Light pulse
      const breathe = (Math.sin(elapsedTime * 1.8) + 1.2) * 0.5;
      if (coreLightRef.current && treeCoreMeshRef.current) {
        const theme = THEMES[currentModeRef.current];
        coreLightRef.current.intensity = theme.coreIntensity * (0.85 + breathe * 0.35);
        (treeCoreMeshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
          2.0 + breathe * 1.5;
        treeCoreMeshRef.current.rotation.y = elapsedTime * 0.4;
        treeCoreMeshRef.current.rotation.z = elapsedTime * 0.2;
      }

      // Rotate Celestial Rings around Core
      if (runesGroupRef.current) {
        runesGroupRef.current.children[0].rotation.z = elapsedTime * 0.35;
        runesGroupRef.current.children[1].rotation.x = -elapsedTime * 0.28;
      }

      // Levitate Zen Stones
      if (stonesGroupRef.current) {
        stonesGroupRef.current.children.forEach((stone) => {
          const ud = stone.userData;
          stone.position.y = ud.initialY + Math.sin(elapsedTime * ud.speed + ud.phase) * 0.14;
          stone.rotation.y += 0.003;
          stone.rotation.x += 0.001;
        });
      }

      // Drift Forest Fog
      fogPlanesGroup.children.forEach((fp) => {
        fp.position.x += fp.userData.driftSpeed;
        fp.rotation.z += fp.userData.rotSpeed;
        if (fp.position.x > 6) fp.position.x = -6;
      });

      // Update Fireflies Swarm Physics
      if (firefliesPointsRef.current) {
        const fPos = firefliesPointsRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < fireflyCount; i++) {
          const v = fireflyVelocities[i];
          const px = fPos[i * 3];
          const py = fPos[i * 3 + 1];

          const turbX = Math.sin(elapsedTime * v.speed + v.phase) * 0.006;
          const turbY = Math.cos(elapsedTime * v.speed * 0.8 + v.phase) * 0.005;
          const turbZ = Math.sin(elapsedTime * v.speed * 1.2 + v.phase) * 0.006;

          fPos[i * 3] += v.x + turbX;
          fPos[i * 3 + 1] += v.y + turbY;
          fPos[i * 3 + 2] += v.z + turbZ;

          const dx = px - camera.position.x;
          const dy = py - camera.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 1.8 && dist > 0.01) {
            fPos[i * 3] += (dx / dist) * 0.02;
            fPos[i * 3 + 1] += (dy / dist) * 0.02;
          }

          if (fPos[i * 3 + 1] > 4.5) {
            fPos[i * 3 + 1] = -1.4;
          }
          if (Math.abs(fPos[i * 3]) > 6.0) fPos[i * 3] *= -0.95;
          if (Math.abs(fPos[i * 3 + 2]) > 6.0) fPos[i * 3 + 2] *= -0.95;
        }
        firefliesPointsRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Update Stardust particles
      if (natureDustPointsRef.current) {
        const dPos = natureDustPointsRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < dustCount; i++) {
          dPos[i * 3 + 1] += 0.002;
          if (dPos[i * 3 + 1] > 7.5) dPos[i * 3 + 1] = -1.5;
        }
        natureDustPointsRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Update Interactive Click Burst Embers
      if (clickRipplesRef.current) {
        const cPos = clickRipplesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < clickPoolSize; i++) {
          const cp = clickParticlesDataRef.current[i];
          if (cp && cp.life < cp.maxLife) {
            cp.life++;
            cp.x += cp.vx;
            cp.y += cp.vy;
            cp.z += cp.vz;
            cp.vy -= 0.0008;

            cPos[i * 3] = cp.x;
            cPos[i * 3 + 1] = cp.y;
            cPos[i * 3 + 2] = cp.z;
          } else {
            cPos[i * 3] = -999;
            cPos[i * 3 + 1] = -999;
            cPos[i * 3 + 2] = -999;
          }
        }
        clickRipplesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("click", handleClickOrTouch);
      container.removeEventListener("touchstart", handleClickOrTouch);

      renderer.dispose();
      terrainGeo.dispose();
      terrainMat.dispose();
      pondGeo.dispose();
      pondMat.dispose();
      pondRingGeo.dispose();
      pondRingMat.dispose();
      trunkGeo.dispose();
      barkMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      fireflyGeo.dispose();
      fireflyMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      clickGeo.dispose();
      clickMat.dispose();
    };
  }, [createFireflyTexture]);

  // Dynamic Theme Color Transitions
  useEffect(() => {
    const theme = THEMES[currentMode];

    if (fogRef.current) {
      fogRef.current.color.setHex(theme.fogColor);
      fogRef.current.density = theme.fogDensity;
    }

    if (coreLightRef.current) {
      coreLightRef.current.color.setHex(theme.coreColor);
      coreLightRef.current.intensity = theme.coreIntensity;
    }
    if (ambientLightRef.current) {
      ambientLightRef.current.color.setHex(theme.ambientColor);
      ambientLightRef.current.intensity = theme.ambientIntensity;
    }
    if (rimLightRef.current) {
      rimLightRef.current.color.setHex(theme.rimColor);
    }

    foliageMatsRef.current.forEach((mat) => {
      mat.color.setHex(theme.foliageColor);
      mat.emissive.setHex(theme.foliageEmissive);
    });

    if (treeCoreMeshRef.current) {
      (treeCoreMeshRef.current.material as THREE.MeshStandardMaterial).emissive.setHex(theme.coreColor);
    }

    if (terrainMeshRef.current) {
      (terrainMeshRef.current.material as THREE.MeshStandardMaterial).color.setHex(theme.terrainColor);
    }
    if (stonesGroupRef.current) {
      stonesGroupRef.current.children.forEach((st) => {
        ((st as THREE.Mesh).material as THREE.MeshStandardMaterial).emissive.setHex(theme.coreColor);
      });
    }

    if (firefliesPointsRef.current) {
      const newTex = createFireflyTexture(theme.fireflyGlow, theme.fireflyColor);
      (firefliesPointsRef.current.material as THREE.PointsMaterial).map = newTex;
      (firefliesPointsRef.current.material as THREE.PointsMaterial).needsUpdate = true;
    }
  }, [currentMode, createFireflyTexture]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden">
      {/* 3D WebGL Canvas Mount Container */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-pointer active:scale-[0.999] transition-transform duration-300"
      />

      {/* Loading Shimmer */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-charcoal-900/90 backdrop-blur-md">
          <div className="w-10 h-10 rounded-full border-2 border-amberWood border-t-transparent animate-spin" />
          <span className="mt-3 text-xs tracking-widest uppercase text-amberWood font-light font-sans">
            Đang khởi tạo không gian rừng thiêng...
          </span>
        </div>
      )}

      {/* Interactive Atmosphere Theme Switcher (Corner HUD) */}
      <div className="absolute top-28 sm:top-24 right-4 sm:right-8 z-20 flex items-center gap-1.5 p-1 bg-charcoal-900/80 backdrop-blur-xl rounded-full border border-amberWood/25 shadow-2xl">
        {(Object.keys(THEMES) as AtmosphereMode[]).map((key) => {
          const t = THEMES[key];
          const isActive = currentMode === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleModeSelect(key)}
              title={t.label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-amberWood text-charcoal-900 shadow-lg shadow-amberWood/25 scale-105 font-semibold"
                  : "text-stone-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{t.icon}</span>
              <span className="hidden md:inline text-[11px] tracking-wider uppercase font-sans">
                {t.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Subtle Interaction Hint for user */}
      {showInteractHint && (
        <div className="absolute bottom-24 sm:bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-opacity duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-charcoal-900/75 backdrop-blur-md border border-amberWood/20 text-stone-300 text-[10px] sm:text-xs tracking-widest uppercase animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amberWood animate-ping" />
            <span>Rê chuột hoặc chạm vào màn hình để tương tác cùng đom đóm &amp; rừng thiêng</span>
          </div>
        </div>
      )}

      {/* Vignette & Ambient Radial Shadow Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(15,14,13,0.85)_100%)]" />
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none bg-gradient-to-b from-charcoal-900 via-charcoal-900/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none bg-gradient-to-t from-charcoal-900 via-charcoal-900/60 to-transparent" />
    </div>
  );
}
