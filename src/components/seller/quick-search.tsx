'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SearchInput } from '@/components/forms/search-input'
import { PartStatusBadge } from '@/components/inventory/part-status-badge'
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
                  <Link
                    href={ROUTES.SELLER.PART_DETAIL(part.id)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{part.partName}</p>
                      <p className="text-xs text-slate-500">
                        {part.vehicle.make} {part.vehicle.model} · <span className="font-mono">{part.sku}</span>
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right space-y-1">
                      <p className="text-sm font-semibold text-slate-900">€{part.price}</p>
                      <PartStatusBadge status={part.status} />
                    </div>
                  </Link>
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
