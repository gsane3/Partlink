import { Badge } from '@/components/ui/badge'

interface QRStatusBadgeProps {
  printed: boolean
  className?: string
}

export function QRStatusBadge({ printed, className }: QRStatusBadgeProps) {
  return (
    <Badge variant={printed ? 'brand' : 'warning'} className={className}>
      {printed ? 'QR Εκτυπώθηκε' : 'QR Εκκρεμεί'}
    </Badge>
  )
}
