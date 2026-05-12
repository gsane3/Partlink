import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'muted' | 'brand' | 'purple'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-green-50 text-green-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-600',
  muted: 'bg-slate-100 text-slate-500',
  brand: 'bg-blue-50 text-blue-700',
  purple: 'bg-purple-50 text-purple-700',
}

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}
