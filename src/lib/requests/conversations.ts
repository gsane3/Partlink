import { mockBuyerRequests } from '@/lib/mock-data/buyer-requests'
import type { RequestStatus } from '@/lib/mock-data/buyer-requests'
import { buildBaseRequestMessages } from '@/lib/requests/messages'

export interface RequestConversation {
  id: string
  requestId: string
  partName: string
  partSku: string
  sellerName: string
  buyerCompany: string
  buyerContact?: string
  lastMessage: string
  lastMessageAt: string
  hasSellerReply: boolean
  hasPriceSent: boolean
  status: RequestStatus
}

export function getRequestConversations(): RequestConversation[] {
  return mockBuyerRequests.map((request) => {
    const messages = buildBaseRequestMessages(request)
    const lastMsg = messages[messages.length - 1]
    return {
      id: request.id,
      requestId: request.id,
      partName: request.partName,
      partSku: request.partSku,
      sellerName: request.sellerName ?? 'Πωλητής',
      buyerCompany: request.buyerCompany,
      buyerContact: request.buyerContact,
      lastMessage: lastMsg?.body ?? request.message,
      lastMessageAt: lastMsg?.createdAt ?? request.createdAt,
      hasSellerReply: !!request.replyNote,
      hasPriceSent: !!request.priceSent,
      status: request.status,
    }
  })
}
