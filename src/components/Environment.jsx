import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useGLTF, Environment as EnvironmentMap } from "@react-three/drei";
import InteractableProp from "./InteractableProp";

/* ─── Constants ──────────────────────────────────────────── */
const MODEL_SCALE = 4.0;
const ACCENT_COLOR = "#58cc02"; // Duolingo Green

/**
 * Environment — The Final High-Fidelity Route
 */
export default function Environment({ onInteract, dialogueOpen }) {
  const { scene } = useGLTF("/duolingo-latest-v2.glb");

  return (
    <group>
      {/* ── ENVIRONMENT LIGHTING ────────────────────────────────── */}
      <EnvironmentMap preset="city" intensity={0.6} />

      {/* ── STYLIZED BACKGROUND ────────────────────────────────── */}
      <color attach="background" args={["#111811"]} />

      {/* ── COLLISION FLOOR (Invisible) ────────────────────────── */}
      <RigidBody type="fixed" colliders={false} position={[0, -0.05, 0]}>
        <CuboidCollider args={[500, 0.1, 500]} position={[0, -0.1, 0]} />
      </RigidBody>

      {/* ── ENVIRONMENT MODEL ─────────────────────────────────── */}
      <RigidBody type="fixed" colliders="trimesh">
        <primitive object={scene} scale={MODEL_SCALE} position={[0, 0, 0]} />
      </RigidBody>

      {/* ── CINEMATIC LIGHTING ────────────────────────────────── */}
      <pointLight position={[0, 25, 0]} intensity={80} color={ACCENT_COLOR} distance={150} decay={1.5} />
      <pointLight position={[60, 20, -60]} intensity={60} color="#ffffff" distance={150} decay={1.5} />
      <pointLight position={[-60, 20, 60]} intensity={60} color="#ffffff" distance={150} decay={1.5} />
      <ambientLight intensity={0.5} />

      {/* ══════════════════════════════════════════════════════
          INTERACTIVE NPC STATIONS
          Moved closer to origin (0,0) to stay within model bounds.
         ══════════════════════════════════════════════════════ */}

      {/* Kiosk 1 — Café scenario (North West) */}
      <InteractableProp
        position={[-11, 0.55, -11.5]}
        promptHeight={2.2}
        interactRadius={2.8}
        scenarioId="cafe_counter"
        label="Hablar Español"
        dialogueOpen={dialogueOpen}
        onInteract={onInteract}
      >
        <group visible={false}>
          {/* NPC Body */}
          <mesh position={[0, 0.75, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 1.4, 12]} />
            <meshStandardMaterial color="#ff4a4a" roughness={0.5} />
          </mesh>
          {/* NPC Head */}
          <mesh position={[0, 1.53, 0]}>
            <sphereGeometry args={[0.26, 12, 12]} />
            <meshStandardMaterial color="#ffdbac" />
          </mesh>
        </group>
      </InteractableProp>

      {/* Kiosk 2 — Bench/NPC scenario (North East) */}
      <InteractableProp
        position={[-13, 0.45, 8]}
        promptHeight={2.0}
        interactRadius={2.8}
        scenarioId="bench_sign"
        label="Parler Français"
        dialogueOpen={dialogueOpen}
        onInteract={onInteract}
      >
        <group visible={false}>
          <mesh position={[0, 1.0, 0.5]}>
            <cylinderGeometry args={[0.22, 0.24, 1.1, 12]} />
            <meshStandardMaterial color="#4a90ff" roughness={0.5} />
          </mesh>
          <mesh position={[0, 1.65, 0.5]}>
            <sphereGeometry args={[0.22, 12, 12]} />
            <meshStandardMaterial color="#eadaba" />
          </mesh>
        </group>
      </InteractableProp>

      {/* Kiosk 3 — Street scenario (South West - Moved) */}
      <InteractableProp
        position={[-1, 0.5, -9]}
        promptHeight={2.0}
        interactRadius={2.8}
        scenarioId="trash_can"
        label="日本語を話す"
        dialogueOpen={dialogueOpen}
        onInteract={onInteract}
      >
        <group visible={false}>
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
        </group>
      </InteractableProp>

      {/* Kiosk 4 — Tourist scenario (South East) */}
      <InteractableProp
        position={[18, 0.75, 2.3]}
        promptHeight={2.0}
        interactRadius={2.8}
        scenarioId="npc_tourist"
        label="Deutsch sprechen"
        dialogueOpen={dialogueOpen}
        onInteract={onInteract}
      >
        <group visible={false}>
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
        </group>
      </InteractableProp>
    </group>
  );
}

useGLTF.preload("/duolingo-latest-v2.glb");
