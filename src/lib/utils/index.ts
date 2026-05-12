import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' }).format(amount)
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('el-GR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString))
}

export function generateSKU(sellerId: string, partIndex: number): string {
  const sellerPart = sellerId.split('-').pop()?.padStart(3, '0') ?? '000'
  const index = String(partIndex).padStart(4, '0')
  return `PL-${sellerPart}-${index}`
}

export function generateQRValue(sku: string, sellerId: string, partId: string): string {
  return `partlink:${sellerId}:${partId}:${sku}`
}

// Extracts trailing digits from an order id and zero-pads to 3 digits.
// Handles: "order-001" → "001", "order-010" → "010", "order-100" → "100"
export function formatOrderNumber(orderId: string): string {
  const match = orderId.match(/(\d+)$/)
  if (!match) return orderId.toUpperCase()
  return match[1].padStart(3, '0')
}

// Compact price without decimal part for space-constrained displays.
// "2.553,00 €" → "2.553€"
export function formatPriceCompact(amount: number): string {
  return new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' })
    .format(amount)
    .replace(/,\d+\s*€/, '€')
    .replace(/\s€/, '€')
}
