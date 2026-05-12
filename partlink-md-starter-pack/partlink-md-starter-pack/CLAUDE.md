# PARTLINK CLAUDE.md

## Product Identity

Partlink is a Greek B2B/B2C web platform for the used car parts market.

It connects:
- Μάντρες / dismantlers / used parts suppliers
- Συνεργεία / repair shops
- Ιδιώτες / private buyers
- Admin operators who verify and monitor the platform

Partlink is not a classified ads website. It is an inventory-first marketplace and operating system for used car parts.

The marketplace exists because seller stock is structured first.

## Core Product Truth

Always preserve this chain:

```text
Physical part
→ digital inventory item
→ SKU
→ QR label
→ inventory record
→ marketplace listing
→ buyer search
→ order
→ QR dispatch scan
→ stock update
→ sales record
```

If a screen, component, route, database change, or flow breaks this chain, it is wrong.

## Primary Product Goal

Build the MVP so the first pilot yard can use it in real life.

The product must allow:

1. Seller registers
2. Seller submits business verification
3. Admin approves seller
4. Seller adds a part manually or imports a full car by VIN
5. System creates SKU and QR
6. Seller prints QR label
7. Part enters inventory
8. Part appears in marketplace
9. Buyer searches by VIN, part number, part name, vehicle or filters
10. Buyer calls, chats or buys
11. Order is created
12. Seller scans QR for dispatch
13. Inventory and marketplace update automatically

## Current Build Phase

We are currently focused on UI and frontend product flows.

During this phase:
- Use realistic fake data
- Build clickable, production-quality UI
- Do not overbuild backend logic
- Do not invent unnecessary features
- Keep every UI decision compatible with the final data model

The UI must not be a design showcase. It must be a realistic operational prototype.

## Official MVP Scope

### Public
- Homepage
- Marketplace
- Part detail page
- Login
- Register
- Business verification

### Seller
- Seller dashboard
- Seller mobile dashboard
- Inventory list
- Add part wizard
- VIN import wizard
- QR scan screen
- Seller part detail
- Orders
- Order detail
- Chats
- Settings

### Buyer
- Buyer dashboard
- Marketplace
- VIN search
- Orders
- Order detail
- Chats
- Profile with shipping and invoice details

### Admin
- Admin overview
- Verification queue
- Users
- Sellers
- Buyers
- Listings
- Orders
- Disputes
- Reports

## Official Routes

Use these routes unless there is a strong reason to change them.

### Public

```text
/
/marketplace
/marketplace/[partId]
/login
/register
/verify-business
```

### Seller

```text
/seller
/seller/mobile
/seller/inventory
/seller/inventory/add
/seller/inventory/vin-import
/seller/inventory/scan
/seller/inventory/[partId]
/seller/orders
/seller/orders/[orderId]
/seller/chats
/seller/settings
```

### Buyer

```text
/buyer
/buyer/marketplace
/buyer/vin-search
/buyer/orders
/buyer/orders/[orderId]
/buyer/chats
/buyer/profile
```

### Admin

```text
/admin
/admin/verifications
/admin/users
/admin/sellers
/admin/buyers
/admin/listings
/admin/orders
/admin/disputes
/admin/reports
```

## User Roles

Support these roles:
- seller_owner
- seller_employee
- buyer_owner
- buyer_employee
- admin

Do not create extra roles unless explicitly requested.

## Product Framing

Correct:
- Web dashboard and marketplace
- Inventory-first marketplace
- QR-based stock tracking
- VIN-based vehicle and parts workflow
- Buyer-seller chat as support for questions and orders

Incorrect:
- Chat-first app
- Generic classifieds site
- Generic ecommerce site
- AI-first product
- ERP-heavy system

## Seller Reality

Build around real yard behavior.

Seller usage pattern:
- Mobile for adding parts
- Mobile for VIN import
- Mobile for QR scan
- Mobile for dispatch
- Desktop for stock overview, orders, sales and management

Seller mobile UX must be fast, simple and usable with one hand.

## Buyer Reality

Buyers need speed and confidence.

Buyer usage pattern:
- Search by VIN
- Search by part number
- Search by part name
- Filter by category, condition, price, vehicle and location
- Open part detail
- Call, chat or buy

Do not hide core buying actions.

## Admin Reality

Admins need operational control.

Admin usage pattern:
- Manual business verification
- Seller and buyer review
- Listing moderation
- Order monitoring
- Dispute review
- Reports

Admin UI should be desktop-first, clear and fast.

## Verification Rules

Sellers must not access operational seller dashboards until approved.

Verification states:
- Registered
- Verification submitted
- Pending manual review
- Approved
- Rejected
- Needs more info, if implemented

Verification fields:
- Επωνυμία
- ΑΦΜ
- ΔΟΥ
- Τηλέφωνο
- Διεύθυνση
- Website/social link if available

Business buyers may browse marketplace before verification, but business features such as saved invoice data, orders and buyer dashboard require account setup.

## Hardware Rules

Default hardware approach:
- Any Android/iOS phone
- Browser-based access
- Small Bluetooth label printer
- QR sticker labels

Do not assume SUNMI hardware.

Bluetooth QR label printing is the intended workflow.

Browser print or PDF label export can exist as fallback later.

## UI Language

Primary UI language is Greek.

Use simple, professional Greek.

Avoid:
- complex SaaS jargon
- playful copy
- too much English
- overexplaining
- technical wording for normal users

Good examples:
- Πρόσθεσε ανταλλακτικό
- Σκάναρε QR
- Το ανταλλακτικό προστέθηκε στο stock
- Δεν υπάρχουν ακόμα παραγγελίες
- Συμπλήρωσε τα στοιχεία αποστολής μία φορά

Use official labels from `06_COPY_AND_LABELS.md` whenever available.

## Design Direction

Partlink should feel like:
- clean SaaS dashboard
- marketplace
- practical operations tool
- trustworthy business software

Partlink should not feel like:
- complex ERP
- consumer social app
- generic classifieds website
- futuristic AI app
- template dashboard

Design priorities:
1. Clarity
2. Speed
3. Trust
4. Mobile usability
5. Operational accuracy

## Visual System

Use:
- Tailwind CSS
- shadcn/ui where useful
- clean sans-serif typography
- card-based layouts
- clear forms
- clear status badges
- large mobile tap targets
- bottom navigation on mobile
- left sidebar on desktop
- floating action button on seller mobile

Avoid:
- glassmorphism
- heavy gradients
- tiny text
- random icon usage
- inconsistent spacing
- decorative animations
- hidden primary actions

Recommended palette:
- primary: #0F172A
- primary blue: #2563EB
- background: #F8FAFC
- card: #FFFFFF
- border: #E2E8F0
- text: #0F172A
- muted text: #64748B
- success: #16A34A
- warning: #F59E0B
- danger: #DC2626

## Mobile Rules

Mobile screens must use:
- large tap targets
- sticky bottom actions
- minimal typing
- camera-first workflows
- save progress often
- visible primary action
- readable text
- simple navigation

Seller mobile dashboard must show:
- pending orders
- dispatch needed
- recent parts
- quick stock search
- floating action button

Floating action button options:
- Πρόσθεσε ανταλλακτικό
- Εισαγωγή με VIN
- Σκάναρε QR

## Desktop Rules

Desktop dashboards should use:
- left sidebar
- top bar
- search
- notifications
- profile menu
- KPI cards
- tables with filters
- clear bulk actions
- modal or drawer detail views

Do not overload dashboards with analytics before core flows work.

## Seller Dashboard Widgets

Seller desktop dashboard can include:
- Total stock value
- Parts in stock
- Sales this month
- Pending orders
- Most viewed parts
- Old stock / low activity
- Sold parts this month
- Average order value
- Inventory by category
- Parts without photos
- Parts without price
- Parts awaiting QR label

Widget customization may exist, but do not prioritize it before core flows.

## Add Part Flow

Manual part upload must follow:

Photo
→ vehicle details
→ part details
→ condition and price
→ publish
→ generate SKU
→ generate QR
→ print QR
→ add to inventory
→ publish to marketplace if selected

Required fields:
- photos
- make
- model
- year
- engine optional
- fuel optional
- part name
- category
- condition
- price
- description optional
- quantity
- publish yes/no

On publish:
- create part
- create SKU
- create QR
- create marketplace listing
- print QR

## VIN Import Flow

VIN import must follow:

Car photo
→ scan or enter VIN
→ validate 17 characters
→ decode vehicle
→ confirm vehicle
→ show generated sellable parts list
→ seller selects parts
→ seller enters price and condition
→ publish selected
→ create SKU and QR per part
→ add parts to inventory
→ publish selected parts to marketplace
→ print QR now or later

A fixed template of common parts is acceptable for MVP if full compatibility data is unavailable.

The UI should still feel like the VIN decoded the vehicle and generated relevant parts.

## Inventory Rules

Inventory must support:
- search by part name
- search by SKU
- vehicle filter
- category filter
- condition filter
- status filter
- price range
- date added
- has photo / missing photo
- marketplace visibility
- QR status

Inventory actions:
- view
- edit
- reprint QR
- mark sold
- remove from marketplace
- delete

Inventory is not just listings. It is the seller’s operational stock system.

## Part Statuses

Use these internal statuses:
- draft
- available
- reserved
- sold
- shipped
- delivered
- returned
- deleted

Greek labels:
- Πρόχειρο
- Διαθέσιμο
- Κρατημένο
- Πωλήθηκε
- Απεστάλη
- Παραδόθηκε
- Επιστράφηκε
- Διαγράφηκε

## Marketplace Rules

Marketplace search must support:
- part name
- car make
- car model
- OEM number if available
- part number if available

Filters:
- category
- price max
- condition
- location if available

Part card must show:
- photo
- title
- vehicle
- condition
- price
- seller location
- call
- buy
- ask seller

Marketplace listings must always be connected to inventory records.

Do not build marketplace cards as independent ads.

## Buyer Profile

Buyer enters details once and reuses them for:
- shipping
- invoice
- receipt
- order communication

Buyer profile fields:
- full name or company name
- phone
- email
- shipping address
- city
- postal code
- invoice or receipt preference

For invoice:
- company name
- AFM
- DOY
- profession
- billing address

## Checkout Rules

Buyer checkout must include:
- confirm saved profile details
- payment method
- document type
- delivery method
- confirm order

Payment methods:
- card
- cash on delivery
- bank transfer

Document types:
- receipt
- invoice

Delivery methods:
- courier
- pickup from yard

Do not implement real payment integration until requested. UI options are enough for MVP.

## QR Rules

QR is not decorative.

QR is used to:
- identify the part
- open correct part page
- verify dispatch
- mark sold
- update stock
- update marketplace listing
- create sales record

QR value should eventually include:
- SKU
- seller_id
- item_id
- checksum

For UI phase, QR can be mocked, but the screen must represent the real operational flow.

## Chat Rules

Partlink is not chat-first.

Chat exists only as buyer-seller messaging for:
- part questions
- order questions
- post-order communication

Chat must support:
- part-linked threads
- order-linked threads after purchase
- buyer inbox
- seller inbox

Admin review of chat is only needed for disputes later.

## Data Model Awareness

Even in UI phase, screens should map cleanly to these core entities:
- User
- Seller
- Buyer
- VerificationRequest
- Vehicle
- Part
- PartPhoto
- Category
- QRCode
- Order
- OrderItem
- Payment
- InvoiceDocument
- Shipment
- ChatThread
- ChatMessage
- Sale
- Dispute
- AdminAction

Do not invent UI concepts that cannot map to the data model.

## Categories

Use these categories:
- Αμάξωμα
- Φωτισμός
- Κινητήρας
- Σασμάν
- Ανάρτηση
- Φρένα
- Εσωτερικό
- Ηλεκτρικά
- Ζάντες / Ελαστικά
- Ψύξη / Κλιματισμός
- Εξάτμιση
- Άλλο

## Conditions

Use these condition labels:
- Άριστο
- Πολύ καλό
- Καλό
- Μέτριο
- Για επισκευή
- Ελεγμένο
- Χωρίς έλεγχο

## Copy Rules

Use official copy where possible.

Homepage title:
Βρες και πούλα μεταχειρισμένα ανταλλακτικά πιο γρήγορα.

Homepage subtitle:
Το Partlink οργανώνει το stock της μάντρας και βοηθά συνεργεία και ιδιώτες να βρίσκουν διαθέσιμα ανταλλακτικά σε όλη την Ελλάδα.

Add part success:
Το ανταλλακτικό προστέθηκε στο stock και δημοσιεύτηκε στο marketplace.

VIN import success:
Τα επιλεγμένα ανταλλακτικά προστέθηκαν στο stock και είναι διαθέσιμα στο marketplace.

Marketplace search placeholder:
Αναζήτησε ανταλλακτικό, part number ή μοντέλο

QR scan failed:
Δεν αναγνωρίστηκε το QR. Βεβαιώσου ότι είναι καθαρό και δοκίμασε ξανά.

## Realistic Fake Data

Use realistic Greek marketplace data.

Examples:
- BMW E90 N47 Turbo
- Opel Astra H ECU
- VW Golf 5 Airbag Module
- Mercedes W204 Φανάρι εμπρός δεξί
- Toyota Yaris 2016 Προφυλακτήρας
- Peugeot 208 Καθρέφτης αριστερός
- Ford Focus 1.6 TDCi Μίζα
- Audi A3 8P Πόρτα οδηγού

Use realistic Greek seller examples:
- Μάντρα Παπαδόπουλος, Αιγάλεω
- Auto Parts Νίκαια
- Ανακυκλώσεις Αττικής
- CarParts Θεσσαλονίκης

Use realistic prices:
- small trim parts: 15-60€
- lights/mirrors: 40-180€
- ECU/turbo/gearbox/engine parts: 150-1,500€

Avoid:
- lorem ipsum
- John Doe
- Test Product
- generic fake names

## Technical Stack

Use:
- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase/PostgreSQL later
- Supabase Auth later
- Supabase Storage or S3-compatible storage later
- qrcode.react for QR generation
- ZXing for QR scanning

During UI phase:
- fake data is acceptable
- local state is acceptable
- mocked QR is acceptable
- mocked auth states are acceptable

But do not structure the UI in a way that will make backend integration painful later.

## Code Quality

Prefer:
- simple readable code
- TypeScript types
- reusable components
- feature-based folders
- predictable names
- small components
- clear props
- clean state handling

Avoid:
- giant page files
- duplicate card implementations
- inline styles
- hardcoded repeated values
- random component naming
- premature abstractions
- complex global state too early

## Suggested Folder Structure

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

Keep feature components close to their product domain.

## Agent Rules For Claude Code And Ruflo

When using agents:
- Use Opus for architecture, product decisions, UX review and refactor planning
- Use Sonnet for UI implementation, component generation and page building
- Use smaller/cheaper routing only for simple transforms when available
- Use hierarchical swarm coordination for multi-screen or multi-domain work
- Keep max agents small, usually 4-8
- Use specialized roles
- Add checkpoints after each flow
- Do not let agents redesign unrelated flows

Useful roles:
- product-architect
- ux-reviewer
- frontend-builder
- component-builder
- data-model-reviewer
- qa-tester

Every agent must preserve:
- inventory-first logic
- official routes
- Greek UI copy
- mobile seller workflow
- QR dispatch chain
- marketplace inventory connection

## Anti-Drift Rules

Before changing or creating any screen, check:

1. Which user is this for?
2. Which route is this?
3. Which entity does it map to?
4. Which part of the core chain does it support?
5. Does it help the pilot yard?
6. Is the copy simple Greek?
7. Is the mobile experience usable?
8. Does it avoid overbuilding?

Do not proceed if these are unclear.

## Things Not To Overbuild

Do not overbuild:
- AI recommendations
- fully automated courier integration
- complex dispute handling
- advanced analytics
- complex subscriptions
- multi-country support
- native mobile app
- advanced permissions
- perfect VIN compatibility database
- gamification
- social features
- RFQ system as a core MVP feature unless explicitly requested

## Acceptance Criteria

The UI is acceptable when this complete flow is visible and believable:

Seller registers
→ admin approves seller
→ seller adds part with photo and price
→ SKU and QR are generated
→ QR label can be printed
→ part appears in inventory
→ part appears in marketplace
→ buyer searches and opens part
→ buyer calls, chats or buys
→ order appears for seller
→ seller scans QR
→ part is marked sold or dispatched
→ inventory and marketplace update

## Final Product Feel

Partlink should feel like a practical operating system for used car parts.

Not:
- a generic marketplace template
- a startup landing page
- a chat app
- a bloated ERP
- a design experiment

Every screen should feel usable by a real yard tomorrow morning.
