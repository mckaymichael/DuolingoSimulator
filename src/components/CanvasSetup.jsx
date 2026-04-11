"use client";

import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import { PlayerProvider } from "@/context/PlayerContext";
import CharacterController from "./CharacterController";
import Environment from "./Environment";

/**
 * CanvasSetup
 *
 * Full-screen R3F Canvas with shadows, lighting rig, and Rapier physics.
 * PlayerProvider wraps the scene so CharacterController and InteractableProp
 * can share player position and input refs without prop-drilling.
 */
export default function CanvasSetup({ onInteract, dialogueOpen }) {
  return (
    <Canvas
      shadows
      camera={{ fov: 65, near: 0.1, far: 300, position: [0, 8, 14] }}
      style={{ width: "100vw", height: "100vh", background: "#1a2015" }}
    >
      {/* ── Lighting ─────────────────────────────────── */}
      <ambientLight intensity={0.55} color="#c8b89a" />

      <directionalLight
        castShadow
        position={[18, 24, 10]}
        intensity={2.2}
        color="#ffe8c0"
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={120}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
        shadow-bias={-0.0004}
      />

      <directionalLight
        position={[-12, 8, -10]}
        intensity={0.4}
        color="#a8c0d8"
      />

      <hemisphereLight
        skyColor="#d4c4a0"
        groundColor="#3d2a12"
        intensity={0.5}
      />

      <fog attach="fog" args={["#1e2a18", 50, 130]} />

      {/* ── Physics + Scene ───────────────────────────── */}
      <Physics gravity={[0, -20, 0]}>
        <PlayerProvider>
          <Suspense fallback={null}>
            <Environment onInteract={onInteract} dialogueOpen={dialogueOpen} />
            <CharacterController dialogueOpen={dialogueOpen} />
          </Suspense>
        </PlayerProvider>
      </Physics>
    </Canvas>
  );
}
