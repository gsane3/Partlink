import { mockBuyers } from '@/lib/mock-data/buyers'
import { mockOrders } from '@/lib/mock-data/orders'
import { mockSellers } from '@/lib/mock-data/sellers'
import type { Buyer, Order, Seller } from '@/types'

const CURRENT_BUYER_ID = 'buyer-001'

export function getCurrentBuyerId(): string {
  return CURRENT_BUYER_ID
}

export function getCurrentBuyer(): Buyer {
  const buyer = mockBuyers.find((b) => b.id === CURRENT_BUYER_ID)
  if (!buyer) throw new Error('Current buyer not found')
  return buyer
}

export function getBuyerOrders(buyerId: string): Order[] {
  return mockOrders.filter((o) => o.buyerId === buyerId)
}

export function getBuyerOrderById(orderId: string, buyerId: string): Order | undefined {
  return mockOrders.find((o) => o.id === orderId && o.buyerId === buyerId)
}

export function getSellerById(sellerId: string): Seller | undefined {
  return mockSellers.find((s) => s.id === sellerId)
}
