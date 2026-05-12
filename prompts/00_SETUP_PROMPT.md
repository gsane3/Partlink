# 00_SETUP_PROMPT.md

You are working inside the new Partlink repository.

Read `CLAUDE.md` first.

Your task is setup-only.

Do not build product screens yet.

## Goal

Prepare the frontend codebase for the Partlink UI build.

## Requirements

1. Verify the project uses:
   - Next.js App Router
   - TypeScript
   - Tailwind
   - shadcn/ui

2. Create or clean the folder structure:

```text
src/
  app/
    (public)/
    seller/
    buyer/
    admin/
  components/
    ui/
    layout/
    marketplace/
    inventory/
    orders/
    chat/
    verification/
    qr/
    forms/
  lib/
    mock-data/
    constants/
    utils/
    routes/
  types/
    index.ts
```

3. Create centralized constants for:
   - routes
   - categories
   - part conditions
   - part statuses
   - order statuses
   - payment methods
   - delivery methods
   - verification statuses

4. Create TypeScript types for:
   - User
   - Seller
   - Buyer
   - Vehicle
   - Part
   - PartPhoto
   - Category
   - QRCode
   - Order
   - OrderItem
   - Payment
   - Shipment
   - ChatThread
   - ChatMessage
   - VerificationRequest

5. Create realistic mock data files for:
   - sellers
   - vehicles
   - parts
   - orders
   - buyers
   - verification requests

6. Keep user-facing labels in Greek.

7. Do not create real backend logic.

8. Do not create Supabase schema yet.

9. Do not build full screens.

10. Make sure the repo compiles.

## Output Expected

After completion, summarize:
- files created
- constants created
- types created
- mock data created
- anything that needs review

Run lint/build if possible and report results.
