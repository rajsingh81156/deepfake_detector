# Deploying this project via GitHub

This repository contains a monorepo with `frontend/` and `backend/`.

Two deployment options are prepared:

1) GitHub Pages (static frontend only) — automatic via GitHub Actions

- A workflow is added at `.github/workflows/deploy-frontend.yml` that builds the `frontend` directory and deploys `frontend/dist` to the `gh-pages` branch on every push to `main`.
- After pushing to GitHub, the action will run automatically and publish to the `gh-pages` branch.

To push this repo to GitHub and trigger the workflow:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-user-or-org>/<repo>.git
git push -u origin main
```

Then enable GitHub Pages (if needed):
- Go to the repository Settings → Pages → Source → choose `gh-pages` branch (if required). The peaceiris action already pushes to `gh-pages`.

2) Vercel (recommended for full monorepo + backend)

- If you want Vercel to host both frontend and backend, import this GitHub repo into Vercel and set the **Project Root** to `frontend` for the frontend project (or create separate Vercel projects for frontend and backend). The `frontend/vercel.json` already configures a static build and SPA rewrite.
- In Vercel, set any required environment variables (for example `VITE_API_URL`) to point to your deployed backend.

If you want, I can also:
- Create a top-level `vercel.json` to route both `frontend` and `backend` from the repository root (for a monorepo Vercel setup).
- Prepare a small script or CI job to deploy the backend to a separate service.
