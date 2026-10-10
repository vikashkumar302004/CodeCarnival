const CODE_CARNIVAL_THEMES = [
  { id: "web-hero", name: "Web Hero", emoji: "🕸️", tagline: "Swing into victory", colors: ["#0b1023", "#ef3340", "#42a5ff"], celebration: "MISSION COMPLETE" },
  { id: "pixel-quest", name: "Pixel Quest", emoji: "⚔️", tagline: "A new stage awaits", colors: ["#15102b", "#ffcf4a", "#7cf7c5"], celebration: "STAGE CLEAR!" },
  { id: "neon-tokyo", name: "Neon Tokyo", emoji: "🌃", tagline: "Code after midnight", colors: ["#110720", "#ff4fd8", "#62f4ff"], celebration: "SYSTEM CLEARED" },
  { id: "cosmic-run", name: "Cosmic Run", emoji: "🚀", tagline: "Launch beyond limits", colors: ["#071426", "#a675ff", "#48e5ff"], celebration: "LIFTOFF!" },
  { id: "forest-spirit", name: "Forest Spirit", emoji: "🍃", tagline: "Focus in the wild", colors: ["#081c15", "#80ed99", "#d8f3dc"], celebration: "QUEST COMPLETE" },
  { id: "sunset-drive", name: "Sunset Drive", emoji: "🌅", tagline: "Cruise through problems", colors: ["#28143d", "#ff7b54", "#ffd56b"], celebration: "SMOOTH SOLVE" }
];

const CODE_CARNIVAL_DEFAULTS = {
  enabled: true,
  theme: "pixel-quest",
  accent: "#ffcf4a",
  blur: 8,
  overlay: 55,
  customBackground: "",
  sound: true,
  celebrateOnce: true,
  intensity: "full"
};
