# FOREIGN AFFAIRS — Creative Collective

A production-ready React + Vite platform for screening, onboarding, and booking photographers and videographers for event, corporate, and commercial work under **Ease Healthcare Inc.**

## Stack

- React 19 + Vite 8
- Tailwind CSS v4
- React Router 7
- Lucide icons

## Deploy

Deployed on Vercel. Setup mirrors the `dist/` output via `vercel.json` with SPA rewrites.

## Env Variables

Required Vite env vars (set in Vercel dashboard or `.env` locally):

- `VITE_GOOGLE_SCRIPT_URL`
- `VITE_DISCORD_WEBHOOK_URL`
- `VITE_CENTRAL_ENGINE_URL`

See `.env.example` for shape.

## Dev

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Lint

```bash
npm run lint
```
