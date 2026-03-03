// src/components/intro/Intro3DWelcome.jsx
// Fullscreen 3D welcome screen for LetterLab Pro
// Uses @react-three/fiber (three.js) for a floating envelope scene
// Then fades out and calls onComplete() so you can show HeroIntro.

import { useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Envelope3D({ phase }) {
  const groupRef = useRef();

  // Simple target states for different phases
  const targets = {
    intro: {
      position: new THREE.Vector3(0, 0.1, 0),
      rotation: new THREE.Euler(0.4, 0.5, 0),
      scale: 1.05,
    },
    focus: {
      position: new THREE.Vector3(0, 0.05, 0),
      rotation: new THREE.Euler(0.25, 0.9, 0.05),
      scale: 1.2,
    },
    shrink: {
      position: new THREE.Vector3(-1.3, 0.9, -0.8),
      rotation: new THREE.Euler(0.25, 1.2, 0.2),
      scale: 0.6,
    },
    fade: {
      position: new THREE.Vector3(-1.3, 0.9, -0.8),
      rotation: new THREE.Euler(0.25, 1.2, 0.2),
      scale: 0.6,
    },
  };

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = targets[phase] || targets.intro;

    // Smoothly lerp towards target
    groupRef.current.position.lerp(t.position, 1 - Math.exp(-delta * 4));
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      t.rotation.x,
      1 - Math.exp(-delta * 4)
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      t.rotation.y,
      1 - Math.exp(-delta * 4)
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      t.rotation.z,
      1 - Math.exp(-delta * 4)
    );

    const currentScale = groupRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(
      currentScale,
      t.scale,
      1 - Math.exp(-delta * 4)
    );
    groupRef.current.scale.setScalar(newScale);

    // Subtle idle float
    const time = state.clock.getElapsedTime();
    groupRef.current.position.y += Math.sin(time * 1.2) * 0.002;
  });

  return (
    <group ref={groupRef}>
      {/* Envelope body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.4, 1.6, 0.18]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Envelope flap */}
      <mesh position={[0, 0.35, 0.11]} rotation={[-Math.PI / 7, 0, 0]}>
        <planeGeometry args={[2.2, 1.2]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* Envelope lines */}
      <mesh position={[0, -0.1, 0.11]} rotation={[0, 0, 0]}>
        <planeGeometry args={[2.1, 1.1]} />
        <meshBasicMaterial
          color="#0f172a"
          wireframe
          transparent
          opacity={0.24}
        />
      </mesh>
    </group>
  );
}

function BackgroundBlobs() {
  const blob1 = useRef();
  const blob2 = useRef();
  const circle = new THREE.Spherical();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.15;

    if (blob1.current) {
      circle.set(6, 1.1 + Math.sin(t) * 0.15, t * 1.3);
      blob1.current.position.setFromSpherical(circle);
    }
    if (blob2.current) {
      circle.set(7, 2.1 + Math.cos(t * 1.2) * 0.2, t * 1.1 + Math.PI / 3);
      blob2.current.position.setFromSpherical(circle);
    }
  });

  return (
    <>
      <mesh ref={blob1}>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshBasicMaterial color="#e5edff" transparent opacity={0.5} />
      </mesh>
      <mesh ref={blob2}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial color="#e0fbff" transparent opacity={0.45} />
      </mesh>
    </>
  );
}

export default function Intro3DWelcome({ onComplete }) {
  const [phase, setPhase] = useState("intro"); // intro -> focus -> shrink -> fade
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Sequence timing ~4.2s total. You can tweak these numbers.
    const t1 = setTimeout(() => setPhase("focus"), 1200);
    const t2 = setTimeout(() => setPhase("shrink"), 2600);
    const t3 = setTimeout(() => setPhase("fade"), 3400);
    const t4 = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          shadows
          gl={{ antialias: true }}
        >
          <color attach="background" args={["#f4f4f7"]} />
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[4, 6, 6]}
            intensity={1.1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <spotLight
            position={[-4, 5, 4]}
            angle={0.7}
            penumbra={0.5}
            intensity={0.6}
          />

          <BackgroundBlobs />
          <Envelope3D phase={phase} />

          {/* Soft floor */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -1.7, -0.2]}
            receiveShadow
          >
            <circleGeometry args={[6, 64]} />
            <meshStandardMaterial
              color="#e5e7eb"
              roughness={0.9}
              metalness={0}
              transparent
              opacity={0.85}
            />
          </mesh>
        </Canvas>
      </div>

      {/* Overlay content */}
      <div className="relative z-10 flex flex-col items-center justify-center -translate-y-[4vh] text-center px-4">
        {/* Welcome text */}
        <div
          className={`
            transition-all duration-700
            ${phase === "intro" ? "opacity-100 scale-100" : "opacity-0 scale-95"}
          `}
        >
          <p className="text-xs tracking-[0.25em] uppercase text-slate-500 mb-3">
            Welcome to
          </p>
          <h1 className="text-[clamp(2.4rem,4.2vw,3.4rem)] font-[Outfit] font-semibold tracking-tight text-slate-900">
            LetterLab Pro
          </h1>
        </div>

        {/* Focus phase text (explainer) */}
        <div
          className={`
            transition-all duration-700
            ${phase === "focus" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
          `}
        >
          <p className="mt-5 max-w-md text-[13px] md:text-[14px] text-slate-600">
            Your inbox co-pilot for understanding long email threads, extracting
            decisions, and drafting replies that still sound like you.
          </p>
        </div>

        {/* Shrink phase hint text */}
        <div
          className={`
            transition-all duration-600
            ${phase === "shrink" || phase === "fade" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}
          `}
        >
          <p className="mt-8 text-[11px] uppercase tracking-[0.25em] text-slate-400">
            Opening your workspace…
          </p>
        </div>
      </div>

      {/* Fade overlay for closing */}
      <div
        className={`
          pointer-events-none absolute inset-0 bg-white transition-opacity duration-700
          ${phase === "fade" ? "opacity-80" : "opacity-0"}
        `}
      />
    </div>
  );
}
