# CodeCarnival

**Every Accepted deserves a celebration.**

<img src="store-assets/codecarnival-master-icon.png" alt="CodeCarnival icon" width="128" />

CodeCarnival is a Chrome extension that turns LeetCode into a themed coding space and plays a playful, theme-specific celebration when a submission is accepted.

## What is included

- A Manifest V3 Chrome extension in `extension/`
- One obsessively crafted Neon Web theme with a matching celebration
- A custom theme creator (background image, accent, blur, and overlay)
- A full-page Theme Studio with a live LeetCode preview
- A responsive showcase/download dashboard in `website/`
- Preferences stored locally in Chrome; no account or server required

## Try the extension locally

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select the `extension` folder.
4. Open any problem on `leetcode.com` and pick a theme from the extension popup.

For testing, the popup includes a **Preview celebration** button.

For the packaged beta workflow, see [docs/INSTALL.md](docs/INSTALL.md).

### Build an installable ZIP

```powershell
./tools/package-extension.ps1
```

The archive is written to `dist/codecarnival-extension.zip`. For local development, loading the unpacked `extension/` directory is faster.

### Validate the project

```powershell
node tools/validate.mjs
node tools/compatibility-check.mjs
node tools/quality-check.mjs
node --check extension/content.js
node --check extension/popup.js
node --check website/app.js
```

## Preview the dashboard

Open `website/index.html` directly, or serve the repository with any static server.

## Structure

```text
extension/  Chrome extension source
website/    Product dashboard and interactive theme previews
```

## Privacy

CodeCarnival only reads LeetCode pages so it can apply visual themes and detect the visible Accepted result. Custom settings stay in `chrome.storage.local`.

The complete data-handling policy is available in [PRIVACY.md](PRIVACY.md).

Chrome Web Store metadata and the final submission checklist are in [STORE_LISTING.md](STORE_LISTING.md).

See [ROADMAP.md](ROADMAP.md) for the production plan and current phase.
