import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'
import { DashboardGrid } from '@/components/layout/dashboard-grid'
import { MetricCard } from '@/components/layout/metric-card'
import { formatDate, formatPrice } from '@/lib/utils'
import { ROUTES } from '@/lib/routes'
import { mockBuyerRequests } from '@/lib/mock-data/buyer-requests'
import { BUYER_STATUS_CONFIG } from '@/lib/requests/status'
import { getBuyerActionRequestCount } from '@/lib/requests/counts'

// ─── Derived counts ───────────────────────────────────────────────────────────

const totalCount      = mockBuyerRequests.length
const withReplyCount  = mockBuyerRequests.filter((r) => !!r.replyNote).length
const withPriceCount  = mockBuyerRequests.filter((r) => r.priceSent !== undefined).length
const actionCount     = getBuyerActionRequestCount()

const recentRequests = [...mockBuyerRequests]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 3)

// ─── Quick action link card ───────────────────────────────────────────────────

function QuickAction({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3.5 hover:bg-slate-50 transition-colors"
    >
      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
        {icon}
      </div>
      <span className="text-sm font-medium text-slate-900 flex-1">{label}</span>
      <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BuyerDashboardPage() {
  return (
    <PageContainer className="pb-24 lg:pb-10">
      <SectionHeader
        title="Αρχική αγοραστή"
        subtitle="Παρακολούθησε αιτήματα και βρες ανταλλακτικά."
      />

      {/* Metrics */}
      <DashboardGrid cols={4} className="mb-8">
        <MetricCard label="Αιτήματα"             value={totalCount} />
        <MetricCard label="Με απάντηση"           value={withReplyCount} />
        <MetricCard label="Με τιμή"               value={withPriceCount} />
        <MetricCard label="Χρειάζονται ενέργεια"  value={actionCount} />
      </DashboardGrid>

      {/* Quick actions */}
      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Γρήγορες ενέργειες</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <QuickAction
          href={ROUTES.BUYER.ORDERS}
          label="Τα αιτήματά μου"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
        />
        <QuickAction
          href={ROUTES.BUYER.CHATS}
          label="Μηνύματα"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          }
        />
        <QuickAction
          href={ROUTES.MARKETPLACE}
          label="Marketplace"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
        <QuickAction
          href={ROUTES.BUYER.VIN_SEARCH}
          label="Αναζήτηση με VIN"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
            </svg>
          }
        />
      </div>

      {/* Recent request updates */}
      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Πρόσφατα αιτήματα</h2>
      <div className="space-y-2">
        {recentRequests.map((req) => {
          const { label: statusLabel, variant: statusVariant } = BUYER_STATUS_CONFIG[req.status]
          return (
            <Link
              key={req.id}
              href={ROUTES.BUYER.ORDER_DETAIL(req.id)}
              className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:bg-slate-50 transition-colors"
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
              <span className="text-xs text-slate-400 flex-shrink-0">{formatDate(req.createdAt)}</span>
              <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )
        })}
      </div>
    </PageContainer>
  )
}
