'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getAdminSellers, getAdminStats } from '@/lib/data/admin'
import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'
import { DashboardGrid } from '@/components/layout/dashboard-grid'
import { MetricCard } from '@/components/layout/metric-card'
import { FilterChip } from '@/components/forms/filter-chip'
import { SearchInput } from '@/components/forms/search-input'
import { Badge } from '@/components/ui/badge'
import { VERIFICATION_STATUS_LABELS } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import type { VerificationStatus } from '@/types'
import type { BadgeVariant } from '@/components/ui/badge'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const VERIF_BADGE: Record<VerificationStatus, BadgeVariant> = {
  registered: 'muted',
  submitted: 'warning',
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  needs_more_info: 'warning',
}

type SellerFilter = 'all' | 'approved' | 'pending' | 'rejected'

const FILTER_OPTIONS: { value: SellerFilter; label: string }[] = [
  { value: 'all', label: 'Όλοι' },
  { value: 'approved', label: 'Εγκεκριμένοι' },
  { value: 'pending', label: 'Σε αναμονή' },
  { value: 'rejected', label: 'Απορρίφθηκαν' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminSellersPage() {
  const [filter, setFilter] = useState<SellerFilter>('all')
  const [search, setSearch] = useState('')

  const stats = getAdminStats()
  const allSellers = getAdminSellers()

  const totalParts = allSellers.reduce((sum, s) => sum + s.totalParts, 0)
  const activeSellers = allSellers.filter((s) => s.seller.verificationStatus === 'approved').length
  const reviewingSellers = allSellers.filter(
    (s) => s.seller.verificationStatus === 'pending' || s.seller.verificationStatus === 'submitted'
  ).length

  const filtered = allSellers.filter(({ seller }) => {
    const status = seller.verificationStatus
    if (filter === 'approved' && status !== 'approved') return false
    if (filter === 'pending' && status !== 'pending' && status !== 'submitted') return false
    if (filter === 'rejected' && status !== 'rejected') return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!seller.businessName.toLowerCase().includes(q) && !seller.city.toLowerCase().includes(q)) {
        return false
      }
    }
    return true
  })

  return (
    <PageContainer className="pb-10">
      <SectionHeader
        title="Πωλητές"
        subtitle={`${stats.totalSellers} εγγεγραμμένοι πωλητές`}
      />

      {/* Summary */}
      <DashboardGrid cols={4} className="mb-6">
        <MetricCard label="Σύνολο" value={stats.totalSellers} />
        <MetricCard label="Ενεργοί" value={activeSellers} />
        <MetricCard label="Σε έλεγχο" value={reviewingSellers} />
        <MetricCard label="Ανταλλακτικά" value={totalParts} />
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
          placeholder="Επωνυμία, πόλη..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
        />
      </div>

      <p className="text-xs text-slate-500 mb-3">{filtered.length} πωλητές</p>

      {/* Sellers list — table on desktop, cards on mobile */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">Δεν βρέθηκαν πωλητές</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map(({ seller, totalParts: tp, publishedParts, ordersCount, stockValue }) => (
              <div key={seller.id} className="flex items-center gap-3 px-4 py-4 hover:bg-slate-50 transition-colors">
                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-slate-900 truncate">{seller.businessName}</p>
                    <Badge variant={VERIF_BADGE[seller.verificationStatus]}>
                      {VERIFICATION_STATUS_LABELS[seller.verificationStatus]}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">{seller.city}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                    <span>{tp} ανταλλ. ({publishedParts} δημοσ.)</span>
                    <span>{ordersCount} παραγγ.</span>
                    <span className="hidden sm:inline">Stock {formatPrice(stockValue)}</span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={`/admin/verifications/${seller.id}`}
                  className="flex-shrink-0 inline-flex items-center h-8 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  Προβολή
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  )
}
