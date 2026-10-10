# OmniPrompt AI

Multi-agent prompt engineering studio, diagnostic lab, and curated templates orchestrator.

## Features

- **Studio** – turn raw ideas (English / Hinglish / Hindi) into multi-version production prompts  
  Supports: web apps, mobile, frontend, backend, image, video, marketing, research, PDF, PPT, text, code
- **Diagnostic Lab** – score weak prompts, list flaws, emit improved system prompts
- **Library** – curated templates
- **History** – private per-user history (not shared across accounts) with clear
- **Auth** – Firebase Auth (email/password); must sign in before using the app
- **Database** – Firestore private per-user history
- **Backend** – Express + Groq (`llama-3.3-70b-versatile`) with automatic local heuristic fallback

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local and set:
# GROQ_API_KEY=gsk_your_key_here
```

Get a free key: https://console.groq.com/keys

## Development

Runs Vite (3000) + Express API (3001):

```bash
npm run dev
```

Open http://localhost:3000

Without a Groq key the app still works using the built-in synthesizer.

## Production

```bash
npm run build
npm start
```

Serves UI + API on `PORT` (default 3001).

### Deploy notes

Set these environment variables on your host (Vercel / Railway / Render / VPS):

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Yes (for AI) | Your Groq API key (`gsk_…`) |
| `GROQ_MODEL` | No | Default `llama-3.3-70b-versatile` |
| `PORT` | No | Default `3001` |

Never commit `.env.local` — it is gitignored.

## API

| Method | Path | Body |
|--------|------|------|
| GET | `/api/health` | – |
| POST | `/api/synthesize` | `{ prompt, platform?, outputType?, depth? }` |
| POST | `/api/diagnose` | `{ prompt, targetPlatform? }` |

## Stack

React 19 · Vite 6 · Tailwind 4 · Express · Groq API · TypeScript


## Auth

On first visit a **Sign in / Create account** modal appears.
History is stored per user (server file + localStorage keyed by user id).
Other users cannot see your history.

Endpoints:
- `POST /api/auth/register` `{ username, password }`
- `POST /api/auth/login` `{ username, password }`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET|POST|DELETE /api/history` (requires Bearer token)


## Firebase setup

1. Firebase Console → **Authentication** → enable **Email/Password**
2. **Firestore Database** → Create database (production mode)
3. **Rules** tab → paste contents of `firestore.rules` → Publish

Config is in `src/lib/firebase.ts` (project: omni-prompt-d1433).
