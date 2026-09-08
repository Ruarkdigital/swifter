---
name: project_api_doc_sync_260908
description: API docs sync 2026-09-08 — swagger.json + docs/swagger-phase-2.json replaced with upstream docs.json (v2.3.0, 696 paths); adds the full AI-redline suggestion/turn/resolution contract
metadata:
  type: project
---

On 2026-09-08 the upstream `docs.json` replaced the tracked specs. Both committed
copies were synced to the same content:

- `swagger.json` (root, minified — the documented source of truth) — replaced verbatim.
- `docs/swagger-phase-2.json` (pretty-printed 2-space) — reformatted from the same doc.

Still `openapi 3.0.0`, `info.version 2.3.0`, but the content grew substantially.

**Diff vs the previous `swagger.json`:** paths 484 → 696 (+227 new, −15), schemas
113 → 155 (+42, 0 removed).

### AI redline contract now fully in the spec (was partial)
Redline paths 8 → 28. The `manager` and `vendor` role prefixes carry, per
`{contracts|msa-contracts}`:
- `GET|POST .../ai/redline-suggestions`
- `POST .../ai/redline-suggestions/batch-resolve`
- `POST .../ai/redline-suggestions/{redlineId}/resolve`
- `POST .../ai/redline-suggestions/{redlineId}/undo`
- `GET .../redline-turn`, `POST .../redline-turn/send`, `POST .../redline-turn/finalize`

**There is no `redline-accept` endpoint.** Accepting a redline = `POST
.../ai/redline-suggestions/{redlineId}/resolve` with `action: "accepted"` (or the
`batch-resolve` variant). `resolve`/`batch-resolve` accept an optional
`documentState` (Base64 Yjs state) so the BE can persist a document snapshot;
the shipped SuperDoc-iframe editor does not currently send it (no host-side Y.Doc).

**redline-suggestions GET removed from `approver` and `user` roles** — only
`manager`/`vendor` have it now. The frontend `buildEndpoint`
(`useAiRedlineSuggestions.ts`) already resolves `url=null` for those roles, so no
change needed.

+20 new redline schemas incl. `RedlineAcceptanceStatus` (bilateral
`cmAccepted`/`vendorAccepted`/`status`/`shouldRemove`) and `RedlineAcceptedBy` —
these match the frontend's existing `RedlineAcceptance` / `RedlineAcceptedByUser`
types. `RedlineProgress` requires `cm_accept`/`pm_accept` (the FE's
`RedlineProgress` type omits them but reads them via `SuggestionProgress`).

### Other renames (the 15 "removed" paths are mostly relocations)
- `payment-holdbacks/{holdBackId}` and `payment-savings/{savingId}` moved under
  `.../{contractId}/...` for manager/vendor/approver × contracts/msa-contracts.

**Note:** `docs/API_DOCUMENTATION_PHASE_2.md` (handwritten summary) was NOT
rewritten for the 227 new paths — the spec JSON is authoritative
(`project_be_spec_doc_precedence`). Treat the MD as a stale partial summary.
