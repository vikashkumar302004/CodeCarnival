const $ = (selector) => document.querySelector(selector);
let settings = { ...CODE_CARNIVAL_DEFAULTS };

function renderThemes() {
  $("#theme-count").textContent = `${CODE_CARNIVAL_THEMES.length} themes`;
  $("#picker-theme-count").textContent = `${CODE_CARNIVAL_THEMES.length} available`;
  $("#theme-grid").innerHTML = CODE_CARNIVAL_THEMES.map((theme) => `
    <button class="theme-card ${theme.id === settings.theme ? "active" : ""}" data-theme="${theme.id}" style="--c1:${theme.colors[0]};--c2:${theme.colors[1]}55;--c3:${theme.colors[2]};--bg:${theme.wallpaper}">
      <span class="emoji">${theme.icon ? `<img src="${theme.icon}" alt="" />` : theme.emoji}</span><strong>${theme.name}</strong><small>${theme.tagline}</small>
    </button>`).join("");
  const selected = CODE_CARNIVAL_THEMES.find(({ id }) => id === settings.theme) || CODE_CARNIVAL_THEMES[0];
  $("#selected-theme-name").textContent = selected.name;
  $("#selected-theme-tagline").textContent = selected.tagline;
  $("#selected-theme-swatch").innerHTML = selected.icon ? `<img src="${selected.icon}" alt="" />` : selected.emoji;
  $("#selected-theme-swatch").style.cssText = `--summary-bg:${selected.wallpaper};--summary-accent:${selected.colors[1]}`;
}

function toggleThemePicker(open) {
  const picker = $("#theme-picker");
  picker.hidden = !open;
  $("#theme-picker-toggle").setAttribute("aria-expanded", String(open));
}

function toggleSoundPicker(open) {
  $("#sound-picker-panel").hidden = !open;
  $("#sound-picker-toggle").setAttribute("aria-expanded", String(open));
}

function uploadSound(file, resultType) {
  if (!file) return;
  if (file.size > 3 * 1024 * 1024) return setStatus("Please choose audio below 3 MB.");
  if (!file.type.startsWith("audio/")) return setStatus("Please choose an MP3, WAV or OGG file.");
  const isSuccess = resultType === "success";
  const reader = new FileReader();
  reader.onload = async () => {
    const soundKey = isSuccess ? "successSound" : "wrongSound";
    const dataKey = isSuccess ? "customSuccessSound" : "customWrongSound";
    await save({ [soundKey]: "custom", [dataKey]: reader.result, sound: true });
    $(isSuccess ? "#success-sound" : "#wrong-sound").value = "custom";
    $(isSuccess ? "#success-upload-state" : "#wrong-upload-state").textContent = `${file.name} · ready`;
    $("#sound").checked = true;
  };
  reader.readAsDataURL(file);
}

function setStatus(message) {
  $("#status").textContent = message;
  clearTimeout(setStatus.timer);
  setStatus.timer = setTimeout(() => $("#status").textContent = "", 1600);
}

async function save(patch) {
  settings = { ...settings, ...patch };
  await chrome.storage.local.set(settings);
  renderThemes();
  setStatus("Saved — your carnival is ready!");
}

chrome.storage.local.get(CODE_CARNIVAL_DEFAULTS, (stored) => {
  if (!CODE_CARNIVAL_THEMES.some(({ id }) => id === stored.theme) && stored.theme !== "custom") {
    stored = { ...stored, theme: "midnight-ink", accent: "#7aa2ff" };
    chrome.storage.local.set(stored);
  }
  settings = stored;
  $("#enabled").checked = settings.enabled;
  $("#show-dock").checked = settings.showDock;
  $("#accent").value = settings.accent;
  $("#blur").value = settings.blur;
  $("#overlay").value = settings.overlay;
  $("#sound").checked = settings.sound;
  $("#success-sound").value = settings.successSound;
  $("#wrong-sound").value = settings.wrongSound;
  if (settings.customSuccessSound) $("#success-upload-state").textContent = "Custom audio saved · ready";
  if (settings.customWrongSound) $("#wrong-upload-state").textContent = "Custom audio saved · ready";
  $("#celebrate-once").checked = settings.celebrateOnce;
  $("#intensity").value = settings.intensity;
  renderThemes();
});

async function checkConnection() {
  const connection = $("#connection");
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.url?.includes("leetcode.com")) throw new Error("not-leetcode");
    const response = await chrome.tabs.sendMessage(tab.id, { type: "CODE_CARNIVAL_STATUS" });
    connection.className = `connection ${response.problemPage ? "connected" : "unsupported"}`;
    connection.querySelector("span").textContent = response.problemPage ? `Connected · ${response.problem}` : "Open a LeetCode problem to activate";
  } catch (_) {
    connection.className = "connection unsupported";
    connection.querySelector("span").textContent = "Open a LeetCode problem to activate";
  }
}

checkConnection();

$("#theme-grid").addEventListener("click", (event) => {
  const card = event.target.closest("[data-theme]");
  if (!card) return;
  const theme = CODE_CARNIVAL_THEMES.find(({ id }) => id === card.dataset.theme);
  save({ theme: theme.id, accent: theme.colors[1], customBackground: "" });
  $("#accent").value = theme.colors[1];
  toggleThemePicker(false);
});

$("#theme-picker-toggle").addEventListener("click", () => toggleThemePicker($("#theme-picker").hidden));
$("#theme-picker-close").addEventListener("click", () => toggleThemePicker(false));
$("#sound-picker-toggle").addEventListener("click", () => toggleSoundPicker($("#sound-picker-panel").hidden));

$("#enabled").addEventListener("change", (event) => save({ enabled: event.target.checked }));
$("#show-dock").addEventListener("change", (event) => save({ showDock: event.target.checked }));
$("#sound").addEventListener("change", (event) => save({ sound: event.target.checked }));
$("#success-sound").addEventListener("change", (event) => save({ successSound: event.target.value }));
$("#wrong-sound").addEventListener("change", (event) => save({ wrongSound: event.target.value }));
$("#success-sound-file").addEventListener("change", (event) => uploadSound(event.target.files[0], "success"));
$("#wrong-sound-file").addEventListener("change", (event) => uploadSound(event.target.files[0], "wrong"));
$("#celebrate-once").addEventListener("change", (event) => save({ celebrateOnce: event.target.checked }));
$("#intensity").addEventListener("change", (event) => save({ intensity: event.target.value }));
$("#accent").addEventListener("change", (event) => save({ accent: event.target.value }));
$("#blur").addEventListener("change", (event) => save({ blur: Number(event.target.value) }));
$("#overlay").addEventListener("change", (event) => save({ overlay: Number(event.target.value) }));

$("#background-file").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 4 * 1024 * 1024) return setStatus("Please choose an image below 4 MB.");
  const reader = new FileReader();
  reader.onload = () => save({ customBackground: reader.result, theme: "custom" });
  reader.readAsDataURL(file);
});

$("#reset").addEventListener("click", async () => {
  await chrome.storage.local.clear();
  settings = { ...CODE_CARNIVAL_DEFAULTS };
  location.reload();
});

$("#preview").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url?.includes("leetcode.com")) return setStatus("Open a LeetCode problem to preview.");
  await chrome.tabs.sendMessage(tab.id, { type: "CODE_CARNIVAL_PREVIEW" });
  window.close();
});

$("#open-studio").addEventListener("click", () => chrome.runtime.openOptionsPage());
