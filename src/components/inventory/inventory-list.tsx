'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { SearchInput } from '@/components/forms/search-input'
import { FilterChip } from '@/components/forms/filter-chip'
import { EmptyState } from '@/components/layout/empty-state'
import { PartRow } from './part-row'
import { CATEGORIES, PART_STATUS_LABELS } from '@/lib/constants'
import { ROUTES } from '@/lib/routes'
import type { Part, PartStatus } from '@/types'

// ─── Filter types ────────────────────────────────────────────────────────────

interface Filters {
  search: string
  status: PartStatus | null
  category: string | null
  isPublished: boolean | null
  hasQR: boolean | null
}

const EMPTY: Filters = {
  search: '',
  status: null,
  category: null,
  isPublished: null,
  hasQR: null,
}

const STATUS_OPTIONS: { value: PartStatus | null; label: string }[] = [
  { value: null, label: 'Όλα' },
  { value: 'available', label: PART_STATUS_LABELS.available },
  { value: 'reserved', label: PART_STATUS_LABELS.reserved },
  { value: 'sold', label: PART_STATUS_LABELS.sold },
  { value: 'draft', label: PART_STATUS_LABELS.draft },
]

function hasAnyFilter(f: Filters) {
  return !!(f.search || f.status || f.category || f.isPublished !== null || f.hasQR !== null)
}

function applyFilters(parts: Part[], f: Filters): Part[] {
  return parts.filter((p) => {
    if (f.search) {
      const q = f.search.toLowerCase()
      const match =
        p.partName.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.vehicle.make.toLowerCase().includes(q) ||
        p.vehicle.model.toLowerCase().includes(q)
      if (!match) return false
    }
    if (f.status && p.status !== f.status) return false
    if (f.category && p.categoryId !== f.category) return false
    if (f.isPublished !== null && p.isPublished !== f.isPublished) return false
    if (f.hasQR !== null && !!p.qrCodeId !== f.hasQR) return false
    return true
  })
}

// ─── Part actions dropdown ────────────────────────────────────────────────────

function PartActionsMenu({ part }: { part: Part }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [open])

  const menuItemClass =
    'w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left'

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        aria-label="Ενέργειες"
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="8" cy="2" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="8" cy="14" r="1.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-30 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 w-52">
          <Link
            href={ROUTES.SELLER.PART_DETAIL(part.id)}
            onClick={() => setOpen(false)}
            className={menuItemClass}
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Προβολή
          </Link>

          <Link
            href={ROUTES.SELLER.PART_DETAIL(part.id)}
            onClick={() => setOpen(false)}
            className={menuItemClass}
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Επεξεργασία
          </Link>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className={menuItemClass}
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            Εκτύπωση QR
          </button>

          <div className="border-t border-slate-100 my-1" />

          <button
            type="button"
            onClick={() => setOpen(false)}
            className={`${menuItemClass} text-red-600 hover:text-red-700`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Σήμανση ως πωλημένο
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Scrollable chip row ──────────────────────────────────────────────────────

function ChipRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {children}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function InventoryList({ parts }: { parts: Part[] }) {
  const [filters, setFilters] = useState<Filters>(EMPTY)

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }))

  const filtered = useMemo(() => applyFilters(parts, filters), [parts, filters])
  const active = hasAnyFilter(filters)

  return (
    <div className="space-y-3">

      {/* Search */}
      <SearchInput
        placeholder="Αναζήτηση: όνομα, SKU, μοντέλο..."
        value={filters.search}
        onChange={(e) => set('search', e.target.value)}
        onClear={() => set('search', '')}
      />

      {/* Status chips */}
      <ChipRow>
        {STATUS_OPTIONS.map((opt) => (
          <FilterChip
            key={opt.value ?? '__all__'}
            label={opt.label}
            selected={filters.status === opt.value}
            onClick={() => set('status', opt.value)}
          />
        ))}
      </ChipRow>

      {/* Category chips */}
      <ChipRow>
        <FilterChip
          label="Όλες κατ."
          selected={filters.category === null}
          onClick={() => set('category', null)}
        />
        {CATEGORIES.map((cat) => (
          <FilterChip
            key={cat.id}
            label={cat.name}
            selected={filters.category === cat.id}
            onClick={() => set('category', cat.id)}
          />
        ))}
      </ChipRow>

      {/* Visibility + QR toggles */}
      <div className="flex gap-2 flex-wrap">
        <FilterChip
          label="Δημοσιευμένο"
          selected={filters.isPublished === true}
          onClick={() => set('isPublished', filters.isPublished === true ? null : true)}
        />
        <FilterChip
          label="Αδημοσίευτο"
          selected={filters.isPublished === false}
          onClick={() => set('isPublished', filters.isPublished === false ? null : false)}
        />
        <FilterChip
          label="QR ✓"
          selected={filters.hasQR === true}
          onClick={() => set('hasQR', filters.hasQR === true ? null : true)}
        />
        <FilterChip
          label="Χωρίς QR"
          selected={filters.hasQR === false}
          onClick={() => set('hasQR', filters.hasQR === false ? null : false)}
        />
      </div>

      {/* Results count + clear */}
      <div className="flex items-center justify-between pt-1">
        <p className="text-xs text-slate-500">
          {filtered.length === parts.length
            ? `${parts.length} ανταλλακτικά`
            : `${filtered.length} από ${parts.length} ανταλλακτικά`}
        </p>
        {active && (
          <button
            type="button"
            onClick={() => setFilters(EMPTY)}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Καθαρισμός φίλτρων
          </button>
        )}
      </div>

      {/* List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            title={parts.length === 0 ? 'Δεν υπάρχουν ανταλλακτικά στο stock' : 'Δεν βρέθηκαν ανταλλακτικά'}
            description={
              parts.length === 0
                ? 'Πρόσθεσε το πρώτο ανταλλακτικό ή κάνε εισαγωγή με VIN.'
                : 'Δοκίμασε διαφορετικές λέξεις ή καθάρισε τα φίλτρα.'
            }
            icon={
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
            action={
              active ? (
                <button
                  type="button"
                  onClick={() => setFilters(EMPTY)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Καθαρισμός φίλτρων
                </button>
              ) : (
                <Link
                  href={ROUTES.SELLER.INVENTORY_ADD}
                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Πρόσθεσε ανταλλακτικό
                </Link>
              )
            }
          />
        ) : (
          filtered.map((part) => (
            <PartRow
              key={part.id}
              variant="full"
              part={part}
              actions={<PartActionsMenu part={part} />}
            />
          ))
        )}
      </div>
    </div>
  )
}
