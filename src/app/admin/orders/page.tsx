'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { FilterChip } from '@/components/forms/filter-chip'
import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'
import { formatDate, formatPrice } from '@/lib/utils'
import { mockBuyerRequests } from '@/lib/mock-data/buyer-requests'
import type { BuyerRequest } from '@/lib/mock-data/buyer-requests'
import { SELLER_STATUS_CONFIG } from '@/lib/requests/status'
import { DELIVERY_PREFERENCE_LABELS } from '@/lib/requests/delivery'
import { buildBaseRequestMessages } from '@/lib/requests/messages'

// ─── Filter config ────────────────────────────────────────────────────────────

type AdminFilter = 'all' | 'new' | 'needs_price' | 'in_progress' | 'completed' | 'replied' | 'with_price'

const FILTER_OPTIONS: { value: AdminFilter; label: string }[] = [
  { value: 'all',          label: 'Όλα' },
  { value: 'new',          label: 'Νέα' },
  { value: 'needs_price',  label: 'Θέλουν τιμή' },
  { value: 'in_progress',  label: 'Σε εξέλιξη' },
  { value: 'completed',    label: 'Ολοκληρωμένα' },
  { value: 'replied',      label: 'Με απάντηση' },
  { value: 'with_price',   label: 'Με τιμή' },
]

function matchesFilter(req: BuyerRequest, f: AdminFilter): boolean {
  if (f === 'all')         return true
  if (f === 'new')         return req.status === 'new'
  if (f === 'needs_price') return req.status === 'needs_price'
  if (f === 'in_progress') return req.status === 'in_progress'
  if (f === 'completed')   return req.status === 'completed'
  if (f === 'replied')     return !!req.replyNote
  if (f === 'with_price')  return req.priceSent !== undefined
  return true
}

// ─── Request card ─────────────────────────────────────────────────────────────

function RequestCard({ req }: { req: BuyerRequest }) {
  const { label: statusLabel, variant: statusVariant } = SELLER_STATUS_CONFIG[req.status]
  const messages    = buildBaseRequestMessages(req)
  const lastMsg     = messages[messages.length - 1]

  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-4">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="text-xs font-mono text-slate-400 flex-shrink-0">{req.id}</span>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
          {req.priceSent !== undefined && (
            <Badge variant="success">Τιμή</Badge>
          )}
          {req.replyNote && (
            <Badge variant="brand">Απάντηση</Badge>
          )}
        </div>
        <span className="text-xs text-slate-400 flex-shrink-0">{formatDate(req.createdAt)}</span>
      </div>

      {/* Part */}
      <p className="text-sm font-semibold text-slate-900 truncate">{req.partName}</p>
      <p className="text-xs text-slate-400 font-mono mb-1">{req.partSku}</p>

      {/* Buyer → Seller */}
      <p className="text-xs text-slate-600 truncate mb-1">
        {req.buyerCompany}
        <span className="text-slate-300 mx-1.5">→</span>
        {req.sellerName ?? 'Πωλητής'}
      </p>

      {/* Delivery + price sent */}
      <div className="flex items-center gap-2 flex-wrap mb-1.5">
        <span className="text-xs text-slate-400">{DELIVERY_PREFERENCE_LABELS[req.delivery]}</span>
        {req.priceSent !== undefined && (
          <span className="text-xs font-semibold text-green-700">{formatPrice(req.priceSent)}</span>
        )}
      </div>

      {/* Last message preview */}
      {lastMsg && (
        <p className="text-xs text-slate-500 italic line-clamp-1">&ldquo;{lastMsg.body}&rdquo;</p>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [activeFilter, setActiveFilter] = useState<AdminFilter>('all')

  const filtered = mockBuyerRequests.filter((r) => matchesFilter(r, activeFilter))

  return (
    <PageContainer className="pb-10">
      <SectionHeader
        title="Αιτήματα marketplace"
        subtitle="Παρακολούθηση αιτημάτων μεταξύ αγοραστών και πωλητών."
      />

      {/* Filter chips */}
      <div className="overflow-x-auto pb-0.5 mb-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex gap-1.5 min-w-max pr-4">
          {FILTER_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.value}
              label={opt.label}
              selected={activeFilter === opt.value}
              onClick={() => setActiveFilter(opt.value)}
            />
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-500 mb-3">
        {filtered.length === mockBuyerRequests.length
          ? `${mockBuyerRequests.length} αιτήματα`
          : `${filtered.length} από ${mockBuyerRequests.length} αιτήματα`}
      </p>

      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl py-14 text-center">
          <p className="text-sm font-medium text-slate-600 mb-1">Δεν υπάρχουν αιτήματα</p>
          {activeFilter !== 'all' && (
            <button type="button" onClick={() => setActiveFilter('all')} className="text-xs font-medium text-blue-600 hover:text-blue-700 mt-2">
              Καθαρισμός φίλτρου
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => (
            <RequestCard key={req.id} req={req} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
