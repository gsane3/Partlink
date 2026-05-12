import { mockSellers } from '@/lib/mock-data/sellers'
import { mockVerifications } from '@/lib/mock-data/verifications'
import { mockOrders } from '@/lib/mock-data/orders'
import { mockParts } from '@/lib/mock-data/parts'
import { mockBuyers } from '@/lib/mock-data/buyers'
import type { Seller, Part, Order, Buyer, VerificationRequest, VerificationStatus } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export type DocStatus = 'verified' | 'missing' | 'needs_review'

export interface DocumentCheck {
  label: string
  status: DocStatus
}

export interface AdminVerificationItem {
  seller: Seller
  verif: VerificationRequest | undefined
  partCount: number
}

export interface AdminSellerItem {
  seller: Seller
  totalParts: number
  publishedParts: number
  ordersCount: number
  stockValue: number
}

export interface AdminOrderItem {
  order: Order
  seller: Seller | undefined
  buyer: Buyer | undefined
}

export interface AdminSellerDetail {
  seller: Seller
  verif: VerificationRequest | undefined
  parts: Part[]
  orders: Order[]
}

export interface AdminStats {
  pendingVerifications: number
  approvedSellers: number
  totalSellers: number
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
}

// ─── Document status mocks ────────────────────────────────────────────────────

export function getDocumentChecks(status: VerificationStatus): DocumentCheck[] {
  if (status === 'approved') {
    return [
      { label: 'Ταυτότητα / νόμιμος εκπρόσωπος', status: 'verified' },
      { label: 'Έναρξη / στοιχεία επιχείρησης', status: 'verified' },
      { label: 'Απόδειξη έδρας', status: 'verified' },
      { label: 'IBAN / πληρωμές', status: 'verified' },
    ]
  }
  if (status === 'submitted') {
    return [
      { label: 'Ταυτότητα / νόμιμος εκπρόσωπος', status: 'verified' },
      { label: 'Έναρξη / στοιχεία επιχείρησης', status: 'needs_review' },
      { label: 'Απόδειξη έδρας', status: 'verified' },
      { label: 'IBAN / πληρωμές', status: 'missing' },
    ]
  }
  return [
    { label: 'Ταυτότητα / νόμιμος εκπρόσωπος', status: 'needs_review' },
    { label: 'Έναρξη / στοιχεία επιχείρησης', status: 'verified' },
    { label: 'Απόδειξη έδρας', status: 'missing' },
    { label: 'IBAN / πληρωμές', status: 'missing' },
  ]
}

// ─── Data helpers ─────────────────────────────────────────────────────────────

export function getAdminVerificationQueue(): AdminVerificationItem[] {
  return mockSellers.map((seller) => ({
    seller,
    verif: mockVerifications.find((v) => v.sellerId === seller.id),
    partCount: mockParts.filter((p) => p.sellerId === seller.id).length,
  }))
}

export function getAdminSellerById(sellerId: string): AdminSellerDetail | undefined {
  const seller = mockSellers.find((s) => s.id === sellerId)
  if (!seller) return undefined
  return {
    seller,
    verif: mockVerifications.find((v) => v.sellerId === sellerId),
    parts: mockParts.filter((p) => p.sellerId === sellerId),
    orders: mockOrders.filter((o) => o.sellerId === sellerId),
  }
}

export function getAdminSellers(): AdminSellerItem[] {
  return mockSellers.map((seller) => {
    const parts = mockParts.filter((p) => p.sellerId === seller.id)
    const availableParts = parts.filter((p) => p.status === 'available')
    return {
      seller,
      totalParts: parts.length,
      publishedParts: parts.filter((p) => p.isPublished).length,
      ordersCount: mockOrders.filter((o) => o.sellerId === seller.id).length,
      stockValue: availableParts.reduce((sum, p) => sum + p.price, 0),
    }
  })
}

export function getAdminOrders(): AdminOrderItem[] {
  return mockOrders.map((order) => ({
    order,
    seller: mockSellers.find((s) => s.id === order.sellerId),
    buyer: mockBuyers.find((b) => b.id === order.buyerId),
  }))
}

export function getAdminStats(): AdminStats {
  return {
    pendingVerifications: mockSellers.filter(
      (s) => s.verificationStatus === 'pending' || s.verificationStatus === 'submitted'
    ).length,
    approvedSellers: mockSellers.filter((s) => s.verificationStatus === 'approved').length,
    totalSellers: mockSellers.length,
    totalOrders: mockOrders.length,
    pendingOrders: mockOrders.filter((o) => o.status === 'pending').length,
    totalRevenue: mockOrders.reduce((sum, o) => sum + o.totalAmount, 0),
  }
}
