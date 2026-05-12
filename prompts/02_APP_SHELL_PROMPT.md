# 02_APP_SHELL_PROMPT.md

You are working inside the Partlink repository.

Read:
- `CLAUDE.md`
- `docs/00_PRODUCT_RULES.md`
- `docs/01_UI_BUILD_PLAN.md`
- `docs/02_REVIEW_CHECKLIST.md`

## Task

Build the Partlink app shell and navigation system.

## Create Layouts

### Public
- homepage layout shell
- marketplace layout shell

### Seller
- desktop seller layout with sidebar and topbar
- mobile seller layout with bottom nav
- floating action button system for seller mobile

### Buyer
- buyer layout with marketplace/search/orders/chats/profile navigation

### Admin
- admin desktop layout with sidebar

## Required Navigation

Seller:
- Αρχική
- Το stock μου
- Προσθήκη
- Εισαγωγή με VIN
- Σάρωση QR
- Παραγγελίες
- Συνομιλίες
- Ρυθμίσεις

Buyer:
- Αγορά
- Αναζήτηση με VIN
- Παραγγελίες
- Συνομιλίες
- Προφίλ

Admin:
- Επισκόπηση
- Επαληθεύσεις
- Χρήστες
- Πωλητές
- Αγοραστές
- Αγγελίες
- Παραγγελίες
- Διαφωνίες
- Αναφορές

## Do Not

- build all pages fully
- implement backend
- create random routes outside official route list
- overdesign

## Output Expected

Summarize:
- layouts created
- navigation created
- route placeholders created
- mobile behavior
- lint/build result
