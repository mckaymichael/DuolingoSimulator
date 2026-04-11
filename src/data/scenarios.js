/**
 * scenarios.js
 * Language scenario data for interactive props and NPCs.
 * Each scenario relies on context clues — no direct translations are shown upfront.
 */

export const SCENARIOS = {
  cafe_counter: {
    title: "La Cafetería",
    location: "Café del Plaza",
    npcSpeech: "¿Qué desea tomar?",
    contextHint:
      "The barista smiles and gestures at the chalkboard menu behind them. The aroma of freshly ground coffee fills the air.",
    choices: [
      "Un café, por favor.",
      "La cuenta, por favor.",
      "¿Dónde está el baño?",
    ],
    correctIndex: 0,
    successMessage: "¡Perfecto! The barista nods and begins preparing your order.",
  },

  bench_sign: {
    title: "El Parque",
    location: "Town Square — Bench",
    npcSpeech: "Este banco está ocupado.",
    contextHint:
      "An elderly man gestures firmly at the bags placed on the bench beside him. He shakes his head.",
    choices: [
      "¿Puedo sentarme aquí?",
      "Gracias, señor.",
      "¡Buenos días!",
    ],
    correctIndex: 0,
    successMessage: "The man pauses, then moves his bags with a reluctant nod.",
  },

  trash_can: {
    title: "La Calle",
    location: "Town Street",
    npcSpeech: "¡No tire basura aquí!",
    contextHint:
      "A city worker points sternly at the overflowing rubbish bin, then at the litter on the ground.",
    choices: [
      "Lo siento mucho.",
      "¿Cuánto cuesta?",
      "Me llamo Carlos.",
    ],
    correctIndex: 0,
    successMessage: "The worker relaxes. \"Está bien,\" they say, handing you a proper bag.",
  },

  npc_tourist: {
    title: "La Plaza",
    location: "Town Plaza — Tourist",
    npcSpeech: "Perdona, ¿hablas inglés?",
    contextHint:
      "A flustered tourist holds a crumpled map and looks at you hopefully, pointing at a street sign.",
    choices: [
      "Sí, un poco. ¿En qué puedo ayudarte?",
      "No entiendo.",
      "Adiós.",
    ],
    correctIndex: 0,
    successMessage:
      "The tourist sighs with relief. \"¡Gracias!\" they exclaim, finally finding their way.",
  },
};
