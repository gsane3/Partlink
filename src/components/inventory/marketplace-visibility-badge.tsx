import { Badge } from '@/components/ui/badge'

interface MarketplaceVisibilityBadgeProps {
  isPublished: boolean
  className?: string
}

export function MarketplaceVisibilityBadge({ isPublished, className }: MarketplaceVisibilityBadgeProps) {
  return (
    <Badge variant={isPublished ? 'success' : 'muted'} className={className}>
      {isPublished ? 'Δημοσιευμένο' : 'Αδημοσίευτο'}
    </Badge>
  )
}
