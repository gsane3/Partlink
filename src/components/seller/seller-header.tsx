import { Badge } from '@/components/ui/badge'
import { VERIFICATION_STATUS_LABELS } from '@/lib/constants'
import type { Seller } from '@/types'

interface SellerHeaderProps {
  seller: Seller
}

export function SellerHeader({ seller }: SellerHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-xl font-bold text-slate-900 leading-tight truncate">
          {seller.businessName}
        </h1>
        <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {seller.city}
        </p>
      </div>
      {seller.verificationStatus === 'approved' ? (
        <Badge variant="success" className="flex-shrink-0 mt-1">Εγκεκριμένος</Badge>
      ) : (
        <Badge variant="warning" className="flex-shrink-0 mt-1">
          {VERIFICATION_STATUS_LABELS[seller.verificationStatus]}
        </Badge>
      )}
    </div>
  )
}
