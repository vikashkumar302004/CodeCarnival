const CC_THEMES = {
  "neon-web": { emoji: "🕸️", title: "CITY SAVED!", eyebrow: "Neon Web", note: "Another bug caught. Another mission complete.", colors: ["#ff304f", "#29b6ff"], effect: "web" },
  custom: { emoji: "✨", title: "YOU DID IT!", eyebrow: "Custom World", note: "Your code. Your world. Your victory.", colors: ["#f8c451", "#ff7b9c"], effect: "custom" }
};

const CC_DEFAULTS = { enabled: true, theme: "neon-web", accent: "#ff304f", blur: 2, overlay: 42, customBackground: "", sound: true, celebrateOnce: true, intensity: "full" };
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
  if (!CC_THEMES[settings.theme] && settings.theme !== "custom") {
    settings = { ...settings, theme: "neon-web", accent: "#ff304f" };
    chrome.storage.local.set(settings);
  }
  ccSettings = settings;
  const root = document.documentElement;
  root.classList.toggle("cc-enabled", Boolean(settings.enabled));
  root.classList.toggle("cc-problem-page", isProblemPage());
  const theme = CC_THEMES[settings.theme] || CC_THEMES.custom;
  root.style.setProperty("--cc-accent", settings.accent || theme.colors[0]);
  root.style.setProperty("--cc-accent-2", theme.colors[1]);
  root.style.setProperty("--cc-blur", `${settings.blur}px`);
  root.style.setProperty("--cc-overlay", String(settings.overlay / 100));
  const background = settings.customBackground || chrome.runtime.getURL("assets/neon-web-city.png");
  root.style.setProperty("--cc-background", `url("${background}")`);
  ensureBackdrop();
}

function ensureBackdrop() {
  if (document.querySelector("#cc-backdrop")) return;
  const backdrop = document.createElement("div");
  backdrop.id = "cc-backdrop";
  backdrop.setAttribute("aria-hidden", "true");
  document.documentElement.appendChild(backdrop);
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
  const previousFocus = document.activeElement;
  const theme = CC_THEMES[ccSettings.theme] || CC_THEMES.custom;
  const layer = document.createElement("div");
  layer.id = "cc-celebration";
  layer.setAttribute("role", "dialog");
  layer.setAttribute("aria-modal", "true");
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
    document.removeEventListener("keydown", onKey);
    layer.classList.add("cc-exit");
    setTimeout(() => {
      layer.remove();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    }, 420);
  };
  layer.querySelector(".cc-skip").addEventListener("click", close);
  const onKey = (event) => { if (event.key === "Escape") close(); };
  document.addEventListener("keydown", onKey);
  document.body.appendChild(layer);
  layer.querySelector(".cc-skip").focus();
  playVictorySound();
  setTimeout(close, 4800);
}

function buildThemeEffect(host, effect) {
  if (effect === "web") {
    for (let i = 0; i < 7; i++) host.insertAdjacentHTML("beforeend", `<i class="cc-web-spoke" style="--turn:${i * 25}deg"></i>`);
    host.insertAdjacentHTML("beforeend", '<i class="cc-web-line"></i><b class="cc-web-dancer"><i class="cc-dancer-head"></i><i class="cc-dancer-body"></i><i class="cc-dancer-arm left"></i><i class="cc-dancer-arm right"></i><i class="cc-dancer-leg left"></i><i class="cc-dancer-leg right"></i></b>');
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
  if (document.hidden || !ccSettings.enabled || !isProblemPage()) {
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
document.addEventListener("visibilitychange", queueInspection);
setInterval(handleLocationChange, 750);
queueInspection();
