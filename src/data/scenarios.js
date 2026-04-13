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
    errorMessage: "Mmm, eso no parece correcto. Presta atención a las pistas del entorno.",
    continueText: "¡Continuar! →",
    retryText: "Reintentar →",
  },

  bench_sign: {
    title: "Le Parc",
    location: "Town Square — Le Banc",
    npcSpeech: "Ce banc est occupé.",
    contextHint:
      "Un homme âgé gesticule fermement vers les sacs posés sur le banc à côté de lui. Il secoue la tête.",
    choices: [
      "Puis-je m'asseoir ici ?",
      "Merci, monsieur.",
      "Bonjour !",
    ],
    correctIndex: 0,
    successMessage: "L'homme marque une pause, puis déplace ses sacs avec un hochement de tête hésitant.",
    errorMessage: "Hmm, cela ne semble pas correct. Faites attention aux indices contextuels.",
    continueText: "Continuer ! →",
    retryText: "Réessayer →",
  },

  trash_can: {
    title: "街の通り",
    location: "Town Street — 街中",
    npcSpeech: "ここでゴミを捨てないでください！",
    contextHint:
      "市の職員が溢れそうなゴミ箱と地面のゴミを厳しく指差しています。",
    choices: [
      "本当にすみません。",
      "いくらですか？",
      "私の名前はカルロスです。",
    ],
    correctIndex: 0,
    successMessage: "職員はリラックスします。「大丈夫です」と言って、適切な袋を渡してくれます。",
    errorMessage: "うーん、それは正しくないようです。周りのヒントに注意してください。",
    continueText: "次へ →",
    retryText: "もう一度やり直す →",
  },

  npc_tourist: {
    title: "Der Platz",
    location: "Town Plaza — Tourist",
    npcSpeech: "Entschuldigung, sprechen Sie Englisch?",
    contextHint:
      "Ein sichtlich verwirrter Tourist hält einen zerknitterten Stadtplan und blickt Sie hoffnungsvoll an.",
    choices: [
      "Ja, ein bisschen. Wie kann ich Ihnen helfen?",
      "Ich verstehe nicht.",
      "Auf Wiedersehen.",
    ],
    correctIndex: 0,
    successMessage:
      "Der Tourist seufzt erleichtert auf. \"Danke!\" ruft er aus, als er endlich seinen Weg findet.",
    errorMessage: "Hmm, das scheint nicht richtig zu sein. Achten Sie auf die Hinweise.",
    continueText: "Weiter! →",
    retryText: "Nochmal versuchen →",
  },
};
