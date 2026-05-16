import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { SharedValue } from 'react-native-reanimated';
import type { Group, Mesh } from 'three';

type HeroSceneProps = {
  scrollY: SharedValue<number>;
  enabled: boolean;
};

type BrandObjectsProps = {
  scrollY: SharedValue<number>;
  active: boolean;
};

function BrandObjects({ scrollY, active }: BrandObjectsProps) {
  const groupRef = useRef<Group>(null);
  const torusRef = useRef<Mesh>(null);
  const crystalRef = useRef<Mesh>(null);
  const sphereRef = useRef<Mesh>(null);
  const { invalidate } = useThree();

  useEffect(() => {
    if (!active) return;

    let frame = 0;
    const tick = () => {
      invalidate();
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [active, invalidate]);

  useFrame(({ clock }) => {
    if (!active || !groupRef.current) return;

    const elapsed = clock.getElapsedTime();
    const scrollTilt = Math.max(-0.45, Math.min(0.45, scrollY.value / 1600));

    groupRef.current.rotation.x = scrollTilt * 0.65 + Math.sin(elapsed * 0.32) * 0.05;
    groupRef.current.rotation.y = Math.sin(elapsed * 0.22) * 0.18;
    groupRef.current.rotation.z = Math.cos(elapsed * 0.18) * 0.08;
    groupRef.current.position.y = Math.sin(elapsed * 0.4) * 0.1;

    if (torusRef.current) {
      torusRef.current.rotation.x = elapsed * 0.24;
      torusRef.current.rotation.y = elapsed * 0.3;
    }

    if (crystalRef.current) {
      crystalRef.current.rotation.y = -elapsed * 0.36;
      crystalRef.current.rotation.z = elapsed * 0.16;
    }

    if (sphereRef.current) {
      sphereRef.current.rotation.y = elapsed * 0.18;
      sphereRef.current.position.y = Math.cos(elapsed * 0.7) * 0.14;
    }
  });

  return (
    <group ref={groupRef} position={[0.7, 0.25, 0]}>
      <mesh ref={torusRef} position={[-1.4, 0.35, -0.15]}>
        <torusGeometry args={[0.95, 0.18, 32, 120]} />
        <meshPhysicalMaterial
          color="#004225"
          roughness={0.28}
          metalness={0.12}
          clearcoat={0.86}
          reflectivity={0.82}
          transparent
          opacity={0.82}
        />
      </mesh>

      <mesh ref={crystalRef} position={[0.85, 0.75, 0.25]}>
        <octahedronGeometry args={[0.52, 0]} />
        <meshPhysicalMaterial
          color="#1F5C3A"
          roughness={0.35}
          metalness={0.09}
          clearcoat={0.92}
          reflectivity={0.7}
          transparent
          opacity={0.88}
        />
      </mesh>

      <mesh ref={sphereRef} position={[1.65, -0.6, -0.45]}>
        <sphereGeometry args={[0.58, 48, 48]} />
        <meshPhysicalMaterial
          color="#E8E3D7"
          roughness={0.22}
          metalness={0.05}
          clearcoat={0.98}
          transparent
          opacity={0.74}
        />
      </mesh>
    </group>
  );
}

const rootStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  pointerEvents: 'none',
};

const canvasStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
};

export default function HeroScene({ scrollY, enabled }: HeroSceneProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [inViewport, setInViewport] = useState(true);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !rootRef.current) return;

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setInViewport(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [enabled]);

  const active = enabled && inViewport;
  if (!enabled) return null;

  return (
    <div ref={rootRef} style={rootStyle}>
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={canvasStyle}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.68} color="#FAF8F2" />
        <directionalLight position={[2, 3, 4]} intensity={1.05} color="#FFFFFF" />
        <pointLight position={[-3, -1, 3]} intensity={0.55} color="#1F5C3A" />
        <BrandObjects scrollY={scrollY} active={active} />
      </Canvas>
    </div>
  );
}
