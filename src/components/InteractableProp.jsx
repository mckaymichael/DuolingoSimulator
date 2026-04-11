import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Vector3 } from "three";
import { usePlayer } from "@/context/PlayerContext";

/**
 * InteractableProp
 *
 * Reusable interactive object wrapper.
 * Reads player position and input from PlayerContext (set by CharacterController)
 * to determine proximity and trigger interaction — no prop-drilling needed.
 *
 * Props:
 *   position       — [x, y, z] world position of the prop
 *   promptHeight   — Y offset for the floating prompt label
 *   interactRadius — world-unit radius for the trigger zone
 *   scenarioId     — key into SCENARIOS data
 *   label          — human-readable name shown in prompt
 *   dialogueOpen   — whether any dialogue is currently open
 *   onInteract     — (scenarioId) => void called when player interacts
 *   children       — the visual 3D mesh(es) for this prop
 */
export default function InteractableProp({
  position = [0, 0, 0],
  promptHeight = 2.5,
  interactRadius = 3.2,
  scenarioId,
  label = "Object",
  dialogueOpen,
  onInteract,
  children,
}) {
  const { playerPosRef, inputRef } = usePlayer();
  const [playerNear, setPlayerNear] = useState(false);
  const prevInteract = useRef(false);
  const propPos = useRef(new Vector3(...position));
  const playerVec = useRef(new Vector3());
  
  // Prevent immediate re-triggering when closing dialogue with the interact button
  const canInteract = useRef(true);

  useFrame(() => {
    const pp = playerPosRef?.current;
    if (!pp) return;

    if (dialogueOpen) {
      canInteract.current = false; // Lock interaction while dialogue is up
    }

    playerVec.current.set(pp.x, pp.y, pp.z);
    const dist = propPos.current.distanceTo(playerVec.current);
    const near = dist < interactRadius;

    // Avoid flooding setState — only update when value changes
    setPlayerNear((prev) => (prev !== near ? near : prev));

    const interact = inputRef?.current?.interact ?? false;
    
    // Unlock interaction only AFTER the button is released while dialogue is closed
    if (!dialogueOpen && !interact) {
      canInteract.current = true;
    }

    // Trigger only if near, dialogue is closed, button pushed, AND lockout is clear
    if (near && !dialogueOpen && interact && !prevInteract.current && canInteract.current) {
      onInteract?.(scenarioId);
    }
    prevInteract.current = interact;
  });

  return (
    <group position={position}>
      {/* ── Floating interact prompt via drei <Html> ─────── */}
      {playerNear && !dialogueOpen && (
        <Html
          position={[0, promptHeight, 0]}
          center
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          <div
            style={{
              background: "rgba(18,12,6,0.92)",
              border: "1px solid rgba(143,186,106,0.65)",
              borderRadius: "8px",
              padding: "6px 14px",
              color: "#f0e6d0",
              fontFamily: "'Outfit', sans-serif",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              whiteSpace: "nowrap",
              textAlign: "center",
              boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
            }}
          >
            <span style={{ color: "#8fba6a" }}>[E]</span>
            {" / "}
            <span style={{ color: "#8fba6a" }}>[A]</span>
            {"  "}
            {label}
          </div>
        </Html>
      )}

      {/* ── Visual mesh children ─────────────────────────── */}
      {children}
    </group>
  );
}
