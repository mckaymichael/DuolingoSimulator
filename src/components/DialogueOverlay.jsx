import { useState, useEffect, useRef } from "react";
import { SCENARIOS } from "@/data/scenarios";

/**
 * DialogueOverlay
 *
 * Full-screen HTML/CSS overlay shown during language interactions.
 * Presents the NPC speech in the target language (Spanish) with
 * environmental context clues — no direct translation shown upfront.
 *
 * Props:
 *   scenarioId — key into SCENARIOS
 *   onClose    — callback to restore player movement
 */
export default function DialogueOverlay({ scenarioId, onClose }) {
  const scenario = SCENARIOS[scenarioId];
  const [selected, setSelected] = useState(null);   // index of chosen answer
  const [showResult, setShowResult] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(0); // for controller/keyboard navigation

  if (!scenario) return null;

  const isCorrect = selected === scenario.correctIndex;

  const handleChoice = (idx) => {
    if (selected !== null) return; // already answered
    setSelected(idx);
    setShowResult(true);
    setHoveredIdx(100); // sentinel for "Continue" button
  };

  // ── Controller Support ────────────────────────────────────
  const ctrlRef = useRef({
    lastBtn: true, // Initialize to true to ignore the initial press that opened the dialogue
    lastDpad: { up: false, down: false },
    navCooldown: 0,
    startTime: Date.now()
  });

  // Track showResult in a ref so the polling loop always has the latest value
  const showResultRef = useRef(showResult);
  useEffect(() => { showResultRef.current = showResult; }, [showResult]);

  useEffect(() => {
    let rafId;

    const poll = (time) => {
      // 200ms initial lockout to prevent "input bleed" from the interaction press
      if (Date.now() - ctrlRef.current.startTime < 200) {
        rafId = requestAnimationFrame(poll);
        return;
      }
      const gpts = navigator.getGamepads();
      const gp = gpts[0];

      if (gp) {
        const DEADZONE = 0.5;
        const y = gp.axes[1]; // Left stick vertical
        const btnA = gp.buttons[0].pressed;
        
        // D-pad (12: Up, 13: Down)
        const dUp = gp.buttons[12]?.pressed;
        const dDown = gp.buttons[13]?.pressed;

        const state = ctrlRef.current;

        // --- Navigation ---
        let navInput = 0;
        if (dUp && !state.lastDpad.up) navInput = -1;
        if (dDown && !state.lastDpad.down) navInput = 1;

        // Sticky-stick logic with cooldown to prevent skipping
        if (navInput === 0 && Math.abs(y) > DEADZONE && time > state.navCooldown) {
          navInput = y < 0 ? -1 : 1;
          state.navCooldown = time + 250; // 250ms debounce
        }

        if (navInput !== 0) {
          setHoveredIdx(prev => {
            if (showResultRef.current) return 100;
            if (navInput < 0) return Math.max(0, prev - 1);
            return Math.min(scenario.choices.length - 1, prev + 1);
          });
        }
        
        state.lastDpad = { up: !!dUp, down: !!dDown };

        // --- Selection (A Button) ---
        if (btnA && !state.lastBtn) {
          if (!showResultRef.current) {
            // We use a functional setter or a ref for hoveredIdx if we didn't have it here.
            // But hoveredIdx is needed to trigger handleChoice.
            // Actually, handleChoice should probably use the latest hoveredIdx.
            setHoveredIdx(currentHovered => {
              handleChoice(currentHovered);
              return currentHovered;
            });
          } else {
            // If result is shown, check the ref value of continue button focus
            setHoveredIdx(currentHovered => {
               if (currentHovered === 100) onClose();
               return currentHovered;
            });
          }
        }
        state.lastBtn = btnA;
      }
      rafId = requestAnimationFrame(poll);
    };

    rafId = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(rafId);
  }, [scenario.choices.length, onClose]); // Removed dependencies that reset the polling state

  return (
    <div className="dialogue-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="dialogue-card">
        {/* Location tag */}
        <div className="dialogue-tag">📍 {scenario.location}</div>

        {/* NPC speech — target language only */}
        <div className="dialogue-npc-speech">"{scenario.npcSpeech}"</div>

        {/* Context hint — environmental clues, no translation */}
        <div className="dialogue-hint">💡 {scenario.contextHint}</div>

        {/* Choices */}
        {!showResult ? (
          <div className="dialogue-choices">
            {scenario.choices.map((choice, idx) => (
              <button
                key={idx}
                id={`choice-${scenarioId}-${idx}`}
                className={`dialogue-choice-btn ${hoveredIdx === idx ? "focused" : ""}`}
                onClick={() => handleChoice(idx)}
                onMouseEnter={() => setHoveredIdx(idx)}
              >
                {choice}
              </button>
            ))}
          </div>
        ) : (
          <div>
            <div className="dialogue-choices">
              {scenario.choices.map((choice, idx) => {
                const isThisCorrect   = idx === scenario.correctIndex;
                const isThisSelected  = idx === selected;
                let extraClass = "";
                if (isThisCorrect)  extraClass = "correct";
                if (isThisSelected && !isThisCorrect) extraClass = "incorrect";
                return (
                  <button
                    key={idx}
                    id={`result-choice-${scenarioId}-${idx}`}
                    className={`dialogue-choice-btn ${extraClass}`}
                    disabled
                  >
                    {isThisCorrect   && "✓ "}
                    {isThisSelected && !isThisCorrect && "✗ "}
                    {choice}
                  </button>
                );
              })}
            </div>

            {/* Result message */}
            <div
              style={{
                marginTop: "1rem",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                background: isCorrect
                  ? "rgba(143,186,106,0.12)"
                  : "rgba(200,80,60,0.12)",
                border: `1px solid ${isCorrect ? "rgba(143,186,106,0.4)" : "rgba(200,80,60,0.4)"}`,
                color: isCorrect ? "#8fba6a" : "#e07060",
                fontSize: "0.875rem",
                lineHeight: 1.6,
              }}
            >
              {isCorrect
                ? scenario.successMessage
                : scenario.errorMessage || "Hmm, that doesn't seem right. Pay attention to the context clues around you."}
            </div>

            <button
              id="dialogue-continue-btn"
              className={`dialogue-continue-btn ${hoveredIdx === 100 ? "focused" : ""}`}
              onClick={onClose}
              onMouseEnter={() => setHoveredIdx(100)}
            >
              {isCorrect 
                ? (scenario.continueText || "¡Continuar! →") 
                : (scenario.retryText || "Try again next time →")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
