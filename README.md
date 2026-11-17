# DevText Studio

A privacy-first collection of 9 developer utilities in one static website. No backend, no database, no build step: upload the folder to any static host and it works.

## Tools
JSON to CSV, JSON Formatter/Minifier, Base64 Encoder/Decoder, URL Slug Generator, Case Converter (camel, snake, kebab, Pascal), JWT Decoder, SHA Hash Generator, Password Generator, UUID v4 Generator.

All processing runs in the visitor's browser with vanilla JavaScript. User input is never sent to a server.

## Tech stack
| Part | Detail |
|---|---|
| Frontend | HTML5 + vanilla JavaScript (`js/app.js`) |
| Styling | Tailwind CSS 3.4.17 (CDN, version pinned) |
| Icons | Font Awesome Free 6.4.0 (CDN) |
| Fonts | Inter and Fira Code (Google Fonts) |
| Backend / DB / Auth | None |
| Hosting needs | Any static host or web server, HTTPS recommended |

## Project structure
```
index.html          main page with all tool UIs
js/app.js           all tool logic
about.html privacy.html terms.html contact.html 404.html
favicon*.png apple-touch-icon.png
robots.txt sitemap.xml
Dockerfile          optional nginx container
```

## Quick start
See `HowToSetup.md`. In short: `python3 -m http.server 8080` inside this folder, then open http://localhost:8080.

## Before you publish (required)
1. Replace `https://devflux-portal.vercel.app` with your real domain in all HTML files, `sitemap.xml` and `robots.txt`.
2. Replace `talharahman337@gmail.com` with your real email in `contact.html`, `privacy.html`, `terms.html`.
3. Review `privacy.html` and `terms.html` for your country and add your business name. They are general templates, not legal advice.
4. Replace the favicon files and the "DevText Studio" brand text if you rebrand.

## Third-party requests
The page loads Tailwind CSS, Font Awesome and Google Fonts from CDNs, so the visitor's IP address reaches those providers. To go fully self-hosted, download these assets and change the `<link>`/`<script>` tags in `index.html`. See `DEPLOYMENT.md`.

## Browser support
Current Chrome, Edge, Firefox and Safari. The hash generator needs HTTPS or localhost.

## License
See `LICENSE.txt` and `THIRD_PARTY_LICENSES.md`.
