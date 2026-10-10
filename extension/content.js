const CC_THEMES = {
  "web-hero": { emoji: "🕸️", title: "MISSION COMPLETE", eyebrow: "Web Hero", note: "Another challenge caught in your web.", colors: ["#ef3340", "#42a5ff"], effect: "web" },
  "pixel-quest": { emoji: "⚔️", title: "STAGE CLEAR!", eyebrow: "Pixel Quest", note: "+100 XP · The next level awaits", colors: ["#ffcf4a", "#7cf7c5"], effect: "pixel" },
  "neon-tokyo": { emoji: "🌃", title: "SYSTEM CLEARED", eyebrow: "Neon Tokyo", note: "Run complete. Skill level rising.", colors: ["#ff4fd8", "#62f4ff"], effect: "neon" },
  "cosmic-run": { emoji: "🚀", title: "LIFTOFF!", eyebrow: "Cosmic Run", note: "Solution accepted. New orbit unlocked.", colors: ["#a675ff", "#48e5ff"], effect: "space" },
  "forest-spirit": { emoji: "🍃", title: "QUEST COMPLETE", eyebrow: "Forest Spirit", note: "A calm mind finds the path.", colors: ["#80ed99", "#d8f3dc"], effect: "leaves" },
  "sunset-drive": { emoji: "🌅", title: "SMOOTH SOLVE", eyebrow: "Sunset Drive", note: "Cruising into the next challenge.", colors: ["#ff7b54", "#ffd56b"], effect: "sunset" },
  custom: { emoji: "✨", title: "YOU DID IT!", eyebrow: "Custom World", note: "Your code. Your world. Your victory.", colors: ["#f8c451", "#ff7b9c"], effect: "custom" }
};

const CC_DEFAULTS = { enabled: true, theme: "pixel-quest", accent: "#ffcf4a", blur: 8, overlay: 55, customBackground: "", sound: true, celebrateOnce: true, intensity: "full" };
let ccSettings = { ...CC_DEFAULTS };
let lastAcceptedAt = 0;
let acceptedVisible = false;
const celebratedProblems = new Set();
let lastLocation = location.href;
let inspectionQueued = false;

const RESULT_SELECTORS = [
  '[data-e2e-locator="submission-result"]',
  '[data-e2e-locator="console-result"]',
  '[data-e2e-locator="submission-result-status"]',
  '[data-cy="submission-result"]',
  '[class*="submission-result"]',
  '[class*="result-state"]',
  '[role="dialog"] [role="status"]',
  '[role="dialog"] [class*="success"]'
];

function isProblemPage() {
  return /^\/problems\/[^/]+\/?/.test(location.pathname);
}

function applyTheme(settings) {
  ccSettings = settings;
  const root = document.documentElement;
  root.classList.toggle("cc-enabled", Boolean(settings.enabled));
  root.classList.toggle("cc-problem-page", isProblemPage());
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
  layer.dataset.effect = theme.effect;
  layer.innerHTML = `
    <div class="cc-effect-layer" aria-hidden="true"></div>
    <div class="cc-victory-card">
      <span class="cc-victory-icon">${theme.emoji}</span>
      <div class="cc-eyebrow">${theme.eyebrow}</div>
      <h2>${theme.title}</h2>
      <p>${theme.note}</p>
    </div>
    <button class="cc-skip">Skip · Esc</button>`;

  const particleCount = ccSettings.intensity === "calm" ? 18 : 54;
  for (let i = 0; i < particleCount; i++) {
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
  buildThemeEffect(layer.querySelector(".cc-effect-layer"), theme.effect);

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

function buildThemeEffect(host, effect) {
  const count = ccSettings.intensity === "calm" ? 4 : 10;
  if (effect === "web") {
    for (let i = 0; i < 7; i++) host.insertAdjacentHTML("beforeend", `<i class="cc-web-spoke" style="--turn:${i * 25}deg"></i>`);
    host.insertAdjacentHTML("beforeend", '<i class="cc-web-line"></i><b class="cc-hero-swing">🕷️</b>');
  } else if (effect === "pixel") {
    for (let i = 0; i < count; i++) host.insertAdjacentHTML("beforeend", `<i class="cc-pixel" style="--x:${8 + Math.random() * 84}%;--y:${10 + Math.random() * 78}%;--delay:${Math.random()}s"></i>`);
  } else if (effect === "neon") {
    host.insertAdjacentHTML("beforeend", '<i class="cc-neon-grid"></i><i class="cc-scanline"></i>');
  } else if (effect === "space") {
    for (let i = 0; i < count * 2; i++) host.insertAdjacentHTML("beforeend", `<i class="cc-star" style="--x:${Math.random() * 100}%;--y:${Math.random() * 100}%;--delay:${Math.random() * 1.5}s"></i>`);
    host.insertAdjacentHTML("beforeend", '<b class="cc-rocket-trail">🚀</b>');
  } else if (effect === "leaves") {
    for (let i = 0; i < count; i++) host.insertAdjacentHTML("beforeend", `<i class="cc-leaf" style="--x:${Math.random() * 100}%;--delay:${Math.random() * 2}s">🍃</i>`);
  } else if (effect === "sunset") {
    host.insertAdjacentHTML("beforeend", '<i class="cc-sun"></i><i class="cc-road"></i>');
  } else {
    host.insertAdjacentHTML("beforeend", '<i class="cc-custom-glow"></i>');
  }
}

function currentProblemKey() {
  const match = location.pathname.match(/\/problems\/([^/]+)/);
  return match?.[1] || location.pathname;
}

function isVisible(node) {
  if (!(node instanceof Element)) return false;
  const style = getComputedStyle(node);
  const rect = node.getBoundingClientRect();
  return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) !== 0 && rect.width > 0 && rect.height > 0;
}

function normalizedResultText(node) {
  return (node.textContent || "").replace(/\s+/g, " ").trim();
}

function findAcceptedResult() {
  for (const selector of RESULT_SELECTORS) {
    for (const node of document.querySelectorAll(selector)) {
      if (isVisible(node) && /(^|\s)Accepted(?:!|\s|$)/i.test(normalizedResultText(node))) return node;
    }
  }
  return null;
}

function inspectForAccepted() {
  inspectionQueued = false;
  if (!ccSettings.enabled || !isProblemPage()) {
    acceptedVisible = false;
    return;
  }
  const accepted = Boolean(findAcceptedResult());
  const now = Date.now();
  const problemKey = currentProblemKey();
  const alreadyCelebrated = ccSettings.celebrateOnce && celebratedProblems.has(problemKey);
  if (accepted && !acceptedVisible && !alreadyCelebrated && now - lastAcceptedAt > 15000) {
    lastAcceptedAt = now;
    acceptedVisible = true;
    celebratedProblems.add(problemKey);
    celebrate();
  }
  if (!accepted) acceptedVisible = false;
}

function queueInspection() {
  if (inspectionQueued) return;
  inspectionQueued = true;
  requestAnimationFrame(() => setTimeout(inspectForAccepted, 120));
}

function handleLocationChange() {
  if (location.href === lastLocation) return;
  lastLocation = location.href;
  acceptedVisible = false;
  applyTheme(ccSettings);
  queueInspection();
}

chrome.storage.local.get(CC_DEFAULTS, applyTheme);
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  for (const [key, value] of Object.entries(changes)) ccSettings[key] = value.newValue;
  applyTheme(ccSettings);
});
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "CODE_CARNIVAL_PREVIEW") {
    celebrate();
    sendResponse({ ok: true });
  }
  if (message.type === "CODE_CARNIVAL_STATUS") {
    sendResponse({
      ok: true,
      problemPage: isProblemPage(),
      problem: currentProblemKey().replaceAll("-", " "),
      enabled: ccSettings.enabled,
      theme: ccSettings.theme
    });
  }
});

const observer = new MutationObserver(queueInspection);
observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
window.addEventListener("popstate", handleLocationChange);
setInterval(handleLocationChange, 750);
queueInspection();
