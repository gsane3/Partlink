'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getCurrentSellerId, getSellerOrders, getBuyerById } from '@/lib/data/seller'
import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'
import { DashboardGrid } from '@/components/layout/dashboard-grid'
import { MetricCard } from '@/components/layout/metric-card'
import { FilterChip } from '@/components/forms/filter-chip'
import { SearchInput } from '@/components/forms/search-input'
import { Badge } from '@/components/ui/badge'
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  DELIVERY_METHOD_LABELS,
} from '@/lib/constants'
import { ROUTES } from '@/lib/routes'
import { formatOrderNumber, formatDate, formatPrice, cn } from '@/lib/utils'
import type { Order, OrderStatus } from '@/types'
import type { BadgeVariant } from '@/components/ui/badge'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ORDER_STATUS_VARIANT: Record<OrderStatus, BadgeVariant> = {
  pending: 'warning',
  confirmed: 'brand',
  dispatched: 'purple',
  shipped: 'purple',
  delivered: 'success',
  cancelled: 'danger',
  returned: 'danger',
}

type FilterStatus = 'all' | 'pending' | 'confirmed' | 'dispatched' | 'delivered'

const FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'Όλες' },
  { value: 'pending', label: 'Σε αναμονή' },
  { value: 'confirmed', label: 'Επιβεβαιωμένες' },
  { value: 'dispatched', label: 'Εστάλησαν' },
  { value: 'delivered', label: 'Ολοκληρώθηκαν' },
]

// CTA label shown at the bottom of each order card
function orderCtaLabel(status: OrderStatus): string | null {
  if (status === 'pending') return 'Έλεγχος'
  if (status === 'confirmed') return 'Σκάναρε QR για αποστολή'
  if (status === 'dispatched') return 'Προβολή'
  return null
}

function orderCtaColor(status: OrderStatus): string {
  if (status === 'pending') return 'text-amber-600'
  if (status === 'confirmed') return 'text-blue-600'
  return 'text-slate-500'
}

// ─── Order card ───────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: Order }) {
  const buyer = getBuyerById(order.buyerId)
  const item = order.items[0]
  const cta = orderCtaLabel(order.status)

  return (
    <Link
      href={ROUTES.SELLER.ORDER_DETAIL(order.id)}
      className="block bg-white border border-slate-200 rounded-xl px-4 py-4 hover:bg-slate-50 active:bg-slate-100 transition-colors"
    >
      {/* Top row: order number, status badge, amount */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-bold text-slate-900 font-mono flex-shrink-0">
            #{formatOrderNumber(order.id)}
          </span>
          <Badge variant={ORDER_STATUS_VARIANT[order.status]}>
            {ORDER_STATUS_LABELS[order.status]}
          </Badge>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-sm font-bold text-slate-900 tabular-nums">
            {formatPrice(order.totalAmount)}
          </span>
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Part + vehicle */}
      {item && (
        <p className="text-sm font-medium text-slate-900 truncate">
          {item.part.partName}
          <span className="font-normal text-slate-400 ml-1">
            · {item.part.vehicle.make} {item.part.vehicle.model} {item.part.vehicle.year}
          </span>
        </p>
      )}

      {/* Buyer + payment + delivery */}
      <p className="text-xs text-slate-500 mt-1 truncate">
        {buyer ? buyer.fullName : `Αγοραστής #${order.buyerId}`}
        {order.payment && (
          <span> · {PAYMENT_METHOD_LABELS[order.payment.method]}</span>
        )}
        {order.shipment && (
          <span> · {DELIVERY_METHOD_LABELS[order.shipment.method]}</span>
        )}
      </p>

      {/* Date */}
      <p className="text-xs text-slate-400 mt-1">{formatDate(order.createdAt)}</p>

      {/* CTA indicator */}
      {cta && (
        <div className={cn('flex items-center gap-1 mt-3 text-xs font-semibold', orderCtaColor(order.status))}>
          {cta}
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </Link>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SellerOrdersPage() {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all')
  const [search, setSearch] = useState('')

  const sellerId = getCurrentSellerId()
  const allOrders = getSellerOrders(sellerId)

  // Summary metrics
  const pendingCount = allOrders.filter((o) => o.status === 'pending').length
  const confirmedCount = allOrders.filter((o) => o.status === 'confirmed').length
  const dispatchedCount = allOrders.filter((o) => o.status === 'dispatched').length

  // "This month" = month of the most recent order in mock data
  const latestMonth = allOrders
    .map((o) => o.createdAt.substring(0, 7))
    .sort()
    .pop() ?? ''
  const thisMonthTotal = allOrders
    .filter((o) => o.createdAt.startsWith(latestMonth))
    .reduce((sum, o) => sum + o.totalAmount, 0)

  // Filtered + searched orders (inline — mock data is small, no memoization needed)
  const filtered = allOrders.filter((order) => {
    if (activeFilter !== 'all' && order.status !== activeFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      const orderNum = formatOrderNumber(order.id).toLowerCase()
      const partName = (order.items[0]?.part.partName ?? '').toLowerCase()
      const buyer = getBuyerById(order.buyerId)
      const buyerName = (buyer?.fullName ?? '').toLowerCase()
      const companyName = (buyer?.companyName ?? '').toLowerCase()
      if (
        !orderNum.includes(q) &&
        !partName.includes(q) &&
        !buyerName.includes(q) &&
        !companyName.includes(q)
      ) {
        return false
      }
    }
    return true
  })

  return (
    <PageContainer className="pb-10">
      <SectionHeader
        title="Παραγγελίες"
        subtitle={`${allOrders.length} παραγγελίες συνολικά`}
      />

      {/* Summary metrics */}
      <DashboardGrid cols={4} className="mb-6">
        <MetricCard label="Νέες" value={pendingCount} />
        <MetricCard label="Προς αποστολή" value={confirmedCount} />
        <MetricCard label="Εστάλησαν" value={dispatchedCount} />
        <MetricCard label="Σύνολο μήνα" value={formatPrice(thisMonthTotal)} />
      </DashboardGrid>

      {/* Filters + search */}
      <div className="space-y-3 mb-5">
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {FILTER_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.value}
              label={opt.label}
              selected={activeFilter === opt.value}
              onClick={() => setActiveFilter(opt.value)}
            />
          ))}
        </div>

        <SearchInput
          placeholder="Αριθμός παραγγελίας, ανταλλακτικό, αγοραστής..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
        />
      </div>

      {/* Results count */}
      <p className="text-xs text-slate-500 mb-3">
        {filtered.length === allOrders.length
          ? `${allOrders.length} παραγγελίες`
          : `${filtered.length} από ${allOrders.length} παραγγελίες`}
      </p>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl py-12 text-center">
          <p className="text-sm text-slate-500">Δεν βρέθηκαν παραγγελίες</p>
          {(activeFilter !== 'all' || search) && (
            <button
              type="button"
              onClick={() => { setActiveFilter('all'); setSearch('') }}
              className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Καθαρισμός φίλτρων
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
