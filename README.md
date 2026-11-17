# NVIC Command Center

The organizing platform for the **New Vision Innovation Challenge** — New Vision University's national student innovation & research competition. Launch target: **November 30, 2026** · National Final: **March 20, 2027**.

## Start it

```bash
cd "NVIC Organizational Platform"
pnpm install        # first time only (approve better-sqlite3 build if asked)
pnpm build          # build the UI (only needed after code changes)
node server/index.mjs
```

Open **http://localhost:5181** — that's the whole app.

To let the committee use it from their own computers, open the same URL on your machine's LAN address (e.g. `http://192.168.x.x:5181`) — check System Settings → Sharing for the local IP. For a public deployment, put it on any Node host (VPS, NVU server) behind nginx/caddy.

## What's inside

| Page | Purpose |
|---|---|
| **Dashboard** | Live countdown to launch, readiness %, workstream progress, key dates, open questions, activity feed |
| **Launch Checklist** | All 8 workstreams / 89 tasks from the pre-launch plan. Click a circle to advance a task (to-do → in progress → done). Filters: essential / can-follow / status / owner. Add, edit, block, delete tasks; assign owners and notes |
| **Documents** | The 12 launch deliverables (Concept, დებულება, Application Form, Rubric, Consent Pack, Awards Policy, Budget Matrix, School Pack, Jury Pack, Event Plan, Comms Plan, Runbook). Upload files, keep version history, cycle Draft → In review → Approved |
| **Sponsors & Partners** | Pipeline board: Ideas → Contacted → Replied → In talks → Verified → Committed (→ Declined). Contact details, value/offer, owner, notes, verified shield |
| **Open Questions** | Committee decisions: ask, answer, mark Decided. Seeded with the 6 launch-blocking questions |
| **Links & Resources** | Every tool, account, reference and research link in one place |
| **People & Roles** | Team directory + the NVU ↔ founding-team responsibility matrix (Part IV) |
| **Calendar** | The season timeline — launch, deadline, semifinals, mentorship, final |
| **Notes** | Team principles and reminders |
| **Activity** | Full audit log — who changed what, when |

**Identity:** each person types their name once (top right). Every change is logged under that name. No passwords — internal team tool.

## Data & files

- Database: `data/nvic.db` (SQLite) — back it up by copying this file.
- Uploaded documents: `data/uploads/`.
- Reset to the seeded state: delete `data/nvic.db` and restart.

## Tech

React 18 + Vite + Tailwind 4 (dark blueprint theme, KA/EN labels) · Express + better-sqlite3 + Multer · single process, port 5181.

## Suggested next steps

1. Committee signs in, claims task owners, starts checking off WS1–WS2.
2. Upload the draft regulations (დებულება) the moment it exists — it gates the website text, school letters and the application form.
3. Log every sponsor conversation in the pipeline as it happens; "Verified" = confirmed by a real conversation.
