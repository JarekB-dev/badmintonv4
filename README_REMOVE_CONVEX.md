
# Removed Convex - GitHub Pages ready

- Convex code and dependencies removed.
- `src/main.tsx` no longer wraps with ConvexProvider.
- `vite.config.ts` uses relative `base: './'` for GitHub Pages.
- `package.json` scripts updated with `postbuild` to create `dist/404.html`.
- GitHub Actions workflow added at `.github/workflows/deploy.yml`.

## Deploy
1. Push to `main`.
2. In Settings - Pages, select Source: GitHub Actions.
3. On each push to `main`, the site is built and deployed.

