"use client";

import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import { PlayerProvider } from "@/context/PlayerContext";
import { Loader } from "@react-three/drei";
import CharacterController from "./CharacterController";
import Environment from "./Environment";

/**
 * CanvasSetup
 *
 * Full-screen R3F Canvas with a dark, technical vibe for the Sketch aesthetic.
 */
export default function CanvasSetup({ onInteract, dialogueOpen }) {
  return (
    <>
      <Canvas
        shadows
        camera={{ fov: 65, near: 0.1, far: 300, position: [0, 8, 14] }}
        style={{ width: "100vw", height: "100vh", background: "#111811" }}
      >
        {/* ── Lighting ── */}
        <ambientLight intensity={0.6} color="#ffffff" />
        
        {/* Subtle top light to give player depth */}
        <spotLight 
          position={[0, 40, 0]} 
          intensity={2} 
          angle={0.6} 
          penumbra={1} 
          color="#ffffff" 
        />

        {/* Lighter fog */}
        <fog attach="fog" args={["#111811", 60, 200]} />

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
      <Loader 
        containerStyles={{ background: "#111811" }}
        innerStyles={{ background: "#334433", height: "10px" }}
        barStyles={{ background: "#58cc02", height: "10px" }}
        dataStyles={{ color: "#f0e6d0", fontFamily: "'Outfit', sans-serif" }}
        dataInterpolation={(p) => `Syncing Simulation... ${p.toFixed(0)}%`}
      />
    </>
  );
}
