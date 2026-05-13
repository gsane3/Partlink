import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'
import { formatDate, formatPrice } from '@/lib/utils'
import { ROUTES } from '@/lib/routes'
import { mockBuyerRequests } from '@/lib/mock-data/buyer-requests'
import { BUYER_STATUS_CONFIG } from '@/lib/requests/status'
import { getBuyerActionRequestCount } from '@/lib/requests/counts'
import { getRequestConversations } from '@/lib/requests/conversations'

// ─── Derived counts (static mock) ────────────────────────────────────────────

const totalCount      = mockBuyerRequests.length
const withReplyCount  = mockBuyerRequests.filter((r) => !!r.replyNote).length
const withPriceCount  = mockBuyerRequests.filter((r) => r.priceSent !== undefined).length
const actionCount     = getBuyerActionRequestCount()
const conversationCount = getRequestConversations().length

const recentRequests = [...mockBuyerRequests]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 3)

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BuyerDashboardPage() {
  return (
    <PageContainer narrow className="pb-24 lg:pb-10">
      <SectionHeader
        title="Αρχική αγοραστή"
        subtitle="Παρακολούθησε αιτήματα και βρες ανταλλακτικά."
      />

      {/* ── Metrics (2×2 grid on mobile, 4-col on desktop) ───────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{totalCount}</p>
          <p className="text-xs text-slate-500 mt-0.5 leading-tight">Αιτήματα</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-blue-600 tabular-nums">{withReplyCount}</p>
          <p className="text-xs text-slate-500 mt-0.5 leading-tight">Με απάντηση</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-green-600 tabular-nums">{withPriceCount}</p>
          <p className="text-xs text-slate-500 mt-0.5 leading-tight">Με τιμή</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-amber-600 tabular-nums">{actionCount}</p>
          <p className="text-xs text-slate-500 mt-0.5 leading-tight">Θέλουν ενέργεια</p>
        </div>
      </div>

      {/* ── Priorities ───────────────────────────────────────────────────── */}
      <h2 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Προτεραιότητες</h2>
      <div className="space-y-2 mb-8">
        <Link
          href={ROUTES.BUYER.ORDERS}
          className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-4 hover:bg-slate-50 active:bg-slate-100 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900">Απαντήσεις πωλητών</p>
            <p className="text-xs text-slate-500 mt-0.5">Τιμές και απαντήσεις που έλαβες</p>
          </div>
          {actionCount > 0 && (
            <span className="min-w-[1.5rem] h-6 px-1.5 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
              {actionCount}
            </span>
          )}
          <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        <Link
          href={ROUTES.BUYER.CHATS}
          className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-4 hover:bg-slate-50 active:bg-slate-100 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900">Μηνύματα</p>
            <p className="text-xs text-slate-500 mt-0.5">Συζητήσεις με πωλητές</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 flex-shrink-0">{conversationCount}</span>
          <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* ── Quick actions ─────────────────────────────────────────────────── */}
      <h2 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Γρήγορες ενέργειες</h2>
      <div className="space-y-2 mb-8">
        {[
          { label: 'Marketplace',        href: ROUTES.MARKETPLACE },
          { label: 'Αναζήτηση με VIN',  href: ROUTES.BUYER.VIN_SEARCH },
          { label: 'Τα αιτήματά μου',   href: ROUTES.BUYER.ORDERS },
        ].map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-4 text-sm font-medium text-slate-900 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            {label}
            <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>

      {/* ── Recent requests ───────────────────────────────────────────────── */}
      <h2 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Πρόσφατα αιτήματα</h2>
      <div className="space-y-2">
        {recentRequests.map((req) => {
          const { label: statusLabel, variant: statusVariant } = BUYER_STATUS_CONFIG[req.status]
          return (
            <Link
              key={req.id}
              href={ROUTES.BUYER.ORDER_DETAIL(req.id)}
              className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className="text-sm font-medium text-slate-900 truncate">{req.partName}</span>
                  <Badge variant={statusVariant}>{statusLabel}</Badge>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-500 truncate">{req.sellerName}</span>
                  {req.priceSent !== undefined && (
                    <span className="text-xs font-semibold text-green-700">{formatPrice(req.priceSent)}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-slate-400">{formatDate(req.createdAt)}</span>
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          )
        })}
      </div>
    </PageContainer>
  )
}
