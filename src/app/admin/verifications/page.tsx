'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getAdminVerificationQueue, getAdminStats } from '@/lib/data/admin'
import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'
import { DashboardGrid } from '@/components/layout/dashboard-grid'
import { MetricCard } from '@/components/layout/metric-card'
import { FilterChip } from '@/components/forms/filter-chip'
import { SearchInput } from '@/components/forms/search-input'
import { Badge } from '@/components/ui/badge'
import { VERIFICATION_STATUS_LABELS } from '@/lib/constants'
import { formatDate, cn } from '@/lib/utils'
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

function ctaLabel(status: VerificationStatus): string {
  if (status === 'approved') return 'Προβολή'
  if (status === 'rejected') return 'Επανέλεγχος'
  return 'Έλεγχος'
}

function ctaColor(status: VerificationStatus): string {
  if (status === 'approved') return 'text-slate-600'
  if (status === 'rejected') return 'text-amber-600'
  return 'text-blue-600'
}

type VerifFilter = 'all' | 'pending' | 'approved' | 'rejected'

const FILTER_OPTIONS: { value: VerifFilter; label: string }[] = [
  { value: 'all', label: 'Όλοι' },
  { value: 'pending', label: 'Σε αναμονή' },
  { value: 'approved', label: 'Εγκεκριμένοι' },
  { value: 'rejected', label: 'Απορρίφθηκαν' },
]

function isPending(status: VerificationStatus) {
  return status === 'pending' || status === 'submitted'
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminVerificationsPage() {
  const [filter, setFilter] = useState<VerifFilter>('all')
  const [search, setSearch] = useState('')

  const stats = getAdminStats()
  const queue = getAdminVerificationQueue()

  const filtered = queue.filter(({ seller }) => {
    const status = seller.verificationStatus
    if (filter === 'pending' && !isPending(status)) return false
    if (filter === 'approved' && status !== 'approved') return false
    if (filter === 'rejected' && status !== 'rejected') return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (
        !seller.businessName.toLowerCase().includes(q) &&
        !seller.city.toLowerCase().includes(q) &&
        !(seller.afm ?? '').toLowerCase().includes(q)
      ) return false
    }
    return true
  })

  return (
    <PageContainer className="pb-10">
      <SectionHeader
        title="Έλεγχοι πωλητών"
        subtitle={`${stats.pendingVerifications} αιτήματα σε αναμονή`}
      />

      {/* Summary */}
      <DashboardGrid cols={4} className="mb-6">
        <MetricCard label="Σε αναμονή" value={stats.pendingVerifications} />
        <MetricCard label="Εγκεκριμένοι" value={stats.approvedSellers} />
        <MetricCard label="Απορρίφθηκαν" value={0} />
        <MetricCard label="Σύνολο πωλητών" value={stats.totalSellers} />
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
          placeholder="Επωνυμία, πόλη, ΑΦΜ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
        />
      </div>

      <p className="text-xs text-slate-500 mb-3">{filtered.length} πωλητές</p>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl py-12 text-center">
          <p className="text-sm text-slate-500">Δεν βρέθηκαν αποτελέσματα</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(({ seller, verif, partCount }) => (
            <Link
              key={seller.id}
              href={`/admin/verifications/${seller.id}`}
              className="block bg-white border border-slate-200 rounded-xl px-4 py-4 hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{seller.businessName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{seller.city}</p>
                </div>
                <Badge variant={VERIF_BADGE[seller.verificationStatus]}>
                  {VERIFICATION_STATUS_LABELS[seller.verificationStatus]}
                </Badge>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                {seller.phone && <span>{seller.phone}</span>}
                {seller.afm && <span>ΑΦΜ {seller.afm}</span>}
                {partCount > 0 && <span>{partCount} ανταλλακτικά</span>}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {verif?.submittedAt
                    ? `Υποβλήθηκε ${formatDate(verif.submittedAt)}`
                    : `Εγγράφηκε ${formatDate(seller.createdAt)}`}
                </span>
                <span className={cn('text-xs font-semibold flex items-center gap-1', ctaColor(seller.verificationStatus))}>
                  {ctaLabel(seller.verificationStatus)}
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  )
}
