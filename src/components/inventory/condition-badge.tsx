import { Badge, type BadgeVariant } from '@/components/ui/badge'
import { CONDITION_LABELS } from '@/lib/constants'
import type { PartCondition } from '@/types'

const conditionVariant: Record<PartCondition, BadgeVariant> = {
  excellent: 'success',
  very_good: 'success',
  good: 'brand',
  fair: 'warning',
  for_repair: 'danger',
  tested: 'brand',
  untested: 'muted',
}

interface ConditionBadgeProps {
  condition: PartCondition
  className?: string
}

export function ConditionBadge({ condition, className }: ConditionBadgeProps) {
  return (
    <Badge variant={conditionVariant[condition]} className={className}>
      {CONDITION_LABELS[condition]}
    </Badge>
  )
}
