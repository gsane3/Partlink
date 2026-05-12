import type { OrderStatus } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChatStatus = 'active' | 'waiting' | 'closed'
export type ChatSource = 'order' | 'marketplace'

export interface ChatMessage {
  id: string
  chatId: string
  senderId: string
  senderRole: 'buyer' | 'seller'
  body: string
  sentAt: string
}

export interface ChatThread {
  id: string
  orderId?: string
  partId: string
  partName: string
  vehicleLabel: string
  buyerId: string
  buyerName: string
  sellerId: string
  sellerBusinessName: string
  orderStatus?: OrderStatus
  partPrice?: number
  lastMessage: string
  lastMessageAt: string
  unreadCountBuyer: number
  unreadCountSeller: number
  status: ChatStatus
  source: ChatSource
  messages: ChatMessage[]
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_THREADS: ChatThread[] = [
  {
    id: 'chat-001',
    orderId: 'order-001',
    partId: 'part-002',
    partName: 'Φανάρι εμπρός δεξί',
    vehicleLabel: 'Mercedes C-Class W204 2015',
    buyerId: 'buyer-001',
    buyerName: 'Νίκος Αλεξίου',
    sellerId: 'seller-001',
    sellerBusinessName: 'Μάντρα Παπαδόπουλος',
    orderStatus: 'pending',
    partPrice: 95,
    lastMessage: 'Εντάξει, ευχαριστώ!',
    lastMessageAt: '2026-05-01T12:30:00Z',
    unreadCountBuyer: 0,
    unreadCountSeller: 1,
    status: 'active',
    source: 'order',
    messages: [
      { id: 'm001', chatId: 'chat-001', senderId: 'buyer-001', senderRole: 'buyer', body: 'Γεια σας! Έκανα παραγγελία για το φανάρι. Πότε μπορεί να σταλεί;', sentAt: '2026-05-01T09:15:00Z' },
      { id: 'm002', chatId: 'chat-001', senderId: 'seller-001', senderRole: 'seller', body: 'Καλημέρα! Η παραγγελία σας ελήφθη. Θα ετοιμαστεί σήμερα και θα σταλεί αύριο το πρωί.', sentAt: '2026-05-01T09:45:00Z' },
      { id: 'm003', chatId: 'chat-001', senderId: 'buyer-001', senderRole: 'buyer', body: 'Στέλνεις με ACS;', sentAt: '2026-05-01T10:00:00Z' },
      { id: 'm004', chatId: 'chat-001', senderId: 'seller-001', senderRole: 'seller', body: "Ναι, ACS κατ' οίκον. Θα σας στείλω το tracking μόλις αποσταλεί.", sentAt: '2026-05-01T10:05:00Z' },
      { id: 'm005', chatId: 'chat-001', senderId: 'buyer-001', senderRole: 'buyer', body: 'Εντάξει, ευχαριστώ!', sentAt: '2026-05-01T12:30:00Z' },
    ],
  },
  {
    id: 'chat-002',
    partId: 'part-001',
    partName: 'Τουρμπίνα N47',
    vehicleLabel: 'BMW E90 320d 2013',
    buyerId: 'buyer-001',
    buyerName: 'Νίκος Αλεξίου',
    sellerId: 'seller-001',
    sellerBusinessName: 'Μάντρα Παπαδόπουλος',
    partPrice: 450,
    lastMessage: 'Στείλε μου στοιχεία πληρωμής',
    lastMessageAt: '2026-05-05T15:00:00Z',
    unreadCountBuyer: 0,
    unreadCountSeller: 1,
    status: 'active',
    source: 'marketplace',
    messages: [
      { id: 'm010', chatId: 'chat-002', senderId: 'buyer-001', senderRole: 'buyer', body: 'Γεια, η τουρμπίνα N47 ταιριάζει και στο E87;', sentAt: '2026-05-05T14:20:00Z' },
      { id: 'm011', chatId: 'chat-002', senderId: 'seller-001', senderRole: 'seller', body: 'Ναι, ταιριάζει σε E87, E90 και E91 με κινητήρα N47. Είναι ελεγμένη και σε πολύ καλή κατάσταση.', sentAt: '2026-05-05T14:45:00Z' },
      { id: 'm012', chatId: 'chat-002', senderId: 'buyer-001', senderRole: 'buyer', body: 'Στείλε μου στοιχεία πληρωμής', sentAt: '2026-05-05T15:00:00Z' },
    ],
  },
  {
    id: 'chat-003',
    orderId: 'order-002',
    partId: 'part-001',
    partName: 'Τουρμπίνα N47',
    vehicleLabel: 'BMW E90 320d 2013',
    buyerId: 'buyer-002',
    buyerName: 'Κωνσταντίνος Κωστόπουλος',
    sellerId: 'seller-001',
    sellerBusinessName: 'Μάντρα Παπαδόπουλος',
    orderStatus: 'dispatched',
    partPrice: 450,
    lastMessage: 'Χαρούμεθα! Καλή χρήση!',
    lastMessageAt: '2026-04-29T09:05:00Z',
    unreadCountBuyer: 0,
    unreadCountSeller: 0,
    status: 'closed',
    source: 'order',
    messages: [
      { id: 'm020', chatId: 'chat-003', senderId: 'buyer-002', senderRole: 'buyer', body: 'Γεια σας, πότε αναμένεται η παράδοση;', sentAt: '2026-04-28T11:00:00Z' },
      { id: 'm021', chatId: 'chat-003', senderId: 'seller-001', senderRole: 'seller', body: 'Εστάλη σήμερα. Tracking: ACS123456789GR. Αναμένεται αύριο.', sentAt: '2026-04-28T11:30:00Z' },
      { id: 'm022', chatId: 'chat-003', senderId: 'buyer-002', senderRole: 'buyer', body: 'Το παρέλαβα, ευχαριστώ πολύ!', sentAt: '2026-04-29T09:00:00Z' },
      { id: 'm023', chatId: 'chat-003', senderId: 'seller-001', senderRole: 'seller', body: 'Χαρούμεθα! Καλή χρήση!', sentAt: '2026-04-29T09:05:00Z' },
    ],
  },
  {
    id: 'chat-004',
    orderId: 'order-005',
    partId: 'part-003',
    partName: 'ECU / Εγκέφαλος κινητήρα',
    vehicleLabel: 'VW Golf 5 1.9 TDI 2007',
    buyerId: 'buyer-002',
    buyerName: 'Κωνσταντίνος Κωστόπουλος',
    sellerId: 'seller-001',
    sellerBusinessName: 'Μάντρα Παπαδόπουλος',
    orderStatus: 'confirmed',
    partPrice: 320,
    lastMessage: 'Ευχαριστώ! Θα σταλεί αύριο.',
    lastMessageAt: '2026-05-11T09:05:00Z',
    unreadCountBuyer: 1,
    unreadCountSeller: 0,
    status: 'active',
    source: 'order',
    messages: [
      { id: 'm030', chatId: 'chat-004', senderId: 'buyer-002', senderRole: 'buyer', body: 'Πότε μπορείτε να στείλετε το ECU;', sentAt: '2026-05-11T08:30:00Z' },
      { id: 'm031', chatId: 'chat-004', senderId: 'seller-001', senderRole: 'seller', body: 'Σήμερα το απόγευμα θα ετοιμαστεί. Χρειάζομαι τη διεύθυνσή σας.', sentAt: '2026-05-11T08:45:00Z' },
      { id: 'm032', chatId: 'chat-004', senderId: 'buyer-002', senderRole: 'buyer', body: 'Εγνατία 45, Θεσσαλονίκη 54636, τηλ. 2310987654', sentAt: '2026-05-11T09:00:00Z' },
      { id: 'm033', chatId: 'chat-004', senderId: 'seller-001', senderRole: 'seller', body: 'Ευχαριστώ! Θα σταλεί αύριο.', sentAt: '2026-05-11T09:05:00Z' },
    ],
  },
  {
    id: 'chat-005',
    partId: 'part-008',
    partName: 'Καθρέφτης αριστερός',
    vehicleLabel: 'VW Golf 5 1.9 TDI 2007',
    buyerId: 'buyer-001',
    buyerName: 'Νίκος Αλεξίου',
    sellerId: 'seller-003',
    sellerBusinessName: 'CarParts Θεσσαλονίκης',
    partPrice: 45,
    lastMessage: 'Είναι ακόμα διαθέσιμο;',
    lastMessageAt: '2026-05-08T10:45:00Z',
    unreadCountBuyer: 0,
    unreadCountSeller: 1,
    status: 'waiting',
    source: 'marketplace',
    messages: [
      { id: 'm040', chatId: 'chat-005', senderId: 'buyer-001', senderRole: 'buyer', body: 'Γεια, έχετε καθρέφτη αριστερό για Golf 5;', sentAt: '2026-05-08T10:00:00Z' },
      { id: 'm041', chatId: 'chat-005', senderId: 'seller-003', senderRole: 'seller', body: 'Ναι, έχουμε! €45 συν μεταφορικά. Ποια χρονολογία;', sentAt: '2026-05-08T10:30:00Z' },
      { id: 'm042', chatId: 'chat-005', senderId: 'buyer-001', senderRole: 'buyer', body: 'Είναι ακόμα διαθέσιμο;', sentAt: '2026-05-08T10:45:00Z' },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getBuyerChats(buyerId: string): ChatThread[] {
  return MOCK_THREADS.filter((t) => t.buyerId === buyerId)
}

export function getSellerChats(sellerId: string): ChatThread[] {
  return MOCK_THREADS.filter((t) => t.sellerId === sellerId)
}

export function getChatById(chatId: string): ChatThread | undefined {
  return MOCK_THREADS.find((t) => t.id === chatId)
}

export function getChatMessages(chatId: string): ChatMessage[] {
  return MOCK_THREADS.find((t) => t.id === chatId)?.messages ?? []
}
