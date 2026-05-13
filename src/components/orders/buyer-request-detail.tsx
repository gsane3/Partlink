'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/layout/page-container'
import { cn, formatDate, formatPrice } from '@/lib/utils'
import { ROUTES } from '@/lib/routes'
import { findBuyerRequestById } from '@/lib/mock-data/buyer-requests'
import type { BuyerRequest, RequestStatus } from '@/lib/mock-data/buyer-requests'
import { BUYER_STATUS_CONFIG } from '@/lib/requests/status'
import { DELIVERY_PREFERENCE_LABELS } from '@/lib/requests/delivery'
import { buildBaseActivityEvents } from '@/lib/requests/activity'
import type { RequestActivityEvent } from '@/lib/requests/activity'
import { RequestActivityTimeline } from '@/components/orders/request-activity-timeline'
import { buildBaseRequestMessages } from '@/lib/requests/messages'
import type { RequestMessage } from '@/lib/requests/messages'
import { RequestMessageThread } from '@/components/orders/request-message-thread'

// ─── Constants ────────────────────────────────────────────────────────────────

// ─── Layout helpers ───────────────────────────────────────────────────────────

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
      <span className="text-sm text-slate-500 flex-shrink-0 w-32">{label}</span>
      <span className="text-sm font-medium text-slate-900 text-right flex-1 min-w-0">{children}</span>
    </div>
  )
}

// ─── Not found ────────────────────────────────────────────────────────────────

function BuyerRequestNotFound() {
  return (
    <PageContainer>
      <div className="py-16 text-center max-w-sm mx-auto">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Το αίτημα δεν βρέθηκε</h2>
        <p className="text-sm text-slate-500 mb-6">Μπορεί να έχει αφαιρεθεί ή να μην υπάρχει στο demo.</p>
        <Link
          href={ROUTES.BUYER.ORDERS}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Επιστροφή στα αιτήματά μου
        </Link>
      </div>
    </PageContainer>
  )
}

// ─── Detail content ───────────────────────────────────────────────────────────

function BuyerRequestDetailContent({ request }: { request: BuyerRequest }) {
  const [status,        setStatus]        = useState<RequestStatus>(request.status)
  const [priceAccepted, setPriceAccepted] = useState(false)
  const [showMsgPanel,  setShowMsgPanel]  = useState(false)
  const [msgText,       setMsgText]       = useState('')
  const [successNote,   setSuccessNote]   = useState<string | null>(null)
  const [localEvents,   setLocalEvents]   = useState<RequestActivityEvent[]>([])
  const [localMessages, setLocalMessages] = useState<RequestMessage[]>([])
  const eventCounter = useRef(0)
  const msgCounter   = useRef(0)

  const addEvent = (event: Omit<RequestActivityEvent, 'id'>) => {
    eventCounter.current += 1
    setLocalEvents((prev) => [...prev, { ...event, id: `local-${eventCounter.current}` }])
  }

  const addMessage = (msg: Omit<RequestMessage, 'id'>) => {
    msgCounter.current += 1
    setLocalMessages((prev) => [...prev, { ...msg, id: `msg-${msgCounter.current}` }])
  }

  const displayStatus: RequestStatus = priceAccepted ? 'completed' : status
  const { label: statusLabel, variant: statusVariant } = BUYER_STATUS_CONFIG[displayStatus]
  const hasPrice = request.partPrice > 0

  const showToast = (msg: string) => {
    setSuccessNote(msg)
    setTimeout(() => setSuccessNote(null), 3500)
  }

  const handleAcceptPrice = () => {
    setPriceAccepted(true)
    setStatus('completed')
    addEvent({ title: 'Τιμή αποδέχτηκε', description: 'Το επόμενο βήμα θα είναι παραλαβή ή αποστολή.', tone: 'success' })
    showToast('Η τιμή αποδέχτηκε για το demo. Το επόμενο βήμα θα είναι παραλαβή ή αποστολή.')
  }

  const handleSendMsg = () => {
    if (!msgText.trim()) return
    const text = msgText.trim()
    setShowMsgPanel(false)
    setMsgText('')
    addMessage({ author: 'buyer', authorLabel: request.buyerCompany, body: text })
    addEvent({ title: 'Μήνυμα στάλθηκε', description: text, tone: 'info' })
    showToast('Το μήνυμα στάλθηκε για το demo.')
  }

  const canAcceptPrice = request.priceSent !== undefined && !priceAccepted && displayStatus !== 'completed'
  const allEvents   = [...buildBaseActivityEvents(request), ...localEvents]
  const allMessages = [...buildBaseRequestMessages(request), ...localMessages]

  return (
    <>
      {/* Toast */}
      {successNote && (
        <div className="fixed top-16 left-0 right-0 z-40 flex justify-center px-4 pt-3 pointer-events-none">
          <div className="bg-green-600 text-white text-sm font-medium rounded-xl px-5 py-3 shadow-lg max-w-sm text-center">
            {successNote}
          </div>
        </div>
      )}

      <div className="pb-44 lg:pb-10">
        <PageContainer>

          {/* Header */}
          <div className="mb-5">
            <Link
              href={ROUTES.BUYER.ORDERS}
              className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Αιτήματά μου
            </Link>
            <h1 className="text-xl font-bold text-slate-900 mb-1">{request.partName}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={statusVariant}>{statusLabel}</Badge>
              {request.sellerName && <span className="text-sm text-slate-500">{request.sellerName}</span>}
            </div>
          </div>

          <div className="space-y-4 max-w-2xl">

            {/* A. Request summary */}
            <InfoCard title="Αίτημα">
              <div className="space-y-0">
                <InfoRow label="Ανταλλακτικό">{request.partName}</InfoRow>
                <InfoRow label="SKU"><span className="font-mono text-xs">{request.partSku}</span></InfoRow>
                {request.donorVehicle && <InfoRow label="Όχημα">{request.donorVehicle}</InfoRow>}
                <InfoRow label="Τιμή καταχώρησης">
                  {hasPrice ? (
                    <span className="font-semibold">{formatPrice(request.partPrice)}</span>
                  ) : (
                    <span className="text-amber-700 italic">Κατόπιν ζήτησης</span>
                  )}
                </InfoRow>
                {request.priceSent && (
                  <InfoRow label="Τιμή πωλητή">
                    <span className="font-bold text-green-700">{formatPrice(request.priceSent)}</span>
                  </InfoRow>
                )}
                <InfoRow label="Παραλαβή">{DELIVERY_PREFERENCE_LABELS[request.delivery]}</InfoRow>
                <InfoRow label="Κατάσταση"><Badge variant={statusVariant}>{statusLabel}</Badge></InfoRow>
                <InfoRow label="Ημερομηνία">{formatDate(request.createdAt)}</InfoRow>
              </div>
            </InfoCard>

            {/* B. Seller card */}
            <InfoCard title="Πωλητής">
              <p className="text-sm font-semibold text-slate-900">
                {request.sellerName ?? 'Επαγγελματίας πωλητής'}
              </p>
              <p className="text-xs text-slate-500 mt-1">Επαλυθευμένος πωλητής στο Partlink</p>
            </InfoCard>

            {/* C. Message thread */}
            <RequestMessageThread messages={allMessages} perspective="buyer" />

            {/* Price acceptance banner */}
            {priceAccepted && (
              <div className="flex items-start gap-2.5 bg-green-50 border border-green-200 rounded-xl px-4 py-3.5">
                <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-green-800">
                  Η τιμή αποδέχτηκε. Το επόμενο βήμα θα είναι παραλαβή ή αποστολή.
                </p>
              </div>
            )}

            {/* E. Compatibility warning */}
            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5">
              <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xs text-amber-800 leading-relaxed">
                Πριν προχωρήσεις, επιβεβαίωσε συμβατότητα με OEM, VIN ή τον πωλητή.
              </p>
            </div>

            {/* F. Activity timeline */}
            <RequestActivityTimeline events={allEvents} />

            {/* G. Message panel — triggered from sticky bar */}
            {!priceAccepted && showMsgPanel && (
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-900">Μήνυμα στον πωλητή</p>
                  <button type="button" onClick={() => setShowMsgPanel(false)} className="text-xs text-slate-500 hover:text-slate-700 font-medium">Ακύρωση</button>
                </div>
                <div className="px-4 py-4 space-y-3">
                  <textarea
                    value={msgText}
                    onChange={(e) => setMsgText(e.target.value)}
                    placeholder="Γράψε το μήνυμά σου..."
                    rows={3}
                    className={cn(
                      'w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2.5 resize-none',
                      'text-slate-900 placeholder:text-slate-400',
                      'focus:outline-none focus:ring-2 focus:ring-blue-500'
                    )}
                  />
                  <Button type="button" variant="primary" fullWidth onClick={handleSendMsg} className="h-11" disabled={!msgText.trim()}>
                    Αποστολή μηνύματος
                  </Button>
                </div>
              </div>
            )}
          </div>
        </PageContainer>
      </div>

      {/* Sticky bottom bar */}
      {!priceAccepted && !showMsgPanel && (
        <div className="fixed bottom-16 lg:bottom-0 left-0 lg:left-60 right-0 z-30 bg-white border-t border-slate-200 px-4 py-3">
          <div className="flex gap-2.5 max-w-2xl mx-auto">
            <Link
              href={ROUTES.BUYER.ORDERS}
              className="flex-shrink-0 inline-flex items-center gap-1 h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Πίσω
            </Link>
            {canAcceptPrice ? (
              <Button type="button" variant="primary" fullWidth onClick={handleAcceptPrice} className="h-11 gap-1.5">
                Αποδοχή τιμής
              </Button>
            ) : (
              <Button type="button" variant="primary" fullWidth onClick={() => setShowMsgPanel(true)} className="h-11 gap-1.5">
                Μήνυμα στον πωλητή
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  )
}

// ─── Public export ────────────────────────────────────────────────────────────

export function BuyerRequestDetail({ requestId }: { requestId: string }) {
  const request = findBuyerRequestById(requestId)
  if (!request) return <BuyerRequestNotFound />
  return <BuyerRequestDetailContent request={request} />
}
