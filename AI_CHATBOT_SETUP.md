# AI Anatomy Chatbot — Setup Guide

A free Google Gemini (Google AI Studio) chatbot has been added to the app. It answers
**only** about the anatomy of the **currently open 3D model** and refuses everything else
(other organs, general human anatomy, and non-anatomy topics).

## Where it appears
- A **🤖 AI Tutor** button in the Navbar (top-right) on every page.
- A **floating 🤖 "AI Tutor" button** at the bottom-right of the screen.

## How the scoping works
The chatbot detects the open model from the URL route `/anatomy/:id` and injects that
model's full structured study guide into the Gemini system instruction:

- **Model open** (e.g. `/anatomy/heart`): answers only about the Heart (chambers, valves,
  coronary vessels, cardiac cycle, etc.). Asks about the Brain, Liver, or coding → a
  polite refusal naming the open model.
- **No model open** (Home, Catalogue, About): refuses all anatomy questions and only helps
  you pick a model to open.

## Get a free API key
1. Open <https://aistudio.google.com/apikey> (Google account required).
2. Click **Create API Key**.
3. Copy the key (starts with `AIza...`).

## Configure the key
1. Copy `.env.example` → `.env` and paste your key:

   ```env
   VITE_GEMINI_API_KEY=your_key_here
   ```

4. Restart the dev server and rebuild:

   ```bash
   npm run dev
   ```

   Vite only exposes `VITE_*` env vars to the client at build time, so the key is read
   automatically on the next run.

## Optional model pin
```env
VITE_GEMINI_MODEL=gemini-2.5-flash
```
Defaults to `gemini-2.5-flash`. The client falls back to `gemini-2.0-flash` /
`gemini-1.5-flash` / `gemini-2.5-pro` if the preferred model is unavailable for your key.

## Security note (demo-grade)
The key is shipped to the browser and sent to the Google REST endpoint. This is fine for a
demo, but for production:
- **Restrict the key** in the Google Cloud console (Application restrictions → HTTP
  referrers; API restrictions → `Generative Language API` only).
- Prefer routing requests through a small server-side proxy that keeps the key secret.

## Troubleshooting
| Symptom | Likely cause |
| --- | --- |
| "API key missing" warning | `VITE_GEMINI_API_KEY` not set, or server not restarted after editing `.env`. |
| 403 auth failed | Key rejected — re-check the value or regenerate it in AI Studio. |
| 404 model unavailable | The pinned model isn't enabled; the client auto-falls back. |
| Empty / weird replies | Gemini safety filters or an empty prompt — try rephrasing. |