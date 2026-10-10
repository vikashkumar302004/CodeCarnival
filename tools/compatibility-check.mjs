import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const manifest = JSON.parse(await readFile(new URL("extension/manifest.json", root), "utf8"));
const content = await readFile(new URL("extension/content.js", root), "utf8");

const checks = [
  [manifest.content_scripts[0].matches.includes("https://*.leetcode.com/*"), "LeetCode subdomains are supported"],
  [content.includes("isProblemPage()"), "problem-route guard is present"],
  [content.includes("handleLocationChange"), "SPA navigation handler is present"],
  [content.includes("data-e2e-locator"), "stable result locator is present"],
  [content.includes("isVisible(node)"), "hidden-result guard is present"],
  [content.includes("acceptedVisible"), "submission-state latch is present"]
];

const failures = checks.filter(([passed]) => !passed);
if (failures.length) {
  for (const [, message] of failures) console.error(`✗ ${message}`);
  process.exit(1);
}

for (const [, message] of checks) console.log(`✓ ${message}`);

