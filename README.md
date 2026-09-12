# Gurjot OS — Command Centre

Free, static V1 of Gurjot's AI Command Centre.

## Architecture
- Frontend: single-file HTML/CSS/JS
- Source control: GitHub
- Orchestration bridge: Make webhook
- AI layer: Make Chief of Staff + specialist agents
- Hosting target: Freebuff Cloud/Web (or GitHub Pages/Cloudflare Pages)

## Deploy with Freebuff
1. Open Freebuff Cloud/Web.
2. Connect GitHub.
3. Select `gurjotsingh2028-ui/signalforge-ai`.
4. Deploy the repo as a static web app.

No Lovable subscription is required.

## Important security note
The current browser command bridge is a V1 scaffold. Do not put private API keys in `index.html`. Production Make/API credentials should sit behind a server-side endpoint or Freebuff server function.

## Current Make bridge
The UI is pre-wired to the existing Gurjot Command Centre Make webhook. The Make scenario still needs its backend execution path connected to the Chief of Staff because the native AI Agent scenario-run API currently returns BundleValidationError in the connected Make environment.
