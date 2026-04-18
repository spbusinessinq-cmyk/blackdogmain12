# Workspace

## Overview

pnpm workspace monorepo using TypeScript. BLACK DOG SECURITY — premium presentation + intake system for the RSR Intelligence Network's protective security division.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite, Framer Motion, Tailwind CSS, shadcn/ui, Wouter routing

## Artifacts

- `artifacts/black-dog-security` — main site (one-page + Commander Center). Routes: `/`, `/commander/login`, `/commander`, `/commander/dashboard`, `/commander/requests/:id`
- `artifacts/api-server` — Express API. Routes mounted under `/api/`. PORT 8080.

## Auth

Commander Center uses Bearer token auth. Token stored in `sessionStorage` as `bds_commander_token`. Set via `setAuthTokenGetter` in App.tsx. Credentials validated against `ADMIN_USERNAME`/`ADMIN_PASSWORD` env vars (dev defaults: `rsr-admin` / `4451`). In-memory token store (resets on server restart).

## DB Tables

- `bds_requests` — public intake submissions. Includes `seq_num` (serial) and `display_id` (BDS-REQ-XXXX) columns.
- `bds_action_history` — commander actions per request
- `bds_system_logs` — system event log (logs login success, failure, and new requests)

## Request ID Generation

New requests are inserted first to get the auto-generated `seq_num`, then immediately back-filled with `display_id = BDS-REQ-{seqNum padded to 4 digits}`. Both the list and detail endpoints return `displayId`.

## Features

### Public Site
- One-page presentation: hero, capabilities, posture, network, access/request form
- After form submission: shows confirmation state with the BDS-REQ-XXXX reference ID and a "Submit Another Request" button

### Commander Center
- Login at `/commander/login` with failure logging to `bds_system_logs`
- Dashboard at `/commander` (also `/commander/dashboard`) — real-time queue with status filters and search (searches by displayId, name, org, email, subject)
- Each row shows BDS-REQ-XXXX, subject, status badge, name, org, date
- Request detail page with:
  - Full submission info (8 fields)
  - Internal notes editor (save/cancel)
  - Audit trail / action history
  - Status actions: pending / approved / more_info / denied / dispatched
  - Response template picker (Approval, More Info, Denial, Dispatched) that pre-fills the note textarea
  - Packet preview modal (full 5-section controlled-distribution info packet)
  - Send Packet button (marks packetSent + packetSentAt in DB)

## Design

- Background: `hsl(220,16%,4%)` obsidian
- Primary: `hsl(350,46%,46%)` muted crimson
- Fonts: Inter (body), Space Grotesk (headings), IBM Plex Mono (labels)
- No emojis in UI

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only, prompts for confirmation if data-loss)
- `pnpm --filter @workspace/db run push-force` — force push schema (use when adding serial/not-null columns to existing tables)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Codegen Notes

The `codegen` script runs orval then a fix-zod-barrel.js script that rewrites `lib/api-zod/src/index.ts` to only export from `./generated/api` (avoids naming conflicts with the now-removed types subfolder).

Orval mutations use `{ data: body }` variable shape (not the body directly). For mutations with path params: `{ id: string; data: body }`.

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
