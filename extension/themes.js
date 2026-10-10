const CODE_CARNIVAL_THEMES = [
  { id: "neon-web", name: "Neon Web", emoji: "🕸️", tagline: "Own the night", background: "assets/neon-web-city.png", colors: ["#050b18", "#ff304f", "#29b6ff"], celebration: "CITY SAVED!" },
  { id: "sakura-ronin", name: "Sakura Ronin", emoji: "🌸", tagline: "Code with honor", background: "assets/sakura-ronin.png", colors: ["#11091f", "#f34fbf", "#b9a1ff"], celebration: "VICTORY BLOOMS" },
  { id: "pixel-dungeon", name: "Pixel Dungeon", emoji: "⚔️", tagline: "Clear the quest", background: "assets/pixel-dungeon.png", colors: ["#090b20", "#ffc542", "#35e6a2"], celebration: "STAGE CLEAR!" }
];

const CODE_CARNIVAL_DEFAULTS = {
  enabled: true,
  theme: "neon-web",
  accent: "#ff304f",
  blur: 2,
  overlay: 42,
  customBackground: "",
  sound: true,
  celebrateOnce: true,
  intensity: "full"
};
