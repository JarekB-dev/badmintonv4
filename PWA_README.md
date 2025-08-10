# PWA enablement

What was added
- `public/manifest.webmanifest`
- `public/sw.js` with offline caching
- `public/offline.html`
- Icons in `public/icons/`
- `index.html` updated to link manifest and register the service worker
- Vite `base: './'` for portable builds

Local run
```
npm install
npm run dev
```

Production build
```
npm run build
```
Upload the `dist/` folder to any HTTPS host. For GitHub Pages manual upload, rename `dist` to `docs` and enable Pages from the `/docs` folder.
