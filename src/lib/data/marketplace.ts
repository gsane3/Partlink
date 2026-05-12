import { mockParts } from '@/lib/mock-data/parts'
import { mockSellers } from '@/lib/mock-data/sellers'
import type { Part, Seller } from '@/types'

export interface MarketplaceItem {
  part: Part
  seller: Seller | undefined
}

// Only published, available parts appear in the marketplace.
export function getMarketplaceParts(): MarketplaceItem[] {
  return mockParts
    .filter((p) => p.isPublished && p.status === 'available')
    .map((part) => ({
      part,
      seller: mockSellers.find((s) => s.id === part.sellerId),
    }))
}

export function getMarketplacePartById(partId: string): MarketplaceItem | undefined {
  const part = mockParts.find(
    (p) => p.id === partId && p.isPublished && p.status === 'available'
  )
  if (!part) return undefined
  return {
    part,
    seller: mockSellers.find((s) => s.id === part.sellerId),
  }
}
