import Link from 'next/link'
import { SellerHeader } from '@/components/seller/seller-header'
import { DispatchAlert } from '@/components/seller/dispatch-alert'
import { QuickSearch } from '@/components/seller/quick-search'
import { PartRow } from '@/components/inventory/part-row'
import { PAYMENT_METHOD_LABELS, ORDER_STATUS_LABELS } from '@/lib/constants'
import { ROUTES } from '@/lib/routes'
import { formatPrice, formatDate, formatOrderNumber, formatPriceCompact } from '@/lib/utils'
import {
  getCurrentSellerId,
  getCurrentSeller,
  getSellerInventory,
  getSellerPendingOrders,
  getSellerDispatchOrders,
} from '@/lib/data/seller'

const ACTIVITY = [
  {
    id: 'a1',
    text: 'Παραγγελία ελήφθη',
    sub: 'ECU / Εγκέφαλος κινητήρα · €320',
    at: '11 Μαΐ',
    type: 'order' as const,
  },
  {
    id: 'a2',
    text: 'Παραγγελία #001 ελήφθη',
    sub: 'Φανάρι εμπρός δεξί · €95',
    at: '1 Μαΐ',
    type: 'order' as const,
  },
  {
    id: 'a3',
    text: 'Παραγγελία #002 εστάλη',
    sub: 'Τουρμπίνα N47 · ACS · €450',
    at: '29 Απρ',
    type: 'dispatch' as const,
  },
  {
    id: 'a4',
    text: 'Ανταλλακτικό προστέθηκε',
    sub: 'Μίζα · Ford Focus 1.6 TDCi',
    at: '5 Απρ',
    type: 'part' as const,
  },
]

export function SellerMobileDashboard() {
  const sellerId = getCurrentSellerId()
  const seller = getCurrentSeller()
  const sellerParts = getSellerInventory(sellerId)
  const pendingOrders = getSellerPendingOrders(sellerId)
  const dispatchOrders = getSellerDispatchOrders(sellerId)

  const recentParts = [...sellerParts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)

  const stockValue = sellerParts
    .filter((p) => p.status === 'available')
    .reduce((sum, p) => sum + p.price * p.quantity, 0)

  return (
    <div className="px-4 pt-4 pb-36 space-y-6">

      <SellerHeader seller={seller} />

      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{sellerParts.length}</p>
          <p className="text-xs text-slate-500 mt-0.5 leading-tight">στο stock</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-slate-900 tabular-nums">
            {pendingOrders.length + dispatchOrders.length}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 leading-tight">εκκρεμούν</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-center">
          <p className="text-lg font-bold text-slate-900 tabular-nums tracking-tight">
            {formatPriceCompact(stockValue)}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 leading-tight">αξία stock</p>
        </div>
      </div>

      {dispatchOrders.length > 0 && (
        <DispatchAlert orders={dispatchOrders} />
      )}

      <section>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            Εκκρεμείς παραγγελίες
          </p>
          <Link
            href={ROUTES.SELLER.ORDERS}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Όλες →
          </Link>
        </div>

        {pendingOrders.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-6 text-center">
            <p className="text-sm text-slate-500">Δεν υπάρχουν εκκρεμείς παραγγελίες</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
            {pendingOrders.map((order) => (
              <Link
                key={order.id}
                href={ROUTES.SELLER.ORDER_DETAIL(order.id)}
                className="flex items-start gap-3 px-4 py-4 hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {order.items[0]?.part.partName ?? '—'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    #{formatOrderNumber(order.id)} · {formatDate(order.createdAt)}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700">
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                    {order.payment && (
                      <span className="text-xs text-slate-400">
                        {PAYMENT_METHOD_LABELS[order.payment.method]}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2 pt-0.5">
                  <p className="text-sm font-bold text-slate-900">
                    {formatPrice(order.totalAmount)}
                  </p>
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <QuickSearch parts={sellerParts} />

      <section>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            Πρόσφατες προσθήκες
          </p>
          <Link
            href={ROUTES.SELLER.INVENTORY}
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            Όλο το stock →
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
          {recentParts.map((part) => (
            <PartRow
              key={part.id}
              variant="compact"
              part={part}
              href={ROUTES.SELLER.PART_DETAIL(part.id)}
            />
          ))}
        </div>
      </section>

      <section>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Πρόσφατη δραστηριότητα
        </p>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
          {ACTIVITY.map((item) => (
            <div key={item.id} className="flex items-start gap-3 px-4 py-3.5">
              <div className={`mt-0.5 w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                item.type === 'order' ? 'bg-blue-50 text-blue-600' :
                item.type === 'dispatch' ? 'bg-green-50 text-green-600' :
                'bg-slate-100 text-slate-500'
              }`}>
                {item.type === 'order' && (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                )}
                {item.type === 'dispatch' && (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {item.type === 'part' && (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">{item.text}</p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{item.sub}</p>
              </div>
              <p className="text-xs text-slate-400 flex-shrink-0 mt-0.5">{item.at}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
