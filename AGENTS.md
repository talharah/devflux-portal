# Notes for AI coding agents

DevText Studio is a static site. Keep it dependency-free unless asked otherwise.

- `index.html`: one `<section id="tool-NAME">` per tool plus a tab button `id="tab-NAME"`. `switchTool('NAME')` shows a section by id.
- `js/app.js`: plain functions called from inline `onclick` attributes. Shared helpers: `showToast`, `showError`, `copyValue`, `copyToClipboard`, `downloadFile`.
- To add a tool: add a tab button, a section (copy an existing one), add logic to `js/app.js`. If it needs setup on open, add it to `switchTool`.
- Styling is Tailwind via CDN (pinned 3.4.17). Custom colors are in the inline `tailwind.config`.
- Randomness uses `crypto.getRandomValues`, never `Math.random`.
- Do not add trackers or network calls that send user input anywhere. The privacy claim is the product's selling point.
- `example.com` and `contact@example.com` are intentional placeholders.
