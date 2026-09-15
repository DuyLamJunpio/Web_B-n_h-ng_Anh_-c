"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import { Sparkles, Flame, Wind } from "lucide-react";

export type SanctuaryItemType = "palosanto" | "candle" | "sage" | "mala";

interface ItemInfo {
  name: string;
  sub: string;
  scent: string;
  elements: string[];
  ritual: string;
  meaning: string;
}

const ITEM_DETAILS: Record<SanctuaryItemType, ItemInfo> = {
  palosanto: {
    name: "Gỗ Palo Santo (Thánh Mộc Nam Mỹ)",
    sub: "Peru Harvest • Thanh lọc trường năng lượng",
    scent: "Hương gỗ thông cổ thụ ngọt ngào, tinh dầu chanh vàng & bạc hà tươi mát",
    elements: ["Gỗ Thánh Peru", "Tinh Dầu Tự Nhiên", "Khói Thanh Tẩy"],
    ritual: "Đốt đầu gỗ 30-45 giây cho bén lửa, nhẹ nhàng thổi tắt và để làn khói ngọt lành lan tỏa khắp phòng.",
    meaning: "Xua tan năng lượng tiêu cực, kích hoạt nguồn sinh khí tích cực và đem lại cảm giác bình an, tĩnh tại.",
  },
  candle: {
    name: "Nến Thơm Sáp Đậu Nành Bấc Gỗ",
    sub: "Tuyết Tùng Đà Lạt, Hổ Phách & Sáp Dừa",
    scent: "Hương thơm nồng ấm, bấc gỗ nổ tí tách êm dịu như đốm lửa trại bên rừng thông",
    elements: ["100% Sáp Đậu Nành", "Bấc Gỗ Tự Nhiên", "Hũ Thủy Tinh Hổ Phách"],
    ritual: "Thắp nến từ 1-2 tiếng mỗi lần để bề mặt sáp tan đều và hương thơm phủ kín không gian.",
    meaning: "Giải tỏa căng thẳng sau ngày dài, sưởi ấm tâm hồn và tạo bầu không khí thư thái cho giấc ngủ sâu.",
  },
  sage: {
    name: "Bó Xô Thơm Trắng (White Sage California)",
    sub: "California Smudge Bundle • Tẩy uế & Khử mùi",
    scent: "Hương thảo mộc thuần khiết, thơm nồng tinh tế và khử mùi ẩm mốc mạnh mẽ",
    elements: ["Lá Xô Thơm Trắng", "Chỉ Cotton Mộc", "Khói Tẩy Uế"],
    ritual: "Châm lửa đầu bó lá, hơ nhẹ làn khói quanh 4 góc phòng và các vật phẩm cần làm sạch năng lượng.",
    meaning: "Làm sạch từ trường không gian sống, trừ uế khí khi về nhà mới, đón nhận nguồn năng lượng tươi mới.",
  },
  mala: {
    name: "Vòng Tay Gỗ Bách Xanh Tây Tạng",
    sub: "Gỗ Bách Xanh Rừng Già & Ngọc Lam Hộ Mệnh",
    scent: "Mùi gỗ rừng già thanh khiết tỏa hương dịu nhẹ khi tiếp xúc với nhiệt độ cổ tay",
    elements: ["Hạt Bách Xanh Tự Nhiên", "Ngọc Lam Turquoise", "Nút Thắt May Mắn"],
    ritual: "Đeo ở cổ tay trái để đón nhận năng lượng bình an, dùng lần hạt khi hít thở chánh niệm hoặc thiền định.",
    meaning: "Bảo hộ bình an, nhắc nhở tâm trí luôn giữ sự an định và tĩnh lặng trước mọi biến động.",
  },
};

export default function ZenSanctuary3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState<SanctuaryItemType>("palosanto");
  const [isBurning, setIsBurning] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const itemsGroupRef = useRef<THREE.Group | null>(null);
  const smokeParticlesRef = useRef<THREE.Points | null>(null);
  const flameMeshRef = useRef<THREE.Mesh | null>(null);
  const emberLightRef = useRef<THREE.PointLight | null>(null);
  const emberTipRef = useRef<THREE.Mesh | null>(null);
  const malaGroupRef = useRef<THREE.Group | null>(null);

  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0.003 });
  const targetRotationRef = useRef({ x: 0.15, y: 0 });
  const activeItemRef = useRef<SanctuaryItemType>(activeItem);
  const isBurningRef = useRef(isBurning);

  useEffect(() => {
    activeItemRef.current = activeItem;
  }, [activeItem]);

  useEffect(() => {
    isBurningRef.current = isBurning;
  }, [isBurning]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x22221e, 0.025);

    // 2. Camera setup
    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.2);
    camera.lookAt(0, 0, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.replaceChildren(renderer.domElement);

    // 4. Lights setup
    const ambientLight = new THREE.AmbientLight(0xf1ece2, 1.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfff7ed, 2.4);
    mainLight.position.set(4, 8, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0xb59b70, 1.3);
    rimLight.position.set(-5, 3, -4);
    scene.add(rimLight);

    const emberLight = new THREE.PointLight(0xff7722, 2.5, 4, 1.5);
    emberLight.position.set(0, 0.6, 0);
    scene.add(emberLight);
    emberLightRef.current = emberLight;

    // 5. Wooden Altar Base Pedestal
    const baseGroup = new THREE.Group();
    const pedestalGeo = new THREE.CylinderGeometry(2.1, 2.3, 0.22, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x5a4838,
      roughness: 0.85,
      metalness: 0.05,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -1.15;
    pedestal.receiveShadow = true;
    baseGroup.add(pedestal);

    // Ceramic Dish on top of Pedestal - Oceanic Earth Glaze
    const dishGeo = new THREE.CylinderGeometry(1.7, 1.45, 0.08, 48);
    const dishMat = new THREE.MeshStandardMaterial({
      color: 0x857760,
      roughness: 0.5,
      metalness: 0.15,
    });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.position.y = -1.02;
    dish.receiveShadow = true;
    baseGroup.add(dish);
    scene.add(baseGroup);

    // 6. Master item display group
    const itemsGroup = new THREE.Group();
    itemsGroupRef.current = itemsGroup;
    scene.add(itemsGroup);

    // ─────────────────────────────────────────────────────────────
    // A. 3D Model: PALO SANTO WOOD STICK
    // ─────────────────────────────────────────────────────────────
    const paloGroup = new THREE.Group();
    paloGroup.name = "palosanto";

    const stickLength = 2.3;
    const stickWidth = 0.42;
    const stickGeo = new THREE.BoxGeometry(stickWidth, stickLength, stickWidth, 4, 12, 4);

    const posAttr = stickGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vy = posAttr.getY(i);
      const vz = posAttr.getZ(i);
      const noise = (Math.sin(vy * 6) + Math.cos(vx * 10)) * 0.032;
      posAttr.setX(i, vx + noise);
      posAttr.setZ(i, vz + noise);
    }
    stickGeo.computeVertexNormals();

    const woodMat = new THREE.MeshStandardMaterial({
      color: 0xc48f57,
      roughness: 0.88,
      metalness: 0.02,
    });
    const paloStick = new THREE.Mesh(stickGeo, woodMat);
    paloStick.rotation.set(0.35, 0.2, -0.6);
    paloStick.position.set(0, -0.2, 0);
    paloStick.castShadow = true;
    paloGroup.add(paloStick);

    // Charred tip & glowing ember
    const emberGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const emberMat = new THREE.MeshStandardMaterial({
      color: 0x18120e,
      roughness: 0.95,
      emissive: 0xff3b00,
      emissiveIntensity: 1.6,
    });
    const emberTip = new THREE.Mesh(emberGeo, emberMat);
    emberTip.position.set(0.65, 0.7, 0.18);
    paloGroup.add(emberTip);
    emberTipRef.current = emberTip;

    itemsGroup.add(paloGroup);

    // ─────────────────────────────────────────────────────────────
    // B. 3D Model: SCENTED SOY CANDLE
    // ─────────────────────────────────────────────────────────────
    const candleGroup = new THREE.Group();
    candleGroup.name = "candle";
    candleGroup.visible = false;

    const jarGeo = new THREE.CylinderGeometry(0.85, 0.8, 1.35, 36);
    const jarMat = new THREE.MeshStandardMaterial({
      color: 0x2e2319,
      roughness: 0.4,
      metalness: 0.1,
    });
    const jar = new THREE.Mesh(jarGeo, jarMat);
    jar.position.y = -0.3;
    jar.castShadow = true;
    candleGroup.add(jar);

    const labelGeo = new THREE.CylinderGeometry(0.86, 0.86, 0.55, 36);
    const labelMat = new THREE.MeshStandardMaterial({
      color: 0x141210,
      roughness: 0.9,
    });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.y = -0.3;
    candleGroup.add(label);

    const waxGeo = new THREE.CylinderGeometry(0.78, 0.78, 0.1, 36);
    const waxMat = new THREE.MeshStandardMaterial({
      color: 0xfffaf0,
      roughness: 0.7,
    });
    const wax = new THREE.Mesh(waxGeo, waxMat);
    wax.position.y = 0.3;
    candleGroup.add(wax);

    const wickGeo = new THREE.BoxGeometry(0.04, 0.2, 0.12);
    const wickMat = new THREE.MeshStandardMaterial({ color: 0x110c08, roughness: 1.0 });
    const wick = new THREE.Mesh(wickGeo, wickMat);
    wick.position.y = 0.4;
    candleGroup.add(wick);

    const flameGeo = new THREE.ConeGeometry(0.12, 0.38, 16);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa22 });
    const flame = new THREE.Mesh(flameGeo, flameMat);
    flame.position.y = 0.6;
    candleGroup.add(flame);
    flameMeshRef.current = flame;

    itemsGroup.add(candleGroup);

    // ─────────────────────────────────────────────────────────────
    // C. 3D Model: WHITE SAGE BUNDLE
    // ─────────────────────────────────────────────────────────────
    const sageGroup = new THREE.Group();
    sageGroup.name = "sage";
    sageGroup.visible = false;

    const sageCylinderGeo = new THREE.CylinderGeometry(0.48, 0.36, 2.1, 24);
    const sageMat = new THREE.MeshStandardMaterial({
      color: 0x6e806c,
      roughness: 0.95,
      metalness: 0.0,
    });
    const sageCylinder = new THREE.Mesh(sageCylinderGeo, sageMat);
    sageCylinder.rotation.set(0.4, 0.1, -0.4);
    sageCylinder.position.set(0, -0.15, 0);
    sageCylinder.castShadow = true;
    sageGroup.add(sageCylinder);

    const twineMat = new THREE.MeshBasicMaterial({ color: 0xe6dfd5 });
    for (let i = -0.65; i <= 0.65; i += 0.32) {
      const ringGeo = new THREE.TorusGeometry(0.44, 0.024, 8, 24);
      const ring = new THREE.Mesh(ringGeo, twineMat);
      ring.position.set(-0.25 * i, -0.15 + i * 0.7, 0.15 * i);
      ring.rotation.set(0.4, 0.1, -0.4);
      sageGroup.add(ring);
    }

    const sageTipGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const sageTipMat = new THREE.MeshStandardMaterial({
      color: 0x222220,
      roughness: 1.0,
      emissive: 0xff4400,
      emissiveIntensity: 1.3,
    });
    const sageTip = new THREE.Mesh(sageTipGeo, sageTipMat);
    sageTip.position.set(0.45, 0.72, 0.15);
    sageGroup.add(sageTip);

    itemsGroup.add(sageGroup);

    // ─────────────────────────────────────────────────────────────
    // D. 3D Model: TIBETAN MALA BRACELET
    // ─────────────────────────────────────────────────────────────
    const malaGroup = new THREE.Group();
    malaGroup.name = "mala";
    malaGroup.visible = false;
    malaGroupRef.current = malaGroup;

    const beadCount = 24;
    const malaRadius = 1.08;
    const beadGeo = new THREE.SphereGeometry(0.115, 16, 16);
    const woodBeadMat = new THREE.MeshStandardMaterial({
      color: 0x5a3a1f,
      roughness: 0.6,
      metalness: 0.1,
    });
    const turquoiseMat = new THREE.MeshStandardMaterial({
      color: 0x2a9d8f,
      roughness: 0.3,
      metalness: 0.2,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.3,
      metalness: 0.8,
    });

    for (let i = 0; i < beadCount; i++) {
      const angle = (i / beadCount) * Math.PI * 2;
      const x = Math.cos(angle) * malaRadius;
      const z = Math.sin(angle) * malaRadius;

      let mat = woodBeadMat;
      if (i === 0) mat = turquoiseMat;
      else if (i === 6 || i === 12 || i === 18) mat = goldMat;

      const bead = new THREE.Mesh(beadGeo, mat);
      bead.position.set(x, 0, z);
      bead.castShadow = true;
      malaGroup.add(bead);
    }

    const guruDropGeo = new THREE.ConeGeometry(0.09, 0.32, 12);
    const tasselMat = new THREE.MeshStandardMaterial({ color: 0x8c2d2d, roughness: 0.8 });
    const tassel = new THREE.Mesh(guruDropGeo, tasselMat);
    tassel.rotation.x = Math.PI;
    tassel.position.set(malaRadius, -0.28, 0);
    malaGroup.add(tassel);

    malaGroup.rotation.x = 0.5;
    itemsGroup.add(malaGroup);

    // ─────────────────────────────────────────────────────────────
    // 7. Dynamic Physics Smoke Particles
    // ─────────────────────────────────────────────────────────────
    const particleCount = 180;
    const smokeGeo = new THREE.BufferGeometry();
    const smokePositions = new Float32Array(particleCount * 3);
    const smokeVelocities: Array<{ x: number; y: number; z: number; age: number; maxAge: number }> = [];

    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
      grad.addColorStop(0, "rgba(235, 225, 215, 0.85)");
      grad.addColorStop(0.4, "rgba(212, 163, 115, 0.35)");
      grad.addColorStop(1, "rgba(150, 130, 120, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const smokeTexture = new THREE.CanvasTexture(canvas);

    for (let i = 0; i < particleCount; i++) {
      smokePositions[i * 3] = (Math.random() - 0.5) * 0.2;
      smokePositions[i * 3 + 1] = 0.7 + Math.random() * 1.5;
      smokePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;

      smokeVelocities.push({
        x: (Math.random() - 0.5) * 0.008,
        y: 0.008 + Math.random() * 0.012,
        z: (Math.random() - 0.5) * 0.008,
        age: Math.random() * 150,
        maxAge: 120 + Math.random() * 60,
      });
    }

    smokeGeo.setAttribute("position", new THREE.BufferAttribute(smokePositions, 3));

    const smokeMat = new THREE.PointsMaterial({
      size: 0.35,
      map: smokeTexture,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const smokeParticles = new THREE.Points(smokeGeo, smokeMat);
    scene.add(smokeParticles);
    smokeParticlesRef.current = smokeParticles;

    // ─────────────────────────────────────────────────────────────
    // 8. Event Listeners & Interaction
    // ─────────────────────────────────────────────────────────────
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      prevPointerRef.current = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - prevPointerRef.current.x;
      const deltaY = clientY - prevPointerRef.current.y;

      rotationVelocityRef.current.y = deltaX * 0.005;
      rotationVelocityRef.current.x = deltaY * 0.005;

      targetRotationRef.current.y += deltaX * 0.008;
      targetRotationRef.current.x += deltaY * 0.005;

      prevPointerRef.current = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    dom.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);

    const onResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    setIsLoading(false);

    // ─────────────────────────────────────────────────────────────
    // 9. Animation Loop
    // ─────────────────────────────────────────────────────────────
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (!isDraggingRef.current) {
        targetRotationRef.current.y += rotationVelocityRef.current.y;
        rotationVelocityRef.current.y *= 0.96;
        if (Math.abs(rotationVelocityRef.current.y) < 0.001) {
          rotationVelocityRef.current.y = 0.002;
        }
      }

      if (itemsGroupRef.current) {
        itemsGroupRef.current.rotation.y = THREE.MathUtils.lerp(
          itemsGroupRef.current.rotation.y,
          targetRotationRef.current.y,
          0.08
        );
        itemsGroupRef.current.rotation.x = THREE.MathUtils.lerp(
          itemsGroupRef.current.rotation.x,
          targetRotationRef.current.x,
          0.08
        );
      }

      if (malaGroupRef.current && activeItemRef.current === "mala") {
        malaGroupRef.current.position.y = Math.sin(elapsedTime * 1.5) * 0.06;
      }

      if (flameMeshRef.current && isBurningRef.current) {
        const flicker = Math.sin(elapsedTime * 15) * 0.08 + Math.cos(elapsedTime * 23) * 0.05;
        flameMeshRef.current.scale.set(1 + flicker, 1 + flicker * 1.5, 1 + flicker);
        flameMeshRef.current.rotation.z = Math.sin(elapsedTime * 8) * 0.08;
        flameMeshRef.current.visible = true;
      } else if (flameMeshRef.current) {
        flameMeshRef.current.visible = false;
      }

      if (emberTipRef.current && emberLightRef.current) {
        if (isBurningRef.current) {
          const pulse = (Math.sin(elapsedTime * 3) + 1.2) * 0.8;
          (emberTipRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.2 * pulse;
          emberLightRef.current.intensity = 2.0 * pulse;
        } else {
          (emberTipRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
          emberLightRef.current.intensity = 0.2;
        }
      }

      if (smokeParticlesRef.current) {
        const positions = smokeParticlesRef.current.geometry.attributes.position.array as Float32Array;
        const emitterPos = { x: 0, y: 0.6, z: 0 };

        if (activeItemRef.current === "palosanto") {
          emitterPos.x = 0.65;
          emitterPos.y = 0.7;
          emitterPos.z = 0.18;
        } else if (activeItemRef.current === "candle") {
          emitterPos.x = 0;
          emitterPos.y = 0.72;
          emitterPos.z = 0;
        } else if (activeItemRef.current === "sage") {
          emitterPos.x = 0.45;
          emitterPos.y = 0.72;
          emitterPos.z = 0.15;
        } else {
          emitterPos.y = 0.2;
        }

        for (let i = 0; i < particleCount; i++) {
          const v = smokeVelocities[i];
          v.age += 1;

          if (v.age > v.maxAge || !isBurningRef.current) {
            v.age = 0;
            positions[i * 3] = emitterPos.x + (Math.random() - 0.5) * 0.08;
            positions[i * 3 + 1] = isBurningRef.current ? emitterPos.y : -10;
            positions[i * 3 + 2] = emitterPos.z + (Math.random() - 0.5) * 0.08;
          } else {
            const swirlX = Math.sin(elapsedTime * 2 + positions[i * 3 + 1] * 3) * 0.005;
            const swirlZ = Math.cos(elapsedTime * 2 + positions[i * 3 + 1] * 3) * 0.005;

            positions[i * 3] += v.x + swirlX;
            positions[i * 3 + 1] += v.y;
            positions[i * 3 + 2] += v.z + swirlZ;
          }
        }
        smokeParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      dom.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  const selectItem = (type: SanctuaryItemType) => {
    setActiveItem(type);
    if (!itemsGroupRef.current) return;

    itemsGroupRef.current.children.forEach((child) => {
      child.visible = child.name === type;
    });
  };

  const details = ITEM_DETAILS[activeItem];

  return (
    <section id="sanctuary-3d" className="pt-20 pb-24 sm:pt-28 sm:pb-32 relative overflow-hidden bg-linen-alt">

      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(42,99,158,0.1),transparent_70%)] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6"
        >
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-forest-700 text-xs tracking-[0.3em] uppercase font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-forest-600" />
              <span>Trải Nghiệm 3D Tương Tác</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-forest-950 font-light leading-tight">
              Chiêm Ngưỡng Vật Phẩm &amp; Làn Khói Thơm 3D
            </h2>
            <p className="text-forest-800/80 font-light text-sm sm:text-base leading-relaxed">
              Dùng chuột hoặc ngón tay xoay 360° để ngắm nhìn từng vân gỗ, ánh than hồng và làn khói thiêng chuyển động theo thời gian thực.
            </p>
          </div>

          {/* Item Selector Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-white/90 p-1.5 rounded-full border border-forest-800/15 backdrop-blur-md shadow-sm">
            {(
              [
                { id: "palosanto", label: "Gỗ Palo Santo", icon: "🪵" },
                { id: "candle", label: "Nến Thơm", icon: "🕯️" },
                { id: "sage", label: "Xô Thơm Trắng", icon: "🌿" },
                { id: "mala", label: "Vòng Tây Tạng", icon: "📿" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => selectItem(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                  activeItem === tab.id
                    ? "bg-forest-800 text-white shadow-md shadow-forest-900/20 scale-105"
                    : "text-forest-800 hover:text-forest-950 hover:bg-forest-50"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* 3D Canvas Box Frame */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#e2ecf7] via-[#ebf3fa] to-[#f4f8fc] border border-forest-800/15 shadow-xl">
          {/* Main 3D Canvas Area */}
          <div className="relative h-[480px] sm:h-[540px] lg:h-[580px] w-full cursor-grab active:cursor-grabbing">
            {isLoading && (
              <div className="absolute inset-0 grid place-items-center bg-white/80 backdrop-blur-sm z-20">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 rounded-full border-2 border-forest-700 border-t-transparent animate-spin" />
                  <span className="text-xs text-forest-800 font-medium">Đang khởi tạo không gian 3D...</span>
                </div>
              </div>
            )}

            <div ref={containerRef} className="h-full w-full" />

            {/* Quick Flame/Smoke Toggle in Top Right */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
              <button
                type="button"
                onClick={() => setIsBurning(!isBurning)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium backdrop-blur-md border transition-all duration-300 ${
                  isBurning
                    ? "bg-forest-800 text-white border-forest-700 shadow-md font-semibold"
                    : "bg-white/90 text-forest-800 border-forest-800/20 hover:bg-white"
                }`}
              >
                {isBurning ? <Flame className="w-3.5 h-3.5 text-amberWood-dark animate-pulse" /> : <Wind className="w-3.5 h-3.5" />}
                <span>{isBurning ? "Đang Toả Khói Thơm" : "Châm Lửa / Thắp Khói"}</span>
              </button>
            </div>

            {/* Floating Sensory Card in Bottom Left */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md z-10">
              <div className="bg-white/95 rounded-2xl p-5 shadow-2xl backdrop-blur-xl border border-forest-800/15">
                <div className="flex items-center justify-between gap-2 border-b border-forest-800/10 pb-2.5">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-forest-700">
                      {details.sub}
                    </span>
                    <h3 className="font-serif text-lg font-medium text-forest-950">{details.name}</h3>
                  </div>
                  <span className="text-2xl">
                    {activeItem === "palosanto" && "🪵"}
                    {activeItem === "candle" && "🕯️"}
                    {activeItem === "sage" && "🌿"}
                    {activeItem === "mala" && "📿"}
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="text-forest-700 font-semibold shrink-0">Hương vị:</span>
                    <span className="text-forest-900 leading-relaxed font-normal">{details.scent}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-forest-700 font-semibold shrink-0">Nghi thức:</span>
                    <span className="text-forest-800/85 leading-relaxed">{details.ritual}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-forest-700 font-semibold shrink-0">Ý niệm:</span>
                    <span className="text-forest-800/85 leading-relaxed">{details.meaning}</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5 pt-2 border-t border-forest-800/10">
                  {details.elements.map((el) => (
                    <span
                      key={el}
                      className="rounded-md bg-forest-50 border border-forest-200 px-2 py-0.5 text-[10px] text-forest-800 font-medium"
                    >
                      {el}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
