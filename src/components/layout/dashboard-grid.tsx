import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

interface DashboardGridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: 2 | 3 | 4
}

const colClasses: Record<2 | 3 | 4, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4',
}

export function DashboardGrid({ cols = 4, className, ...props }: DashboardGridProps) {
  return (
    <div
      className={cn('grid gap-4', colClasses[cols], className)}
      {...props}
    />
  )
}
