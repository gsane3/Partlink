import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface MetricCardProps {
  label: string
  value: string | number
  delta?: string
  deltaPositive?: boolean
  icon?: ReactNode
  className?: string
}

export function MetricCard({ label, value, delta, deltaPositive, icon, className }: MetricCardProps) {
  return (
    <div className={cn('bg-white border border-slate-200 rounded-xl p-4', className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
      <p className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">{value}</p>
      {delta && (
        <p
          className={cn(
            'mt-1 text-xs font-medium',
            deltaPositive ? 'text-green-600' : 'text-red-500'
          )}
        >
          {deltaPositive ? '+' : ''}{delta}
        </p>
      )}
    </div>
  )
}
