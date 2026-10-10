const $ = (selector) => document.querySelector(selector);
let settings = { ...CODE_CARNIVAL_DEFAULTS };

function renderThemes() {
  $("#theme-grid").innerHTML = CODE_CARNIVAL_THEMES.map((theme) => `
    <button class="theme-card ${theme.id === settings.theme ? "active" : ""}" data-theme="${theme.id}" style="--c1:${theme.colors[0]};--c2:${theme.colors[1]}55;--c3:${theme.colors[2]}">
      <span class="emoji">${theme.emoji}</span><strong>${theme.name}</strong><small>${theme.tagline}</small>
    </button>`).join("");
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
  settings = stored;
  $("#enabled").checked = settings.enabled;
  $("#accent").value = settings.accent;
  $("#blur").value = settings.blur;
  $("#overlay").value = settings.overlay;
  $("#sound").checked = settings.sound;
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
});

$("#enabled").addEventListener("change", (event) => save({ enabled: event.target.checked }));
$("#sound").addEventListener("change", (event) => save({ sound: event.target.checked }));
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
