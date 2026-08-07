import { Component, Suspense, useMemo, useRef, type ReactNode, type RefObject } from "react";
import { useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import { GlassPanel } from "@/components/wagyu/glass-panel";

// The centerpiece requested: one persistent 3D barn whose actual door panels
// swing open on real hinges as you scroll (not a cut to a different photo).
// Once open, the camera pushes through the doorway toward a real photo of the
// farm interior glowing beyond it -- same "connected" idea, just handed off
// to the next full Scene beat rather than faked as a second 3D interior.

const TEX = {
  woodDiff: "/wagyu/textures/wood_diff.jpg",
  woodNormal: "/wagyu/textures/wood_normal.jpg",
  woodRough: "/wagyu/textures/wood_rough.jpg",
  metalDiff: "/wagyu/textures/metal_diff.jpg",
  metalRough: "/wagyu/textures/metal_rough.jpg",
};

function usePlankMaterial(tint: string, repeat: [number, number]) {
  const diff = useTexture(TEX.woodDiff);
  const normal = useTexture(TEX.woodNormal);
  const rough = useTexture(TEX.woodRough);
  useMemo(() => {
    for (const t of [diff, normal, rough]) {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(repeat[0], repeat[1]);
    }
    diff.colorSpace = THREE.SRGBColorSpace;
  }, [diff, normal, rough, repeat]);
  return { map: diff, normalMap: normal, roughnessMap: rough, color: tint, roughness: 1 };
}

function useMetalMaterial() {
  const diff = useTexture(TEX.metalDiff);
  const rough = useTexture(TEX.metalRough);
  useMemo(() => {
    diff.colorSpace = THREE.SRGBColorSpace;
  }, [diff]);
  // Dark iron hinges -- real hardware, not tinted gold, matching the
  // "wood texture, metal hinges" reference instead of the earlier brass look.
  return { map: diff, roughnessMap: rough, metalness: 0.8, roughness: 0.5, color: "#2a2420" };
}

function signTexture(line1: string, line2: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 384;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#f0ece1";
  ctx.fillRect(0, 0, 768, 384);
  ctx.strokeStyle = "#C97A2B";
  ctx.lineWidth = 6;
  ctx.strokeRect(14, 14, 740, 356);
  ctx.fillStyle = "#2a2420";
  ctx.textAlign = "center";
  ctx.font = "bold 64px Georgia, serif";
  ctx.fillText(line1, 384, 170);
  ctx.font = "500 34px sans-serif";
  ctx.fillStyle = "#C97A2B";
  ctx.fillText(line2, 384, 240);
  return new THREE.CanvasTexture(canvas);
}

function DoorPanel({
  side,
  openProgress,
}: {
  side: "left" | "right";
  openProgress: RefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const panelWidth = 1.7;
  const panelHeight = 4.3;
  const dir = side === "left" ? -1 : 1;
  const wood = usePlankMaterial("#1c140f", [1.4, 3]);
  const trim = usePlankMaterial("#D9A35F", [3, 0.3]);
  const braceLength = Math.hypot(panelWidth, panelHeight) * 0.94;
  const braceAngle = Math.atan2(panelHeight, panelWidth);
  const openAngle = THREE.MathUtils.degToRad(112) * dir;

  useFrame(() => {
    if (!groupRef.current) return;
    const t = openProgress.current ?? 0;
    groupRef.current.rotation.y = openAngle * t;
  });

  return (
    <group ref={groupRef} position={[dir * panelWidth, 0, 0]}>
      <mesh position={[dir * -panelWidth * 0.5, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[panelWidth, panelHeight, 0.08]} />
        <meshStandardMaterial {...wood} />
      </mesh>
      {/* Cream X-brace, real raised geometry (not a drawn texture) */}
      <mesh position={[dir * -panelWidth * 0.5, 0, 0.045]} rotation={[0, 0, braceAngle]}>
        <boxGeometry args={[braceLength, 0.09, 0.02]} />
        <meshStandardMaterial {...trim} />
      </mesh>
      <mesh position={[dir * -panelWidth * 0.5, 0, 0.045]} rotation={[0, 0, -braceAngle]}>
        <boxGeometry args={[braceLength, 0.09, 0.02]} />
        <meshStandardMaterial {...trim} />
      </mesh>
      {/* Top/bottom rails */}
      <mesh position={[dir * -panelWidth * 0.5, panelHeight * 0.46, 0.045]}>
        <boxGeometry args={[panelWidth * 0.94, 0.14, 0.02]} />
        <meshStandardMaterial {...trim} />
      </mesh>
      <mesh position={[dir * -panelWidth * 0.5, -panelHeight * 0.46, 0.045]}>
        <boxGeometry args={[panelWidth * 0.94, 0.14, 0.02]} />
        <meshStandardMaterial {...trim} />
      </mesh>
    </group>
  );
}

function BarnStructure({ interiorImage }: { interiorImage: string }) {
  const wallMat = usePlankMaterial("#221812", [4, 2.6]);
  const trimMat = usePlankMaterial("#D9A35F", [4, 0.5]);
  const hingeMat = useMetalMaterial();
  const interiorTexture = useTexture(interiorImage);
  useMemo(() => {
    interiorTexture.colorSpace = THREE.SRGBColorSpace;
  }, [interiorTexture]);

  const roofGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-3.3, 0);
    shape.lineTo(0, 1.8);
    shape.lineTo(3.3, 0);
    shape.lineTo(-3.3, 0);
    return new THREE.ExtrudeGeometry(shape, { depth: 2, bevelEnabled: false });
  }, []);

  const signTex = useMemo(() => signTexture("WAGYU FARM", "Scroll to enter"), []);

  return (
    <group>
      {/* Back wall, seen through the doorway once it opens */}
      <mesh position={[0, 0.3, -0.9]}>
        <planeGeometry args={[8, 7]} />
        <meshStandardMaterial color="#050a07" />
      </mesh>

      {/* Real interior photo, glowing beyond the doorway */}
      <mesh position={[0, 0.15, -0.85]}>
        <planeGeometry args={[3.1, 4]} />
        <meshStandardMaterial map={interiorTexture} toneMapped={false} />
      </mesh>

      {/* Side walls flanking the doorway */}
      <mesh position={[-2.5, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 5, 0.5]} />
        <meshStandardMaterial {...wallMat} />
      </mesh>
      <mesh position={[2.5, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 5, 0.5]} />
        <meshStandardMaterial {...wallMat} />
      </mesh>

      {/* Gable roof */}
      <mesh geometry={roofGeo} position={[0, 2.8, -0.85]} castShadow>
        <meshStandardMaterial {...trimMat} />
      </mesh>

      {/* Hay-loft window */}
      <mesh position={[0, 2.15, 0.26]}>
        <planeGeometry args={[1.3, 0.7]} />
        <meshStandardMaterial color="#1a0e05" />
      </mesh>

      {/* Door frame trim */}
      <mesh position={[0, 2.5, 0.28]}>
        <boxGeometry args={[3.7, 0.2, 0.16]} />
        <meshStandardMaterial {...trimMat} />
      </mesh>

      {/* Hinge posts, real metal material */}
      <mesh position={[-1.7, 0.75, 0.05]} castShadow>
        <boxGeometry args={[0.1, 0.5, 0.12]} />
        <meshStandardMaterial {...hingeMat} />
      </mesh>
      <mesh position={[-1.7, -0.75, 0.05]} castShadow>
        <boxGeometry args={[0.1, 0.5, 0.12]} />
        <meshStandardMaterial {...hingeMat} />
      </mesh>
      <mesh position={[1.7, 0.75, 0.05]} castShadow>
        <boxGeometry args={[0.1, 0.5, 0.12]} />
        <meshStandardMaterial {...hingeMat} />
      </mesh>
      <mesh position={[1.7, -0.75, 0.05]} castShadow>
        <boxGeometry args={[0.1, 0.5, 0.12]} />
        <meshStandardMaterial {...hingeMat} />
      </mesh>

      {/* Sign plaque, mounted on the doors */}
      <SignPlaque texture={signTex} />
    </group>
  );
}

function SignPlaque({ texture }: { texture: THREE.CanvasTexture }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    // Gentle pulse to invite scrolling, same spirit as the Hero's bobbing chevron.
    const pulse = 1 + Math.sin(clock.elapsedTime * 1.6) * 0.015;
    ref.current.scale.setScalar(pulse);
  });
  return (
    <group ref={ref} position={[0, 0.2, 0.35]}>
      <mesh>
        <planeGeometry args={[1.5, 0.75]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[1.56, 0.81]} />
        <meshStandardMaterial color="#070707" />
      </mesh>
    </group>
  );
}

function DollyRig({ progressRef }: { progressRef: RefObject<number> }) {
  const { camera } = useThree();
  useFrame(() => {
    const t = progressRef.current ?? 0;
    // Phases: 0-0.35 hold outside, 0.35-1 push forward through the open doorway.
    const dollyT = THREE.MathUtils.clamp((t - 0.35) / 0.65, 0, 1);
    const eased = dollyT * dollyT * (3 - 2 * dollyT);
    camera.position.z = THREE.MathUtils.lerp(7.4, 3, eased);
    camera.position.y = THREE.MathUtils.lerp(0.5, 0.2, eased);
    camera.lookAt(0, 0.25, -0.85);
  });
  return null;
}

function InteriorLight({ progressRef }: { progressRef: RefObject<number> }) {
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame(() => {
    if (!lightRef.current) return;
    const t = progressRef.current ?? 0;
    lightRef.current.intensity = THREE.MathUtils.lerp(
      0,
      3.2,
      THREE.MathUtils.clamp((t - 0.2) / 0.5, 0, 1),
    );
  });
  return <pointLight ref={lightRef} position={[0, 0.3, -0.6]} color="#e8c78a" distance={4} />;
}

function FallbackPanel() {
  return (
    <mesh>
      <boxGeometry args={[3.4, 4.3, 0.2]} />
      <meshStandardMaterial color="#8f2f27" />
    </mesh>
  );
}

class SceneErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

export function BarnDoorScene({
  interiorImage,
  heightVh = 320,
  children,
}: {
  interiorImage: string;
  heightVh?: number;
  children?: ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 220, damping: 38, mass: 0.4 });

  // R3F's render loop should read the latest scroll value every frame without
  // forcing a React re-render on every pixel scrolled -- a plain ref updated
  // via useMotionValueEvent is the bridge between framer-motion's scroll
  // tracking (outside the canvas) and R3F's useFrame (inside it).
  const progressRef = useRef(0);
  const doorProgressRef = useRef(0);
  useMotionValueEvent(smoothProgress, "change", (v) => {
    progressRef.current = v;
    doorProgressRef.current = THREE.MathUtils.clamp((v - 0.1) / 0.5, 0, 1);
  });

  return (
    <div ref={trackRef} style={{ height: `${heightVh}vh` }} className="relative bg-[#070707]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Canvas camera={{ position: [0, 0.5, 7.4], fov: 42 }} dpr={[1, 2]} shadows>
          <ambientLight intensity={0.25} />
          <directionalLight position={[3, 5, 4]} intensity={1.1} castShadow />
          {/* Cool rim light from behind, warm key from the front -- the
              two-tone contrast that reads as "premium product photography"
              rather than flat cartoon lighting. */}
          <pointLight position={[-4, 3, -3]} intensity={1.4} color="#4a6b8a" />
          <pointLight position={[0, 1.5, 5]} intensity={0.8} color="#D9A35F" />
          <SceneErrorBoundary fallback={<FallbackPanel />}>
            <Suspense fallback={null}>
              <BarnStructure interiorImage={interiorImage} />
              <DoorPanel side="left" openProgress={doorProgressRef} />
              <DoorPanel side="right" openProgress={doorProgressRef} />
              <InteriorLight progressRef={progressRef} />
            </Suspense>
          </SceneErrorBoundary>
          <DollyRig progressRef={progressRef} />
          <EffectComposer>
            <Bloom intensity={0.6} luminanceThreshold={0.35} luminanceSmoothing={0.3} mipmapBlur />
          </EffectComposer>
        </Canvas>
        {children && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-end pb-24 md:items-center md:pb-0">
            <div className="mx-auto w-full max-w-6xl px-6">
              <GlassPanel className="pointer-events-auto max-w-xl">{children}</GlassPanel>
            </div>
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-8 text-center text-xs uppercase tracking-widest text-white/50">
          Scroll to open the door
        </div>
      </div>
    </div>
  );
}
