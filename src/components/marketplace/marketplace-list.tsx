'use client'

import { useState } from 'react'
import { SearchInput } from '@/components/forms/search-input'
import { FilterChip } from '@/components/forms/filter-chip'
import { MarketplacePartCard } from './marketplace-part-card'
import { getMarketplaceParts } from '@/lib/data/marketplace'
import { cn } from '@/lib/utils'
import type { PartCondition } from '@/types'

// ─── Filter config ────────────────────────────────────────────────────────────

type CategoryFilter =
  | 'all' | 'body' | 'lighting' | 'engine' | 'transmission' | 'electrical' | 'other'

type ConditionFilter = 'all' | PartCondition

type SortOption = 'default' | 'price_asc' | 'price_desc' | 'newest'

const CATEGORY_FILTERS: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'Όλα' },
  { value: 'body', label: 'Αμάξωμα' },
  { value: 'lighting', label: 'Φωτισμός' },
  { value: 'engine', label: 'Κινητήρας' },
  { value: 'transmission', label: 'Σασμάν' },
  { value: 'electrical', label: 'Ηλεκτρικά' },
  { value: 'other', label: 'Άλλο' },
]

const CONDITION_FILTERS: { value: ConditionFilter; label: string }[] = [
  { value: 'all', label: 'Όλες' },
  { value: 'excellent', label: 'Άριστο' },
  { value: 'very_good', label: 'Πολύ καλό' },
  { value: 'good', label: 'Καλό' },
  { value: 'tested', label: 'Ελεγμένο' },
]

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Προτεινόμενα' },
  { value: 'price_asc', label: 'Τιμή αύξουσα' },
  { value: 'price_desc', label: 'Τιμή φθίνουσα' },
  { value: 'newest', label: 'Νεότερα' },
]

// These are the "main" categories explicitly listed in filters.
// Anything else falls under "Άλλο".
const MAIN_CATEGORY_IDS = new Set(['body', 'lighting', 'engine', 'transmission', 'electrical'])

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
  const [category, setCategory] = useState<CategoryFilter>('all')
  const [condition, setCondition] = useState<ConditionFilter>('all')
  const [sort, setSort] = useState<SortOption>('default')

  const allItems = getMarketplaceParts()

  // Filter
  const filtered = allItems.filter(({ part }) => {
    // Category
    if (category !== 'all') {
      if (category === 'other') {
        if (MAIN_CATEGORY_IDS.has(part.categoryId)) return false
      } else {
        if (part.categoryId !== category) return false
      }
    }
    // Condition
    if (condition !== 'all' && part.condition !== condition) return false
    // Search
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      const matches =
        part.partName.toLowerCase().includes(q) ||
        part.sku.toLowerCase().includes(q) ||
        part.vehicle.make.toLowerCase().includes(q) ||
        part.vehicle.model.toLowerCase().includes(q) ||
        part.categoryId.toLowerCase().includes(q)
      if (!matches) return false
    }
    return true
  })

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'price_asc') return a.part.price - b.part.price
    if (sort === 'price_desc') return b.part.price - a.part.price
    if (sort === 'newest') return b.part.createdAt.localeCompare(a.part.createdAt)
    return 0 // default: keep original order
  })

  const hasActiveFilter = category !== 'all' || condition !== 'all' || search.trim()

  return (
    <div className="space-y-4">
      {/* Search */}
      <SearchInput
        placeholder="Αναζήτηση ανταλλακτικού, SKU, μοντέλο..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch('')}
      />

      {/* Category chips */}
      <ChipRow>
        {CATEGORY_FILTERS.map((opt) => (
          <FilterChip
            key={opt.value}
            label={opt.label}
            selected={category === opt.value}
            onClick={() => setCategory(opt.value)}
          />
        ))}
      </ChipRow>

      {/* Condition chips */}
      <ChipRow>
        {CONDITION_FILTERS.map((opt) => (
          <FilterChip
            key={opt.value}
            label={opt.label}
            selected={condition === opt.value}
            onClick={() => setCondition(opt.value)}
          />
        ))}
      </ChipRow>

      {/* Sort + results count */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          {sorted.length === allItems.length
            ? `${allItems.length} ανταλλακτικά`
            : `${sorted.length} από ${allItems.length}`}
        </p>
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
        <div className="bg-white border border-dashed border-slate-300 rounded-xl py-12 text-center">
          <p className="text-sm text-slate-500 mb-2">Δεν βρέθηκαν ανταλλακτικά</p>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={() => { setSearch(''); setCategory('all'); setCondition('all') }}
              className="text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              Καθαρισμός φίλτρων
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map(({ part, seller }) => (
            <MarketplacePartCard key={part.id} part={part} seller={seller} />
          ))}
        </div>
      )}
    </div>
  )
}
