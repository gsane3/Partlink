import type { BuyerRequest } from '@/lib/mock-data/buyer-requests'

export type RequestMessageAuthor = 'buyer' | 'seller'

export interface RequestMessage {
  id: string
  author: RequestMessageAuthor
  authorLabel: string
  body: string
  createdAt?: string
}

// Returns messages in chronological order (oldest first).
// Does not include priceSent — price has its own card and timeline event.
export function buildBaseRequestMessages(request: BuyerRequest): RequestMessage[] {
  const messages: RequestMessage[] = []

  if (request.message) {
    messages.push({
      id: `${request.id}-msg-buyer`,
      author: 'buyer',
      authorLabel: request.buyerCompany,
      body: request.message,
      createdAt: request.createdAt,
    })
  }

  if (request.replyNote) {
    messages.push({
      id: `${request.id}-msg-seller`,
      author: 'seller',
      authorLabel: request.sellerName ?? 'Πωλητής',
      body: request.replyNote,
      createdAt: request.replyNoteAt,
    })
  }

  return messages
}
