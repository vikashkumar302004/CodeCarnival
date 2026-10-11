import { readFile, stat } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const failures = [];
const passes = [];
const check = (condition, message) => (condition ? passes : failures).push(message);

const manifest = JSON.parse(await read("extension/manifest.json"));
const contentJs = await read("extension/content.js");
const extensionSources = await Promise.all([
  "extension/sounds.js", "extension/content.js", "extension/popup.js", "extension/studio.js",
  "extension/content.css", "extension/popup.css", "extension/studio.css"
].map(read));
const websiteHtml = await read("website/index.html");
const websiteCss = await read("website/styles.css");
const websiteApp = await read("website/src/App.tsx");
const studioHtml = await read("extension/studio.html");
const popupHtml = await read("extension/popup.html");

check(JSON.stringify(manifest.permissions.sort()) === JSON.stringify(["activeTab", "storage"]), "permissions use the expected minimal set");
check(!extensionSources.some((source) => /\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon/.test(source)), "extension makes no network requests");
check(!extensionSources.some((source) => /\beval\s*\(|new Function/.test(source)), "extension contains no dynamic code execution");
check(!contentJs.includes("document.cookie"), "content script does not access cookies");
check(websiteHtml.includes('lang="en"') && studioHtml.includes('lang="en"') && popupHtml.includes('lang="en"'), "all interfaces declare a document language");
check(websiteApp.includes('aria-modal="true"') && contentJs.includes('role", "status"') && contentJs.includes('aria-live", "polite"'), "celebrations expose appropriate accessible semantics");
check(websiteCss.includes("prefers-reduced-motion") && extensionSources.filter((source) => source.includes("prefers-reduced-motion")).length >= 2, "interfaces respect reduced-motion preferences");
check(websiteApp.includes("<main") && studioHtml.includes("<main") && popupHtml.includes("<main"), "all interfaces include a main landmark");
check((await stat(new URL("extension/content.js", root))).size < 30_000, "content script stays below the 30 KB budget");
check(extensionSources.join("").length < 150_000, "extension source stays below the 150 KB budget");

for (const message of passes) console.log(`✓ ${message}`);
for (const message of failures) console.error(`✗ ${message}`);
if (failures.length) process.exit(1);
