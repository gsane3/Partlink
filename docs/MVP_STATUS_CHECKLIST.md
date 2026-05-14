# Partlink MVP Status Checklist

Έκδοση: 1.0 — 2026-05-14

---

## 1. Τρέχουσα κατεύθυνση προϊόντος

Το Partlink MVP είναι **request-first marketplace** για μεταχειρισμένα ανταλλακτικά αυτοκινήτων στην Ελλάδα.

**Κεντρική ροή:**

```
Αγοραστής βρίσκει ανταλλακτικό στο marketplace
→ Στέλνει αίτημα (με μήνυμα + επιλογή παράδοσης)
→ Πωλητής λαμβάνει αίτημα, στέλνει τιμή ή απάντηση
→ Αγοραστής αποδέχεται τιμή
→ Επόμενο βήμα: παραλαβή ή αποστολή
```

**Τρέχουσα τεχνική κατάσταση:**

- Δεν υπάρχει backend, βάση δεδομένων ή αυθεντικοποίηση
- Όλα τα δεδομένα είναι mock/local state
- Οι ενέργειες (αποδοχή τιμής, αποστολή τιμής, μηνύματα) γίνονται reset με κάθε reload
- Το demo είναι κατάλληλο για παρουσίαση ροής — όχι για κανονική χρήση

---

## 2. Έτοιμα για demo

### 2.1 Public marketplace

- [x] Homepage (`/`) με τίτλο, CTAs, searchbox, στατιστικά, τρόποι χρήσης
- [x] Marketplace list (`/marketplace`) με φίλτρα, αναζήτηση, realistic mock parts
- [x] Part detail (`/marketplace/part-001`) με φωτογραφία, SKU, κατάσταση, τιμή, seller info
- [x] Request sheet — φόρμα αιτήματος με προφίλ αγοραστή, μήνυμα, επιλογή παράδοσης
- [x] Login form (`/login`) — mock UI
- [x] Register form (`/register`) — mock UI
- [x] Verify business form (`/verify-business`) — mock UI

### 2.2 Buyer flow

- [x] Buyer dashboard (`/buyer`) με summary cards και γρήγορες συνδέσεις
- [x] Buyer marketplace (`/buyer/marketplace`) — redirect/alias
- [x] VIN search (`/buyer/vin-search`) — mock decode με προτεινόμενα ανταλλακτικά
- [x] Λίστα αιτημάτων αγοραστή (`/buyer/orders`) με filters, price hints, accept price action
- [x] Λεπτομέρεια αιτήματος αγοραστή (`/buyer/orders/req-004`) με timeline, μηνύματα, accept price
- [x] Buyer chats (`/buyer/chats`) — placeholder UI
- [x] Buyer profile (`/buyer/profile`) — mock προφίλ με στοιχεία αποστολής/τιμολόγησης

### 2.3 Seller flow

- [x] Seller desktop dashboard (`/seller`) με KPIs, λίστα εκκρεμών
- [x] Seller mobile dashboard (`/seller/mobile`) με FAB, dispatch alerts, quick search
- [x] Inventory list (`/seller/inventory`) με φίλτρα, QR status, actions ανά ανταλλακτικό
- [x] Add part wizard (`/seller/inventory/add`) — multi-step: φωτογραφία → όχημα → ανταλλακτικό → τιμή → QR preview
- [x] VIN import wizard (`/seller/inventory/vin-import`) — scan/enter VIN → decode (mock) → bulk select → publish
- [x] QR scan screen (`/seller/inventory/scan`) — camera UI, confirm dispatch screen
- [x] Seller part detail (`/seller/inventory/[partId]`)
- [x] Seller vehicle detail (`/seller/inventory/vehicles/[vehicleCode]`)
- [x] Seller request inbox (`/seller/orders`) με filters, inline expand, price/reply actions
- [x] Seller request detail (`/seller/orders/req-003`) με timeline, μηνύματα, send price, reply
- [x] Seller chats (`/seller/chats`) — placeholder UI
- [x] Seller settings (`/seller/settings`) — mock UI

### 2.4 Admin flow

- [x] Admin overview (`/admin`) με KPI cards
- [x] Αιτήματα marketplace (`/admin/orders`) — λίστα με buyer/seller/status/date
- [x] Listings (`/admin/listings`) — λίστα με φίλτρα, απενεργοποίηση
- [x] Verifications queue (`/admin/verifications`) — λίστα αιτήσεων επαλήθευσης
- [x] Verification detail (`/admin/verifications/[id]`) — στοιχεία επιχείρησης, approve/reject actions
- [x] Disputes/Review items (`/admin/disputes`) — soft review placeholder
- [x] Reports (`/admin/reports`) — static mock activity data
- [x] Users (`/admin/users`) — λίστα χρηστών
- [x] Buyers (`/admin/buyers`) — λίστα αγοραστών με αιτήματα
- [x] Sellers (`/admin/sellers`) — λίστα πωλητών με listings και αιτήματα

### 2.5 Τεκμηρίωση

- [x] `docs/00_PRODUCT_RULES.md` — βασική λογική προϊόντος
- [x] `docs/01_UI_BUILD_PLAN.md` — build phases
- [x] `docs/02_REVIEW_CHECKLIST.md` — review checklist ανά output
- [x] `docs/DEMO_WALKTHROUGH.md` — πλήρης walkthrough 7 λεπτών
- [x] `docs/BACKEND_HANDOFF_SPEC.md` — backend spec για developer
- [x] `docs/PILOT_FEEDBACK_CHECKLIST.md` — feedback checklist για pilot demo

---

## 3. Mock / local state μόνο

Τα παρακάτω **φαίνονται** λειτουργικά στο demo αλλά δεν αποθηκεύουν τίποτα και χάνονται με reload.

| Λειτουργία | Τρέχουσα κατάσταση | Αρχείο |
|-----------|-------------------|--------|
| Αυθεντικοποίηση | Δεν υπάρχει. Οι ρόλοι είναι hardcoded. | `profiles.ts` |
| Χρήστης session | `currentBuyerProfile` / `currentSellerProfile` — hardcoded | `profiles.ts` |
| Δημιουργία αιτήματος | Submit στο request sheet δείχνει success state μόνο | `request-sheet.tsx` |
| Αποδοχή τιμής | `useState` — reset με navigation/reload | `buyer-request-detail.tsx` |
| Αποστολή τιμής από πωλητή | `useState` — reset με navigation/reload | `request-inbox.tsx`, `request-detail-screen.tsx` |
| Απάντηση πωλητή | `useState` — reset με navigation/reload | `request-inbox.tsx`, `request-detail-screen.tsx` |
| Μηνύματα αγοραστή/πωλητή | Local messages array — reset με navigation | `buyer-request-detail.tsx`, `request-detail-screen.tsx` |
| Activity timeline | Δημιουργείται από mock data + local events | `activity.ts` |
| VIN αποκωδικοποίηση | Mock vehicle/parts list | `vehicle-part-catalog.ts`, `vin-wizard.tsx` |
| QR scan | Camera UI υπάρχει — καμία real scan λογική | `qr-scan-screen.tsx` |
| Admin approve/reject | UI actions — καμία πραγματική επίδραση | admin verification pages |
| Admin actions (listings, disputes) | UI controls — καμία πραγματική επίδραση | admin pages |

---

## 4. Δεν έχει υλοποιηθεί ακόμα

| Λειτουργία | Κατάσταση |
|-----------|-----------|
| Backend persistence | Δεν υπάρχει. Δεν υπάρχει Supabase ή άλλη βάση. |
| Real auth / roles | Δεν υπάρχει. Supabase Auth δεν έχει ενεργοποιηθεί. |
| Real request creation | Δεν υπάρχει. Το submit δεν κάνει POST πουθενά. |
| Real messaging | Δεν υπάρχει. Τα μηνύματα είναι local state. |
| Real seller notifications | Δεν υπάρχει (email, push, real-time). |
| Real πληρωμές | Δεν υπάρχουν. Τα UI options είναι placeholder. |
| Courier API | Δεν υπάρχει. Αριθμός αποστολής εισάγεται χειροκίνητα αργότερα. |
| Τιμολόγιο / MyData | Δεν υπάρχει. |
| Production VIN compatibility | Δεν υπάρχει. Η αποκωδικοποίηση VIN είναι mock template. |
| QR scan → stock update | Δεν υπάρχει. Το QR scan UI δεν ενημερώνει inventory. |
| Email επαλήθευσης | Δεν υπάρχει. |

---

## 5. Checklist ετοιμότητας για pilot demo

Εκτελέστε τα παρακάτω πριν κάθε παρουσίαση:

### Build

- [ ] `npm run lint` — κανένα error
- [ ] `npm run build` — clean build χωρίς errors
- [ ] `npm run dev` — η εφαρμογή ξεκινά στο `http://localhost:3000`

### Manual walkthrough

- [ ] Ανοίξτε κάθε demo route χειροκίνητα και επιβεβαιώστε ότι φορτώνει
- [ ] Κάντε τη ροή αγοραστή: marketplace → part → request sheet → orders → αποδοχή τιμής
- [ ] Κάντε τη ροή πωλητή: seller/orders → επιλογή req-003 → αποστολή τιμής
- [ ] Δείτε ότι το activity timeline εμφανίζεται σωστά
- [ ] Επαληθεύστε ότι ο seller mobile dashboard φορτώνει σωστά

### Προετοιμασία

- [ ] Έχετε ανοιχτές τις βασικές σελίδες σε tabs πριν ξεκινήσετε
- [ ] Έχετε έτοιμη εξήγηση για τους mock περιορισμούς (βλ. §8)
- [ ] Αρχείο σημειώσεων ανοιχτό για καταγραφή αντιδράσεων
- [ ] (Προαιρετικό) Screenshots ή video recording έτοιμο

---

## 6. Route smoke-test checklist

Επαληθεύστε κάθε route πριν το demo. Σημειώστε ✓ ή ✗.

### Public

| Route | Φορτώνει; | Σχόλιο |
|-------|----------|--------|
| `/` | | |
| `/marketplace` | | |
| `/marketplace/part-001` | | |
| `/login` | | |
| `/register` | | |
| `/verify-business` | | |

### Buyer

| Route | Φορτώνει; | Σχόλιο |
|-------|----------|--------|
| `/buyer` | | |
| `/buyer/marketplace` | | |
| `/buyer/vin-search` | | |
| `/buyer/orders` | | |
| `/buyer/orders/req-004` | | |
| `/buyer/chats` | | |
| `/buyer/profile` | | |

### Seller

| Route | Φορτώνει; | Σχόλιο |
|-------|----------|--------|
| `/seller` | | |
| `/seller/mobile` | | |
| `/seller/inventory` | | |
| `/seller/inventory/add` | | |
| `/seller/inventory/vin-import` | | |
| `/seller/inventory/scan` | | |
| `/seller/orders` | | |
| `/seller/orders/req-003` | | |
| `/seller/chats` | | |
| `/seller/settings` | | |

### Admin

| Route | Φορτώνει; | Σχόλιο |
|-------|----------|--------|
| `/admin` | | |
| `/admin/orders` | | |
| `/admin/listings` | | |
| `/admin/verifications` | | |
| `/admin/verifications/seller-profile` | | |
| `/admin/verifications/buyer-profile` | | |
| `/admin/disputes` | | |
| `/admin/reports` | | |
| `/admin/users` | | |
| `/admin/buyers` | | |
| `/admin/sellers` | | |

**Σημείωση:** Η dynamic route είναι `/admin/verifications/[id]`. Αν οι static paths `/seller-profile` ή `/buyer-profile` δεν λειτουργούν, χρησιμοποιήστε mock id από τα `verifications` mock data.

---

## 7. Τι να μην πείτε στο demo

Αποφύγετε τις παρακάτω διατυπώσεις — μπορεί να δημιουργήσουν λάθος εντύπωση:

| Αποφύγετε | Πείτε αντ' αυτού |
|-----------|-----------------|
| «Έχει backend» | «Το backend δεν έχει υλοποιηθεί ακόμα — αυτό είναι το επόμενο βήμα» |
| «Κρατάει τα δεδομένα» | «Τα δεδομένα είναι mock — δεν αποθηκεύεται τίποτα μετά από refresh» |
| «Έχει πληρωμές» | «Οι πληρωμές είναι placeholder στο UI — δεν υπάρχει real integration» |
| «Έχει courier integration» | «Ο τρόπος αποστολής θα συμφωνηθεί χειροκίνητα μεταξύ πωλητή και αγοραστή» |
| «Το VIN είναι production-grade» | «Η αποκωδικοποίηση VIN είναι mock template — στο production θα συνδεθεί με βάση συμβατότητας» |
| «Είναι έτοιμο για κανονικές συναλλαγές» | «Αυτό είναι πρωτότυπο για επικύρωση ροής — δεν είναι production» |
| «Έχει real auth» | «Η αυθεντικοποίηση δεν έχει υλοποιηθεί — οι ρόλοι είναι simulated» |

---

## 8. Προτεινόμενα επόμενα engineering βήματα

Σε σειρά προτεραιότητας:

1. **Backend: read requests** — σύνδεση `GET /api/seller/requests` και `GET /api/buyer/requests` με Supabase. Αντικατάσταση `mockBuyerRequests`.

2. **Backend: create request** — `POST /api/buyer/requests` από το `request-sheet.tsx`. Αποθήκευση buyer profile snapshot.

3. **Backend: persist messages και activity** — Αντικατάσταση local state στα detail screens. Αποθήκευση `request_messages` και `request_activity_events`.

4. **Backend: seller send price** — `POST /api/seller/requests/:id/send-price`. Αποθήκευση `request_price_offers`, status → `price_sent`.

5. **Backend: buyer accept price** — `POST /api/buyer/requests/:id/accept-price`. Status → `price_accepted`.

6. **Auth / roles** — Ενεργοποίηση Supabase Auth. Custom claims για buyer / seller / admin role. Route guards στο Next.js middleware.

7. **Admin monitoring** — Σύνδεση admin screens με real data. Approve/reject verifications με πραγματική επίδραση σε `verification_requests`.

8. **QR scan → stock update** — Σύνδεση QR scan screen με backend. Scan → find part → mark dispatched → update inventory.

---

## 9. Σύνοψη σε μία σελίδα

### Τι είναι έτοιμο τώρα

Το Partlink έχει πλήρη, clickable UI για **όλες τις βασικές ροές**:

- Αγοραστής βρίσκει ανταλλακτικό, στέλνει αίτημα, αποδέχεται τιμή
- Πωλητής βλέπει αιτήματα, στέλνει τιμή, απαντά
- Seller add part wizard (multi-step) και VIN import wizard
- QR scan screen
- Admin monitoring για αιτήματα, listings, verifications, disputes, reports
- Buyer/seller dashboards (desktop και mobile)
- Activity timeline και message thread UI

Το demo είναι κατάλληλο για παρουσίαση ροής σε pilot χρήστη.

### Τι δεν είναι έτοιμο

- **Δεν υπάρχει backend** — τίποτα δεν αποθηκεύεται
- **Δεν υπάρχει auth** — οι ρόλοι είναι simulated
- **Δεν υπάρχουν πληρωμές** — placeholder μόνο
- **VIN decode είναι mock** — δεν υπάρχει production compatibility database
- **QR scan δεν ενημερώνει stock** — UI μόνο
- **Οι ενέργειες (τιμές, αποδοχές, μηνύματα) χάνονται με reload**

### Καλύτερο επόμενο βήμα

Εκτελέστε το pilot demo με 1–2 πωλητές ή συνεργεία. Συλλέξτε feedback με το `PILOT_FEEDBACK_CHECKLIST.md`. Αν η ροή επικυρωθεί, ξεκινήστε backend integration από το §8 — αρχίζοντας με read requests και create request.

---

*Αρχείο για manual review: `docs/MVP_STATUS_CHECKLIST.md`*
