import { cn } from '@/lib/utils'
import type { MarketplaceReadiness, ReadinessLevel } from '@/lib/inventory/readiness'

const LEVEL_CLASSES: Record<ReadinessLevel, string> = {
  ready:      'bg-green-50 text-green-700',
  basic:      'bg-blue-50 text-blue-700',
  needs_work: 'bg-amber-50 text-amber-700',
}

interface ReadinessBadgeProps {
  readiness: MarketplaceReadiness
  className?: string
}

export function ReadinessBadge({ readiness, className }: ReadinessBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap',
        LEVEL_CLASSES[readiness.level],
        className
      )}
    >
      {readiness.label}
    </span>
  )
}
