# CodeCarnival

**Every Accepted deserves a celebration.**

CodeCarnival is a Chrome extension that turns LeetCode into a themed coding space and plays a playful, theme-specific celebration when a submission is accepted.

## What is included

- A Manifest V3 Chrome extension in `extension/`
- Six built-in themes with matching celebrations
- A custom theme creator (background image, accent, blur, and overlay)
- A responsive showcase/download dashboard in `website/`
- Preferences stored locally in Chrome; no account or server required

## Try the extension locally

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Choose **Load unpacked** and select the `extension` folder.
4. Open any problem on `leetcode.com` and pick a theme from the extension popup.

For testing, the popup includes a **Preview celebration** button.

## Preview the dashboard

Open `website/index.html` directly, or serve the repository with any static server.

## Structure

```text
extension/  Chrome extension source
website/    Product dashboard and interactive theme previews
```

## Privacy

CodeCarnival only reads LeetCode pages so it can apply visual themes and detect the visible Accepted result. Custom settings stay in `chrome.storage.local`.

