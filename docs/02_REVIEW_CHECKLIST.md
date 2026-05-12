# 02_REVIEW_CHECKLIST.md

Use this checklist after every Claude + Ruflo output.

## Product Logic

- Does this preserve the inventory-first chain?
- Is the screen connected to a real entity?
- Is the workflow realistic for a Greek yard?
- Is the marketplace listing connected to inventory?
- Does QR have an operational role, not just decoration?

## Scope

- Did the agent add features we did not ask for?
- Did it overbuild backend logic?
- Did it invent RFQ, subscriptions, AI or analytics without being asked?
- Did it keep the phase limited?

## UI

- Is mobile actually good?
- Are tap targets large enough?
- Is the primary action obvious?
- Is spacing consistent?
- Are cards, buttons and badges reused?
- Does it feel practical, not decorative?

## Greek Copy

- Is user-facing copy mostly Greek?
- Is the Greek simple and professional?
- Are labels consistent with the product files?
- Did it avoid English where Greek is needed?

## Code

- Are components reusable?
- Are files too large?
- Are types clear?
- Is fake data centralized?
- Are constants centralized?
- Is there duplication?
- Does it compile?

## Decision

Choose one:

```text
APPROVE. Continue to next phase.
FIX. Stay in current phase and correct issues.
RESET. Output drifted too much. Rework from previous commit.
```
