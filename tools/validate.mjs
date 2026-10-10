import { readFile, access } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("../", import.meta.url).pathname.replace(/^\/(?:[A-Za-z]:)/, (value) => value.slice(1));
const manifestPath = join(root, "extension", "manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));

const failures = [];
if (manifest.manifest_version !== 3) failures.push("manifest_version must be 3");
if (!manifest.content_scripts?.length) failures.push("a content script is required");
if (!manifest.host_permissions?.includes("https://leetcode.com/*")) failures.push("LeetCode host permission is missing");
if (!manifest.host_permissions?.includes("https://*.leetcode.com/*")) failures.push("LeetCode subdomain permission is missing");

const referencedFiles = [
  manifest.action?.default_popup,
  manifest.options_page,
  ...manifest.content_scripts.flatMap((entry) => [...(entry.js || []), ...(entry.css || [])])
].filter(Boolean);

const iconFiles = Object.values(manifest.icons || {});
referencedFiles.push(...iconFiles);

for (const file of referencedFiles) {
  try { await access(join(root, "extension", file)); }
  catch { failures.push(`manifest references missing file: ${file}`); }
}

const extensionFiles = ["popup.html", "popup.css", "popup.js", "themes.js", "content.css", "content.js"];
for (const file of extensionFiles) {
  const source = await readFile(join(root, "extension", file), "utf8");
  if (/https?:\/\//.test(source)) failures.push(`${file} contains a remote dependency`);
}

if (failures.length) {
  console.error(failures.map((item) => `✗ ${item}`).join("\n"));
  process.exit(1);
}

console.log(`✓ Manifest V${manifest.manifest_version} is valid`);
console.log(`✓ ${referencedFiles.length} referenced extension files exist`);
console.log("✓ Extension has no remote runtime dependencies");
