# Chrome Web Store listing

## Product details

**Name:** CodeCarnival

**Summary:** Transform LeetCode with beautiful coding themes and a joyful animation whenever your solution is Accepted.

**Category:** Developer Tools

**Language:** English

**Version:** 1.0.0

## Detailed description

Every Accepted deserves a celebration.

CodeCarnival transforms LeetCode into a personal coding world. Choose a polished theme, tune the atmosphere, or upload your own image or GIF. When your solution is Accepted, CodeCarnival plays a short celebration designed for the selected world.

Features:

- Six built-in coding worlds
- A unique Accepted celebration for every theme
- Custom image and GIF backgrounds
- Accent, blur, and dark-overlay controls
- Full Theme Studio with a live preview
- Optional victory sound
- Full Carnival and Calm animation modes
- Once-per-problem celebration control
- Local settings with no account required

CodeCarnival does not modify solutions, reveal test cases, automate submissions, or communicate with a server. It only changes the visual presentation of LeetCode and watches the visible submission result so it knows when to celebrate.

## Single purpose

CodeCarnival personalizes the visual LeetCode problem-solving experience and celebrates successful submissions.

## Permission justifications

### `storage`

Stores the selected theme, custom background, visual controls, and celebration preferences locally in Chrome.

### `activeTab`

Lets the popup preview a celebration and show connection status for the currently open LeetCode problem after the user opens the extension.

### Host access: `https://leetcode.com/*` and `https://*.leetcode.com/*`

Required to apply themes to LeetCode problem pages and detect the visible Accepted submission status. CodeCarnival does not read or store solution source code, cookies, passwords, hidden test cases, or account information.

## Privacy declarations

- Personally identifiable information: **Not collected**
- Health information: **Not collected**
- Financial and payment information: **Not collected**
- Authentication information: **Not collected**
- Personal communications: **Not collected**
- Location: **Not collected**
- Web history: **Not collected**
- User activity: **Not collected or transmitted**
- Website content: Only the visible LeetCode submission status is processed in memory; it is not retained or transmitted.
- Remote code: **Not used**
- Analytics or advertising: **Not used**

**Privacy policy URL:** `https://github.com/vikashkumar302004/CodeCarnival/blob/main/PRIVACY.md`

## Store assets

- Extension icon: `extension/icons/icon-128.png`
- Screenshot: `store-assets/screenshot-theme-studio-1280x800.png`
- Small promotional tile: `store-assets/promo-small-440x280.png`
- Master brand image: `store-assets/codecarnival-master-icon.png`

## Submission checklist

- [x] Manifest V3 production ZIP
- [x] 128px padded extension icon
- [x] 1280×800 current-feature screenshot
- [x] 440×280 small promo tile
- [x] Single-purpose statement
- [x] Permission justifications
- [x] Privacy declarations and public policy URL
- [x] Automated syntax, compatibility, privacy, and performance checks
- [ ] Developer account registration and fee — account owner action
- [ ] Account 2-Step Verification — account owner action
- [ ] Upload ZIP and submit for review — account owner action

