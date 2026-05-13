'use client'

import { useState } from 'react'
import { SearchInput } from '@/components/forms/search-input'
import { FilterChip } from '@/components/forms/filter-chip'
import { MarketplacePartCard } from './marketplace-part-card'
import { getMarketplaceParts } from '@/lib/data/marketplace'
import { CATEGORIES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { scorePartSearch, matchesPartSearch } from '@/lib/search/part-search'
import type { Part } from '@/types'
import type { CompatibilityStatus } from '@/components/inventory/vin-import/types'

// ─── Static data (computed once, mock data never changes) ─────────────────────

const ALL_ITEMS = getMarketplaceParts()

const ALL_MAKES = [...new Set(ALL_ITEMS.map(({ part }) => part.vehicle.make))].sort()

const AVAILABLE_CATEGORIES = CATEGORIES.filter((cat) =>
  ALL_ITEMS.some(({ part }) => part.categoryId === cat.id)
)

// ─── Filter config ────────────────────────────────────────────────────────────

type PriceFilter = 'with_price' | 'on_request'
type SortOption = 'default' | 'price_asc' | 'price_desc' | 'newest'

const PRICE_OPTIONS: { value: PriceFilter | null; label: string }[] = [
  { value: null,          label: 'Όλες τιμές' },
  { value: 'with_price',  label: 'Με τιμή' },
  { value: 'on_request',  label: 'Κατόπιν ζήτησης' },
]

const COMPAT_OPTIONS: { value: CompatibilityStatus | null; label: string }[] = [
  { value: null,              label: 'Όλα' },
  { value: 'donor_only',      label: 'Μόνο donor' },
  { value: 'oem_verified',    label: 'Με OEM' },
  { value: 'seller_confirmed', label: 'Επιβεβαιωμένα' },
]

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default',    label: 'Προτεινόμενα' },
  { value: 'price_asc',  label: 'Τιμή αύξουσα' },
  { value: 'price_desc', label: 'Τιμή φθίνουσα' },
  { value: 'newest',     label: 'Νεότερα' },
]

// MVP default: all parts are donor_only until enrichment data is added
function getPartCompat(part: Part): CompatibilityStatus {
  void part
  return 'donor_only'
}

// ─── Chip row ─────────────────────────────────────────────────────────────────

function ChipRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {children}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function MarketplaceList() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [make, setMake] = useState<string | null>(null)
  const [price, setPrice] = useState<PriceFilter | null>(null)
  const [compat, setCompat] = useState<CompatibilityStatus | null>(null)
  const [sort, setSort] = useState<SortOption>('default')

  const clearAll = () => {
    setSearch('')
    setCategory(null)
    setMake(null)
    setPrice(null)
    setCompat(null)
    setSort('default')
  }

  const activeSearch = search.trim()

  // ─── Filter ──────────────────────────────────────────────────────────────────
  const filtered = ALL_ITEMS.filter(({ part, seller }) => {
    if (category && part.categoryId !== category) return false
    if (make && part.vehicle.make !== make) return false
    if (price === 'with_price' && !(part.price > 0)) return false
    if (price === 'on_request' && part.price > 0) return false
    if (compat && getPartCompat(part) !== compat) return false
    if (activeSearch) {
      return matchesPartSearch(part, activeSearch, {
        sellerName: seller?.businessName,
        sellerCity: seller?.city,
      })
    }
    return true
  })

  // ─── Sort ────────────────────────────────────────────────────────────────────
  // When search is active, relevance score takes priority over the selected sort.
  const sorted = [...filtered].sort((a, b) => {
    if (activeSearch) {
      const opts = { sellerName: a.seller?.businessName, sellerCity: a.seller?.city }
      const optsB = { sellerName: b.seller?.businessName, sellerCity: b.seller?.city }
      const diff = scorePartSearch(b.part, activeSearch, optsB) - scorePartSearch(a.part, activeSearch, opts)
      if (diff !== 0) return diff
    }
    if (sort === 'price_asc') return a.part.price - b.part.price
    if (sort === 'price_desc') return b.part.price - a.part.price
    if (sort === 'newest') return b.part.createdAt.localeCompare(a.part.createdAt)
    return 0
  })

  const hasActiveFilter = !!(search.trim() || category || make || price || compat)

  return (
    <div className="space-y-4">
      {/* Search */}
      <SearchInput
        placeholder="π.χ. καθρέφτης BMW E90, φανάρι Astra H, PL-001-0001"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch('')}
      />

      {/* Compatibility safety notice */}
      <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
        <svg className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-xs font-semibold text-slate-700 mb-0.5">Έλεγχος συμβατότητας</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Η συμβατότητα πρέπει να επιβεβαιώνεται με OEM, VIN ή τον πωλητή πριν την αγορά.
          </p>
        </div>
      </div>

      {/* Category filter */}
      <ChipRow>
        <FilterChip
          label="Όλες κατ."
          selected={category === null}
          onClick={() => setCategory(null)}
        />
        {AVAILABLE_CATEGORIES.map((cat) => (
          <FilterChip
            key={cat.id}
            label={cat.name}
            selected={category === cat.id}
            onClick={() => setCategory(cat.id)}
          />
        ))}
      </ChipRow>

      {/* Make filter */}
      <ChipRow>
        <FilterChip
          label="Όλες μάρκες"
          selected={make === null}
          onClick={() => setMake(null)}
        />
        {ALL_MAKES.map((m) => (
          <FilterChip
            key={m}
            label={m}
            selected={make === m}
            onClick={() => setMake(m)}
          />
        ))}
      </ChipRow>

      {/* Price filter */}
      <ChipRow>
        {PRICE_OPTIONS.map((opt) => (
          <FilterChip
            key={opt.value ?? '__all_price__'}
            label={opt.label}
            selected={price === opt.value}
            onClick={() => setPrice(opt.value)}
          />
        ))}
      </ChipRow>

      {/* Compatibility filter */}
      <ChipRow>
        {COMPAT_OPTIONS.map((opt) => (
          <FilterChip
            key={opt.value ?? '__all_compat__'}
            label={opt.label}
            selected={compat === opt.value}
            onClick={() => setCompat(opt.value)}
          />
        ))}
      </ChipRow>

      {/* Results count + sort */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <p className="text-xs text-slate-500 shrink-0">
            {activeSearch
              ? `${sorted.length} αποτελέσματα`
              : sorted.length === ALL_ITEMS.length
                ? `${ALL_ITEMS.length} ανταλλακτικά`
                : `${sorted.length} από ${ALL_ITEMS.length}`}
          </p>
          {activeSearch && sorted.length > 0 && (
            <p className="text-xs text-slate-400 truncate">
              για <span className="font-medium text-slate-600">&ldquo;{activeSearch}&rdquo;</span>
            </p>
          )}
          {hasActiveFilter && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors shrink-0"
            >
              Καθαρισμός
            </button>
          )}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className={cn(
            'h-8 px-2 pr-7 text-xs font-medium bg-white border border-slate-200 rounded-lg',
            'text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
            'appearance-none bg-no-repeat',
            '[background-image:url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMUw2IDdMMTEgMSIgc3Ryb2tlPSIjOTRBM0I4IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+")]',
            '[background-position:right_8px_center]'
          )}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Results grid */}
      {sorted.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl py-14 text-center">
          <p className="text-sm font-medium text-slate-600 mb-1">Δεν βρέθηκαν ανταλλακτικά</p>
          <p className="text-xs text-slate-400 mb-4">Δοκίμασε διαφορετικά φίλτρα</p>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={clearAll}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Καθαρισμός φίλτρων
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map(({ part, seller }) => (
            <MarketplacePartCard
              key={part.id}
              part={part}
              seller={seller}
              compat={getPartCompat(part)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
