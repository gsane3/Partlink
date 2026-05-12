'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getOrderById, getBuyerById } from '@/lib/data/seller'
import { PartCard } from '@/components/inventory/part-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/layout/page-container'
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  DELIVERY_METHOD_LABELS,
} from '@/lib/constants'
import { ROUTES } from '@/lib/routes'
import { formatOrderNumber, formatDate, formatPrice, cn } from '@/lib/utils'
import type { OrderStatus, PaymentStatus } from '@/types'
import type { BadgeVariant } from '@/components/ui/badge'

// ─── Local label maps ─────────────────────────────────────────────────────────

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

// ─── Info card layout ─────────────────────────────────────────────────────────

function InfoCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
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

// ─── Timeline ────────────────────────────────────────────────────────────────

interface TimelineStep {
  label: string
  date?: string
  done: boolean
}

function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={step.label} className="flex gap-3">
          {/* Connector line + dot */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                step.done
                  ? 'bg-green-600 border-green-600'
                  : 'bg-white border-slate-300'
              )}
            >
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

          {/* Content */}
          <div className="pb-4 flex-1 min-w-0">
            <p className={cn('text-sm font-medium', step.done ? 'text-slate-900' : 'text-slate-400')}>
              {step.label}
            </p>
            {step.date && (
              <p className="text-xs text-slate-500 mt-0.5">{step.date}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Action state for optimistic UI ──────────────────────────────────────────

type ActionState = 'idle' | 'accepted' | 'cancelled'

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SellerOrderDetailPage() {
  const params = useParams<{ orderId: string }>()
  const orderId = params?.orderId ?? ''
  const order = getOrderById(orderId)
  const [actionState, setActionState] = useState<ActionState>('idle')

  if (!order) {
    return (
      <PageContainer>
        <div className="py-16 text-center">
          <p className="text-sm text-slate-500">Η παραγγελία δεν βρέθηκε.</p>
          <Link href={ROUTES.SELLER.ORDERS} className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
            ← Επιστροφή στις παραγγελίες
          </Link>
        </div>
      </PageContainer>
    )
  }

  const buyer = getBuyerById(order.buyerId)
  const item = order.items[0]

  // Effective status after local action
  const effectiveStatus: OrderStatus =
    actionState === 'accepted' ? 'confirmed' :
    actionState === 'cancelled' ? 'cancelled' :
    order.status

  // Timeline steps
  const timelineSteps: TimelineStep[] = [
    {
      label: 'Παραγγελία ελήφθη',
      date: formatDate(order.createdAt),
      done: true,
    },
    {
      label: 'Πληρωμή',
      date: order.payment?.paidAt ? formatDate(order.payment.paidAt) : undefined,
      done: order.payment?.status === 'paid',
    },
    {
      label: 'Έτοιμο για αποστολή',
      done: ['confirmed', 'dispatched', 'shipped', 'delivered'].includes(effectiveStatus),
    },
    {
      label: 'Απεστάλη',
      date: order.shipment?.dispatchedAt ? formatDate(order.shipment.dispatchedAt) : undefined,
      done: !!order.shipment?.dispatchedAt,
    },
  ]

  if (['delivered'].includes(order.status)) {
    timelineSteps.push({
      label: 'Παραδόθηκε',
      date: order.shipment?.deliveredAt ? formatDate(order.shipment.deliveredAt) : undefined,
      done: order.status === 'delivered',
    })
  }

  // Whether to show action bar
  const showActionBar = actionState === 'idle' && ['pending', 'confirmed'].includes(effectiveStatus)

  return (
    <>
      <div className={cn('pb-6', showActionBar ? 'pb-36 lg:pb-28' : 'pb-10')}>
        <PageContainer>
          {/* Back link + header */}
          <div className="mb-5">
            <Link
              href={ROUTES.SELLER.ORDERS}
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

          {/* Action state banners */}
          {actionState === 'accepted' && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
              <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm font-medium text-green-800">
                Παραγγελία εγκρίθηκε — ετοιμάστε για αποστολή
              </p>
            </div>
          )}
          {actionState === 'cancelled' && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <p className="text-sm font-medium text-red-700">Παραγγελία ακυρώθηκε</p>
            </div>
          )}

          <div className="space-y-4 max-w-2xl">
            {/* Buyer */}
            <InfoCard title="Αγοραστής">
              {buyer ? (
                <div className="space-y-1.5">
                  <p className="text-sm font-semibold text-slate-900">
                    {buyer.fullName}
                    {buyer.companyName && (
                      <span className="font-normal text-slate-500 ml-1">· {buyer.companyName}</span>
                    )}
                  </p>
                  <p className="text-sm text-slate-600">{buyer.phone} · {buyer.email}</p>
                  <p className="text-sm text-slate-600">
                    {buyer.shippingAddress}, {buyer.city} {buyer.postalCode}
                  </p>
                  <div className="pt-0.5">
                    <Badge variant={buyer.documentPreference === 'invoice' ? 'brand' : 'muted'}>
                      {buyer.documentPreference === 'invoice' ? 'Τιμολόγιο' : 'Απόδειξη'}
                    </Badge>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Αγοραστής #{order.buyerId}</p>
              )}
            </InfoCard>

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

            {/* Shipment */}
            {order.shipment && (
              <InfoCard title="Αποστολή">
                <div className="space-y-0">
                  <InfoRow label="Τρόπος">{DELIVERY_METHOD_LABELS[order.shipment.method]}</InfoRow>
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
            <InfoCard title="Ιστορικό παραγγελίας">
              <Timeline steps={timelineSteps} />
            </InfoCard>
          </div>
        </PageContainer>
      </div>

      {/* Sticky bottom action bar */}
      {showActionBar && (
        <div className="fixed bottom-16 lg:bottom-0 left-0 lg:left-60 right-0 z-30 bg-white border-t border-slate-200 px-4 py-3">
          {effectiveStatus === 'pending' && (
            <div className="flex gap-3 max-w-2xl mx-auto">
              <Button
                variant="outline"
                onClick={() => setActionState('cancelled')}
                className="flex-shrink-0 gap-1 text-red-600 border-red-200 hover:bg-red-50"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Ακύρωση
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={() => setActionState('accepted')}
                className="h-11 gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Αποδοχή παραγγελίας
              </Button>
            </div>
          )}

          {effectiveStatus === 'confirmed' && (
            <div className="max-w-2xl mx-auto">
              <Link
                href={ROUTES.SELLER.INVENTORY_SCAN}
                className="flex items-center justify-center gap-2 w-full h-11 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                Σκάναρε QR για αποστολή
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  )
}
