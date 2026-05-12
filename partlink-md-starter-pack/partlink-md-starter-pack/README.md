# Partlink UI Build Starter

This repository is for building the Partlink UI v2.

Partlink is an inventory-first marketplace for used car parts in Greece.

## First goal

Build a realistic clickable UI prototype with:
- public marketplace
- seller mobile workflow
- seller inventory
- add part wizard
- VIN import wizard
- QR scan flow
- buyer search and order flow
- admin verification

Do not start with backend complexity.

## First build principle

UI first, but never UI without product logic.

Every screen must map to:
- a user
- a route
- a real entity
- a real workflow
- the inventory chain

## Important files

- `CLAUDE.md`: main behavior and product rules for Claude Code and Ruflo
- `docs/00_PRODUCT_RULES.md`: short non-negotiable product rules
- `docs/01_UI_BUILD_PLAN.md`: phased UI build plan
- `docs/02_REVIEW_CHECKLIST.md`: review checklist after each output
- `docs/03_MOCK_DATA_RULES.md`: fake data standards
- `docs/04_SETUP_INSTRUCTIONS.md`: first setup instructions
- `prompts/00_SETUP_PROMPT.md`: first prompt to give Claude + Ruflo
- `prompts/01_DESIGN_SYSTEM_PROMPT.md`: next prompt after setup
- `prompts/02_APP_SHELL_PROMPT.md`: app shell and navigation prompt
