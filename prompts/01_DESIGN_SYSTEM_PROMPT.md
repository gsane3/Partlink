# 01_DESIGN_SYSTEM_PROMPT.md

You are working inside the Partlink repository.

Read:
- `CLAUDE.md`
- `docs/00_PRODUCT_RULES.md`
- `docs/01_UI_BUILD_PLAN.md`
- `docs/03_MOCK_DATA_RULES.md`

## Task

Build the Partlink design system foundation.

Do not build full product screens yet.

## Create

1. Design tokens through Tailwind/CSS variables:
   - primary
   - primary blue
   - background
   - card
   - border
   - text
   - muted text
   - success
   - warning
   - danger

2. Base layout primitives:
   - PageShell
   - SectionHeader
   - EmptyState
   - StatusBadge
   - MetricCard
   - ActionCard
   - MobileBottomAction
   - MobileBottomNav
   - DesktopSidebar
   - TopBar

3. Form primitives:
   - FormField wrapper
   - SearchInput
   - FilterChip
   - PriceInput

4. Inventory primitives:
   - PartStatusBadge
   - ConditionBadge
   - MarketplaceVisibilityBadge
   - QRStatusBadge

5. Use Greek labels.

6. Use realistic examples from mock data.

## Design Rules

- mobile-first
- large tap targets
- no decorative complexity
- consistent spacing
- clean business UI
- practical operations feel

## Do Not

- build full marketplace
- build full dashboard
- implement backend
- add random libraries
- add animations unless very small and useful

## Output Expected

Summarize:
- components created
- design decisions
- how to use the components
- lint/build result
