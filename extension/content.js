const CC_THEMES = {
  "midnight-ink": { emoji: "✦", title: "FLOW UNLOCKED", eyebrow: "Midnight Ink", note: "Clean thinking. Clean solution.", wallpaper: "radial-gradient(circle at 80% 12%, #283f73 0, transparent 32%), linear-gradient(145deg, #070b16, #10182b 58%, #07101b)", colors: ["#7aa2ff", "#b7c9ff"], effect: "ink" },
  "mono-paper": { emoji: "▤", title: "SOLVED CLEAN", eyebrow: "Mono Paper", note: "Nothing extra. Just correct.", wallpaper: "linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(145deg, #15171b, #20242a)", colors: ["#f1f3f5", "#aeb6c2"], effect: "custom" },
  "shinchan-party": { emoji: "🕺", title: "OH YES!", eyebrow: "Shinchan Party", note: "Correct answer. Victory dance time!", wallpaper: `linear-gradient(rgba(14,8,20,.34), rgba(14,8,20,.52)), url("${chrome.runtime.getURL("assets/shinchan-wallpaper.png")}")`, colors: ["#ff5b45", "#ffd84a"], effect: "shinchan" },
  "cyber-ronin": { emoji: "刀", title: "PERFECT STRIKE", eyebrow: "Cyber Ronin", note: "One clean cut through the challenge.", wallpaper: `linear-gradient(rgba(6,4,14,.34), rgba(6,4,14,.68)), url("${chrome.runtime.getURL("assets/cyber-ronin-shrine.png")}")`, colors: ["#ff365f", "#a85cff"], effect: "ronin" },
  "lofi-rain": { emoji: "☂", title: "NIGHT CLEARED", eyebrow: "Lo-Fi Rain", note: "Slow night. Steady progress.", wallpaper: `linear-gradient(rgba(4,9,20,.28), rgba(4,9,20,.62)), url("${chrome.runtime.getURL("assets/lofi-rain-loft.png")}")`, colors: ["#83b7ff", "#d3b6ff"], effect: "lofi" },
  "volt-ranger": { emoji: "⚡", title: "THREAT CLEARED", eyebrow: "Volt Ranger", note: "Target locked. Solution secured.", wallpaper: `linear-gradient(rgba(1,8,6,.42), rgba(1,8,6,.72)), url("${chrome.runtime.getURL("assets/volt-city-v2.png")}")`, colors: ["#32f5b0", "#7dffe0"], effect: "volt" },
  "shadow-hacker": { emoji: "◈", title: "BUGS ELIMINATED", eyebrow: "Shadow Hacker", note: "Breach complete. No trace left behind.", wallpaper: `linear-gradient(rgba(2,3,12,.36), rgba(2,3,12,.72)), url("${chrome.runtime.getURL("assets/null-district.png")}")`, colors: ["#42dcff", "#bd42ff"], effect: "shadow" },
  "sakura-sanctuary": { emoji: "🌸", title: "A QUIET VICTORY", eyebrow: "Sakura Sanctuary", note: "Breathe softly. Your solution has bloomed.", wallpaper: `linear-gradient(rgba(18,9,24,.34), rgba(18,9,24,.64)), url("${chrome.runtime.getURL("assets/sakura-sanctuary.png")}")`, colors: ["#f39ab3", "#ffd4a3"], effect: "sanctuary" },
  "moonlit-last-train": { emoji: "🌙", title: "NEXT STOP: SUCCESS", eyebrow: "Moonlit Last Train", note: "Your journey continues beyond this platform.", wallpaper: `linear-gradient(rgba(3,10,24,.3), rgba(3,10,24,.68)), url("${chrome.runtime.getURL("assets/moonlit-station.png")}")`, colors: ["#73a9dc", "#ffc36f"], effect: "moontrain" },
  "floating-sky-library": { emoji: "📖", title: "ANOTHER CHAPTER COMPLETE", eyebrow: "Floating Sky Library", note: "A new idea has found its wings.", wallpaper: `linear-gradient(rgba(10,20,45,.22), rgba(10,20,45,.58)), url("${chrome.runtime.getURL("assets/floating-sky-library.png")}")`, colors: ["#8eb9e8", "#ffd28f"], effect: "skylibrary" },
  "festival-rooftop": { emoji: "🎆", title: "LIGHT UP THE NIGHT", eyebrow: "Summer Festival Rooftop", note: "Your solution became tonight's brightest spark.", wallpaper: `linear-gradient(rgba(5,13,35,.28), rgba(5,13,35,.62)), url("${chrome.runtime.getURL("assets/festival-rooftop.png")}")`, colors: ["#ff765d", "#ffd172"], effect: "festival" },
  custom: { emoji: "✨", title: "YOU DID IT!", eyebrow: "Custom World", note: "Your code. Your world. Your victory.", colors: ["#f8c451", "#ff7b9c"], effect: "custom" }
};

const CC_DEFAULTS = { enabled: true, showDock: true, theme: "midnight-ink", accent: "#7aa2ff", blur: 0, overlay: 68, customBackground: "", sound: true, successSound: "theme", wrongSound: "soft-error", customSuccessSound: "", customWrongSound: "", celebrateOnce: true, intensity: "full" };
let ccSettings = { ...CC_DEFAULTS };
let lastResultAt = 0;
let visibleResult = "";
let activeShinchanAudio = null;
let submissionProbeTimer = null;
let voltBattleActive = false;
let shadowBattleActive = false;
let sanctuaryActive = false;
let trainActive = false;
let libraryActive = false;
let festivalActive = false;
const handledResults = new Set();
let lastLocation = location.href;
let lastProblemKey = location.pathname.match(/\/problems\/([^/]+)/)?.[1] || "";
let inspectionQueued = false;

const RESULT_SELECTORS = [
  '[data-e2e-locator="submission-result"]',
  '[data-e2e-locator="console-result"]',
  '[data-e2e-locator="submission-result-status"]',
  '[data-cy="submission-result"]',
  '[class*="submission-result"]',
  '[class*="result-state"]',
  '[role="dialog"] [role="status"]',
  '[role="dialog"] [class*="success"]',
  '[class*="text-green"]',
  '[class*="text-success"]',
  '[class*="text-red"]',
  '[class*="text-error"]'
];

function isProblemPage() {
  return /^\/problems\/[^/]+\/?/.test(location.pathname);
}

function applyTheme(settings) {
  if (!CC_THEMES[settings.theme] && settings.theme !== "custom") {
    settings = { ...settings, theme: "midnight-ink", accent: "#7aa2ff" };
    chrome.storage.local.set(settings);
  }
  ccSettings = settings;
  const root = document.documentElement;
  root.dataset.ccTheme = settings.theme;
  root.classList.toggle("cc-enabled", Boolean(settings.enabled));
  root.classList.toggle("cc-problem-page", isProblemPage());
  const theme = CC_THEMES[settings.theme] || CC_THEMES.custom;
  root.style.setProperty("--cc-accent", settings.accent || theme.colors[0]);
  root.style.setProperty("--cc-accent-2", theme.colors[1]);
  root.style.setProperty("--cc-blur", `${settings.blur}px`);
  root.style.setProperty("--cc-overlay", String(settings.overlay / 100));
  const background = settings.customBackground ? `url("${settings.customBackground}")` : theme.wallpaper;
  root.style.setProperty("--cc-background", background);
  ensureBackdrop();
  ensureThemeDock();
}

function ensureBackdrop() {
  if (document.querySelector("#cc-backdrop")) return;
  const backdrop = document.createElement("div");
  backdrop.id = "cc-backdrop";
  backdrop.ariaHidden = "true";
  document.documentElement.appendChild(backdrop);
}

function ensureThemeDock() {
  if (!isProblemPage() || !ccSettings.showDock) {
    document.querySelector("#cc-theme-dock")?.remove();
    return;
  }
  let dock = document.querySelector("#cc-theme-dock");
  if (!dock) {
    dock = document.createElement("aside");
    dock.id = "cc-theme-dock";
    dock.setAttribute("aria-label", "CodeCarnival theme picker");
    dock.innerHTML = `
      <button class="cc-dock-toggle" aria-expanded="false" aria-label="Open CodeCarnival themes"><span class="cc-logo-mark">✦</span></button>
      <div class="cc-dock-panel">
        <header><div><b>CodeCarnival</b><small>Choose your focus world</small></div><button class="cc-dock-close" aria-label="Close theme picker">×</button></header>
        <div class="cc-dock-themes"></div>
        <button class="cc-dock-studio">Open full Theme Studio <span>↗</span></button>
        <button class="cc-dock-preview">Preview celebration <span>▶</span></button>
      </div>`;
    document.documentElement.appendChild(dock);
    const toggle = (open) => {
      dock.classList.toggle("open", open);
      dock.querySelector(".cc-dock-toggle").setAttribute("aria-expanded", String(open));
    };
    dock.querySelector(".cc-dock-toggle").addEventListener("click", () => toggle(!dock.classList.contains("open")));
    dock.querySelector(".cc-dock-close").addEventListener("click", () => toggle(false));
    dock.querySelector(".cc-dock-preview").addEventListener("click", () => { ccSettings.enabled = true; toggle(false); chrome.storage.local.set({ enabled: true }); celebrate(); });
    dock.querySelector(".cc-dock-studio").addEventListener("click", () => chrome.runtime.openOptionsPage());
    dock.querySelector(".cc-dock-themes").addEventListener("click", (event) => {
      const button = event.target.closest("[data-cc-theme]");
      if (!button) return;
      const selected = CC_THEMES[button.dataset.ccTheme];
      toggle(false);
      chrome.storage.local.set({ theme: button.dataset.ccTheme, accent: selected.colors[0], customBackground: "", enabled: true });
    });
  }
  dock.querySelector(".cc-dock-themes").innerHTML = Object.entries(CC_THEMES)
    .filter(([id]) => id !== "custom")
    .map(([id, theme]) => `<button data-cc-theme="${id}" class="${ccSettings.theme === id ? "active" : ""}" style="--dock-a:${theme.colors[0]};--dock-b:${theme.colors[1]};--dock-bg:${theme.wallpaper}"><i>${theme.emoji}</i><span><b>${theme.eyebrow}</b><small>${theme.note}</small></span><em>✓</em></button>`)
    .join("");
}

function playAudioAsset(source) {
  if (!ccSettings.sound || !source) return false;
  try {
    if (!activeShinchanAudio) activeShinchanAudio = new Audio();
    activeShinchanAudio.pause();
    activeShinchanAudio.currentTime = 0;
    activeShinchanAudio.src = source.startsWith("data:") ? source : chrome.runtime.getURL(source);
    activeShinchanAudio.volume = .9;
    activeShinchanAudio.play().catch(() => {});
    return true;
  } catch (_) {
    return false;
  }
}

function unlockSubmissionAudio() {
  if (!ccSettings.sound) return;
  try {
    if (!activeShinchanAudio) activeShinchanAudio = new Audio(chrome.runtime.getURL("assets/shinchan-wrong.mp3"));
    activeShinchanAudio.volume = .001;
    const attempt = activeShinchanAudio.play();
    attempt?.then(() => { activeShinchanAudio.pause(); activeShinchanAudio.currentTime = 0; activeShinchanAudio.volume = .9; }).catch(() => {});
  } catch (_) {}
}

function watchSubmissionResult() {
  clearInterval(submissionProbeTimer);
  let checks = 0;
  submissionProbeTimer = setInterval(() => {
    inspectForResult();
    if (++checks >= 48 || visibleResult) { clearInterval(submissionProbeTimer); submissionProbeTimer = null; }
  }, 250);
}

function selectedSuccessFile() {
  const files = { shinchan: "assets/shinchan-victory.mp3", "heroic-rise": "assets/heroic-rise.mp3", "dark-suit": "assets/dark-suit.mp3", "mission-beat": "assets/mission-beat.mp3" };
  if (ccSettings.successSound === "custom") return ccSettings.customSuccessSound || "";
  if (ccSettings.successSound === "theme" && ccSettings.theme === "shinchan-party") return files.shinchan;
  return files[ccSettings.successSound] || "";
}

function playVictorySound() {
  if (!ccSettings.sound) return;
  if (ccSettings.successSound === "none") return;
  if (playAudioAsset(selectedSuccessFile())) return;
  try {
    const ctx = new AudioContext();
    const effect = (CC_THEMES[ccSettings.theme] || CC_THEMES.custom).effect;
    const melody = effect === "shinchan" ? [659.25, 783.99, 659.25, 1046.5, 1174.66]
      : effect === "ronin" ? [220, 440, 880]
      : effect === "lofi" ? [392, 493.88, 587.33, 493.88]
      : [523.25, 659.25, 783.99, 1046.5];
    melody.forEach((frequency, index) => {
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
  } catch (_) {}
}

function playWrongSound() {
  if (!ccSettings.sound) return;
  if (ccSettings.theme === "shinchan-party") return void playAudioAsset("assets/shinchan-wrong.mp3");
  if (ccSettings.wrongSound === "none") return;
  if (ccSettings.wrongSound === "anath") return void playAudioAsset("assets/shinchan-wrong.mp3");
  if (ccSettings.wrongSound === "custom") return void playAudioAsset(ccSettings.customWrongSound);
  try {
    const ctx = new AudioContext();
    [196, 146.83].forEach((frequency, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(.001, ctx.currentTime + index * .13);
      gain.gain.linearRampToValueAtTime(.07, ctx.currentTime + index * .13 + .02);
      gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + index * .13 + .28);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + index * .13);
      osc.stop(ctx.currentTime + index * .13 + .3);
    });
  } catch (_) {}
}

function celebrate() {
  if (!ccSettings.enabled || document.querySelector("#cc-celebration")) return;
  const theme = CC_THEMES[ccSettings.theme] || CC_THEMES.custom;
  const layer = document.createElement("div");
  layer.id = "cc-celebration";
  layer.setAttribute("role", "status");
  layer.setAttribute("aria-live", "polite");
  layer.setAttribute("aria-label", `${theme.title} celebration`);
  layer.dataset.effect = theme.effect;
  layer.innerHTML = `
    <div class="cc-cinema-shade" aria-hidden="true"></div>
    <div class="cc-effect-layer" aria-hidden="true"></div>
    <div class="cc-victory-card" data-effect="${theme.effect}">
      <div class="cc-kicker"><span>${theme.emoji}</span>${theme.eyebrow}</div>
      <div class="cc-title-row"><i></i><h2>${theme.title}</h2><i></i></div>
      <p><strong>ACCEPTED</strong><span>ALL TESTS PASSED</span></p>
      <small>${theme.note}</small>
    </div>
    <button class="cc-skip" aria-label="Close celebration">ESC</button>`;

  const particleCount = ccSettings.intensity === "calm" ? 8 : 20;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("i");
    particle.className = "cc-particle";
    particle.style.cssText = `left:${Math.random() * 100}%;--particle:${i % 2 ? theme.colors[0] : theme.colors[1]};--duration:${2 + Math.random() * 2}s;--delay:${Math.random() * 1.1}s;--drift:${-100 + Math.random() * 200}px`;
    layer.appendChild(particle);
  }
  buildThemeEffect(layer.querySelector(".cc-effect-layer"), theme.effect);

  const close = () => {
    if (!layer.isConnected) return;
    document.removeEventListener("keydown", onKey);
    layer.classList.add("cc-exit");
    setTimeout(() => {
      layer.remove();
    }, 420);
  };
  layer.querySelector(".cc-skip").addEventListener("click", close);
  const onKey = (event) => { if (event.key === "Escape") close(); };
  document.addEventListener("keydown", onKey);
  document.documentElement.appendChild(layer);
  playVictorySound();
  setTimeout(close, 3100);
}

function playVoltBattleSound() {
  if (!ccSettings.sound) return;
  try {
    const ctx = new AudioContext();
    const zap = (at, from, to, volume = .11) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(from, ctx.currentTime + at);
      osc.frequency.exponentialRampToValueAtTime(to, ctx.currentTime + at + .16);
      gain.gain.setValueAtTime(.001, ctx.currentTime + at);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + at + .015);
      gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + at + .2);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + at);
      osc.stop(ctx.currentTime + at + .22);
    };
    zap(.12, 95, 48, .07);
    zap(1.18, 1320, 180);
    zap(1.56, 1120, 145, .13);
  } catch (_) {}
}

function launchVoltBattle() {
  if (!ccSettings.enabled || ccSettings.theme !== "volt-ranger" || voltBattleActive) return;
  voltBattleActive = true;
  document.documentElement.classList.add("cc-volt-impact");
  const battle = document.createElement("div");
  battle.id = "cc-volt-battle";
  battle.ariaHidden = "true";
  battle.innerHTML = `
    <div class="cc-volt-scene"></div>
    <div class="cc-volt-grid"></div>
    <div class="cc-volt-scan"></div>
    <div class="cc-volt-vignette"></div>
    <div class="cc-volt-alert">THREAT DETECTED <span>ENGAGING SCRAP DRONES</span></div>
    <div class="cc-volt-reticle r1"><i></i><b>01</b></div>
    <div class="cc-volt-reticle r2"><i></i><b>02</b></div>
    <img class="cc-volt-hero" src="${chrome.runtime.getURL("assets/volt-ranger.png")}" alt="" />
    <img class="cc-volt-drone one" src="${chrome.runtime.getURL("assets/scrap-drone.png")}" alt="" />
    <img class="cc-volt-drone two" src="${chrome.runtime.getURL("assets/scrap-drone.png")}" alt="" />
    <i class="cc-volt-laser l1"></i><i class="cc-volt-laser l2"></i>
    <i class="cc-volt-muzzle m1"></i><i class="cc-volt-muzzle m2"></i>
    <i class="cc-volt-hit h1"></i><i class="cc-volt-hit h2"></i>
    <i class="cc-volt-shockwave"></i>
    ${Array.from({ length: 14 }, (_, i) => `<i class="cc-volt-debris" style="--d:${i};--dx:${-110 + Math.random() * 220}px;--dy:${-50 - Math.random() * 150}px"></i>`).join("")}`;
  document.documentElement.appendChild(battle);
  playVoltBattleSound();
  setTimeout(() => {
    battle.classList.add("cc-exit");
    document.documentElement.classList.remove("cc-volt-impact");
  }, 3650);
  setTimeout(() => {
    battle.remove();
    voltBattleActive = false;
  }, 4100);
}

function launchShadowBattle() {
  if (!ccSettings.enabled || ccSettings.theme !== "shadow-hacker" || shadowBattleActive) return;
  shadowBattleActive = true;
  document.documentElement.classList.add("cc-shadow-breach");
  const battle = document.createElement("div");
  battle.id = "cc-shadow-battle";
  battle.ariaHidden = "true";
  battle.innerHTML = `<div class="cc-shadow-scene"></div><div class="cc-shadow-code"></div><div class="cc-shadow-warning">BREACH IN PROGRESS <span>TRACING HOSTILE BUGS</span></div><img class="cc-shadow-hero" src="${chrome.runtime.getURL("assets/shadow-hacker.png")}" alt="" /><img class="cc-shadow-wraith w1" src="${chrome.runtime.getURL("assets/bug-wraith.png")}" alt="" /><img class="cc-shadow-wraith w2" src="${chrome.runtime.getURL("assets/bug-wraith.png")}" alt="" /><i class="cc-shadow-portal p1"></i><i class="cc-shadow-portal p2"></i><i class="cc-shadow-slash s1"></i><i class="cc-shadow-slash s2"></i><i class="cc-shadow-slash s3"></i>${Array.from({ length: 24 }, (_, i) => `<b class="cc-shadow-pixel" style="--i:${i};--x:${Math.random() * 100}%;--y:${Math.random() * 100}%;--dx:${-120 + Math.random() * 240}px"></b>`).join("")}`;
  document.documentElement.appendChild(battle);
  setTimeout(() => { battle.classList.add("cc-exit"); document.documentElement.classList.remove("cc-shadow-breach"); }, 3500);
  setTimeout(() => { battle.remove(); shadowBattleActive = false; }, 3950);
}

function launchSanctuary() {
  if (!ccSettings.enabled || ccSettings.theme !== "sakura-sanctuary" || sanctuaryActive) return;
  sanctuaryActive = true;
  const moment = document.createElement("div");
  moment.id = "cc-sanctuary-moment";
  moment.ariaHidden = "true";
  moment.innerHTML = `<i class="cc-sanctuary-breeze"></i><span>FOCUS WITHIN</span>${Array.from({ length: 18 }, (_, i) => `<b style="--i:${i};--y:${8 + Math.random() * 72}%;--s:${10 + Math.random() * 13}px">◆</b>`).join("")}`;
  document.documentElement.appendChild(moment);
  setTimeout(() => moment.classList.add("cc-exit"), 1700);
  setTimeout(() => { moment.remove(); sanctuaryActive = false; }, 2150);
}

function launchTrainMoment() {
  if (!ccSettings.enabled || ccSettings.theme !== "moonlit-last-train" || trainActive) return;
  trainActive = true;
  const moment = document.createElement("div");
  moment.id = "cc-train-moment";
  moment.ariaHidden = "true";
  moment.innerHTML = `<i class="cc-train-signal"></i><i class="cc-train-headlight"></i><span>SIGNAL CLEAR</span>${Array.from({ length: 15 }, (_, i) => `<b style="--i:${i};--x:${8 + Math.random() * 84}%;--y:${12 + Math.random() * 72}%"></b>`).join("")}`;
  document.documentElement.appendChild(moment);
  setTimeout(() => moment.classList.add("cc-exit"), 1900);
  setTimeout(() => { moment.remove(); trainActive = false; }, 2350);
}

function launchLibrary() {
  if (!ccSettings.enabled || ccSettings.theme !== "floating-sky-library" || libraryActive) return;
  libraryActive = true;
  const moment = document.createElement("div");
  moment.id = "cc-library-moment";
  moment.ariaHidden = "true";
  moment.innerHTML = `<i class="cc-library-cloud left"></i><i class="cc-library-cloud right"></i><div class="cc-library-book"><b></b><b></b><em></em></div><i class="cc-library-bookmark"></i><span>OPENING THE NEXT CHAPTER</span>`;
  document.documentElement.appendChild(moment);
  setTimeout(() => moment.classList.add("cc-exit"), 2150);
  setTimeout(() => { moment.remove(); libraryActive = false; }, 2600);
}

function launchFestival() {
  if (!ccSettings.enabled || ccSettings.theme !== "festival-rooftop" || festivalActive) return;
  festivalActive = true;
  const moment = document.createElement("div");
  moment.id = "cc-festival-moment";
  moment.ariaHidden = "true";
  moment.innerHTML = `<i class="cc-festival-border"></i><i class="cc-rocket r1"></i><i class="cc-rocket r2"></i><i class="cc-rocket r3"></i><div class="cc-code-burst tree">◇<b>◇ ◇</b><em>◇ ◇ ◇ ◇</em></div><div class="cc-code-burst braces">{ }</div><span>IGNITING THE NIGHT</span>${Array.from({ length: 10 }, (_, i) => `<b class="cc-mini-lantern" style="--i:${i};--x:${5 + i * 10}%"></b>`).join("")}`;
  document.documentElement.appendChild(moment);
  setTimeout(() => moment.classList.add("cc-exit"), 2600);
  setTimeout(() => { moment.remove(); festivalActive = false; }, 3050);
}

function buildThemeEffect(host, effect) {
  if (effect === "ink") {
    host.insertAdjacentHTML("beforeend", '<i class="cc-ink-orbit orbit-one"></i><i class="cc-ink-orbit orbit-two"></i><i class="cc-ink-orbit orbit-three"></i><i class="cc-ink-star">✦</i>');
  } else if (effect === "shinchan") {
    for (let i = 0; i < 24; i++) host.insertAdjacentHTML("beforeend", `<i class="cc-party-drop" style="--x:${Math.random() * 100}%;--delay:${Math.random() * 1.2}s;--spin:${Math.random() > .5 ? 1 : -1}">${["★","●","▲","◆"][i % 4]}</i>`);
    host.insertAdjacentHTML("beforeend", `<i class="cc-party-burst"></i><img class="cc-shinchan-character" src="${chrome.runtime.getURL("assets/shinchan-dance.png")}" alt="" />`);
  } else if (effect === "ronin") {
    for (let i = 0; i < 9; i++) host.insertAdjacentHTML("beforeend", `<i class="cc-ronin-line" style="--y:${8 + i * 10}%;--delay:${i * .035}s"></i>`);
    host.insertAdjacentHTML("beforeend", `<i class="cc-ronin-moon"></i><i class="cc-ronin-gate"></i><img class="cc-ronin-warrior" src="${chrome.runtime.getURL("assets/cyber-ronin-warrior.png")}" alt="" /><i class="cc-ronin-slash"></i><i class="cc-ronin-slash second"></i>`);
  } else if (effect === "lofi") {
    for (let i = 0; i < 34; i++) host.insertAdjacentHTML("beforeend", `<i class="cc-lofi-drop" style="--x:${Math.random() * 100}%;--delay:${Math.random()}s;--len:${30 + Math.random() * 60}px"></i>`);
    host.insertAdjacentHTML("beforeend", `<i class="cc-lofi-window"></i><i class="cc-lofi-city-glow"></i><img class="cc-lofi-coder" src="${chrome.runtime.getURL("assets/lofi-rain-coder.png")}" alt="" /><i class="cc-lofi-steam"></i>`);
  } else if (effect === "volt") {
    host.insertAdjacentHTML("beforeend", `<div class="cc-volt-victory-ring"></div><img class="cc-volt-victory-hero" src="${chrome.runtime.getURL("assets/volt-ranger.png")}" alt="" /><img class="cc-volt-victory-drone" src="${chrome.runtime.getURL("assets/scrap-drone.png")}" alt="" />`);
  } else if (effect === "shadow") {
    host.insertAdjacentHTML("beforeend", `<i class="cc-shadow-victory-portal"></i><img class="cc-shadow-victory-hero" src="${chrome.runtime.getURL("assets/shadow-hacker.png")}" alt="" /><i class="cc-shadow-victory-slash"></i>`);
  } else if (effect === "sanctuary") {
    for (let i = 0; i < (ccSettings.intensity === "calm" ? 12 : 28); i++) host.insertAdjacentHTML("beforeend", `<i class="cc-sanctuary-petal" style="--x:${Math.random() * 100}%;--delay:${Math.random() * 1.2}s;--size:${9 + Math.random() * 16}px">◆</i>`);
    host.insertAdjacentHTML("beforeend", `<i class="cc-sanctuary-halo"></i><i class="cc-sanctuary-lantern l1"></i><i class="cc-sanctuary-lantern l2"></i><img class="cc-sanctuary-keeper" src="${chrome.runtime.getURL("assets/sakura-keeper.png")}" alt="" />`);
  } else if (effect === "moontrain") {
    for (let i = 0; i < 18; i++) host.insertAdjacentHTML("beforeend", `<i class="cc-train-firefly" style="--x:${Math.random() * 100}%;--y:${10 + Math.random() * 75}%;--delay:${Math.random()}s"></i>`);
    host.insertAdjacentHTML("beforeend", `<img class="cc-train-traveler" src="${chrome.runtime.getURL("assets/moonlit-traveler.png")}" alt="" /><img class="cc-train-arrival" src="${chrome.runtime.getURL("assets/moonlit-train.png")}" alt="" /><i class="cc-train-mist"></i>`);
  } else if (effect === "skylibrary") {
    for (let i = 0; i < 16; i++) host.insertAdjacentHTML("beforeend", `<i class="cc-paper-bird" style="--i:${i};--y:${12 + Math.random() * 70}%;--delay:${Math.random() * .8}s">◇</i>`);
    host.insertAdjacentHTML("beforeend", `<i class="cc-library-waterfall w1"></i><i class="cc-library-waterfall w2"></i><i class="cc-library-lanterns"></i><img class="cc-sky-librarian" src="${chrome.runtime.getURL("assets/sky-librarian.png")}" alt="" />`);
  } else if (effect === "festival") {
    for (let i = 0; i < 26; i++) host.insertAdjacentHTML("beforeend", `<i class="cc-festival-confetti" style="--x:${i % 2 ? 3 + Math.random() * 12 : 85 + Math.random() * 12}%;--delay:${Math.random()}s;--c:${i % 3}"></i>`);
    host.insertAdjacentHTML("beforeend", `<i class="cc-firework f1"></i><i class="cc-firework f2"></i><i class="cc-firework f3"></i><img class="cc-festival-visitor" src="${chrome.runtime.getURL("assets/festival-visitor.png")}" alt="" /><img class="cc-festival-mascot" src="${chrome.runtime.getURL("assets/festival-mascot.png")}" alt="" />`);
  } else {
    host.insertAdjacentHTML("beforeend", '<i class="cc-custom-glow"></i>');
  }
}

function currentProblemKey() {
  const match = location.pathname.match(/\/problems\/([^/]+)/);
  return match?.[1] || location.pathname;
}

function currentSubmissionKey() {
  return location.pathname.match(/\/submissions\/(\d+)/)?.[1] || "";
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

function findSubmissionResult() {
  for (const selector of RESULT_SELECTORS) {
    for (const node of document.querySelectorAll(selector)) {
      const text = normalizedResultText(node);
      if (!isVisible(node)) continue;
      const isStatusTab = node.closest('[role="tab"], button') && /^(Accepted!?|Wrong Answer)$/i.test(text);
      if (isStatusTab) continue;
      if (/(^|\s)(Wrong Answer|Compile Error|Runtime Error|Time Limit Exceeded|Memory Limit Exceeded|Output Limit Exceeded)(?:!|\s|$)/i.test(text)) return "wrong";
      if (/(^|\s)Accepted(?:!|\s|$)/i.test(text)) return "accepted";
    }
  }
  return "";
}

function inspectForResult() {
  inspectionQueued = false;
  if (document.hidden || !ccSettings.enabled || !isProblemPage()) {
    visibleResult = "";
    return;
  }
  const result = findSubmissionResult();
  const now = Date.now();
  const submissionKey = currentSubmissionKey();
  const resultKey = submissionKey ? `${result}:submission:${submissionKey}` : `${result}:problem:${currentProblemKey()}`;
  const alreadyHandled = ccSettings.celebrateOnce && handledResults.has(resultKey);
  if (result && result !== visibleResult && !alreadyHandled && now - lastResultAt > 1200) {
    lastResultAt = now;
    visibleResult = result;
    handledResults.add(resultKey);
    if (result === "accepted") celebrate();
    if (result === "wrong") playWrongSound();
  }
  if (!result) visibleResult = "";
}

function queueInspection() {
  if (inspectionQueued) return;
  inspectionQueued = true;
  requestAnimationFrame(() => setTimeout(inspectForResult, 120));
}

function handleLocationChange() {
  if (location.href === lastLocation) return;
  lastLocation = location.href;
  const nextProblemKey = currentProblemKey();
  if (nextProblemKey !== lastProblemKey) visibleResult = "";
  lastProblemKey = nextProblemKey;
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
document.addEventListener("click", (event) => {
  if (event.target.closest('[data-e2e-locator="console-submit-button"]')) {
    unlockSubmissionAudio();
    watchSubmissionResult();
    launchVoltBattle(); launchShadowBattle(); launchSanctuary(); launchTrainMoment(); launchLibrary(); launchFestival();
  }
}, true);
setInterval(handleLocationChange, 750);
queueInspection();
