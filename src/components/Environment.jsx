import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useGLTF, Grid } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import InteractableProp from "./InteractableProp";

/* ─── Constants ──────────────────────────────────────────── */
const MODEL_SCALE = 4.0;
const ACCENT_COLOR = "#58cc02"; // Duolingo Green
const GRID_COLOR = "#223018";

/**
 * Environment — The Stylized "Sketch" Route
 */
export default function Environment({ onInteract, dialogueOpen }) {
  const { scene } = useGLTF("/Duolingo.glb");

  // Stylize the model into a blueprint wireframe
  const sketchScene = useMemo(() => {
    const cloned = scene.clone();
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: "#051005",
          emissive: ACCENT_COLOR,
          emissiveIntensity: 1.5,
          wireframe: true,
          transparent: true,
          opacity: 0.4,
          metalness: 0.1,
          roughness: 0.1
        });
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
    return cloned;
  }, [scene]);

  return (
    <group>
      {/* ── STYLIZED BACKGROUND ────────────────────────────────── */}
      <color attach="background" args={["#0a1208"]} />

      {/* ── GRID FLOOR (Blueprint Look) ───────────────────────── */}
      <RigidBody type="fixed" colliders={false} position={[0, -0.05, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1000, 1000]} />
          <meshStandardMaterial color="#0a1208" />
        </mesh>
        <CuboidCollider args={[500, 0.1, 500]} position={[0, -0.1, 0]} />
      </RigidBody>

      <Grid
        position={[0, 0.01, 0]}
        args={[500, 500]}
        sectionSize={10}
        sectionThickness={1.5}
        sectionColor={GRID_COLOR}
        cellSize={2}
        cellThickness={0.8}
        cellColor={GRID_COLOR}
        infiniteGrid
        fadeDistance={400}
        fadeStrength={5}
      />

      {/* ── GLOWING SKETCH ENVIRONMENT ────────────────────────── */}
      <RigidBody type="fixed" colliders="trimesh">
        <primitive object={sketchScene} scale={MODEL_SCALE} position={[0, 0, 0]} />
      </RigidBody>

      {/* ── CINEMATIC LIGHTING ────────────────────────────────── */}
      <pointLight position={[0, 20, 0]} intensity={25} color={ACCENT_COLOR} distance={100} decay={2} />
      <pointLight position={[40, 15, -40]} intensity={15} color="#ffffff" distance={80} decay={2} />
      <pointLight position={[-40, 15, 40]} intensity={15} color="#ffffff" distance={80} decay={2} />
      <ambientLight intensity={0.2} />

      {/* ══════════════════════════════════════════════════════
          INTERACTIVE NPC STATIONS
          Moved closer to origin (0,0) to stay within model bounds.
         ══════════════════════════════════════════════════════ */}

      {/* Kiosk 1 — Café scenario (North West) */}
      <InteractableProp
        position={[-8, 0.55, -8]}
        promptHeight={2.2}
        interactRadius={3.5}
        scenarioId="cafe_counter"
        label="Language Kiosk 1"
        dialogueOpen={dialogueOpen}
        onInteract={onInteract}
      >
        <RigidBody type="fixed" colliders="cuboid">
          <mesh castShadow receiveShadow={false} rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[3.2, 1.0, 0.8]} />
            <meshStandardMaterial color="#8b5a2b" roughness={0.6} />
          </mesh>
        </RigidBody>
        <mesh position={[-0.9, 1.3, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 1.4, 12]} />
          <meshStandardMaterial color="#ff4a4a" roughness={0.5} />
        </mesh>
        <mesh position={[-0.9, 2.08, 0]}>
          <sphereGeometry args={[0.26, 12, 12]} />
          <meshStandardMaterial color="#ffdbac" />
        </mesh>
      </InteractableProp>

      {/* Kiosk 2 — Bench/NPC scenario (North East) */}
      <InteractableProp
        position={[8, 0.45, -8]}
        promptHeight={2.0}
        interactRadius={3.0}
        scenarioId="bench_sign"
        label="Language Kiosk 2"
        dialogueOpen={dialogueOpen}
        onInteract={onInteract}
      >
        <RigidBody type="fixed" colliders="cuboid">
          <mesh position={[0, 0.35, 0]} rotation={[0, -Math.PI / 4, 0]}>
            <boxGeometry args={[0.7, 0.12, 2.4]} />
            <meshStandardMaterial color="#554433" />
          </mesh>
        </RigidBody>
        <mesh position={[0, 1.0, 0.5]}>
          <cylinderGeometry args={[0.22, 0.24, 1.1, 12]} />
          <meshStandardMaterial color="#4a90ff" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.65, 0.5]}>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshStandardMaterial color="#eadaba" />
        </mesh>
      </InteractableProp>

      {/* Kiosk 3 — Street scenario (South West - Moved) */}
      <InteractableProp
        position={[-9, 0.5, 18]}
        promptHeight={2.0}
        interactRadius={2.8}
        scenarioId="trash_can"
        label="Language Kiosk 3"
        dialogueOpen={dialogueOpen}
        onInteract={onInteract}
      >
        <RigidBody type="fixed" colliders="cuboid">
          <mesh>
            <cylinderGeometry args={[0.38, 0.3, 0.9, 16]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        </RigidBody>
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.27, 0.27, 1.4, 12]} />
          <meshStandardMaterial color="#ffd700" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.47, 0]}>
          <sphereGeometry args={[0.26, 12, 12]} />
          <meshStandardMaterial color="#c8a87a" />
        </mesh>
      </InteractableProp>

      {/* Kiosk 4 — Tourist scenario (South East) */}
      <InteractableProp
        position={[8, 0.75, 8]}
        promptHeight={2.0}
        interactRadius={2.8}
        scenarioId="npc_tourist"
        label="Language Kiosk 4"
        dialogueOpen={dialogueOpen}
        onInteract={onInteract}
      >
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.27, 0.27, 1.5, 12]} />
          <meshStandardMaterial color="#ff6b6b" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.87, 0]}>
          <sphereGeometry args={[0.27, 12, 12]} />
          <meshStandardMaterial color="#ffd4aa" />
        </mesh>
        <mesh position={[0.22, 0.5, 0.25]} rotation={[0, -0.4, 0.3]}>
          <boxGeometry args={[0.4, 0.28, 0.02]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
      </InteractableProp>
    </group>
  );
}

useGLTF.preload("/Duolingo.glb");
