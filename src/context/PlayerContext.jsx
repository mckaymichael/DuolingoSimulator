"use client";

import { createContext, useContext, useRef } from "react";

/**
 * PlayerContext
 *
 * Shares the player RigidBody position ref and unified inputRef
 * between CharacterController (writer) and InteractableProp (reader).
 * Using refs instead of state avoids re-renders every frame.
 */
const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  // playerPosRef.current = { x, y, z } — updated every frame by CharacterController
  const playerPosRef = useRef({ x: 0, y: 0, z: 0 });
  // inputRef is set by CharacterController after useControls() runs inside Canvas
  const inputRef = useRef({ movement: { x: 0, z: 0 }, interact: false });

  return (
    <PlayerContext.Provider value={{ playerPosRef, inputRef }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
