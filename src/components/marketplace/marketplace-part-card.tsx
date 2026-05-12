import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ConditionBadge } from '@/components/inventory/condition-badge'
import { CATEGORIES } from '@/lib/constants'
import { ROUTES } from '@/lib/routes'
import { formatPrice } from '@/lib/utils'
import type { Part, Seller } from '@/types'

function getCategoryName(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.name ?? id
}

interface MarketplacePartCardProps {
  part: Part
  seller: Seller | undefined
}

export function MarketplacePartCard({ part, seller }: MarketplacePartCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col hover:border-slate-300 hover:shadow-sm transition-all">
      {/* Photo placeholder */}
      <div className="bg-slate-100 h-40 flex items-center justify-center text-slate-400 flex-shrink-0">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Part name + category */}
        <div>
          <p className="text-base font-semibold text-slate-900 leading-snug line-clamp-2">
            {part.partName}
          </p>
          <p className="text-sm text-slate-500 mt-0.5">
            {part.vehicle.make} {part.vehicle.model} {part.vehicle.year}
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-xs text-slate-400">{getCategoryName(part.categoryId)}</span>
          <span className="text-slate-200">·</span>
          <ConditionBadge condition={part.condition} />
        </div>

        {/* Seller */}
        {seller && (
          <p className="text-xs text-slate-400">
            {seller.businessName} · {seller.city}
          </p>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold text-slate-900 tabular-nums">
              {formatPrice(part.price)}
            </p>
            <Badge variant="success">Διαθέσιμο</Badge>
          </div>
          <Link
            href={ROUTES.PART_DETAIL(part.id)}
            className="inline-flex items-center gap-1 h-8 px-3 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors flex-shrink-0"
          >
            Προβολή
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
