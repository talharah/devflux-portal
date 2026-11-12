# Deployment routes

The site is static, so there is nothing to compile.

## Route 1: Netlify (easiest)
1. Log in to Netlify, open Add new site > Deploy manually.
2. Drag the project folder in. You get an HTTPS URL immediately.
3. Add your custom domain under Domain settings.

## Route 2: Cloudflare Pages
1. Pages > Create project > Upload assets (or connect a Git repo).
2. Upload the folder. Build command: none. Output directory: `/`.

## Route 3: GitHub Pages
1. Push the folder contents to a repository.
2. Settings > Pages > Deploy from branch > `main` / root.

## Route 4: VPS with Nginx
```
sudo apt install nginx
sudo mkdir -p /var/www/devtext && sudo cp -r . /var/www/devtext
```
`/etc/nginx/sites-available/devtext`:
```
server {
    listen 80;
    server_name YOURDOMAIN.com;
    root /var/www/devtext;
    index index.html;
    error_page 404 /404.html;
    location / { try_files $uri $uri/ =404; }
}
```
Enable it, then run `sudo certbot --nginx` for free HTTPS.

## Route 5: Docker
```
docker build -t devtext-studio .
docker run -d -p 8080:80 devtext-studio
```

## Optional: remove CDN dependencies
Download Tailwind (build with the Tailwind CLI), Font Awesome Free and the Inter/Fira Code fonts, put them in an `assets/` folder and update the tags in `index.html`.
