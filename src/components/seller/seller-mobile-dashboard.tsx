import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { SellerHeader } from '@/components/seller/seller-header'
import { PartRow } from '@/components/inventory/part-row'
import { ROUTES } from '@/lib/routes'
import { formatDate } from '@/lib/utils'
import {
  getCurrentSellerId,
  getCurrentSeller,
  getSellerInventory,
} from '@/lib/data/seller'
import { mockBuyerRequests } from '@/lib/mock-data/buyer-requests'
import { SELLER_STATUS_CONFIG } from '@/lib/requests/status'
import { getRequestConversations } from '@/lib/requests/conversations'

// ─── Derived request data (module-level, static mock) ─────────────────────────

const newCount          = mockBuyerRequests.filter((r) => r.status === 'new').length
const needsPriceCount   = mockBuyerRequests.filter((r) => r.status === 'needs_price').length
const inProgressCount   = mockBuyerRequests.filter((r) => r.status === 'in_progress').length
const conversationCount = getRequestConversations().length
const openCount         = newCount + needsPriceCount

const recentRequests = [...mockBuyerRequests]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 3)

// ─── Component ────────────────────────────────────────────────────────────────

export function SellerMobileDashboard() {
  const sellerId    = getCurrentSellerId()
  const seller      = getCurrentSeller()
  const sellerParts = getSellerInventory(sellerId)

  const recentParts = [...sellerParts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)

  return (
    <div className="px-4 pt-4 pb-36 space-y-6">

      <SellerHeader seller={seller} />

      {/* ── Metrics ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-white border border-slate-200 rounded-xl p-2.5 text-center">
          <p className="text-xl font-bold text-amber-600 tabular-nums">{newCount}</p>
          <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">Νέα</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-2.5 text-center">
          <p className="text-xl font-bold text-amber-600 tabular-nums">{needsPriceCount}</p>
          <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">Για τιμή</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-2.5 text-center">
          <p className="text-xl font-bold text-blue-600 tabular-nums">{inProgressCount}</p>
          <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">Σε εξέλιξη</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-2.5 text-center">
          <p className="text-xl font-bold text-slate-700 tabular-nums">{conversationCount}</p>
          <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">Μηνύματα</p>
        </div>
      </div>

      {/* ── Priorities ──────────────────────────────────────────────────────── */}
      <section>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Προτεραιότητες
        </p>
        <div className="space-y-2">
          <Link
            href={ROUTES.SELLER.ORDERS}
            className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-4 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">Αιτήματα που περιμένουν</p>
              <p className="text-xs text-slate-500 mt-0.5">Νέα και αιτήματα για τιμή</p>
            </div>
            {openCount > 0 && (
              <span className="min-w-[1.5rem] h-6 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {openCount}
              </span>
            )}
            <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link
            href={ROUTES.SELLER.CHATS}
            className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-4 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">Μηνύματα αγοραστών</p>
              <p className="text-xs text-slate-500 mt-0.5">Συζητήσεις από αιτήματα</p>
            </div>
            <span className="text-xs font-semibold text-slate-500 flex-shrink-0">{conversationCount}</span>
            <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Recent requests ──────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            Πρόσφατα αιτήματα
          </p>
          <Link href={ROUTES.SELLER.ORDERS} className="text-xs font-medium text-blue-600 hover:text-blue-700">
            Όλα →
          </Link>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
          {recentRequests.map((req) => {
            const { label: statusLabel, variant: statusVariant } = SELLER_STATUS_CONFIG[req.status]
            return (
              <Link
                key={req.id}
                href={ROUTES.SELLER.ORDER_DETAIL(req.id)}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{req.buyerCompany}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{req.partName}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant={statusVariant}>{statusLabel}</Badge>
                  <span className="text-xs text-slate-400">{formatDate(req.createdAt)}</span>
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── Quick actions ────────────────────────────────────────────────────── */}
      <section>
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Γρήγορες ενέργειες
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Πρόσθεσε ανταλλακτικό', href: ROUTES.SELLER.INVENTORY_ADD },
            { label: 'Εισαγωγή με VIN', href: ROUTES.SELLER.INVENTORY_VIN_IMPORT },
            { label: 'Σκάναρε QR', href: ROUTES.SELLER.INVENTORY_SCAN },
            { label: 'Stock', href: ROUTES.SELLER.INVENTORY },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="bg-white border border-slate-200 rounded-xl px-3 py-3 text-center text-xs font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Recent inventory ─────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            Πρόσφατες προσθήκες
          </p>
          <Link href={ROUTES.SELLER.INVENTORY} className="text-xs font-medium text-blue-600 hover:text-blue-700">
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

    </div>
  )
}
