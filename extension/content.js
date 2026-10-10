const CC_THEMES = {
  "web-hero": { emoji: "🕸️", title: "MISSION COMPLETE", eyebrow: "Web Hero", note: "Another challenge caught in your web.", colors: ["#ef3340", "#42a5ff"], effect: "web" },
  "pixel-quest": { emoji: "⚔️", title: "STAGE CLEAR!", eyebrow: "Pixel Quest", note: "+100 XP · The next level awaits", colors: ["#ffcf4a", "#7cf7c5"], effect: "pixel" },
  "neon-tokyo": { emoji: "🌃", title: "SYSTEM CLEARED", eyebrow: "Neon Tokyo", note: "Run complete. Skill level rising.", colors: ["#ff4fd8", "#62f4ff"], effect: "neon" },
  "cosmic-run": { emoji: "🚀", title: "LIFTOFF!", eyebrow: "Cosmic Run", note: "Solution accepted. New orbit unlocked.", colors: ["#a675ff", "#48e5ff"], effect: "space" },
  "forest-spirit": { emoji: "🍃", title: "QUEST COMPLETE", eyebrow: "Forest Spirit", note: "A calm mind finds the path.", colors: ["#80ed99", "#d8f3dc"], effect: "leaves" },
  "sunset-drive": { emoji: "🌅", title: "SMOOTH SOLVE", eyebrow: "Sunset Drive", note: "Cruising into the next challenge.", colors: ["#ff7b54", "#ffd56b"], effect: "sunset" },
  custom: { emoji: "✨", title: "YOU DID IT!", eyebrow: "Custom World", note: "Your code. Your world. Your victory.", colors: ["#f8c451", "#ff7b9c"], effect: "custom" }
};

const CC_DEFAULTS = { enabled: true, theme: "pixel-quest", accent: "#ffcf4a", blur: 8, overlay: 55, customBackground: "", sound: true };
let ccSettings = { ...CC_DEFAULTS };
let lastAcceptedAt = 0;

function applyTheme(settings) {
  ccSettings = settings;
  const root = document.documentElement;
  root.classList.toggle("cc-enabled", Boolean(settings.enabled));
  const theme = CC_THEMES[settings.theme] || CC_THEMES.custom;
  root.style.setProperty("--cc-accent", settings.accent || theme.colors[0]);
  root.style.setProperty("--cc-accent-2", theme.colors[1]);
  root.style.setProperty("--cc-blur", `${settings.blur}px`);
  root.style.setProperty("--cc-overlay", String(settings.overlay / 100));
  root.style.setProperty("--cc-background", settings.customBackground ? `url("${settings.customBackground}")` : defaultBackdrop(settings.theme));
}

function defaultBackdrop(id) {
  const patterns = {
    "web-hero": "linear-gradient(125deg, #07142d 0%, #1e356b 42%, #7e1323 100%)",
    "pixel-quest": "linear-gradient(135deg, #100d29 0%, #34205e 50%, #152f35 100%)",
    "neon-tokyo": "linear-gradient(155deg, #090617 10%, #511359 55%, #052f47 100%)",
    "cosmic-run": "radial-gradient(circle at 70% 20%, #553091 0%, #071426 42%, #02040b 100%)",
    "forest-spirit": "linear-gradient(135deg, #06150e, #17472e 55%, #0e2620)",
    "sunset-drive": "linear-gradient(160deg, #23113d, #8e335b 55%, #ff835e)"
  };
  return patterns[id] || patterns["pixel-quest"];
}

function playVictorySound() {
  if (!ccSettings.sound) return;
  try {
    const ctx = new AudioContext();
    [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0, ctx.currentTime + index * .1);
      gain.gain.linearRampToValueAtTime(.12, ctx.currentTime + index * .1 + .02);
      gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + index * .1 + .38);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + index * .1);
      osc.stop(ctx.currentTime + index * .1 + .4);
    });
  } catch (_) { /* Audio is an enhancement; visuals still work. */ }
}

function celebrate() {
  if (!ccSettings.enabled || document.querySelector("#cc-celebration")) return;
  const theme = CC_THEMES[ccSettings.theme] || CC_THEMES.custom;
  const layer = document.createElement("div");
  layer.id = "cc-celebration";
  layer.setAttribute("role", "dialog");
  layer.setAttribute("aria-label", `${theme.title} celebration`);
  layer.innerHTML = `
    <div class="cc-victory-card">
      <span class="cc-victory-icon">${theme.emoji}</span>
      <div class="cc-eyebrow">${theme.eyebrow}</div>
      <h2>${theme.title}</h2>
      <p>${theme.note}</p>
    </div>
    <button class="cc-skip">Skip · Esc</button>`;

  for (let i = 0; i < 48; i++) {
    const particle = document.createElement("i");
    particle.className = "cc-particle";
    particle.style.cssText = `left:${Math.random() * 100}%;--particle:${i % 2 ? theme.colors[0] : theme.colors[1]};--duration:${2 + Math.random() * 2}s;--delay:${Math.random() * 1.1}s;--drift:${-100 + Math.random() * 200}px`;
    layer.appendChild(particle);
  }
  for (let i = 0; i < 3; i++) {
    const ring = document.createElement("i");
    ring.className = "cc-ring";
    ring.style.setProperty("--delay", `${i * .4}s`);
    layer.appendChild(ring);
  }
  if (theme.effect === "web") {
    const web = document.createElement("i");
    web.className = "cc-web-line";
    layer.appendChild(web);
  }

  const close = () => {
    if (!layer.isConnected) return;
    layer.classList.add("cc-exit");
    setTimeout(() => layer.remove(), 420);
  };
  layer.querySelector(".cc-skip").addEventListener("click", close);
  const onKey = (event) => { if (event.key === "Escape") { close(); document.removeEventListener("keydown", onKey); } };
  document.addEventListener("keydown", onKey);
  document.body.appendChild(layer);
  playVictorySound();
  setTimeout(close, 4800);
}

function inspectForAccepted() {
  const candidates = document.querySelectorAll('[data-e2e-locator="submission-result"], [class*="result"], [role="dialog"], [role="status"]');
  const accepted = Array.from(candidates).some((node) => /(^|\s)Accepted(\s|$)/i.test(node.textContent || ""));
  const now = Date.now();
  if (accepted && now - lastAcceptedAt > 15000) {
    lastAcceptedAt = now;
    celebrate();
  }
}

chrome.storage.local.get(CC_DEFAULTS, applyTheme);
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  for (const [key, value] of Object.entries(changes)) ccSettings[key] = value.newValue;
  applyTheme(ccSettings);
});
chrome.runtime.onMessage.addListener((message) => { if (message.type === "CODE_CARNIVAL_PREVIEW") celebrate(); });

const observer = new MutationObserver(() => {
  clearTimeout(inspectForAccepted.timer);
  inspectForAccepted.timer = setTimeout(inspectForAccepted, 250);
});
observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });

