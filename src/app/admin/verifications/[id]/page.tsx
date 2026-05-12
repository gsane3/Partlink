'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getAdminSellerById, getDocumentChecks } from '@/lib/data/admin'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/layout/page-container'
import { VERIFICATION_STATUS_LABELS, CATEGORIES } from '@/lib/constants'
import { formatDate, formatPrice, cn } from '@/lib/utils'
import type { VerificationStatus } from '@/types'
import type { BadgeVariant } from '@/components/ui/badge'
import type { DocStatus } from '@/lib/data/admin'

// ─── Local helpers ────────────────────────────────────────────────────────────

const VERIF_BADGE: Record<VerificationStatus, BadgeVariant> = {
  registered: 'muted',
  submitted: 'warning',
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  needs_more_info: 'warning',
}

const DOC_STATUS_CONFIG: Record<DocStatus, { icon: string; color: string; label: string }> = {
  verified: { icon: '✓', color: 'text-green-600 bg-green-50 border-green-200', label: 'Επαληθεύτηκε' },
  missing: { icon: '✗', color: 'text-red-600 bg-red-50 border-red-200', label: 'Λείπει' },
  needs_review: { icon: '!', color: 'text-amber-600 bg-amber-50 border-amber-200', label: 'Χρειάζεται έλεγχο' },
}

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

// ─── Action state ─────────────────────────────────────────────────────────────

type ActionState = 'idle' | 'approved' | 'rejected' | 'correction'

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminVerificationDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? ''
  const detail = getAdminSellerById(id)
  const [actionState, setActionState] = useState<ActionState>('idle')
  const [note, setNote] = useState('')

  if (!detail) {
    return (
      <PageContainer>
        <div className="py-16 text-center">
          <p className="text-sm text-slate-500">Ο πωλητής δεν βρέθηκε.</p>
          <Link href="/admin/verifications" className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
            ← Επιστροφή
          </Link>
        </div>
      </PageContainer>
    )
  }

  const { seller, verif, parts } = detail
  const docChecks = getDocumentChecks(seller.verificationStatus)
  const previewParts = parts.slice(0, 3)

  const isPending =
    seller.verificationStatus === 'pending' || seller.verificationStatus === 'submitted'

  const showActionBar = isPending && actionState === 'idle'

  return (
    <>
      <div className={cn('pb-6', showActionBar ? 'pb-32 lg:pb-10' : 'pb-10')}>
        <PageContainer>
          {/* Back */}
          <Link
            href="/admin/verifications"
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-5 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Έλεγχοι πωλητών
          </Link>

          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <h1 className="text-xl font-bold text-slate-900">{seller.businessName}</h1>
              <p className="text-sm text-slate-500 mt-1">{seller.city}</p>
            </div>
            <Badge variant={VERIF_BADGE[seller.verificationStatus]}>
              {VERIFICATION_STATUS_LABELS[seller.verificationStatus]}
            </Badge>
          </div>

          {/* Action banners */}
          {actionState === 'approved' && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
              <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm font-medium text-green-800">Ο πωλητής εγκρίθηκε</p>
            </div>
          )}
          {actionState === 'rejected' && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <p className="text-sm font-medium text-red-700">Ο πωλητής απορρίφθηκε</p>
            </div>
          )}
          {actionState === 'correction' && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
              <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm font-medium text-amber-800">Ζητήθηκε διόρθωση στοιχείων</p>
            </div>
          )}

          <div className="space-y-4 max-w-2xl">
            {/* Business details */}
            <InfoCard title="Στοιχεία επιχείρησης">
              <div className="space-y-0">
                <InfoRow label="Επωνυμία">{seller.businessName}</InfoRow>
                <InfoRow label="Τηλέφωνο">{seller.phone}</InfoRow>
                <InfoRow label="Διεύθυνση">{seller.address}, {seller.city} {seller.postalCode}</InfoRow>
                <InfoRow label="ΑΦΜ"><span className="font-mono text-sm">{seller.afm}</span></InfoRow>
                <InfoRow label="ΔΟΥ">{seller.doy}</InfoRow>
                {seller.website && (
                  <InfoRow label="Website">
                    <a href={seller.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate text-xs">
                      {seller.website}
                    </a>
                  </InfoRow>
                )}
                {verif?.submittedAt && (
                  <InfoRow label="Υποβολή">{formatDate(verif.submittedAt)}</InfoRow>
                )}
                {verif?.reviewedAt && (
                  <InfoRow label="Εξετάστηκε">{formatDate(verif.reviewedAt)}</InfoRow>
                )}
              </div>
            </InfoCard>

            {/* Documents checklist */}
            <InfoCard title="Έλεγχος εγγράφων">
              <div className="space-y-2.5">
                {docChecks.map((doc) => {
                  const cfg = DOC_STATUS_CONFIG[doc.status]
                  return (
                    <div key={doc.label} className="flex items-center justify-between gap-3">
                      <p className="text-sm text-slate-700">{doc.label}</p>
                      <span className={cn(
                        'flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded border',
                        cfg.color
                      )}>
                        {cfg.icon} {cfg.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </InfoCard>

            {/* Admin note */}
            <InfoCard title="Σημειώσεις διαχειριστή">
              {verif?.reviewNote && (
                <p className="text-sm text-slate-600 mb-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  {verif.reviewNote}
                </p>
              )}
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Πρόσθεσε σημείωση για αυτόν τον πωλητή..."
                rows={3}
                className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </InfoCard>

            {/* Inventory preview */}
            {parts.length > 0 && (
              <InfoCard title={`Stock πωλητή (${parts.length} ανταλλακτικά)`}>
                <div className="space-y-2.5">
                  {previewParts.map((part) => (
                    <div key={part.id} className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{part.partName}</p>
                        <p className="text-xs text-slate-400">{getCategoryName(part.categoryId)} · {part.vehicle.make} {part.vehicle.model}</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 flex-shrink-0 tabular-nums">
                        {formatPrice(part.price)}
                      </p>
                    </div>
                  ))}
                  {parts.length > 3 && (
                    <p className="text-xs text-slate-400 pt-1">+ {parts.length - 3} ακόμα ανταλλακτικά</p>
                  )}
                </div>
              </InfoCard>
            )}

            {/* Desktop actions (non-pending sellers or when already acted) */}
            {(!isPending || actionState !== 'idle') && isPending === false && (
              <div className="flex gap-3">
                <Link
                  href="/admin/verifications"
                  className="flex-1 h-10 flex items-center justify-center border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Πίσω
                </Link>
              </div>
            )}
          </div>
        </PageContainer>
      </div>

      {/* Sticky action bar — only for pending/submitted sellers */}
      {showActionBar && (
        <div className="fixed bottom-0 left-0 lg:left-60 right-0 z-30 bg-white border-t border-slate-200 px-4 py-3">
          <div className="flex gap-2 max-w-2xl mx-auto">
            <Button
              variant="outline"
              onClick={() => setActionState('rejected')}
              className="flex-shrink-0 gap-1 text-red-600 border-red-200 hover:bg-red-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Απόρριψη
            </Button>
            <Button
              variant="outline"
              onClick={() => setActionState('correction')}
              className="flex-shrink-0 text-amber-700 border-amber-200 hover:bg-amber-50"
            >
              Διόρθωση
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => setActionState('approved')}
              className="h-11 gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Έγκριση πωλητή
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
