import { Badge, type BadgeVariant } from '@/components/ui/badge'
import { PART_STATUS_LABELS } from '@/lib/constants'
import type { PartStatus } from '@/types'

const statusVariant: Record<PartStatus, BadgeVariant> = {
  draft: 'muted',
  available: 'success',
  reserved: 'warning',
  sold: 'brand',
  shipped: 'purple',
  delivered: 'success',
  returned: 'danger',
  deleted: 'danger',
}

interface PartStatusBadgeProps {
  status: PartStatus
  className?: string
}

export function PartStatusBadge({ status, className }: PartStatusBadgeProps) {
  return (
    <Badge variant={statusVariant[status]} className={className}>
      {PART_STATUS_LABELS[status]}
    </Badge>
  )
}
