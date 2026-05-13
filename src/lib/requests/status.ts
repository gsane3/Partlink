// Shared request status configuration for seller and buyer perspectives.
// Status labels differ intentionally — sellers see operational terms, buyers see tracking terms.

import type { BuyerRequest, RequestStatus } from '@/lib/mock-data/buyer-requests'
import type { BadgeVariant } from '@/components/ui/badge'

// ─── Seller perspective ───────────────────────────────────────────────────────

export const SELLER_STATUS_CONFIG: Record<RequestStatus, { label: string; variant: BadgeVariant }> = {
  new:          { label: 'Νέο',              variant: 'warning' },
  needs_price:  { label: 'Χρειάζεται τιμή', variant: 'warning' },
  in_progress:  { label: 'Σε εξέλιξη',      variant: 'brand' },
  completed:    { label: 'Ολοκληρωμένο',    variant: 'muted' },
}

export function getSellerRequestStatusLabel(status: RequestStatus): string {
  return SELLER_STATUS_CONFIG[status].label
}

export function getSellerRequestVariant(status: RequestStatus): BadgeVariant {
  return SELLER_STATUS_CONFIG[status].variant
}

// ─── Buyer perspective ────────────────────────────────────────────────────────

export const BUYER_STATUS_CONFIG: Record<RequestStatus, { label: string; variant: BadgeVariant }> = {
  new:          { label: 'Στάλθηκε',       variant: 'muted' },
  needs_price:  { label: 'Αναμονή τιμής',  variant: 'warning' },
  in_progress:  { label: 'Σε εξέλιξη',     variant: 'brand' },
  completed:    { label: 'Ολοκληρωμένο',   variant: 'success' },
}

export function getBuyerRequestStatusLabel(status: RequestStatus): string {
  return BUYER_STATUS_CONFIG[status].label
}

export function getBuyerRequestVariant(status: RequestStatus): BadgeVariant {
  return BUYER_STATUS_CONFIG[status].variant
}

// ─── Request state helpers ────────────────────────────────────────────────────

export function isRequestWaitingPrice(req: BuyerRequest): boolean {
  return req.status === 'needs_price'
}

export function hasSellerResponse(req: BuyerRequest): boolean {
  return req.priceSent !== undefined || req.replyNote !== undefined
}

export function getDisplayPrice(req: BuyerRequest): number | null {
  if (req.priceSent !== undefined) return req.priceSent
  if (req.partPrice > 0) return req.partPrice
  return null
}

export function getPrimarySellerAction(status: RequestStatus): 'price' | 'reply' {
  return status === 'needs_price' ? 'price' : 'reply'
}

export function getPrimaryBuyerAction(req: BuyerRequest): 'accept_price' | 'message' {
  return req.priceSent !== undefined ? 'accept_price' : 'message'
}
