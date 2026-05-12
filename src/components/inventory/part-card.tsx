import { PartStatusBadge } from './part-status-badge'
import { ConditionBadge } from './condition-badge'
import type { Part } from '@/types'

// Standalone part summary card — used in QR scan found states.
// Layout: [photo 14×14] [name / vehicle / SKU / badges] [price far-right]

export function PartCard({ part }: { part: Part }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center text-slate-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-slate-900 leading-tight">{part.partName}</p>
          <p className="text-sm text-slate-500 mt-0.5">
            {part.vehicle.make} {part.vehicle.model} {part.vehicle.year}
          </p>
          <p className="text-xs font-mono text-slate-400 mt-0.5">{part.sku}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            <PartStatusBadge status={part.status} />
            <ConditionBadge condition={part.condition} />
          </div>
        </div>
        <p className="text-base font-bold text-slate-900 flex-shrink-0">€{part.price}</p>
      </div>
    </div>
  )
}
