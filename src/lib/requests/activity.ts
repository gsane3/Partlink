import type { BuyerRequest } from '@/lib/mock-data/buyer-requests'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ActivityTone = 'default' | 'success' | 'warning' | 'info'

export interface RequestActivityEvent {
  id: string
  title: string
  description?: string
  date?: string
  tone?: ActivityTone
}

// ─── Build base events from mock request ─────────────────────────────────────
// Returns events in chronological order (oldest first).

export function buildBaseActivityEvents(request: BuyerRequest): RequestActivityEvent[] {
  const events: RequestActivityEvent[] = []

  // Request created
  events.push({
    id: `${request.id}-created`,
    title: 'Το αίτημα στάλθηκε',
    description: `${request.buyerCompany} ζήτησε το ανταλλακτικό.`,
    date: request.createdAt,
    tone: 'default',
  })

  // Seller sent price
  if (request.priceSent !== undefined) {
    events.push({
      id: `${request.id}-price-sent`,
      title: 'Τιμή στάλθηκε',
      description: `Ο πωλητής έστειλε τιμή ${request.priceSent.toLocaleString('el-GR', { style: 'currency', currency: 'EUR' })}.`,
      date: request.priceSentAt,
      tone: 'info',
    })
  }

  // Seller reply
  if (request.replyNote) {
    events.push({
      id: `${request.id}-reply`,
      title: 'Απάντηση πωλητή',
      description: request.replyNote,
      date: request.replyNoteAt,
      tone: 'info',
    })
  }

  // Completed
  if (request.status === 'completed') {
    events.push({
      id: `${request.id}-completed`,
      title: 'Ολοκληρώθηκε',
      description: 'Το αίτημα ολοκληρώθηκε στο demo.',
      tone: 'success',
    })
  }

  return events
}
