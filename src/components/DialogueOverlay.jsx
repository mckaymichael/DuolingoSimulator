import { useState } from "react";
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

  if (!scenario) return null;

  const isCorrect = selected === scenario.correctIndex;

  const handleChoice = (idx) => {
    if (selected !== null) return; // already answered
    setSelected(idx);
    setShowResult(true);
  };

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
                className="dialogue-choice-btn"
                onClick={() => handleChoice(idx)}
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
                : "Hmm, that doesn't seem right. Pay attention to the context clues around you."}
            </div>

            <button
              id="dialogue-continue-btn"
              className="dialogue-continue-btn"
              onClick={onClose}
            >
              {isCorrect ? "¡Continuar! →" : "Try again next time →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
