import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

interface FilterChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
  label: string
}

export function FilterChip({ selected, label, className, ...props }: FilterChipProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center h-8 px-3 rounded-full text-xs font-medium border transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        selected
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300',
        className
      )}
      {...props}
    >
      {label}
    </button>
  )
}
