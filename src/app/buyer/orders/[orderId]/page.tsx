'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getCurrentBuyerId, getCurrentBuyer, getBuyerOrderById, getSellerById } from '@/lib/data/buyer'
import { PartCard } from '@/components/inventory/part-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/layout/page-container'
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  DELIVERY_METHOD_LABELS,
  VERIFICATION_STATUS_LABELS,
} from '@/lib/constants'
import { ROUTES } from '@/lib/routes'
import { formatOrderNumber, formatDate, formatPrice, cn } from '@/lib/utils'
import type { OrderStatus, PaymentStatus } from '@/types'
import type { BadgeVariant } from '@/components/ui/badge'

// ─── Local maps ───────────────────────────────────────────────────────────────

const ORDER_STATUS_VARIANT: Record<OrderStatus, BadgeVariant> = {
  pending: 'warning',
  confirmed: 'brand',
  dispatched: 'purple',
  shipped: 'purple',
  delivered: 'success',
  cancelled: 'danger',
  returned: 'danger',
}

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Εκκρεμεί',
  paid: 'Πληρώθηκε',
  failed: 'Απέτυχε',
  refunded: 'Επιστράφηκε',
}

const PAYMENT_STATUS_VARIANT: Record<PaymentStatus, BadgeVariant> = {
  pending: 'warning',
  paid: 'success',
  failed: 'danger',
  refunded: 'muted',
}

// ─── Shared layout primitives ─────────────────────────────────────────────────

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

// ─── Status banner ────────────────────────────────────────────────────────────

function StatusBanner({ status }: { status: OrderStatus }) {
  const configs: Partial<Record<OrderStatus, { bg: string; text: string; message: string }>> = {
    pending: {
      bg: 'bg-amber-50 border-amber-200',
      text: 'text-amber-800',
      message: 'Περιμένουμε επιβεβαίωση από τον πωλητή',
    },
    confirmed: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      message: 'Ο πωλητής ετοιμάζει την αποστολή',
    },
    dispatched: {
      bg: 'bg-purple-50 border-purple-200',
      text: 'text-purple-800',
      message: 'Η παραγγελία είναι στον δρόμο',
    },
    shipped: {
      bg: 'bg-purple-50 border-purple-200',
      text: 'text-purple-800',
      message: 'Η παραγγελία είναι στον δρόμο',
    },
    delivered: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      message: 'Η παραγγελία ολοκληρώθηκε',
    },
  }

  const config = configs[status]
  if (!config) return null

  return (
    <div className={cn('flex items-center gap-2.5 border rounded-xl px-4 py-3 mb-4', config.bg)}>
      <svg className={cn('w-4 h-4 flex-shrink-0', config.text.replace('text-', 'text-'))} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {status === 'delivered' ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        )}
      </svg>
      <p className={cn('text-sm font-medium', config.text)}>{config.message}</p>
    </div>
  )
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

interface TimelineStep {
  label: string
  date?: string
  done: boolean
}

function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div>
      {steps.map((step, i) => (
        <div key={step.label} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={cn(
              'w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5',
              step.done ? 'bg-green-600 border-green-600' : 'bg-white border-slate-300'
            )}>
              {step.done && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            {i < steps.length - 1 && (
              <div className={cn('w-0.5 flex-1 my-1 min-h-[16px]', step.done ? 'bg-green-200' : 'bg-slate-200')} />
            )}
          </div>
          <div className="pb-4 flex-1 min-w-0">
            <p className={cn('text-sm font-medium', step.done ? 'text-slate-900' : 'text-slate-400')}>
              {step.label}
            </p>
            {step.date && <p className="text-xs text-slate-500 mt-0.5">{step.date}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Action state ─────────────────────────────────────────────────────────────

type ActionState = 'idle' | 'cancelled' | 'reviewed'

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BuyerOrderDetailPage() {
  const params = useParams<{ orderId: string }>()
  const orderId = params?.orderId ?? ''
  const buyerId = getCurrentBuyerId()
  const buyer = getCurrentBuyer()
  const order = getBuyerOrderById(orderId, buyerId)
  const [actionState, setActionState] = useState<ActionState>('idle')

  if (!order) {
    return (
      <PageContainer>
        <div className="py-16 text-center">
          <p className="text-sm text-slate-500">Η παραγγελία δεν βρέθηκε.</p>
          <Link href={ROUTES.BUYER.ORDERS} className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
            ← Επιστροφή στις παραγγελίες
          </Link>
        </div>
      </PageContainer>
    )
  }

  const seller = getSellerById(order.sellerId)
  const item = order.items[0]

  // Effective status reflects local cancel action
  const effectiveStatus: OrderStatus =
    actionState === 'cancelled' ? 'cancelled' : order.status

  // Timeline steps
  const timelineSteps: TimelineStep[] = [
    {
      label: 'Παραγγελία τοποθετήθηκε',
      date: formatDate(order.createdAt),
      done: true,
    },
    {
      label: 'Επιβεβαίωση πωλητή',
      date: order.updatedAt !== order.createdAt && order.status !== 'pending'
        ? formatDate(order.updatedAt)
        : undefined,
      done: !['pending', 'cancelled'].includes(effectiveStatus),
    },
    {
      label: 'Εστάλη',
      date: order.shipment?.dispatchedAt ? formatDate(order.shipment.dispatchedAt) : undefined,
      done: !!order.shipment?.dispatchedAt,
    },
    {
      label: 'Παραδόθηκε',
      date: order.shipment?.deliveredAt ? formatDate(order.shipment.deliveredAt) : undefined,
      done: order.status === 'delivered',
    },
  ]

  const showActionBar = actionState === 'idle' && effectiveStatus !== 'cancelled'

  return (
    <>
      <div className={cn('pb-6', showActionBar ? 'pb-36 lg:pb-28' : 'pb-10')}>
        <PageContainer>
          {/* Back link + header */}
          <div className="mb-5">
            <Link
              href={ROUTES.BUYER.ORDERS}
              className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Παραγγελίες
            </Link>

            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Παραγγελία #{formatOrderNumber(order.id)}
                </h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant={ORDER_STATUS_VARIANT[effectiveStatus]}>
                    {ORDER_STATUS_LABELS[effectiveStatus]}
                  </Badge>
                  <span className="text-sm text-slate-400">{formatDate(order.createdAt)}</span>
                </div>
              </div>
              <p className="text-xl font-bold text-slate-900 flex-shrink-0 tabular-nums">
                {formatPrice(order.totalAmount)}
              </p>
            </div>
          </div>

          {/* Cancelled banner */}
          {actionState === 'cancelled' && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <p className="text-sm font-medium text-red-700">Το αίτημα ακυρώθηκε</p>
            </div>
          )}

          {/* Reviewed banner */}
          {actionState === 'reviewed' && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
              <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm font-medium text-green-800">Η αξιολόγησή σου καταχωρήθηκε</p>
            </div>
          )}

          {/* Status banner */}
          {actionState === 'idle' && <StatusBanner status={order.status} />}

          <div className="space-y-4 max-w-2xl">
            {/* Part item */}
            {item && (
              <InfoCard title="Ανταλλακτικό">
                <PartCard part={item.part} />
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Τιμή παραγγελίας</span>
                  <span className="text-sm font-bold text-slate-900">{formatPrice(item.priceAtOrder)}</span>
                </div>
              </InfoCard>
            )}

            {/* Seller */}
            {seller && (
              <InfoCard title="Πωλητής">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{seller.businessName}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{seller.city}</p>
                  </div>
                  {seller.verificationStatus === 'approved' && (
                    <Badge variant="success">Επαλ/μένος</Badge>
                  )}
                </div>
                {seller.verificationStatus !== 'approved' && (
                  <p className="text-xs text-slate-400 mb-3">
                    {VERIFICATION_STATUS_LABELS[seller.verificationStatus]}
                  </p>
                )}
                <Link
                  href={ROUTES.BUYER.CHATS}
                  className="flex items-center justify-center gap-2 w-full h-10 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Μήνυμα στον πωλητή
                </Link>
              </InfoCard>
            )}

            {/* Payment */}
            {order.payment && (
              <InfoCard title="Πληρωμή">
                <div className="space-y-0">
                  <InfoRow label="Τρόπος">{PAYMENT_METHOD_LABELS[order.payment.method]}</InfoRow>
                  <InfoRow label="Κατάσταση">
                    <Badge variant={PAYMENT_STATUS_VARIANT[order.payment.status]}>
                      {PAYMENT_STATUS_LABELS[order.payment.status]}
                    </Badge>
                  </InfoRow>
                  <InfoRow label="Ποσό">{formatPrice(order.payment.amount)}</InfoRow>
                  {order.payment.paidAt && (
                    <InfoRow label="Ημερομηνία">{formatDate(order.payment.paidAt)}</InfoRow>
                  )}
                </div>
              </InfoCard>
            )}

            {/* Delivery */}
            {order.shipment && (
              <InfoCard title="Αποστολή">
                <div className="space-y-0">
                  <InfoRow label="Τρόπος">{DELIVERY_METHOD_LABELS[order.shipment.method]}</InfoRow>
                  <InfoRow label="Διεύθυνση">
                    {buyer.shippingAddress}, {buyer.city} {buyer.postalCode}
                  </InfoRow>
                  {order.shipment.carrier && (
                    <InfoRow label="Μεταφορέας">{order.shipment.carrier}</InfoRow>
                  )}
                  {order.shipment.trackingNumber && (
                    <InfoRow label="Tracking">
                      <span className="font-mono text-xs">{order.shipment.trackingNumber}</span>
                    </InfoRow>
                  )}
                  {order.shipment.dispatchedAt && (
                    <InfoRow label="Εστάλη">{formatDate(order.shipment.dispatchedAt)}</InfoRow>
                  )}
                  {order.shipment.deliveredAt && (
                    <InfoRow label="Παραδόθηκε">{formatDate(order.shipment.deliveredAt)}</InfoRow>
                  )}
                  {!order.shipment.dispatchedAt && (
                    <InfoRow label="Κατάσταση">
                      <span className="text-amber-600 font-medium">Αναμένει αποστολή</span>
                    </InfoRow>
                  )}
                </div>
              </InfoCard>
            )}

            {/* Timeline */}
            <InfoCard title="Πορεία παραγγελίας">
              <Timeline steps={timelineSteps} />
            </InfoCard>
          </div>
        </PageContainer>
      </div>

      {/* Sticky bottom action bar */}
      {showActionBar && (
        <div className="fixed bottom-16 lg:bottom-0 left-0 lg:left-60 right-0 z-30 bg-white border-t border-slate-200 px-4 py-3">
          <div className="flex gap-3 max-w-2xl mx-auto">
            {order.status === 'pending' && (
              <Button
                variant="outline"
                fullWidth
                onClick={() => setActionState('cancelled')}
                className="h-11 text-red-600 border-red-200 hover:bg-red-50"
              >
                Ακύρωση αιτήματος
              </Button>
            )}

            {order.status === 'confirmed' && (
              <Link
                href={ROUTES.BUYER.CHATS}
                className="flex items-center justify-center gap-2 w-full h-11 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Μήνυμα στον πωλητή
              </Link>
            )}

            {(order.status === 'dispatched' || order.status === 'shipped') && (
              <div className="flex-1 h-11 flex items-center justify-center gap-2 bg-purple-50 border border-purple-200 rounded-lg">
                <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span className="text-sm font-semibold text-purple-800">
                  {order.shipment?.trackingNumber ?? 'Παρακολούθηση αποστολής'}
                </span>
              </div>
            )}

            {order.status === 'delivered' && (
              <Button
                variant="primary"
                fullWidth
                onClick={() => setActionState('reviewed')}
                className="h-11 gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Αξιολόγηση πωλητή
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
