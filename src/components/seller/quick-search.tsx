'use client'

import { useState } from 'react'
import { SearchInput } from '@/components/forms/search-input'
import { PartRow } from '@/components/inventory/part-row'
import { ROUTES } from '@/lib/routes'
import type { Part } from '@/types'

interface QuickSearchProps {
  parts: Part[]
}

export function QuickSearch({ parts }: QuickSearchProps) {
  const [query, setQuery] = useState('')

  const results = query.trim().length >= 2
    ? parts.filter((p) => {
        const q = query.toLowerCase()
        return (
          p.partName.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.vehicle.make.toLowerCase().includes(q) ||
          p.vehicle.model.toLowerCase().includes(q)
        )
      })
    : []

  const showResults = query.trim().length >= 2

  return (
    <div>
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-3">
        Γρήγορη αναζήτηση stock
      </p>
      <SearchInput
        placeholder="Όνομα, SKU, μοντέλο..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onClear={() => setQuery('')}
      />

      {showResults && (
        <div className="mt-2 bg-white border border-slate-200 rounded-xl overflow-hidden">
          {results.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {results.map((part) => (
                <li key={part.id}>
                  <PartRow
                    variant="search"
                    part={part}
                    href={ROUTES.SELLER.PART_DETAIL(part.id)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-slate-500">Δεν βρέθηκαν αποτελέσματα για &ldquo;{query}&rdquo;</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
