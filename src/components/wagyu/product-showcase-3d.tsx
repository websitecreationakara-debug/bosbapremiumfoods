import { Component, Suspense, useMemo, type ReactNode } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls, RoundedBox } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";

// Renders the real product photo (fetched live via useProducts, same source
// ShopSection below already uses) as a drag-to-rotate card over a podium --
// no invented/AI imagery, just the actual live product shot in 3D space.

function badgeTexture(text: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#070707";
  ctx.fillRect(0, 0, 512, 128);
  ctx.fillStyle = "#D9A35F";
  ctx.font = "bold 56px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 256, 64);
  return new THREE.CanvasTexture(canvas);
}

function BadgeText({ text }: { text: string }) {
  const tex = useMemo(() => badgeTexture(text), [text]);
  return (
    <mesh position={[0, -1.2, 0.05]}>
      <planeGeometry args={[1.2, 0.3]} />
      <meshBasicMaterial map={tex} transparent />
    </mesh>
  );
}

function RotatingCard({ imageUrl, label }: { imageUrl: string; label: string }) {
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <group>
      <RoundedBox args={[1.7, 2.1, 0.09]} radius={0.06} smoothness={4} castShadow>
        <meshStandardMaterial color="#070707" metalness={0.35} roughness={0.4} />
      </RoundedBox>
      <mesh position={[0, 0, 0.046]}>
        <planeGeometry args={[1.5, 1.9]} />
        <meshStandardMaterial map={texture} roughness={0.4} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0, -0.046]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.5, 1.9]} />
        <meshStandardMaterial map={texture} roughness={0.4} metalness={0.05} />
      </mesh>
      <BadgeText text={label} />
    </group>
  );
}

function Podium() {
  return (
    <mesh position={[0, -1.65, 0]} receiveShadow>
      <cylinderGeometry args={[1.3, 1.5, 0.3, 64]} />
      <meshStandardMaterial color="#141414" metalness={0.6} roughness={0.25} />
    </mesh>
  );
}

function FallbackCard({ label }: { label: string }) {
  return (
    <group>
      <RoundedBox args={[1.7, 2.1, 0.09]} radius={0.06} smoothness={4} castShadow>
        <meshStandardMaterial color="#070707" metalness={0.35} roughness={0.4} />
      </RoundedBox>
      <BadgeText text={label} />
    </group>
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

export function ProductShowcase3D({
  imageUrl,
  label,
}: {
  imageUrl: string | null | undefined;
  label: string;
}) {
  return (
    <section className="relative h-[70vh] w-full bg-[#070707]">
      <div className="pointer-events-none absolute inset-x-0 top-10 z-10 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand">Craft</p>
        <h2 className="font-display text-3xl font-semibold leading-tight text-white md:text-5xl">
          Turn it over. See for yourself.
        </h2>
      </div>
      <Canvas camera={{ position: [0, 0.3, 4.2], fov: 40 }} dpr={[1, 2]} shadows>
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 2]} intensity={1.4} castShadow />
        <pointLight position={[-3, 1, -2]} intensity={1.2} color="#D9A35F" />
        <SceneErrorBoundary fallback={<FallbackCard label={label} />}>
          <Suspense fallback={null}>
            {imageUrl ? (
              <RotatingCard imageUrl={imageUrl} label={label} />
            ) : (
              <FallbackCard label={label} />
            )}
            <Podium />
            <Environment preset="city" />
            <ContactShadows position={[0, -1.5, 0]} opacity={0.5} blur={2.4} far={2} />
          </Suspense>
        </SceneErrorBoundary>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.4}
          minPolarAngle={Math.PI / 2.6}
          maxPolarAngle={Math.PI / 1.8}
        />
        <EffectComposer>
          <Bloom intensity={0.5} luminanceThreshold={0.4} luminanceSmoothing={0.3} mipmapBlur />
        </EffectComposer>
      </Canvas>
      <p className="pointer-events-none absolute inset-x-0 bottom-8 text-center text-xs uppercase tracking-widest text-white/50">
        Drag to rotate
      </p>
    </section>
  );
}
