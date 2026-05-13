import { mockBuyerRequests } from '@/lib/mock-data/buyer-requests'

// Requests the seller needs to act on (new or needs_price).
export function getSellerOpenRequestCount(): number {
  return mockBuyerRequests.filter(
    (r) => r.status === 'new' || r.status === 'needs_price'
  ).length
}

// Requests where the seller responded and the buyer still needs to act
// (has price or reply, not yet completed). Each request counted once.
export function getBuyerActionRequestCount(): number {
  return mockBuyerRequests.filter(
    (r) => r.status !== 'completed' &&
           (r.priceSent !== undefined || r.replyNote !== undefined)
  ).length
}
