'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge, type BadgeVariant } from '@/components/ui/badge'
import { FilterChip } from '@/components/forms/filter-chip'
import { SearchInput } from '@/components/forms/search-input'
import { ConditionBadge } from '@/components/inventory/condition-badge'
import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'
import { DashboardGrid } from '@/components/layout/dashboard-grid'
import { MetricCard } from '@/components/layout/metric-card'
import { formatPrice } from '@/lib/utils'
import { ROUTES } from '@/lib/routes'
import { mockParts } from '@/lib/mock-data/parts'
import { mockSellers } from '@/lib/mock-data/sellers'
import { getMarketplaceReadiness, type ReadinessLevel } from '@/lib/inventory/readiness'
import type { Part } from '@/types'

// ─── Pre-computed data (module-level, static) ─────────────────────────────────

const sellerMap = new Map(mockSellers.map((s) => [s.id, s.businessName]))

interface ListingEntry {
  part:        Part
  sellerName:  string
  level:       ReadinessLevel
  readyLabel:  string
  hints:       string[]
}

const allListings: ListingEntry[] = mockParts.map((part) => {
  const { level, label, hints } = getMarketplaceReadiness(part)
  return {
    part,
    sellerName: sellerMap.get(part.sellerId) ?? 'Πωλητής',
    level,
    readyLabel: label,
    hints,
  }
})

const totalCount     = allListings.length
const publishedCount = allListings.filter((l) => l.part.isPublished).length
const needsWorkCount = allListings.filter((l) => l.level === 'needs_work').length
const noPriceCount   = allListings.filter((l) => l.part.price === 0).length

// ─── Filter config ────────────────────────────────────────────────────────────

type AdminListingFilter = 'all' | 'published' | 'unpublished' | 'ready' | 'needs_work' | 'no_price'

const FILTER_OPTIONS: { value: AdminListingFilter; label: string }[] = [
  { value: 'all',         label: 'Όλα' },
  { value: 'published',   label: 'Δημοσιευμένα' },
  { value: 'unpublished', label: 'Μη δημοσιευμένα' },
  { value: 'ready',       label: 'Έτοιμα' },
  { value: 'needs_work',  label: 'Θέλουν δουλειά' },
  { value: 'no_price',    label: 'Χωρίς τιμή' },
]

function matchesFilter(entry: ListingEntry, f: AdminListingFilter): boolean {
  if (f === 'all')         return true
  if (f === 'published')   return entry.part.isPublished
  if (f === 'unpublished') return !entry.part.isPublished
  if (f === 'ready')       return entry.level === 'ready'
  if (f === 'needs_work')  return entry.level === 'needs_work'
  if (f === 'no_price')    return entry.part.price === 0
  return true
}

function matchesSearch(entry: ListingEntry, q: string): boolean {
  if (!q) return true
  const lower = q.toLowerCase()
  const { part, sellerName } = entry
  return (
    part.partName.toLowerCase().includes(lower) ||
    part.sku.toLowerCase().includes(lower) ||
    sellerName.toLowerCase().includes(lower) ||
    part.vehicle.make.toLowerCase().includes(lower) ||
    part.vehicle.model.toLowerCase().includes(lower)
  )
}

// ─── Readiness badge variant ──────────────────────────────────────────────────

const READINESS_VARIANT: Record<ReadinessLevel, BadgeVariant> = {
  ready:      'success',
  basic:      'warning',
  needs_work: 'danger',
}

// ─── Listing card ─────────────────────────────────────────────────────────────

function ListingCard({ entry }: { entry: ListingEntry }) {
  const { part, sellerName, level, readyLabel, hints } = entry
  const v = part.vehicle

  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-4">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <span className="text-sm font-semibold text-slate-900 truncate flex-1">{part.partName}</span>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Badge variant={READINESS_VARIANT[level]}>{readyLabel}</Badge>
          <Badge variant={part.isPublished ? 'brand' : 'muted'}>
            {part.isPublished ? 'Δημοσιευμένο' : 'Αδημοσίευτο'}
          </Badge>
        </div>
      </div>

      {/* SKU + seller */}
      <p className="text-xs text-slate-400 font-mono mb-1">{part.sku}</p>
      <p className="text-xs text-slate-600 mb-1">{sellerName}</p>

      {/* Vehicle */}
      <p className="text-xs text-slate-500 mb-2">
        {v.make} {v.model} {v.year}
      </p>

      {/* Condition + price */}
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <ConditionBadge condition={part.condition} />
        {part.price > 0 ? (
          <span className="text-sm font-bold text-slate-900 tabular-nums">{formatPrice(part.price)}</span>
        ) : (
          <span className="text-xs text-amber-700 font-medium">Κατόπιν ζήτησης</span>
        )}
      </div>

      {/* Readiness hints */}
      {hints.length > 0 && (
        <p className="text-xs text-slate-400 mb-2">
          Λείπει: {hints.join(', ')}
        </p>
      )}

      {/* Link */}
      <Link
        href={ROUTES.PART_DETAIL(part.id)}
        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
      >
        Προβολή στο marketplace
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminListingsPage() {
  const [activeFilter, setActiveFilter] = useState<AdminListingFilter>('all')
  const [search, setSearch] = useState('')

  const isFiltered = activeFilter !== 'all' || search.trim() !== ''

  const filtered = allListings
    .filter((e) => matchesFilter(e, activeFilter))
    .filter((e) => matchesSearch(e, search.trim()))

  return (
    <PageContainer className="pb-10">
      <SectionHeader
        title="Listings marketplace"
        subtitle="Έλεγχος δημοσιευμένων ανταλλακτικών και ποιότητας καταχώρησης."
      />

      {/* Metrics */}
      <DashboardGrid cols={4} className="mb-6">
        <MetricCard label="Σύνολο listings"  value={totalCount} />
        <MetricCard label="Δημοσιευμένα"     value={publishedCount} />
        <MetricCard label="Θέλουν δουλειά"   value={needsWorkCount} />
        <MetricCard label="Χωρίς τιμή"       value={noPriceCount} />
      </DashboardGrid>

      {/* Compatibility note */}
      <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
        <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-xs text-amber-800 leading-relaxed">
          Η συμβατότητα πρέπει να επιβεβαιώνεται με OEM, VIN ή τον πωλητή πριν την αγορά.
        </p>
      </div>

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
          placeholder="Ανταλλακτικό, SKU, πωλητής, μάρκα..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
        />
      </div>

      <p className="text-xs text-slate-500 mb-3">
        {filtered.length === totalCount
          ? `${totalCount} listings`
          : `${filtered.length} από ${totalCount} listings`}
      </p>

      {/* List or empty state */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl py-14 text-center">
          <p className="text-sm font-medium text-slate-600 mb-3">Δεν βρέθηκαν listings</p>
          {isFiltered && (
            <button
              type="button"
              onClick={() => { setActiveFilter('all'); setSearch('') }}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Καθαρισμός φίλτρων
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <ListingCard key={entry.part.id} entry={entry} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
