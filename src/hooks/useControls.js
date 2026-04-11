import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

/**
 * useControls
 *
 * Unified keyboard + Gamepad API input hook.
 * Returns a ref object (not state — zero re-renders) that is
 * read each frame by the CharacterController.
 *
 * inputRef.current shape:
 *   movement : { x: number, z: number }  — normalised movement vector
 *   interact : boolean                    — true on the frame the button was pressed
 */
export function useControls() {
  const keys = useRef({});
  const inputRef = useRef({
    movement: { x: 0, z: 0 },
    look: { x: 0, y: 0 },
    interact: false,
  });

  // ── Keyboard listeners ────────────────────────────────────
  useEffect(() => {
    const onDown = (e) => { keys.current[e.code] = true; };
    const onUp   = (e) => { keys.current[e.code] = false; };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup",   onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup",   onUp);
    };
  }, []);

  // ── Per-frame polling (keyboard + gamepad) ────────────────
  // This runs inside the R3F render loop — no state updates.
  useFrame(() => {
    const k = keys.current;

    // --- Keyboard movement ---
    let mx = 0;
    let mz = 0;
    if (k["KeyW"] || k["ArrowUp"])    mz -= 1;
    if (k["KeyS"] || k["ArrowDown"])  mz += 1;
    if (k["KeyA"] || k["ArrowLeft"])  mx -= 1;
    if (k["KeyD"] || k["ArrowRight"]) mx += 1;

    // --- Keyboard interact (E key) ---
    let interact = !!k["KeyE"];

    // --- Gamepad ---
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    let lx = 0;
    let ly = 0;

    for (const gp of gamepads) {
      if (!gp) continue;
      const DEADZONE = 0.15;
      
      // Left Stick (Movement)
      const axisX = gp.axes[0] ?? 0;
      const axisZ = gp.axes[1] ?? 0;
      if (Math.abs(axisX) > DEADZONE) mx += axisX;
      if (Math.abs(axisZ) > DEADZONE) mz += axisZ;

      // Right Stick (Look)
      const lookX = gp.axes[2] ?? 0;
      const lookY = gp.axes[3] ?? 0;
      if (Math.abs(lookX) > DEADZONE) lx += lookX;
      if (Math.abs(lookY) > DEADZONE) ly += lookY;

      // Face buttons (0:A, 1:B, 2:X, 3:Y)
      // Check for both .pressed and .value for broader compatibility
      const btnA = gp.buttons[0];
      const btnB = gp.buttons[1];
      const btnX = gp.buttons[2];
      const btnY = gp.buttons[3];

      if (btnA?.pressed || btnB?.pressed || btnX?.pressed || btnY?.pressed) {
        interact = true;
      }
    }

    // Clamp to [-1, 1]
    mx = Math.max(-1, Math.min(1, mx));
    mz = Math.max(-1, Math.min(1, mz));

    inputRef.current.movement.x = mx;
    inputRef.current.movement.z = mz;
    inputRef.current.look.x     = lx;
    inputRef.current.look.y     = ly;
    inputRef.current.interact   = interact;
  });

  return inputRef;
}
