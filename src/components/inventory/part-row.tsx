import Link from 'next/link'
import { PartStatusBadge } from './part-status-badge'
import { ConditionBadge } from './condition-badge'
import { MarketplaceVisibilityBadge } from './marketplace-visibility-badge'
import { QRStatusBadge } from './qr-status-badge'
import { ReadinessBadge } from './marketplace-readiness-badge'
import { getMarketplaceReadiness } from '@/lib/inventory/readiness'
import { formatPrice } from '@/lib/utils'
import { CATEGORIES } from '@/lib/constants'
import type { Part } from '@/types'
import type { ReactNode } from 'react'

function PhotoPlaceholder({ size = 'md' }: { size?: 'sm' | 'md' }) {
  return (
    <div
      className={`${size === 'sm' ? 'w-10 h-10' : 'w-12 h-12'} rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400`}
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  )
}

function getCategoryName(id: string) {
  return CATEGORIES.find((c) => c.id === id)?.name ?? id
}

// ─── compact variant ─────────────────────────────────────────────────────────
// Used by: seller mobile recent parts
// Layout: [photo 12×12] [name / vehicle / SKU] [price + status + condition badges stacked right]

function CompactRow({ part, href }: { part: Part; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 transition-colors"
    >
      <PhotoPlaceholder />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">{part.partName}</p>
        <p className="text-xs text-slate-500 truncate">
          {part.vehicle.make} {part.vehicle.model} {part.vehicle.year}
        </p>
        <p className="text-xs text-slate-400 font-mono mt-0.5">{part.sku}</p>
      </div>
      <div className="flex-shrink-0 text-right space-y-1.5">
        <p className="text-sm font-bold text-slate-900">{formatPrice(part.price)}</p>
        <div className="flex flex-col items-end gap-1">
          <PartStatusBadge status={part.status} />
          <ConditionBadge condition={part.condition} />
        </div>
      </div>
    </Link>
  )
}

// ─── search variant ───────────────────────────────────────────────────────────
// Used by: quick stock search results
// Layout: [photo 10×10] [name / vehicle+SKU inline] [price + status badge right]

function SearchRow({ part, href }: { part: Part; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 active:bg-slate-100 transition-colors"
    >
      <PhotoPlaceholder size="sm" />
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
  )
}

// ─── full variant ─────────────────────────────────────────────────────────────
// Used by: inventory list rows
// Layout: [photo 12×12] [name+price+actions / vehicle+category / SKU+qty / all badges]

function FullRow({ part, actions }: { part: Part; actions?: ReactNode }) {
  const readiness = getMarketplaceReadiness(part)
  return (
    <div className="flex items-start gap-3 px-4 py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
      <PhotoPlaceholder />
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <p className="flex-1 text-sm font-semibold text-slate-900 min-w-0 truncate">
            {part.partName}
          </p>
          <div className="flex items-center gap-1 flex-shrink-0">
            <p className="text-sm font-bold text-slate-900 tabular-nums">
              {part.price > 0 ? formatPrice(part.price) : <span className="text-slate-400 font-normal italic text-xs">Κατ. ζήτ.</span>}
            </p>
            {actions}
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-0.5 truncate">
          {part.vehicle.make} {part.vehicle.model} {part.vehicle.year}
          <span className="text-slate-300 mx-1">·</span>
          {getCategoryName(part.categoryId)}
        </p>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          {part.sku}
          {part.quantity > 1 && (
            <span className="font-sans not-italic text-slate-400"> · Qty: {part.quantity}</span>
          )}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          <PartStatusBadge status={part.status} />
          <ConditionBadge condition={part.condition} />
          <MarketplaceVisibilityBadge isPublished={part.isPublished} />
          <QRStatusBadge printed={!!part.qrCodeId} />
          <ReadinessBadge readiness={readiness} />
        </div>
        {readiness.hints.length > 0 && (
          <p className="text-[11px] text-slate-400 mt-1">
            Χρειάζεται: {readiness.hints.slice(0, 2).join(', ')}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

type PartRowProps =
  | { part: Part; variant: 'compact'; href: string }
  | { part: Part; variant: 'search'; href: string }
  | { part: Part; variant: 'full'; actions?: ReactNode }

export function PartRow(props: PartRowProps) {
  if (props.variant === 'compact') return <CompactRow part={props.part} href={props.href} />
  if (props.variant === 'search') return <SearchRow part={props.part} href={props.href} />
  return <FullRow part={props.part} actions={props.actions} />
}
