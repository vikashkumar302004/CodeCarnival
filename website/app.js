const themes = [
  { id: "neon-web", name: "Neon Web", icon: "🕸️", title: "CITY SAVED!", note: "Another bug caught · Mission complete", image: "../extension/assets/neon-web-city.png", colors: ["#ff304f", "#29b6ff", "#050b18"] },
  { id: "sakura-ronin", name: "Sakura Ronin", icon: "🌸", title: "VICTORY BLOOMS", note: "The challenge falls · Your focus remains", image: "../extension/assets/sakura-ronin.png", colors: ["#f34fbf", "#b9a1ff", "#11091f"] },
  { id: "pixel-dungeon", name: "Pixel Dungeon", icon: "⚔️", title: "STAGE CLEAR!", note: "+100 XP · A new quest awaits", image: "../extension/assets/pixel-dungeon.png", colors: ["#ffc542", "#35e6a2", "#090b20"] }
];

const tabs = document.querySelector(".theme-tabs");
const stage = document.querySelector(".theme-preview");
let activeTheme = themes[0];
let celebrationTrigger = null;

tabs.innerHTML = themes.map((theme, index) => `<button role="tab" aria-selected="${index === 0}" data-id="${theme.id}"><i>${theme.icon}</i><span>${theme.name}</span></button>`).join("");

function selectTheme(theme) {
  activeTheme = theme;
  tabs.querySelectorAll("button").forEach((button) => button.setAttribute("aria-selected", String(button.dataset.id === theme.id)));
  stage.style.setProperty("--primary", theme.colors[0]);
  stage.style.setProperty("--secondary", theme.colors[1]);
  stage.style.setProperty("--deep", theme.colors[2]);
  stage.style.setProperty("--art", `url("${theme.image}")`);
  stage.querySelector(".preview-icon").textContent = theme.icon;
  stage.querySelector(".preview-copy span").textContent = theme.name.toUpperCase();
  stage.querySelector("h3").textContent = theme.title;
  stage.querySelector("p").textContent = theme.note;
}

tabs.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (button) selectTheme(themes.find(({ id }) => id === button.dataset.id));
});

function runCelebration() {
  const layer = document.querySelector("#celebration");
  celebrationTrigger = document.activeElement;
  layer.style.setProperty("--primary", activeTheme.colors[0]);
  layer.style.setProperty("--secondary", activeTheme.colors[1]);
  layer.querySelector(".celebration-icon").textContent = activeTheme.icon;
  layer.querySelector("span").textContent = activeTheme.name.toUpperCase();
  layer.querySelector("h2").textContent = activeTheme.title;
  layer.querySelector("p").textContent = activeTheme.note;
  layer.querySelectorAll("i.confetti").forEach((item) => item.remove());
  for (let index = 0; index < 55; index++) {
    const item = document.createElement("i");
    item.className = "confetti";
    item.style.cssText = `left:${Math.random() * 100}%;--delay:${Math.random()}s;--speed:${1.8 + Math.random() * 2}s;--drift:${-120 + Math.random() * 240}px;--color:${index % 2 ? activeTheme.colors[0] : activeTheme.colors[1]}`;
    layer.appendChild(item);
  }
  layer.classList.add("show");
  layer.setAttribute("aria-hidden", "false");
  layer.querySelector("button").focus();
}

function closeCelebration() {
  const layer = document.querySelector("#celebration");
  layer.classList.remove("show");
  layer.setAttribute("aria-hidden", "true");
  celebrationTrigger?.focus();
}

document.querySelector("#hero-demo").addEventListener("click", runCelebration);
document.querySelector("#theme-demo").addEventListener("click", runCelebration);
document.querySelector("#celebration button").addEventListener("click", closeCelebration);
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeCelebration(); });

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    await navigator.clipboard.writeText(button.dataset.copy);
    const original = button.textContent;
    button.textContent = "Copied!";
    setTimeout(() => button.textContent = original, 1400);
  });
});

selectTheme(themes[0]);
