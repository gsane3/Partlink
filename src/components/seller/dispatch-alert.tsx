import Link from 'next/link'
import { PAYMENT_METHOD_LABELS } from '@/lib/constants'
import { formatOrderNumber } from '@/lib/utils'
import type { Order } from '@/types'

interface DispatchAlertProps {
  orders: Order[]
}

export function DispatchAlert({ orders }: DispatchAlertProps) {
  if (orders.length === 0) return null

  return (
    <div className="rounded-xl border border-amber-200 overflow-hidden bg-amber-50">
      <div className="px-4 py-3 bg-amber-100 border-b border-amber-200 flex items-center gap-2">
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
        </span>
        <span className="text-sm font-semibold text-amber-900">
          {orders.length === 1
            ? '1 παραγγελία περιμένει αποστολή'
            : `${orders.length} παραγγελίες περιμένουν αποστολή`}
        </span>
      </div>

      <div className="divide-y divide-amber-100">
        {orders.map((order) => (
          <div key={order.id} className="px-4 py-3 flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 truncate">
                {order.items[0]?.part.partName ?? '—'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                #{formatOrderNumber(order.id)}
                {order.payment?.method
                  ? ` · ${PAYMENT_METHOD_LABELS[order.payment.method]}`
                  : ''}
              </p>
            </div>
            <p className="text-sm font-bold text-slate-900 flex-shrink-0">
              €{order.totalAmount}
            </p>
          </div>
        ))}
      </div>

      <div className="px-4 pb-4">
        <Link
          href="/seller/inventory/scan"
          className="flex items-center justify-center gap-2 w-full h-12 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          Σκάναρε QR για αποστολή
        </Link>
      </div>
    </div>
  )
}
