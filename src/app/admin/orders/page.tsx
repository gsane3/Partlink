'use client'

import { useState } from 'react'
import { getAdminOrders, getAdminStats } from '@/lib/data/admin'
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
import { formatOrderNumber, formatDate, formatPrice } from '@/lib/utils'
import type { OrderStatus, PaymentStatus } from '@/types'
import type { BadgeVariant } from '@/components/ui/badge'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ORDER_STATUS_VARIANT: Record<OrderStatus, BadgeVariant> = {
  pending: 'warning',
  confirmed: 'brand',
  dispatched: 'purple',
  shipped: 'purple',
  delivered: 'success',
  cancelled: 'danger',
  returned: 'danger',
}

const PAYMENT_STATUS_VARIANT: Record<PaymentStatus, BadgeVariant> = {
  pending: 'warning',
  paid: 'success',
  failed: 'danger',
  refunded: 'muted',
}

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Εκκρεμεί',
  paid: 'Πληρώθηκε',
  failed: 'Απέτυχε',
  refunded: 'Επιστράφηκε',
}

type OrderFilter = 'all' | 'pending' | 'confirmed' | 'dispatched' | 'cancelled'

const FILTER_OPTIONS: { value: OrderFilter; label: string }[] = [
  { value: 'all', label: 'Όλες' },
  { value: 'pending', label: 'Σε αναμονή' },
  { value: 'confirmed', label: 'Επιβεβαιωμένες' },
  { value: 'dispatched', label: 'Εστάλησαν' },
  { value: 'cancelled', label: 'Ακυρώθηκαν' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState<OrderFilter>('all')
  const [search, setSearch] = useState('')

  const stats = getAdminStats()
  const allOrderItems = getAdminOrders()

  const confirmedCount = allOrderItems.filter((i) => i.order.status === 'confirmed').length

  const filtered = allOrderItems.filter(({ order, seller, buyer }) => {
    if (filter !== 'all' && order.status !== filter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      const orderNum = formatOrderNumber(order.id).toLowerCase()
      const buyerName = (buyer?.fullName ?? '').toLowerCase()
      const sellerName = (seller?.businessName ?? '').toLowerCase()
      const partName = (order.items[0]?.part.partName ?? '').toLowerCase()
      if (
        !orderNum.includes(q) &&
        !buyerName.includes(q) &&
        !sellerName.includes(q) &&
        !partName.includes(q)
      ) return false
    }
    return true
  })

  return (
    <PageContainer className="pb-10">
      <SectionHeader
        title="Παραγγελίες"
        subtitle={`${stats.totalOrders} παραγγελίες πλατφόρμας`}
      />

      {/* Summary */}
      <DashboardGrid cols={4} className="mb-6">
        <MetricCard label="Σύνολο" value={stats.totalOrders} />
        <MetricCard label="Σε αναμονή" value={stats.pendingOrders} />
        <MetricCard label="Προς αποστολή" value={confirmedCount} />
        <MetricCard label="Τζίρος" value={formatPrice(stats.totalRevenue)} />
      </DashboardGrid>

      {/* Filters + search */}
      <div className="space-y-3 mb-5">
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {FILTER_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.value}
              label={opt.label}
              selected={filter === opt.value}
              onClick={() => setFilter(opt.value)}
            />
          ))}
        </div>
        <SearchInput
          placeholder="Αρ. παραγγελίας, αγοραστής, πωλητής, ανταλλακτικό..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
        />
      </div>

      <p className="text-xs text-slate-500 mb-3">{filtered.length} παραγγελίες</p>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl py-12 text-center">
          <p className="text-sm text-slate-500">Δεν βρέθηκαν παραγγελίες</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(({ order, seller, buyer }) => {
            const item = order.items[0]
            return (
              <div
                key={order.id}
                className="bg-white border border-slate-200 rounded-xl px-4 py-4"
              >
                {/* Top row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-bold text-slate-900 font-mono flex-shrink-0">
                      #{formatOrderNumber(order.id)}
                    </span>
                    <Badge variant={ORDER_STATUS_VARIANT[order.status]}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                    {order.payment && (
                      <Badge variant={PAYMENT_STATUS_VARIANT[order.payment.status]}>
                        {PAYMENT_STATUS_LABELS[order.payment.status]}
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm font-bold text-slate-900 flex-shrink-0 tabular-nums">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>

                {/* Part */}
                {item && (
                  <p className="text-sm font-medium text-slate-800 truncate mb-1">
                    {item.part.partName}
                    <span className="font-normal text-slate-400 ml-1">
                      · {item.part.vehicle.make} {item.part.vehicle.model}
                    </span>
                  </p>
                )}

                {/* Buyer → Seller */}
                <p className="text-xs text-slate-500 truncate mb-1">
                  {buyer?.fullName ?? '—'}
                  <span className="text-slate-300 mx-1.5">→</span>
                  {seller?.businessName ?? '—'}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  {order.payment && <span>{PAYMENT_METHOD_LABELS[order.payment.method]}</span>}
                  {order.shipment && <span>{DELIVERY_METHOD_LABELS[order.shipment.method]}</span>}
                  <span>{formatDate(order.createdAt)}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </PageContainer>
  )
}
