const CODE_CARNIVAL_THEMES = [
  { id: "midnight-ink", name: "Midnight Ink", emoji: "✦", tagline: "Deep focus, zero noise", wallpaper: "radial-gradient(circle at 80% 12%, #283f73 0, transparent 32%), linear-gradient(145deg, #070b16, #10182b 58%, #07101b)", colors: ["#070b16", "#7aa2ff", "#b7c9ff"], celebration: "FLOW UNLOCKED" },
  { id: "mono-paper", name: "Mono Paper", emoji: "▤", tagline: "Maximum readability", wallpaper: "linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(145deg, #15171b, #20242a)", colors: ["#15171b", "#f1f3f5", "#aeb6c2"], celebration: "SOLVED CLEAN" },
  { id: "shinchan-party", name: "Shinchan Party", emoji: "", icon: chrome.runtime.getURL("assets/shinchan-dance.png"), tagline: "Solve, dance, repeat", wallpaper: `linear-gradient(rgba(14,8,20,.34), rgba(14,8,20,.52)), url("${chrome.runtime.getURL("assets/shinchan-wallpaper.png")}")`, colors: ["#35142c", "#ff5b45", "#ffd84a"], celebration: "OH YES!" },
  { id: "cyber-ronin", name: "Cyber Ronin", emoji: "刀", tagline: "Precision under pressure", wallpaper: `linear-gradient(rgba(6,4,14,.34), rgba(6,4,14,.68)), url("${chrome.runtime.getURL("assets/cyber-ronin-shrine.png")}")`, colors: ["#0c0915", "#ff365f", "#a85cff"], celebration: "PERFECT STRIKE" },
  { id: "lofi-rain", name: "Lo-Fi Rain", emoji: "☂", tagline: "Slow night, steady progress", wallpaper: `linear-gradient(rgba(4,9,20,.28), rgba(4,9,20,.62)), url("${chrome.runtime.getURL("assets/lofi-rain-loft.png")}")`, colors: ["#0a1019", "#83b7ff", "#d3b6ff"], celebration: "NIGHT CLEARED" },
  { id: "volt-ranger", name: "Volt Ranger", emoji: "⚡", tagline: "Lock on. Fire. Solve.", wallpaper: `linear-gradient(rgba(1,8,6,.42), rgba(1,8,6,.72)), url("${chrome.runtime.getURL("assets/volt-city-v2.png")}")`, colors: ["#03110d", "#32f5b0", "#7dffe0"], celebration: "THREAT CLEARED" },
  { id: "shadow-hacker", name: "Shadow Hacker", emoji: "◈", tagline: "Breach. Slash. Vanish.", wallpaper: `linear-gradient(rgba(2,3,12,.36), rgba(2,3,12,.72)), url("${chrome.runtime.getURL("assets/null-district.png")}")`, colors: ["#050510", "#42dcff", "#bd42ff"], celebration: "BUGS ELIMINATED" },
  { id: "sakura-sanctuary", name: "Sakura Sanctuary", emoji: "🌸", tagline: "Breathe. Focus. Bloom.", wallpaper: `linear-gradient(rgba(18,9,24,.34), rgba(18,9,24,.64)), url("${chrome.runtime.getURL("assets/sakura-sanctuary.png")}")`, colors: ["#211020", "#f39ab3", "#ffd4a3"], celebration: "A QUIET VICTORY" },
  { id: "moonlit-last-train", name: "Moonlit Last Train", emoji: "🌙", tagline: "One more stop forward", wallpaper: `linear-gradient(rgba(3,10,24,.3), rgba(3,10,24,.68)), url("${chrome.runtime.getURL("assets/moonlit-station.png")}")`, colors: ["#071426", "#73a9dc", "#ffc36f"], celebration: "NEXT STOP: SUCCESS" },
  { id: "floating-sky-library", name: "Floating Sky Library", emoji: "📖", tagline: "Think beyond the horizon", wallpaper: `linear-gradient(rgba(10,20,45,.22), rgba(10,20,45,.58)), url("${chrome.runtime.getURL("assets/floating-sky-library.png")}")`, colors: ["#102347", "#8eb9e8", "#ffd28f"], celebration: "ANOTHER CHAPTER COMPLETE" },
  { id: "festival-rooftop", name: "Summer Festival Rooftop", emoji: "🎆", tagline: "One more spark", wallpaper: `linear-gradient(rgba(5,13,35,.28), rgba(5,13,35,.62)), url("${chrome.runtime.getURL("assets/festival-rooftop.png")}")`, colors: ["#081631", "#ff765d", "#ffd172"], celebration: "LIGHT UP THE NIGHT" }
];

const CODE_CARNIVAL_DEFAULTS = {
  enabled: true,
  showDock: true,
  theme: "midnight-ink",
  accent: "#7aa2ff",
  blur: 0,
  overlay: 68,
  customBackground: "",
  sound: true,
  successSound: "theme",
  wrongSound: "soft-error",
  customSuccessSound: "",
  customWrongSound: "",
  savedThemes: [],
  celebrateOnce: true,
  intensity: "full"
};
