const $ = (selector) => document.querySelector(selector);
let settings = { ...CODE_CARNIVAL_DEFAULTS };
let toastTimer;

function themeFor(id) {
  return CODE_CARNIVAL_THEMES.find((theme) => theme.id === id) || { id: "custom", name: "Custom World", emoji: "✨", tagline: "Made by you", colors: ["#17101f", settings.accent, "#ff7b9c"], celebration: "YOU DID IT!" };
}

function renderThemes() {
  $("#theme-list").innerHTML = CODE_CARNIVAL_THEMES.map((theme) => `
    <button class="theme-item ${settings.theme === theme.id ? "active" : ""}" data-theme="${theme.id}" style="--c1:${theme.colors[0]};--c2:${theme.colors[1]};--c3:${theme.colors[2]}">
      <span>${theme.emoji}</span><div><b>${theme.name}</b><small>${theme.tagline}</small></div>
    </button>`).join("");
}

function updatePreview() {
  const theme = themeFor(settings.theme);
  document.documentElement.style.setProperty("--accent", settings.accent || theme.colors[1]);
  document.documentElement.style.setProperty("--accent-2", theme.colors[2]);
  document.documentElement.style.setProperty("--deep", theme.colors[0]);
  const preview = $("#live-preview");
  preview.style.setProperty("--preview-blur", `${settings.blur}px`);
  preview.style.setProperty("--shade", settings.overlay / 100);
  const builtInBackground = theme.background ? chrome.runtime.getURL(theme.background) : "";
  const previewBackground = settings.customBackground || builtInBackground;
  preview.style.setProperty("--custom-bg", previewBackground ? `url("${previewBackground}")` : "none");
  $("#preview-emoji").textContent = theme.emoji;
  $("#preview-name").textContent = theme.name;
  $("#accent-value").textContent = settings.accent.toUpperCase();
  $("#blur-value").textContent = `${settings.blur}px`;
  $("#overlay-value").textContent = `${settings.overlay}%`;
  renderThemes();
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1500);
}

async function save(patch, message = "Theme saved") {
  settings = { ...settings, ...patch };
  $("#save-state").textContent = "Saving…";
  await chrome.storage.local.set(settings);
  $("#save-state").textContent = "Everything saved";
  updatePreview();
  if (message) showToast(message);
}

chrome.storage.local.get(CODE_CARNIVAL_DEFAULTS, (stored) => {
  if (!CODE_CARNIVAL_THEMES.some(({ id }) => id === stored.theme) && stored.theme !== "custom") {
    stored = { ...stored, theme: "neon-web", accent: "#ff304f" };
    chrome.storage.local.set(stored);
  }
  settings = stored;
  $("#enabled").checked = settings.enabled;
  $("#accent").value = settings.accent;
  $("#blur").value = settings.blur;
  $("#overlay").value = settings.overlay;
  $("#sound").checked = settings.sound;
  $("#celebrate-once").checked = settings.celebrateOnce;
  $("#intensity").value = settings.intensity;
  updatePreview();
});

$("#theme-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-theme]");
  if (!button) return;
  const theme = themeFor(button.dataset.theme);
  $("#accent").value = theme.colors[1];
  save({ theme: theme.id, accent: theme.colors[1], customBackground: "" }, `${theme.name} activated`);
});

$("#custom-theme").addEventListener("click", () => $("#background-file").click());
$("#background-file").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 4 * 1024 * 1024) return showToast("Choose an image below 4 MB");
  const reader = new FileReader();
  reader.onload = () => save({ customBackground: reader.result, theme: "custom" }, "Custom world activated");
  reader.readAsDataURL(file);
});

$("#remove-image").addEventListener("click", () => save({ customBackground: "", theme: "neon-web", accent: "#ff304f" }, "Custom image removed"));
$("#reset").addEventListener("click", async () => {
  await chrome.storage.local.clear();
  settings = { ...CODE_CARNIVAL_DEFAULTS };
  location.reload();
});

for (const id of ["accent", "blur", "overlay"]) {
  $("#" + id).addEventListener("input", (event) => {
    const value = id === "accent" ? event.target.value : Number(event.target.value);
    save({ [id]: value }, "");
  });
}
$("#enabled").addEventListener("change", (event) => save({ enabled: event.target.checked }));
$("#sound").addEventListener("change", (event) => save({ sound: event.target.checked }));
$("#celebrate-once").addEventListener("change", (event) => save({ celebrateOnce: event.target.checked }));
$("#intensity").addEventListener("change", (event) => save({ intensity: event.target.value }));

$("#preview-celebration").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url?.includes("leetcode.com")) return showToast("Open a LeetCode problem first");
  chrome.tabs.sendMessage(tab.id, { type: "CODE_CARNIVAL_PREVIEW" });
});
