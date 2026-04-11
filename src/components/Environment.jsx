import { RigidBody } from "@react-three/rapier";
import { Text } from "@react-three/drei";
import InteractableProp from "./InteractableProp";

/* ─── Constants ──────────────────────────────────────────── */
const WH = 3.6;   // wall height
const WH2 = WH / 2;
const WALL_COLOR = "#ddd5c8";
const WALL_ROUGHNESS = 0.88;

/* ─── Helpers ────────────────────────────────────────────── */
function Wall({ pos, args, rot = 0, color = WALL_COLOR, roughness = WALL_ROUGHNESS }) {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh castShadow receiveShadow position={pos} rotation={[0, rot, 0]}>
        <boxGeometry args={args} />
        <meshStandardMaterial color={color} roughness={roughness} metalness={0.02} />
      </mesh>
    </RigidBody>
  );
}

function FloorPanel({ pos, size, color, rot = 0 }) {
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, rot, 0]} position={pos}>
      <planeGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  );
}

/**
 * AttractionStation
 * Green placeholder block for an attraction/exhibit.
 * Collidable, with emissive screen panel on front face.
 */
function AttractionStation({ position, rot = 0, label = "" }) {
  return (
    <group position={position} rotation={[0, rot, 0]}>
      <RigidBody type="fixed" colliders="cuboid">
        {/* Main body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4, 1.8, 2.6]} />
          <meshStandardMaterial color="#375a37" roughness={0.65} metalness={0.06} />
        </mesh>
        {/* Top cap */}
        <mesh position={[0, 0.96, 0]}>
          <boxGeometry args={[4.1, 0.12, 2.7]} />
          <meshStandardMaterial color="#2a472a" roughness={0.5} />
        </mesh>
      </RigidBody>
      {/* Screen panel */}
      <mesh position={[0, 0.3, 1.31]}>
        <planeGeometry args={[2.8, 1.3]} />
        <meshStandardMaterial
          color="#050d05"
          emissive="#0d3a0d"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>
      {/* Status dot */}
      <mesh position={[1.7, 0.78, 1.31]}>
        <circleGeometry args={[0.07, 8]} />
        <meshStandardMaterial color="#44ff44" emissive="#44ff44" emissiveIntensity={3} />
      </mesh>
      {/* Station light */}
      <pointLight position={[0, 2.2, 0]} intensity={4} color="#a8e8a8" distance={8} decay={2} />
    </group>
  );
}

/**
 * Environment — Indoor Venue
 *
 * Layout (top-down, Y-up):
 *   Main Hall: fan-shaped, X ≈ -22 to +32, Z ≈ -36 to +18
 *   Maze Room: rectangular annex, X ≈ -46 to -22, Z ≈ -29 to +10
 *   Main entrance door: right side of inner front wall (~x=20-28, z≈15)
 *   Maze door: shared wall at x=-22, gap at z=-9 to -5
 */
export default function Environment({ onInteract, dialogueOpen }) {
  return (
    <group>
      {/* ══ BASE GROUND (collision + exterior) ══════════════ */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
          <planeGeometry args={[160, 160]} />
          <meshStandardMaterial color="#6a5c48" roughness={0.95} />
        </mesh>
      </RigidBody>

      {/* ══ INTERIOR FLOORS ═════════════════════════════════ */}
      {/* Main hall — warm light concrete */}
      <FloorPanel pos={[4, 0.01, -8]} size={[56, 54]} color="#d4c9b4" />
      {/* Maze room — slightly darker tone */}
      <FloorPanel pos={[-34, 0.01, -9]} size={[24, 38]} color="#c2b69e" />

      {/* ══════════════════════════════════════════════════════
          MAIN HALL — OUTER CURVED BACK WALL
          4 flat segments approximating the convex arc
         ══════════════════════════════════════════════════════ */}
      {/* Far left */}
      <Wall pos={[-18, WH2, -30]} args={[18, WH, 0.5]} rot={Math.PI * 0.112} />
      {/* Center-left */}
      <Wall pos={[-3, WH2, -36]} args={[20, WH, 0.5]} rot={Math.PI * 0.04} />
      {/* Center-right */}
      <Wall pos={[11, WH2, -35]} args={[18, WH, 0.5]} rot={-Math.PI * 0.04} />
      {/* Far right */}
      <Wall pos={[24, WH2, -28]} args={[16, WH, 0.5]} rot={-Math.PI * 0.13} />
      {/* Cap connector (back-left joins maze back wall) */}
      <Wall pos={[-22.5, WH2, -29.2]} args={[2, WH, 0.5]} rot={0} />

      {/* ══════════════════════════════════════════════════════
          MAIN HALL — RIGHT OUTER WALL
          Angled to follow fan shape from front to back
         ══════════════════════════════════════════════════════ */}
      <Wall pos={[31, WH2, -7]} args={[0.5, WH, 52]} rot={-Math.PI * 0.06} />
      {/* Short cap at top-right to close corner with back wall */}
      <Wall pos={[30.5, WH2, -31]} args={[0.5, WH, 4]} rot={0} />

      {/* ══════════════════════════════════════════════════════
          MAIN HALL — INNER FRONT WALL (concave)
          4 segments. Gap at x≈20–27, z≈15 = MAIN ENTRANCE
         ══════════════════════════════════════════════════════ */}
      {/* Far left (near maze junction) */}
      <Wall pos={[-8, WH2, 12]} args={[20, WH, 0.5]} rot={Math.PI * 0.065} />
      {/* Center */}
      <Wall pos={[6, WH2, 17]} args={[16, WH, 0.5]} rot={-Math.PI * 0.02} />
      {/* Right of center — stops before entrance gap */}
      <Wall pos={[14.5, WH2, 17]} args={[7, WH, 0.5]} rot={-Math.PI * 0.06} />
      {/* ── MAIN ENTRANCE GAP: x ≈ 18–27, z ≈ 14–17 ── */}
      {/* Short wall after entrance (right return) */}
      <Wall pos={[29.5, WH2, 11]} args={[8, WH, 0.5]} rot={-Math.PI * 0.17} />
      {/* Connector: right return to right outer wall */}
      <Wall pos={[31.2, WH2, 14.5]} args={[0.5, WH, 7]} rot={0} />

      {/* ══════════════════════════════════════════════════════
          SHARED WALL (x = -22)
          = Maze right wall / Main hall left boundary
          Upper solid: z = -29 → -9
          DOOR GAP:    z = -9  → -5   (4 units)
          Lower solid: z = -5  → +10
         ══════════════════════════════════════════════════════ */}
      {/* Upper section */}
      <Wall pos={[-22, WH2, -19]} args={[0.5, WH, 20]} />
      {/* Door gap — just a header beam, no collision */}
      <mesh position={[-22, WH - 0.35, -7]}>
        <boxGeometry args={[0.5, 0.7, 4]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={WALL_ROUGHNESS} />
      </mesh>
      {/* Lower section */}
      <Wall pos={[-22, WH2, 2.5]} args={[0.5, WH, 15]} />

      {/* ══════════════════════════════════════════════════════
          MAZE ROOM WALLS
          Rectangular: X -46→-22, Z -29→+10
         ══════════════════════════════════════════════════════ */}
      {/* Back wall (top of maze, z = -29) */}
      <Wall pos={[-34, WH2, -29]} args={[24, WH, 0.5]} />
      {/* Left wall (x = -46) */}
      <Wall pos={[-46, WH2, -9.5]} args={[0.5, WH, 39]} />
      {/* Front wall (bottom of maze, z = +10) */}
      <Wall pos={[-34, WH2, 10]} args={[24, WH, 0.5]} />

      {/* ══════════════════════════════════════════════════════
          RED CIRCULAR COUNTER (central feature / exhibit ring)
          Octagonal approximation — 8 counter segments in a ring
         ══════════════════════════════════════════════════════ */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const r = 5.5;
        const cx = 4, cz = -13;
        return (
          <RigidBody key={`ring-${i}`} type="fixed" colliders="cuboid">
            <mesh
              castShadow receiveShadow
              position={[cx + Math.sin(angle) * r, 0.6, cz + Math.cos(angle) * r]}
              rotation={[0, angle, 0]}
            >
              <boxGeometry args={[4.5, 1.2, 0.45]} />
              <meshStandardMaterial color="#b03020" roughness={0.45} metalness={0.18} />
            </mesh>
            {/* Counter top */}
            <mesh
              position={[cx + Math.sin(angle) * r, 1.26, cz + Math.cos(angle) * r]}
              rotation={[0, angle, 0]}
            >
              <boxGeometry args={[4.6, 0.12, 0.55]} />
              <meshStandardMaterial color="#8c2016" roughness={0.35} metalness={0.25} />
            </mesh>
          </RigidBody>
        );
      })}
      {/* Central glowing exhibit pillar */}
      <mesh position={[4, 1.0, -13]}>
        <cylinderGeometry args={[0.65, 0.65, 2, 16]} />
        <meshStandardMaterial
          color="#1a0808"
          emissive="#9b1a0a"
          emissiveIntensity={1.8}
          roughness={0.25}
          metalness={0.35}
        />
      </mesh>
      <pointLight position={[4, 1.8, -13]} intensity={14} color="#ff4422" distance={14} decay={2} />

      {/* ══════════════════════════════════════════════════════
          RED L-SHAPED COUNTER (lower-left of main hall)
         ══════════════════════════════════════════════════════ */}
      {/* Horizontal arm */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow receiveShadow position={[-12.5, 0.55, 7]}>
          <boxGeometry args={[5.2, 1.0, 0.65]} />
          <meshStandardMaterial color="#b03020" roughness={0.5} metalness={0.12} />
        </mesh>
        <mesh position={[-12.5, 1.06, 7]}>
          <boxGeometry args={[5.35, 0.12, 0.8]} />
          <meshStandardMaterial color="#8a1e10" roughness={0.38} metalness={0.22} />
        </mesh>
      </RigidBody>
      {/* Vertical arm */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow receiveShadow position={[-15.2, 0.55, 4.4]}>
          <boxGeometry args={[0.65, 1.0, 5.6]} />
          <meshStandardMaterial color="#b03020" roughness={0.5} metalness={0.12} />
        </mesh>
        <mesh position={[-15.2, 1.06, 4.4]}>
          <boxGeometry args={[0.8, 0.12, 5.75]} />
          <meshStandardMaterial color="#8a1e10" roughness={0.38} metalness={0.22} />
        </mesh>
      </RigidBody>

      {/* ══════════════════════════════════════════════════════
          GREEN ATTRACTION STATIONS
          Along the right curved wall and back-center of main hall
         ══════════════════════════════════════════════════════ */}
      {/* Right wall cluster — 3 stations */}
      <AttractionStation position={[20, 0.9, -18]} rot={-Math.PI * 0.20} />
      <AttractionStation position={[22, 0.9, -23]} rot={-Math.PI * 0.30} />
      <AttractionStation position={[17, 0.9, -29]} rot={-Math.PI * 0.43} />
      {/* Back center — 2 stations */}
      <AttractionStation position={[6, 0.9, -26]} rot={Math.PI * 0.5} />
      <AttractionStation position={[-5, 0.9, -23]} rot={Math.PI * 0.5} />

      {/* ══════════════════════════════════════════════════════
          GREEN ENTRANCE WELCOME STRIP
          (green dashed arc from floor plan at the inner front wall)
         ══════════════════════════════════════════════════════ */}
      {Array.from({ length: 5 }).map((_, i) => {
        const t = (i / 4); // 0..1
        const x = -6 + t * 22; // x: -6 to +16
        const z = 15.5 - Math.abs(t - 0.5) * 4; // gentle arc
        return (
          <mesh key={`strip-${i}`} position={[x, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.5, 0.35]} />
            <meshStandardMaterial
              color="#2d6b2d"
              emissive="#1a4a1a"
              emissiveIntensity={0.8}
              roughness={0.5}
            />
          </mesh>
        );
      })}

      {/* ══════════════════════════════════════════════════════
          "THE MAZE" DOOR SIGN
         ══════════════════════════════════════════════════════ */}
      <Text
        position={[-22.22, 2.85, -7]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.36}
        color="#8fba6a"
        fontWeight={700}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
      >
        ▶ THE MAZE
      </Text>

      {/* ══════════════════════════════════════════════════════
          INTERACTIVE NPC STATIONS — inside The Maze
          Positioned along the west wall (x≈-44), facing east (+X)
         ══════════════════════════════════════════════════════ */}

      {/* Kiosk 1 — Café scenario */}
      <InteractableProp
        position={[-41, 0.55, -22]}
        promptHeight={2.2}
        interactRadius={3.5}
        scenarioId="cafe_counter"
        label="Language Kiosk 1"
        dialogueOpen={dialogueOpen}
        onInteract={onInteract}
      >
        {/* Counter — faces +X (toward entrance) */}
        <RigidBody type="fixed" colliders="cuboid">
          <mesh castShadow receiveShadow rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[3.2, 1.0, 0.8]} />
            <meshStandardMaterial color="#5c3d1e" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.56, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[3.35, 0.12, 0.95]} />
            <meshStandardMaterial color="#8b6540" roughness={0.4} />
          </mesh>
        </RigidBody>
        {/* Barista NPC */}
        <mesh castShadow position={[-0.9, 1.3, 0]}>
          <cylinderGeometry args={[0.26, 0.26, 1.4, 12]} />
          <meshStandardMaterial color="#4a6b4a" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[-0.9, 2.08, 0]}>
          <sphereGeometry args={[0.26, 12, 12]} />
          <meshStandardMaterial color="#c8a87a" roughness={0.65} />
        </mesh>
        {/* Coffee machine */}
        <mesh castShadow position={[-0.9, 0.84, 0.55]}>
          <boxGeometry args={[0.5, 0.55, 0.35]} />
          <meshStandardMaterial color="#222" roughness={0.3} metalness={0.7} />
        </mesh>
      </InteractableProp>

      {/* Kiosk 2 — Bench/NPC scenario */}
      <InteractableProp
        position={[-41, 0.45, -10]}
        promptHeight={2.0}
        interactRadius={3.0}
        scenarioId="bench_sign"
        label="Language Kiosk 2"
        dialogueOpen={dialogueOpen}
        onInteract={onInteract}
      >
        <RigidBody type="fixed" colliders="cuboid">
          <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
            <boxGeometry args={[0.7, 0.12, 2.4]} />
            <meshStandardMaterial color="#7a5230" roughness={0.8} />
          </mesh>
          <mesh castShadow receiveShadow position={[-0.32, 0.7, 0]}>
            <boxGeometry args={[0.1, 0.55, 2.4]} />
            <meshStandardMaterial color="#7a5230" roughness={0.8} />
          </mesh>
        </RigidBody>
        {/* NPC */}
        <mesh castShadow position={[0, 1.0, 0.5]}>
          <cylinderGeometry args={[0.22, 0.24, 1.1, 12]} />
          <meshStandardMaterial color="#8b7355" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[0, 1.65, 0.5]}>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshStandardMaterial color="#d4b896" roughness={0.7} />
        </mesh>
        {/* Bags */}
        <mesh castShadow position={[0, 0.52, -0.55]}>
          <boxGeometry args={[0.4, 0.28, 0.3]} />
          <meshStandardMaterial color="#8b6540" roughness={0.7} />
        </mesh>
      </InteractableProp>

      {/* Kiosk 3 — Street scenario */}
      <InteractableProp
        position={[-41, 0.5, 2]}
        promptHeight={2.0}
        interactRadius={2.8}
        scenarioId="trash_can"
        label="Language Kiosk 3"
        dialogueOpen={dialogueOpen}
        onInteract={onInteract}
      >
        <RigidBody type="fixed" colliders="cuboid">
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.38, 0.3, 0.9, 16]} />
            <meshStandardMaterial color="#3d3d3d" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.49, 0]}>
            <cylinderGeometry args={[0.42, 0.4, 0.08, 16]} />
            <meshStandardMaterial color="#555" roughness={0.8} />
          </mesh>
        </RigidBody>
        {/* City-worker NPC */}
        <mesh castShadow position={[0.9, 0.7, 0]}>
          <cylinderGeometry args={[0.27, 0.27, 1.4, 12]} />
          <meshStandardMaterial color="#e8820a" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[0.9, 1.47, 0]}>
          <sphereGeometry args={[0.26, 12, 12]} />
          <meshStandardMaterial color="#c8a87a" roughness={0.7} />
        </mesh>
      </InteractableProp>

      {/* Kiosk 4 — Tourist scenario */}
      <InteractableProp
        position={[-41, 0.75, -16]}
        promptHeight={2.0}
        interactRadius={2.8}
        scenarioId="npc_tourist"
        label="Language Kiosk 4"
        dialogueOpen={dialogueOpen}
        onInteract={onInteract}
      >
        {/* Tourist NPC */}
        <mesh castShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.27, 0.27, 1.5, 12]} />
          <meshStandardMaterial color="#5b8dd9" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[0, 0.87, 0]}>
          <sphereGeometry args={[0.27, 12, 12]} />
          <meshStandardMaterial color="#d4aa7a" roughness={0.7} />
        </mesh>
        {/* Map prop */}
        <mesh castShadow position={[0.22, 0.5, 0.25]} rotation={[0, -0.4, 0.3]}>
          <boxGeometry args={[0.4, 0.28, 0.02]} />
          <meshStandardMaterial color="#f5e6c0" roughness={0.7} />
        </mesh>
      </InteractableProp>

      {/* ══════════════════════════════════════════════════════
          LIGHTING
         ══════════════════════════════════════════════════════ */}
      {/* Main hall overhead grid */}
      <pointLight position={[4, 3.3, -13]} intensity={18} color="#fff4e0" distance={30} decay={1.8} />
      <pointLight position={[4, 3.3, 3]} intensity={12} color="#fff4e0" distance={24} decay={2} />
      <pointLight position={[-10, 3.3, -8]} intensity={10} color="#f5edd8" distance={22} decay={2} />
      <pointLight position={[18, 3.3, -20]} intensity={12} color="#f5edd8" distance={24} decay={2} />
      <pointLight position={[6, 3.3, -30]} intensity={10} color="#f5edd8" distance={22} decay={2} />

      {/* Maze interior — warmer/moodier */}
      <pointLight position={[-34, 3.2, -22]} intensity={14} color="#f0e0c8" distance={22} decay={2} />
      <pointLight position={[-34, 3.2, -3]} intensity={12} color="#f0e0c8" distance={22} decay={2} />

      {/* Maze entrance glow — green accent */}
      <pointLight position={[-22, 2.6, -7]} intensity={6} color="#8fba6a" distance={10} decay={2} />

      {/* Attraction station accent lights */}
      <pointLight position={[21, 2.8, -22]} intensity={5} color="#a8e8a8" distance={12} decay={2} />
    </group>
  );
}
