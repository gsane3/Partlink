'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConditionBadge } from '@/components/inventory/condition-badge'
import { CATEGORIES } from '@/lib/constants'
import { ROUTES } from '@/lib/routes'
import { formatPrice } from '@/lib/utils'
import { getMarketplacePartById } from '@/lib/data/marketplace'
import { cn } from '@/lib/utils'

function getCategoryName(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.name ?? id
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{title}</p>
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  )
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 first:pt-0 last:pb-0">
      <span className="text-sm text-slate-500 flex-shrink-0 w-28">{label}</span>
      <span className="text-sm font-medium text-slate-900 text-right flex-1 min-w-0">{children}</span>
    </div>
  )
}

type RequestState = 'idle' | 'sent'

interface MarketplaceDetailProps {
  partId: string
}

export function MarketplaceDetail({ partId }: MarketplaceDetailProps) {
  const [requestState, setRequestState] = useState<RequestState>('idle')
  const result = getMarketplacePartById(partId)

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-sm text-slate-500 mb-3">Το ανταλλακτικό δεν βρέθηκε ή δεν είναι διαθέσιμο.</p>
        <Link href={ROUTES.MARKETPLACE} className="text-sm font-medium text-blue-600 hover:text-blue-700">
          ← Επιστροφή στο Marketplace
        </Link>
      </div>
    )
  }

  const { part, seller } = result

  return (
    <>
      {/* Scrollable content — pb clears sticky bottom bar */}
      <div className="max-w-2xl mx-auto px-4 py-6 pb-28">
        {/* Back link */}
        <Link
          href={ROUTES.MARKETPLACE}
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-5 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Marketplace
        </Link>

        {/* Request success banner */}
        {requestState === 'sent' && (
          <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5">
            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-medium text-green-800">Το αίτημα στάλθηκε στον πωλητή</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Part header */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h1 className="text-xl font-bold text-slate-900 leading-snug flex-1">
                {part.partName}
              </h1>
              <p className="text-2xl font-bold text-slate-900 flex-shrink-0 tabular-nums">
                {formatPrice(part.price)}
              </p>
            </div>
            <p className="text-sm text-slate-500 mb-3">
              {part.vehicle.make} {part.vehicle.model} {part.vehicle.year}
            </p>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="success">Διαθέσιμο</Badge>
              <ConditionBadge condition={part.condition} />
              <Badge variant="brand">Δημοσιευμένο</Badge>
            </div>
          </div>

          {/* Vehicle */}
          <InfoCard title="Στοιχεία οχήματος">
            <div className="space-y-0">
              <InfoRow label="Μάρκα">{part.vehicle.make}</InfoRow>
              <InfoRow label="Μοντέλο">{part.vehicle.model}</InfoRow>
              <InfoRow label="Έτος">{part.vehicle.year}</InfoRow>
              {part.vehicle.engine && (
                <InfoRow label="Κινητήρας">
                  <span className="font-mono text-sm">{part.vehicle.engine}</span>
                </InfoRow>
              )}
              {part.vehicle.fuel && (
                <InfoRow label="Καύσιμο">{part.vehicle.fuel}</InfoRow>
              )}
            </div>
          </InfoCard>

          {/* Seller */}
          {seller && (
            <InfoCard title="Πωλητής">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{seller.businessName}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{seller.city}</p>
                </div>
                {seller.verificationStatus === 'approved' && (
                  <Badge variant="success">Επαλυθευμένος</Badge>
                )}
              </div>
              {seller.verificationStatus === 'approved' && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Επαλυθευμένος πωλητής στο Partlink
                </p>
              )}
            </InfoCard>
          )}

          {/* Part details */}
          <InfoCard title="Στοιχεία ανταλλακτικού">
            <div className="space-y-0">
              <InfoRow label="Κατηγορία">{getCategoryName(part.categoryId)}</InfoRow>
              <InfoRow label="SKU"><span className="font-mono text-sm">{part.sku}</span></InfoRow>
              {part.vehicle.vin && (
                <InfoRow label="VIN"><span className="font-mono text-xs">{part.vehicle.vin}</span></InfoRow>
              )}
            </div>
            {part.description && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Περιγραφή</p>
                <p className="text-sm text-slate-700 leading-relaxed">{part.description}</p>
              </div>
            )}
          </InfoCard>

          {/* Secondary actions */}
          <div className="space-y-2.5">
            <Link
              href={ROUTES.BUYER.CHATS}
              className="w-full h-11 flex items-center justify-center gap-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Μήνυμα στον πωλητή
            </Link>
            <button
              type="button"
              className="w-full h-11 flex items-center justify-center gap-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Αποθήκευση
            </button>
          </div>
        </div>
      </div>

      {/* Sticky bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-4 py-3">
        <div className={cn(
          'flex items-center gap-3 max-w-2xl mx-auto',
        )}>
          <div className="flex-shrink-0">
            <p className="text-xl font-bold text-slate-900 tabular-nums">{formatPrice(part.price)}</p>
            <p className="text-xs text-slate-400 mt-0.5">+ αποστολή</p>
          </div>

          {requestState === 'idle' ? (
            <Button
              variant="primary"
              fullWidth
              onClick={() => setRequestState('sent')}
              className="h-11 gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Αίτημα αγοράς
            </Button>
          ) : (
            <div className="flex-1 h-11 flex items-center justify-center gap-2 bg-green-50 border border-green-200 rounded-lg">
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-semibold text-green-800">Αίτημα στάλθηκε</span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
