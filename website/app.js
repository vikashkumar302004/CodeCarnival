const themes = [
  { id: "pixel", name: "Pixel Quest", icon: "⚔️", title: "STAGE CLEAR!", note: "+100 XP · The next level awaits", colors: ["#ffcf4a", "#7cf7c5", "#15102b"] },
  { id: "web", name: "Web Hero", icon: "🕸️", title: "MISSION COMPLETE", note: "Another challenge caught in your web", colors: ["#ef5360", "#55b5ff", "#07142d"] },
  { id: "neon", name: "Neon Tokyo", icon: "🌃", title: "SYSTEM CLEARED", note: "Run complete · Skill level rising", colors: ["#ff4fd8", "#62f4ff", "#110720"] },
  { id: "space", name: "Cosmic Run", icon: "🚀", title: "LIFTOFF!", note: "Solution accepted · New orbit unlocked", colors: ["#b38aff", "#48e5ff", "#071426"] },
  { id: "forest", name: "Forest Spirit", icon: "🍃", title: "QUEST COMPLETE", note: "A calm mind finds the path", colors: ["#80ed99", "#d8f3dc", "#081c15"] },
  { id: "sunset", name: "Sunset Drive", icon: "🌅", title: "SMOOTH SOLVE", note: "Cruising into the next challenge", colors: ["#ff7b54", "#ffd56b", "#28143d"] }
];

const tabs = document.querySelector(".theme-tabs");
const stage = document.querySelector(".theme-preview");
let activeTheme = themes[0];

tabs.innerHTML = themes.map((theme, index) => `<button role="tab" aria-selected="${index === 0}" data-id="${theme.id}"><i>${theme.icon}</i><span>${theme.name}</span></button>`).join("");

function selectTheme(theme) {
  activeTheme = theme;
  tabs.querySelectorAll("button").forEach((button) => button.setAttribute("aria-selected", String(button.dataset.id === theme.id)));
  stage.style.setProperty("--primary", theme.colors[0]);
  stage.style.setProperty("--secondary", theme.colors[1]);
  stage.style.setProperty("--deep", theme.colors[2]);
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
}

function closeCelebration() {
  const layer = document.querySelector("#celebration");
  layer.classList.remove("show");
  layer.setAttribute("aria-hidden", "true");
}

document.querySelector("#hero-demo").addEventListener("click", runCelebration);
document.querySelector("#theme-demo").addEventListener("click", runCelebration);
document.querySelector("#celebration button").addEventListener("click", closeCelebration);
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeCelebration(); });

selectTheme(themes[0]);

