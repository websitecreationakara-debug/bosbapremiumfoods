import { Component, Suspense, useMemo, useRef, type ReactNode, type RefObject } from "react";
import { useMotionValueEvent, useScroll, useSpring, useTransform, motion } from "motion/react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, useTexture } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import { GlassPanel } from "@/components/wagyu/glass-panel";

// A real 3D Earth in space that the camera flies toward, landing on Japan --
// replaces the old flat map-image-with-a-pin "Origin" scene. Same scroll-track
// + sticky-canvas + ref-bridge pattern as barn-door-3d.tsx.

const TEX = {
  day: "/wagyu/textures/earth_daymap.jpg",
  clouds: "/wagyu/textures/earth_clouds.jpg",
};

const GLOBE_RADIUS = 1.6;
// Central Honshu, Japan -- a reasonable single point to aim the "landing" at.
const JAPAN_LAT = 36.2;
const JAPAN_LNG = 138.25;

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

const baseJapanDir = latLngToVector3(JAPAN_LAT, JAPAN_LNG, 1);

function Globe({
  progressRef,
  frozenYRef,
}: {
  progressRef: RefObject<number>;
  frozenYRef: RefObject<number | null>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const dayMap = useTexture(TEX.day);
  const cloudsMap = useTexture(TEX.clouds);
  useMemo(() => {
    dayMap.colorSpace = THREE.SRGBColorSpace;
  }, [dayMap]);

  useFrame((_, delta) => {
    const t = progressRef.current;
    if (frozenYRef.current === null) {
      if (groupRef.current) groupRef.current.rotation.y += delta * 0.12;
      if (t > 0.02 && groupRef.current) frozenYRef.current = groupRef.current.rotation.y;
    }
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.05;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshStandardMaterial map={dayMap} roughness={0.75} />
      </mesh>
      <mesh ref={cloudsRef} scale={1.012}>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          alphaMap={cloudsMap}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </mesh>
      <JapanPin progressRef={progressRef} />
      <Atmosphere />
    </group>
  );
}

// Simple Fresnel rim-glow shader -- the classic "glowing atmosphere edge"
// look on 3D globes, rendered back-side with additive blending so it only
// shows at the silhouette edge, not across the visible face.
const atmosphereVertex = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const atmosphereFragment = `
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
    gl_FragColor = vec4(0.29, 0.66, 0.85, 1.0) * intensity;
  }
`;

function Atmosphere() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
      }),
    [],
  );
  return (
    <mesh scale={1.18} material={material}>
      <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
    </mesh>
  );
}

function JapanPin({ progressRef }: { progressRef: RefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  const pos = useMemo(() => baseJapanDir.clone().multiplyScalar(GLOBE_RADIUS * 1.01), []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = progressRef.current;
    const visible = THREE.MathUtils.clamp((t - 0.05) / 0.15, 0, 1);
    const pulse = 1 + Math.sin(clock.elapsedTime * 3) * 0.3 * visible;
    ref.current.scale.setScalar(0.035 * pulse);
    (ref.current.material as THREE.MeshBasicMaterial).opacity = visible;
  });
  return (
    <mesh ref={ref} position={pos}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color="#D9A35F" transparent toneMapped={false} />
    </mesh>
  );
}

function ZoomRig({
  progressRef,
  frozenYRef,
}: {
  progressRef: RefObject<number>;
  frozenYRef: RefObject<number | null>;
}) {
  const { camera } = useThree();
  const startPos = useMemo(() => new THREE.Vector3(0, 1.3, 6.2), []);

  useFrame(() => {
    const t = progressRef.current;
    const zoomT = THREE.MathUtils.clamp((t - 0.12) / 0.68, 0, 1);
    const eased = zoomT * zoomT * (3 - 2 * zoomT);

    const yaw = frozenYRef.current ?? 0;
    const dir = baseJapanDir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
    const endPos = dir.clone().multiplyScalar(GLOBE_RADIUS * 1.22);
    const lookTarget = dir.clone().multiplyScalar(GLOBE_RADIUS * 0.95);

    camera.position.lerpVectors(startPos, endPos, eased);
    camera.lookAt(eased > 0.05 ? lookTarget : new THREE.Vector3(0, 0, 0));
  });
  return null;
}

function FallbackGlobe() {
  return (
    <mesh>
      <sphereGeometry args={[GLOBE_RADIUS, 32, 32]} />
      <meshStandardMaterial color="#1c3d2e" />
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

export function EarthZoomScene({
  heightVh = 260,
  children,
}: {
  heightVh?: number;
  children?: ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 220, damping: 38, mass: 0.4 });

  const progressRef = useRef<number>(0);
  const frozenYRef = useRef<number | null>(null);
  useMotionValueEvent(smoothProgress, "change", (v) => {
    progressRef.current = v;
  });

  const textOpacity = useTransform(smoothProgress, [0, 0.72, 0.88, 1], [0, 0, 1, 1]);
  const introOpacity = useTransform(smoothProgress, [0, 0.1, 0.25], [1, 1, 0]);

  return (
    <div ref={trackRef} style={{ height: `${heightVh}vh` }} className="relative bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Canvas camera={{ position: [0, 1.3, 6.2], fov: 45 }} dpr={[1, 2]}>
          <ambientLight intensity={0.55} />
          <directionalLight position={[4, 2, 4]} intensity={1.6} />
          <Stars radius={80} depth={40} count={2500} factor={3} fade speed={0.5} />
          <SceneErrorBoundary fallback={<FallbackGlobe />}>
            <Suspense fallback={null}>
              <Globe progressRef={progressRef} frozenYRef={frozenYRef} />
            </Suspense>
          </SceneErrorBoundary>
          <ZoomRig progressRef={progressRef} frozenYRef={frozenYRef} />
          <EffectComposer>
            <Bloom intensity={0.9} luminanceThreshold={0.2} luminanceSmoothing={0.4} mipmapBlur />
          </EffectComposer>
        </Canvas>

        <motion.div
          style={{ opacity: introOpacity }}
          className="pointer-events-none absolute inset-x-0 top-16 z-10 text-center"
        >
          <p className="text-xs uppercase tracking-widest text-white/60">
            Scroll to travel to Japan
          </p>
        </motion.div>

        {children && (
          <motion.div
            style={{ opacity: textOpacity }}
            className="pointer-events-none absolute inset-0 z-10 flex items-end pb-24 md:items-center md:pb-0"
          >
            <div className="mx-auto w-full max-w-6xl px-6">
              <GlassPanel className="pointer-events-auto max-w-xl">{children}</GlassPanel>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
