# 01_UI_BUILD_PLAN.md

## Build Strategy

Build Partlink UI in phases.

Do not build everything at once.

After each phase:
1. Commit to GitHub
2. Review in browser
3. Send repo link / branch / commit for review
4. Fix issues before continuing

## Phase 0. Repository Setup

Goal:
- Clean Next.js repo
- TypeScript
- Tailwind
- shadcn/ui
- basic folder structure
- `CLAUDE.md`
- docs and prompts

No product UI yet.

## Phase 1. Design System

Goal:
- colors
- typography
- buttons
- cards
- inputs
- badges
- layout primitives
- empty states
- loading states
- Greek UI labels

No full screens yet.

## Phase 2. App Shell And Navigation

Goal:
- public layout
- seller layout
- buyer layout
- admin layout
- mobile bottom navigation
- desktop sidebar
- topbar
- responsive shell

## Phase 3. Core Seller Mobile

Goal:
- `/seller/mobile`
- pending orders
- dispatch needed
- recent parts
- quick stock search
- floating action button
- Add Part / VIN Import / Scan QR actions

## Phase 4. Add Part Flow

Goal:
- `/seller/inventory/add`
- photo step
- vehicle details
- part details
- condition and price
- publish
- QR preview and print UI
- success state

## Phase 5. VIN Import Flow

Goal:
- `/seller/inventory/vin-import`
- car photo
- VIN scan/manual entry
- vehicle confirmation
- generated parts list
- bulk publish selected
- QR print later / now

## Phase 6. Inventory

Goal:
- `/seller/inventory`
- filters
- stock table/list
- status badges
- QR state
- actions
- mobile and desktop usable

## Phase 7. Marketplace

Goal:
- `/marketplace`
- search
- filters
- realistic part cards
- VIN CTA
- category filters
- seller location
- call / ask / buy actions

## Phase 8. Part Detail And Buyer Flow

Goal:
- `/marketplace/[partId]`
- buyer profile
- checkout/order confirmation
- buyer orders

## Phase 9. Seller Orders And QR Dispatch

Goal:
- `/seller/orders`
- `/seller/orders/[orderId]`
- `/seller/inventory/scan`
- dispatch confirmation
- stock update UI states

## Phase 10. Admin Verification

Goal:
- `/admin/verifications`
- pending queue
- approve/reject
- user/seller/buyer review

## Phase 11. Final UI Review

Goal:
- remove inconsistencies
- unify spacing
- improve mobile
- improve Greek copy
- remove overbuilt features
- verify all routes
