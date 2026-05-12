import { mockSellers } from '@/lib/mock-data/sellers'
import { mockParts } from '@/lib/mock-data/parts'
import { mockOrders } from '@/lib/mock-data/orders'
import { mockBuyers } from '@/lib/mock-data/buyers'
import type { Part, Order, Seller, Buyer } from '@/types'

const CURRENT_SELLER_ID = 'seller-001'

export function getCurrentSellerId(): string {
  return CURRENT_SELLER_ID
}

export function getCurrentSeller(): Seller {
  const seller = mockSellers.find((s) => s.id === CURRENT_SELLER_ID)
  if (!seller) throw new Error('Current seller not found')
  return seller
}

export function getSellerInventory(sellerId: string): Part[] {
  return mockParts.filter((p) => p.sellerId === sellerId)
}

export function getSellerOrders(sellerId: string): Order[] {
  return mockOrders.filter((o) => o.sellerId === sellerId)
}

export function getSellerPendingOrders(sellerId: string): Order[] {
  return mockOrders.filter((o) => o.sellerId === sellerId && o.status === 'pending')
}

export function getSellerDispatchOrders(sellerId: string): Order[] {
  return mockOrders.filter((o) => o.sellerId === sellerId && o.status === 'confirmed')
}

export function getSellerPartById(partId: string): Part | undefined {
  return mockParts.find((p) => p.id === partId)
}

export function getOrderById(orderId: string): Order | undefined {
  return mockOrders.find((o) => o.id === orderId)
}

export function getBuyerById(buyerId: string): Buyer | undefined {
  return mockBuyers.find((b) => b.id === buyerId)
}

export interface SellerInventoryStats {
  total: number
  available: number
  published: number
  stockValue: number
  missingQR: number
}

export function getSellerInventoryStats(sellerId: string): SellerInventoryStats {
  const parts = getSellerInventory(sellerId)
  const available = parts.filter((p) => p.status === 'available')
  return {
    total: parts.length,
    available: available.length,
    published: parts.filter((p) => p.isPublished).length,
    stockValue: available.reduce((sum, p) => sum + p.price * p.quantity, 0),
    missingQR: parts.filter((p) => !p.qrCodeId).length,
  }
}
