"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import DialogueOverlay from "@/components/DialogueOverlay";

// Import canvas with SSR disabled — Three.js requires a browser environment
const CanvasSetup = dynamic(() => import("@/components/CanvasSetup"), {
  ssr: false,
});

export default function Page() {
  const [activeScenario, setActiveScenario] = useState(null);

  const handleInteract = useCallback((scenarioId) => {
    setActiveScenario(scenarioId);
  }, []);

  const handleClose = useCallback(() => {
    setActiveScenario(null);
  }, []);

  return (
    <>
      {/* HUD */}
      <div className="hud">
        <div className="hud-title">Duolingo Adventures</div>
        <div className="hud-controls">WASD · Move &nbsp;|&nbsp; E / Gamepad A · Interact</div>
      </div>

      {/* 3D Scene */}
      <CanvasSetup
        onInteract={handleInteract}
        dialogueOpen={activeScenario !== null}
      />

      {/* Dialogue Overlay */}
      {activeScenario && (
        <DialogueOverlay
          scenarioId={activeScenario}
          onClose={handleClose}
        />
      )}
    </>
  );
}
