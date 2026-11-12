# How to set up (clean machine)

No Node.js, database or package install is needed.

## 1. Get the files
Unzip the project and open a terminal in the `devtext-studio` folder.

## 2. Run locally
Any one of these:
- Python 3: `python3 -m http.server 8080` (Windows: `py -m http.server 8080`)
- Node.js: `npx serve .`
- PHP: `php -S localhost:8080`

Open http://localhost:8080. An internet connection is needed on first load for the CDN styles, icons and fonts.

## 3. Replace placeholders
Linux/macOS:
```
grep -rl "example.com" . | xargs sed -i 's#https://example.com#https://YOURDOMAIN.com#g; s#contact@example.com#you@YOURDOMAIN.com#g'
```
Windows: use your editor's "Find in Files" to replace `https://example.com` and `contact@example.com`.

## 4. Test checklist
- Each of the 9 tabs opens.
- JSON to CSV: click "Load Sample" then "Convert to CSV".
- Password and UUID generate a value; Copy shows a green toast.
- JWT: paste any JWT; header and payload appear.
- Hash: needs localhost or HTTPS.

## 5. Deploy
See `DEPLOYMENT.md`.
