# Partlink Backend Handoff Spec

Έκδοση: 1.0 — 2026-05-14

---

## 1. Σκοπός

Αυτό το έγγραφο μεταφράζει τη σημερινή request-first ροή του Partlink MVP από mock/local state σε πρόταση backend data model και API plan, που μπορεί να υλοποιηθεί αργότερα από backend developer.

Δεν περιέχει backend κώδικα ή migration scripts. Αποτυπώνει αυτό που υπάρχει στο frontend σήμερα και τι χρειάζεται για να αντικατασταθεί με πραγματικό backend.

---

## 2. Σύνοψη τρέχουσας MVP ροής

Η βασική ροή:

```
Αγοραστής βρίσκει ανταλλακτικό στο marketplace
→ Ανοίγει φόρμα αιτήματος (request sheet)
→ Στέλνει αίτημα με μήνυμα, επιλογή παράδοσης και στοιχεία προφίλ
→ Πωλητής λαμβάνει αίτημα
→ Πωλητής απαντά: στέλνει τιμή ή κείμενο απάντησης
→ Αγοραστής βλέπει τιμή και αποδέχεται
→ Επόμενο βήμα: παραλαβή ή αποστολή (δεν έχει υλοποιηθεί ακόμα)
```

Το αίτημα συνδέεται πάντα με συγκεκριμένο ανταλλακτικό (listing/part). Δεν υπάρχει ανεξάρτητο αίτημα χωρίς αναφορά σε ανταλλακτικό.

---

## 3. Τρέχουσες mock πηγές στο frontend

Όλα τα δεδομένα είναι **τοπικά**. Δεν υπάρχει backend, βάση δεδομένων ή αυθεντικοποίηση. Οι ενέργειες (αποδοχή τιμής, αποστολή τιμής) γίνονται reset με κάθε reload.

| Αρχείο | Περιεχόμενο |
|--------|-------------|
| `src/lib/mock-data/buyer-requests.ts` | `mockBuyerRequests` — 6 αιτήματα με διαφορετικά statuses. Ορίζει `BuyerRequest`, `RequestStatus`, `DeliveryPreference`. |
| `src/lib/mock-data/profiles.ts` | `currentBuyerProfile`, `currentSellerProfile` — mock προφίλ αγοραστή και πωλητή. Χρησιμοποιούνται στο request sheet και στη λεπτομέρεια αγοραστή. |
| `src/lib/requests/status.ts` | Ορίζει labels και badge variants για αγοραστή και πωλητή ανά status. Helper functions για state checks. |
| `src/lib/requests/delivery.ts` | Labels για τις επιλογές παράδοσης: `pickup`, `shipping`, `unknown`. |
| `src/lib/requests/counts.ts` | Αριθμός ανοιχτών αιτημάτων για πωλητή και αριθμός αιτημάτων που χρειάζονται ενέργεια αγοραστή. |
| `src/lib/requests/activity.ts` | `buildBaseActivityEvents` — δημιουργεί events από mock request (δημιουργία, τιμή, απάντηση, ολοκλήρωση). |
| `src/lib/requests/messages.ts` | `buildBaseRequestMessages` — δημιουργεί μηνύματα από mock request (αρχικό μήνυμα αγοραστή, απάντηση πωλητή). |
| `src/lib/requests/conversations.ts` | `getRequestConversations` — συνδυάζει requests και messages για λίστα συνομιλιών. |

Τοπικές ενέργειες που **δεν αποθηκεύονται**:

- `request-inbox.tsx`: αποστολή τιμής, απάντηση, mark available/unavailable — όλα local component state
- `request-detail-screen.tsx`: ίδιο, συν localEvents και localMessages που χάνονται με navigation
- `buyer-request-list.tsx`: αποδοχή τιμής, αποστολή μηνύματος — local state
- `buyer-request-detail.tsx`: αποδοχή τιμής, αποστολή μηνύματος — local state, localEvents, localMessages
- `request-sheet.tsx`: submit αιτήματος — απλώς δείχνει success state, δεν αποθηκεύει τίποτα

---

## 4. Βασικές οντότητες backend

### 4.1 `users`

**Σκοπός:** Βασικός πίνακας αυθεντικοποίησης. Διαχειρίζεται το Supabase Auth.

**Βασικά πεδία:**
- `id` (uuid)
- `email`
- `role`: `seller_owner` | `seller_employee` | `buyer_owner` | `buyer_employee` | `admin`
- `created_at`

**Σχέσεις:** Ένα user έχει ένα buyer_profile ή seller_profile, ανάλογα με τον ρόλο.

---

### 4.2 `buyer_profiles`

**Σκοπός:** Στοιχεία αγοραστή που στέλνονται μαζί με κάθε αίτημα.

**Βασικά πεδία:**
- `id`
- `user_id` (FK → users)
- `company_name`
- `contact_name`
- `phone`
- `email`
- `city`
- `address`
- `postal_code`
- `verification_status`: `approved` | `pending` | `rejected`
- `document_preference`: `invoice` | `receipt`

**Σχέσεις:** Ένα προφίλ ανά buyer user. Τα στοιχεία αντιγράφονται (snapshot) στο αίτημα κατά τη δημιουργία.

**Mock σημείωση:** Τώρα `currentBuyerProfile` στο `profiles.ts` — hardcoded, χωρίς auth.

---

### 4.3 `seller_profiles`

**Σκοπός:** Στοιχεία πωλητή — μάντρα ή προμηθευτής.

**Βασικά πεδία:**
- `id`
- `user_id` (FK → users)
- `business_name`
- `contact_name`
- `phone`
- `email`
- `city`
- `address`
- `verification_status`: `approved` | `pending` | `rejected`

**Σχέσεις:** Ένα προφίλ ανά seller user. Συνδέεται με parts και marketplace_listings.

**Mock σημείωση:** Τώρα `currentSellerProfile` στο `profiles.ts` — hardcoded.

---

### 4.4 `parts`

**Σκοπός:** Το ανταλλακτικό στο stock του πωλητή. Πυρήνας της inventory-first λογικής.

**Βασικά πεδία:**
- `id`
- `seller_id` (FK → seller_profiles)
- `sku` (μοναδικό)
- `name`
- `category`
- `condition`
- `price`
- `donor_vehicle` (make, model, year, engine — denormalized ή FK σε vehicles)
- `status`: `draft` | `available` | `reserved` | `sold` | `shipped` | `delivered` | `deleted`
- `has_photo`
- `marketplace_visible`
- `qr_code_id` (FK → qr_codes)
- `created_at`

**Σχέσεις:** Ένα part ανήκει σε ένα seller_profile. Δημιουργεί ένα marketplace_listing αν `marketplace_visible = true`.

**Mock σημείωση:** Τα `partId`, `partName`, `partSku`, `partPrice`, `donorVehicle` στο `BuyerRequest` είναι denormalized από αυτόν τον πίνακα.

---

### 4.5 `marketplace_listings`

**Σκοπός:** Η δημόσια εμφάνιση του ανταλλακτικού στο marketplace. Πάντα συνδεδεμένη με inventory record.

**Βασικά πεδία:**
- `id`
- `part_id` (FK → parts)
- `seller_id` (FK → seller_profiles)
- `is_active`
- `published_at`

**Σχέσεις:** Ένα listing ανά part (όχι ανεξάρτητες αγγελίες). Ο αγοραστής βλέπει το listing — το αίτημα συνδέεται με part_id.

---

### 4.6 `buyer_requests`

**Σκοπός:** Το κεντρικό αίτημα αγοραστή για ένα ανταλλακτικό. Αντιστοιχεί στο `BuyerRequest` interface του frontend.

**Βασικά πεδία:**
- `id`
- `part_id` (FK → parts)
- `listing_id` (FK → marketplace_listings)
- `buyer_id` (FK → buyer_profiles)
- `seller_id` (FK → seller_profiles)
- `status`: `new` | `needs_price` | `in_progress` | `price_sent` | `price_accepted` | `completed` | `cancelled` | `unavailable`
- `message` — αρχικό μήνυμα αγοραστή
- `delivery_preference`: `pickup` | `shipping` | `unknown`
- `created_at`
- Snapshot πεδία (αντιγράφονται κατά τη δημιουργία):
  - `buyer_company_snapshot`
  - `buyer_contact_snapshot`
  - `buyer_phone_snapshot`
  - `buyer_email_snapshot`
  - `buyer_city_snapshot`
  - `part_name_snapshot`
  - `part_sku_snapshot`
  - `part_price_snapshot`
  - `donor_vehicle_snapshot`

**Σχέσεις:** Ένα αίτημα → ένα part, ένας αγοραστής, ένας πωλητής. Πολλά μηνύματα, events, price_offers.

**Mock σημείωση:** Αντιστοιχεί απευθείας στο `mockBuyerRequests`. Τα snapshot πεδία προέρχονται από `BuyerProfile` και `BuyerRequest` properties.

---

### 4.7 `request_messages`

**Σκοπός:** Μηνύματα μεταξύ αγοραστή και πωλητή για συγκεκριμένο αίτημα.

**Βασικά πεδία:**
- `id`
- `request_id` (FK → buyer_requests)
- `sender_id` (FK → users)
- `sender_role`: `buyer` | `seller`
- `body`
- `created_at`
- `read_at` (null = αδιάβαστο)

**Σχέσεις:** Πολλά μηνύματα ανά αίτημα. Χρονολογική σειρά.

**Mock σημείωση:** Τώρα `buildBaseRequestMessages()` στο `messages.ts` — δημιουργεί messages από `request.message` (αγοραστής) και `request.replyNote` (πωλητής).

---

### 4.8 `request_activity_events`

**Σκοπός:** Αμετάβλητο ιστορικό ενεργειών για κάθε αίτημα. Append-only.

**Βασικά πεδία:**
- `id`
- `request_id` (FK → buyer_requests)
- `event_type`: βλ. §8
- `title`
- `description`
- `tone`: `default` | `success` | `warning` | `info`
- `triggered_by`: `user` | `system`
- `actor_id` (FK → users, nullable για system events)
- `created_at`

**Σχέσεις:** Πολλά events ανά αίτημα. Δεν διαγράφονται.

**Mock σημείωση:** Τώρα `buildBaseActivityEvents()` στο `activity.ts` — δημιουργεί events από mock data. Τα local events (π.χ. από seller actions) χάνονται με navigation.

---

### 4.9 `request_price_offers`

**Σκοπός:** Τιμή που στέλνει ο πωλητής σε απάντηση αιτήματος.

**Βασικά πεδία:**
- `id`
- `request_id` (FK → buyer_requests)
- `seller_id` (FK → seller_profiles)
- `amount`
- `note` — προαιρετικό μήνυμα πωλητή
- `created_at`
- `accepted_at` (null = δεν έχει αποδεχτεί ακόμα)
- `is_active` — αν υπάρχουν πολλές τιμές, μόνο μία ενεργή

**Σχέσεις:** Ένα ή περισσότερα price offers ανά αίτημα. Συνδέεται με status `price_sent` → `price_accepted`.

**Mock σημείωση:** Τώρα `request.priceSent` και `request.priceSentAt` — inline πεδία στο `BuyerRequest`.

---

### 4.10 `request_delivery_preferences`

**Σκοπός:** Λεπτομέρειες αποστολής όταν ο αγοραστής αποδεχτεί τιμή.

**Βασικά πεδία:**
- `id`
- `request_id` (FK → buyer_requests)
- `preference`: `pickup` | `shipping`
- `shipping_address` (nullable — από buyer profile snapshot ή ξεχωριστή εισαγωγή)
- `pickup_instructions` (nullable)
- `courier_name` (nullable — μελλοντικό)
- `tracking_number` (nullable — μελλοντικό)
- `delivery_status` (nullable — μελλοντικό)

**Mock σημείωση:** Τώρα `request.delivery` — απλό string πεδίο. Η πλήρης διεύθυνση αποθηκεύεται μόνο αν `delivery === 'shipping'`, μέσω buyer profile.

---

### 4.11 `verification_requests`

**Σκοπός:** Αιτήσεις επαλήθευσης επαγγελματιών (πωλητές, business buyers).

**Βασικά πεδία:**
- `id`
- `user_id` (FK → users)
- `role`: `seller` | `buyer`
- `business_name`
- `afm`
- `doy`
- `phone`
- `address`
- `website` (nullable)
- `status`: `pending` | `approved` | `rejected` | `needs_more_info`
- `admin_note` (nullable)
- `submitted_at`
- `reviewed_at` (nullable)
- `reviewed_by` (FK → users, nullable)

**Σχέσεις:** Ένα verification request ανά user (ή ένα ανά επανυποβολή αν επιτραπεί).

---

### 4.12 `admin_review_items`

**Σκοπός:** Αναφερθέντα θέματα / soft disputes από αγοραστές ή πωλητές.

**Βασικά πεδία:**
- `id`
- `request_id` (FK → buyer_requests, nullable)
- `reporter_id` (FK → users)
- `subject`
- `description`
- `status`: `open` | `closed`
- `admin_note` (nullable)
- `created_at`
- `closed_at` (nullable)

**Σχέσεις:** Προαιρετική σύνδεση με αίτημα. Δεν αντικαθιστά νομική διαδικασία — είναι εργαλείο admin review για το MVP.

---

## 5. Μοντέλο κατάστασης αιτήματος

### Statuses

| Status | Ελληνικά UI | Σε ποιον εμφανίζεται | Τρέχουσα κατάσταση |
|--------|-------------|----------------------|--------------------|
| `new` | Νέο / Στάλθηκε | Πωλητής (Νέο), Αγοραστής (Στάλθηκε) | Υπάρχει στο mock |
| `needs_price` | Χρειάζεται τιμή / Αναμονή τιμής | Πωλητής, Αγοραστής | Υπάρχει στο mock |
| `in_progress` | Σε εξέλιξη | Πωλητής, Αγοραστής | Υπάρχει στο mock |
| `price_sent` | Τιμή στάλθηκε | Πωλητής, Αγοραστής | **Δεν υπάρχει ως ξεχωριστό status** — τώρα inline field `priceSent` |
| `price_accepted` | Τιμή αποδέχτηκε | Πωλητής, Αγοραστής | **Δεν υπάρχει** — τώρα local state `priceAccepted` |
| `completed` | Ολοκληρωμένο | Πωλητής, Αγοραστής | Υπάρχει στο mock |
| `cancelled` | Ακυρώθηκε | Πωλητής, Αγοραστής | **Δεν υπάρχει ακόμα** |
| `unavailable` | Δεν είναι διαθέσιμο | Πωλητής, Αγοραστής | Τώρα: mark unavailable → status `completed` |

### Μεταβάσεις

```
new
  → in_progress    (πωλητής: mark available)
  → needs_price    (πωλητής: αίτημα χωρίς τιμή)
  → unavailable    (πωλητής: mark unavailable)
  → cancelled      (αγοραστής: ακύρωση — μελλοντικό)

needs_price
  → price_sent     (πωλητής: αποστολή τιμής)
  → unavailable    (πωλητής: mark unavailable)

in_progress
  → price_sent     (πωλητής: αποστολή τιμής)
  → completed      (χειροκίνητα ή μελλοντικά αυτόματα)

price_sent
  → price_accepted (αγοραστής: αποδοχή τιμής)
  → cancelled      (αγοραστής: απόρριψη — μελλοντικό)

price_accepted
  → completed      (μετά από παραλαβή/αποστολή — μελλοντικό)
```

---

## 6. Μοντέλο παράδοσης

### Τρέχουσες επιλογές

| Τιμή | Ελληνικά | Τρέχουσα κατάσταση |
|------|----------|---------------------|
| `pickup` | Παραλαβή από κατάστημα | Υπάρχει στο mock |
| `shipping` | Αποστολή | Υπάρχει στο mock |
| `unknown` | Δεν ξέρω ακόμα | Υπάρχει στο mock |

### Μελλοντικά πεδία (δεν υπάρχουν ακόμα)

| Πεδίο | Σκοπός |
|-------|--------|
| `shipping_address` | Snapshot διεύθυνσης παράδοσης από buyer profile |
| `courier_name` | Ό,τι courier επιλεγεί — π.χ. ACS, ELTA |
| `tracking_number` | Αριθμός αποστολής — εισάγεται χειροκίνητα ή μελλοντικά μέσω courier API |
| `pickup_instructions` | Οδηγίες για παραλαβή από μάντρα |
| `delivery_status` | `pending` | `dispatched` | `delivered` | `failed` |

**Σημείωση:** Courier API δεν είναι στόχος του πρώτου backend pass.

---

## 7. Μοντέλο μηνυμάτων

Τα μηνύματα είναι ανά αίτημα. Δεν υπάρχει γενικό chat — μόνο επικοινωνία για συγκεκριμένο αίτημα.

### Πεδία `request_messages`

| Πεδίο | Σκοπός |
|-------|--------|
| `request_id` | Σύνδεση με αίτημα |
| `sender_id` | Ο χρήστης που έστειλε |
| `sender_role` | `buyer` ή `seller` — για εμφάνιση στο UI |
| `body` | Κείμενο μηνύματος |
| `read_at` | Null αν δεν έχει διαβαστεί |
| `created_at` | Χρονική σειρά |

### Κανόνες

- Τα μηνύματα δεν διαγράφονται στο MVP.
- Τα μηνύματα δεν περιέχουν attachments στο MVP — μελλοντικό.
- Η αρχική εισαγωγή αγοραστή (`request.message`) δημιουργεί το πρώτο μήνυμα αυτόματα.
- Το `replyNote` του πωλητή (τώρα inline field στο mock) γίνεται ξεχωριστό μήνυμα.

**Τρέχουσα κατάσταση:** `buildBaseRequestMessages()` δημιουργεί messages από mock fields. Τα local messages (που δημιουργεί ο χρήστης στο detail screen) χάνονται με navigation.

---

## 8. Μοντέλο activity timeline

### Event types

| Τύπος | Ελληνικά | Πηγή |
|-------|----------|-------|
| `request_created` | Το αίτημα στάλθηκε | Ενέργεια χρήστη (αγοραστής) |
| `seller_replied` | Απάντηση πωλητή | Ενέργεια χρήστη (πωλητής) |
| `price_sent` | Τιμή στάλθηκε | Ενέργεια χρήστη (πωλητής) |
| `price_accepted` | Τιμή αποδέχτηκε | Ενέργεια χρήστη (αγοραστής) |
| `availability_confirmed` | Διαθεσιμότητα επιβεβαιώθηκε | Ενέργεια χρήστη (πωλητής) |
| `marked_unavailable` | Δεν είναι διαθέσιμο | Ενέργεια χρήστη (πωλητής) |
| `delivery_selected` | Τρόπος παράδοσης επιλέχθηκε | Ενέργεια χρήστη (αγοραστής) |
| `completed` | Ολοκληρώθηκε | Σύστημα ή χειροκίνητα |
| `admin_review_added` | Admin σημείωση | Ενέργεια admin |

### Κανόνες

- Τα events είναι append-only. Δεν τροποποιούνται.
- Κάθε status αλλαγή δημιουργεί αυτόματα event (system-triggered).
- Ο χρόνος είναι server-side — δεν εμπιστευόμαστε client timestamps για events.

**Τρέχουσα κατάσταση:** `buildBaseActivityEvents()` δημιουργεί events από mock data. Τα local events (π.χ. από seller actions) αποθηκεύονται σε `useState` και χάνονται με navigation.

---

## 9. API plan

Πρόταση REST-style endpoints ή Supabase RPC. Όλα απαιτούν authenticated user εκτός αν αναφέρεται διαφορετικά.

### Αγοραστής

```
GET    /api/buyer/requests
       → Λίστα αιτημάτων του authenticated buyer
       → Φίλτρα: status, has_price

GET    /api/buyer/requests/:id
       → Λεπτομέρειες αιτήματος (συμπεριλαμβανομένων messages και events)

POST   /api/buyer/requests
       → Δημιουργία νέου αιτήματος
       → Body: part_id, message, delivery_preference
       → Σύστημα: αντιγράφει buyer profile snapshot, δημιουργεί event request_created

POST   /api/buyer/requests/:id/accept-price
       → Αποδοχή τιμής
       → Σύστημα: status → price_accepted, δημιουργεί event price_accepted

POST   /api/buyer/requests/:id/messages
       → Αποστολή μηνύματος στον πωλητή
       → Body: body
```

### Πωλητής

```
GET    /api/seller/requests
       → Λίστα αιτημάτων για τα listings του authenticated seller
       → Φίλτρα: status

GET    /api/seller/requests/:id
       → Λεπτομέρειες αιτήματος

POST   /api/seller/requests/:id/send-price
       → Αποστολή τιμής
       → Body: amount, note (optional)
       → Σύστημα: δημιουργεί price_offer, status → price_sent, event price_sent

POST   /api/seller/requests/:id/reply
       → Αποστολή μηνύματος/απάντησης
       → Body: body
       → Σύστημα: δημιουργεί message, event seller_replied

POST   /api/seller/requests/:id/mark-unavailable
       → Σήμανση ως μη διαθέσιμο
       → Σύστημα: status → unavailable, event marked_unavailable

POST   /api/seller/requests/:id/mark-completed
       → Χειροκίνητη ολοκλήρωση
       → Σύστημα: status → completed, event completed
```

### Admin

```
GET    /api/admin/requests
       → Λίστα όλων των αιτημάτων πλατφόρμας
       → Φίλτρα: status, seller_id, buyer_id, date_range

GET    /api/admin/listings
       → Λίστα marketplace listings
       → Φίλτρα: seller_id, is_active, category

GET    /api/admin/verifications
       → Λίστα verification requests
       → Φίλτρα: status, role

GET    /api/admin/verifications/:id
POST   /api/admin/verifications/:id/approve
POST   /api/admin/verifications/:id/reject

GET    /api/admin/review-items
       → Λίστα αναφερθέντων θεμάτων
       → Φίλτρα: status

GET    /api/admin/reports/summary
       → Συνοπτικά στοιχεία: αιτήματα ανά status, νέοι χρήστες, ενεργά listings
       → Δεν περιέχει έσοδα ή πληρωμές στο πρώτο pass

GET    /api/admin/users
GET    /api/admin/buyers
GET    /api/admin/sellers
       → Λίστες χρηστών με φίλτρα
```

---

## 10. Σχέδιο μετάβασης frontend

Αντικατάσταση mock/local data σε φάσεις, χωρίς να σπάσει το demo.

### Φάση 1 — Ανάγνωση αιτημάτων από backend

- Αντικατάσταση `mockBuyerRequests` με `GET /api/buyer/requests` και `GET /api/seller/requests`
- Αντικατάσταση `findBuyerRequestById` με `GET /api/buyer/requests/:id` / `GET /api/seller/requests/:id`
- Το UI παραμένει ίδιο

### Φάση 2 — Δημιουργία αιτήματος από request sheet

- Αντικατάσταση `handleSubmit` στο `request-sheet.tsx` με `POST /api/buyer/requests`
- Αντικατάσταση `getCurrentBuyerProfile()` (mock) με αυθεντικοποιημένο buyer profile

### Φάση 3 — Μηνύματα και activity timeline

- Αντικατάσταση `buildBaseRequestMessages` / `buildBaseActivityEvents` με δεδομένα από backend
- Αντικατάσταση local message state με `POST /api/*/requests/:id/messages`
- Local events γίνονται server events που επιστρέφονται με το request detail

### Φάση 4 — Ενέργειες πωλητή

- Αντικατάσταση `handleSubmitPrice`, `handleSubmitReply`, `handleMarkAvailable`, `handleMarkUnavailable` στα seller components με αντίστοιχα POST endpoints
- Αντικατάσταση local state updates με re-fetch από backend

### Φάση 5 — Admin monitoring

- Σύνδεση admin screens (`/admin/orders`, `/admin/verifications`, `/admin/reports` κτλ.) με admin endpoints
- Αντικατάσταση mock data στα admin components

### Φάση 6 — Auth, roles, permissions

- Ενεργοποίηση Supabase Auth
- Κάθε session παρέχει `user.id` και `user.role`
- Route-level guards: buyer routes απαιτούν `buyer_*` role, seller routes `seller_*`, admin routes `admin`

---

## 11. Δικαιώματα και ρόλοι

### Buyer

- Βλέπει μόνο τα δικά του αιτήματα (`buyer_id = auth.user.id`)
- Στέλνει αιτήματα για listings που είναι ενεργά
- Αποδέχεται τιμή μόνο σε δικό του αίτημα
- Στέλνει μηνύματα μόνο σε δικό του αίτημα

### Seller

- Βλέπει μόνο αιτήματα για δικά του listings (`seller_id = auth.user.id`)
- Στέλνει τιμή / απάντηση μόνο σε αίτημα που του ανήκει
- Δεν βλέπει αιτήματα άλλων πωλητών

### Admin

- Βλέπει όλα τα αιτήματα, listings, users, verifications
- Δεν έχει πρόσβαση σε private messages by default — μόνο αν αναφερθεί θέμα
- Εγκρίνει/απορρίπτει verifications

### Δημόσια πρόσβαση

- Marketplace listings: public read
- Part detail: public read
- Αίτημα: **δεν είναι δημόσιο** — απαιτεί auth

---

## 12. Βασικοί κανόνες backend

1. **Αίτημα πάντα συνδεδεμένο με listing/part.** Δεν επιτρέπεται αίτημα χωρίς έγκυρο `part_id` και `listing_id`.

2. **Price offer πάντα συνδεδεμένο με αίτημα.** Δεν στέλνεις τιμή χωρίς `request_id`.

3. **Αποδοχή τιμής → δημιουργία sale record αργότερα.** Το `price_accepted` status είναι το ορόσημο. Το πλήρες order/sale record δημιουργείται στο επόμενο pass, μετά την παραλαβή/αποστολή.

4. **Activity events: append-only.** Δεν τροποποιούνται, δεν διαγράφονται. Κάθε status αλλαγή γεννά event αυτόματα.

5. **Μηνύματα: δεν διαγράφονται στο MVP.** Soft delete μόνο αν αποφασιστεί αργότερα.

6. **Buyer/seller profile snapshots αποθηκεύονται στο αίτημα κατά τη δημιουργία.** Αν ο χρήστης αλλάξει στοιχεία αργότερα, το αίτημα κρατά τα στοιχεία που ίσχυαν κατά την αποστολή.

7. **Sellers χωρίς approved verification δεν λαμβάνουν αιτήματα.** Τα listings τους δεν εμφανίζονται στο marketplace.

---

## 13. Εκτός εύρους για τον πρώτο backend pass

Τα παρακάτω δεν είναι στόχος του πρώτου backend pass. Μην υποσχεθείτε τα σε pilot ή επενδυτή.

| Λειτουργία | Τρέχουσα κατάσταση |
|-----------|-------------------|
| Πληρωμές | Δεν υπάρχουν. Τα payment UI options είναι placeholder. |
| Courier API | Δεν υπάρχει. Το tracking number εισάγεται χειροκίνητα αργότερα. |
| Αυτόματη τιμολόγηση (MyData) | Δεν υπάρχει. |
| VIN compatibility database | Δεν υπάρχει. Η αποκωδικοποίηση VIN είναι mock. |
| Αξιολογήσεις / ratings | Δεν υπάρχουν. |
| Συνδρομές / billing | Δεν υπάρχουν. |
| Νομική διαδικασία disputes | Δεν υπάρχει. Το admin review είναι soft. |
| Real-time notifications | Δεν υπάρχουν. Polling ή Supabase Realtime αργότερα. |
| Native mobile app | Δεν υπάρχει. Browser-based μόνο. |

---

## 14. Ανοιχτά ερωτήματα

Ερωτήματα που χρειάζονται απόφαση πριν ή κατά την υλοποίηση:

1. **Πότε ακριβώς το `price_accepted` γίνεται order;**
   Χρειάζεται να οριστεί αν το sale record δημιουργείται αυτόματα με το `price_accepted` ή μετά από QR scan αποστολής.

2. **Μπορεί ο πωλητής να στείλει πολλές τιμές;**
   Τώρα το UI επιτρέπει "Αλλαγή τιμής". Χρειάζεται να αποφασιστεί αν κρατάμε ιστορικό ή μόνο την τελευταία ενεργή τιμή.

3. **Λήγει το αίτημα αν δεν υπάρξει απάντηση;**
   Χρειάζεται expiry λογική (π.χ. μετά από 30 μέρες χωρίς απάντηση → `cancelled`);

4. **Βλέπει ο admin τα private messages by default ή μόνο σε dispute;**
   Απόφαση για privacy policy και admin permissions.

5. **Ποια πεδία είναι υποχρεωτικά για το pilot yard;**
   Π.χ. απαιτείται η πλήρης διεύθυνση αποστολής πριν ή μετά την αποδοχή τιμής;

6. **Ποιος κλείνει το αίτημα ως completed;**
   Ο πωλητής μετά από QR scan, ο αγοραστής μετά από παραλαβή, ή και τα δύο;

---

## 15. Checklist υλοποίησης

Βήμα-βήμα για backend developer:

**Database (Supabase)**
- [ ] Δημιουργία πινάκων: `users`, `buyer_profiles`, `seller_profiles`
- [ ] Δημιουργία πινάκων: `parts`, `marketplace_listings`
- [ ] Δημιουργία πίνακα `buyer_requests` με snapshot πεδία
- [ ] Δημιουργία πινάκων: `request_messages`, `request_activity_events`
- [ ] Δημιουργία πίνακα `request_price_offers`
- [ ] Δημιουργία πίνακα `request_delivery_preferences`
- [ ] Δημιουργία πίνακων: `verification_requests`, `admin_review_items`
- [ ] Row Level Security (RLS) ανά πίνακα και ρόλο

**Auth**
- [ ] Ενεργοποίηση Supabase Auth
- [ ] Custom claims για `role` (seller / buyer / admin)
- [ ] Middleware σε Next.js για route protection

**API — Buyer**
- [ ] `GET /api/buyer/requests`
- [ ] `GET /api/buyer/requests/:id`
- [ ] `POST /api/buyer/requests` (δημιουργία, snapshot, event)
- [ ] `POST /api/buyer/requests/:id/accept-price`
- [ ] `POST /api/buyer/requests/:id/messages`

**API — Seller**
- [ ] `GET /api/seller/requests`
- [ ] `GET /api/seller/requests/:id`
- [ ] `POST /api/seller/requests/:id/send-price`
- [ ] `POST /api/seller/requests/:id/reply`
- [ ] `POST /api/seller/requests/:id/mark-unavailable`
- [ ] `POST /api/seller/requests/:id/mark-completed`

**API — Admin**
- [ ] `GET /api/admin/requests`
- [ ] `GET /api/admin/listings`
- [ ] `GET /api/admin/verifications` + approve/reject
- [ ] `GET /api/admin/review-items`
- [ ] `GET /api/admin/reports/summary`
- [ ] `GET /api/admin/users`, `buyers`, `sellers`

**Frontend migration**
- [ ] Φάση 1: αντικατάσταση mock data με API reads
- [ ] Φάση 2: request creation από request sheet
- [ ] Φάση 3: messages και events από backend
- [ ] Φάση 4: seller actions
- [ ] Φάση 5: admin screens
- [ ] Φάση 6: auth + roles

---

*Αρχείο για manual review: `docs/BACKEND_HANDOFF_SPEC.md`*
