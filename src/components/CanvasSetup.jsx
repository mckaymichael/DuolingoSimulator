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
 * Full-screen R3F Canvas with a dark, technical vibe for the Sketch aesthetic.
 */
export default function CanvasSetup({ onInteract, dialogueOpen }) {
  return (
    <Canvas
      shadows
      camera={{ fov: 65, near: 0.1, far: 300, position: [0, 8, 14] }}
      style={{ width: "100vw", height: "100vh", background: "#050804" }}
    >
      {/* ── Lighting (Muted for the glowing wireframe aesthetic) ── */}
      <ambientLight intensity={0.2} color="#ccffcc" />
      
      {/* Subtle top light to give player depth */}
      <spotLight 
        position={[0, 40, 0]} 
        intensity={1} 
        angle={0.6} 
        penumbra={1} 
        color="#ffffff" 
      />

      {/* Dark tech fog */}
      <fog attach="fog" args={["#050804", 40, 150]} />

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
