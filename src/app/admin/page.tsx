import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'
import { DashboardGrid } from '@/components/layout/dashboard-grid'
import { MetricCard } from '@/components/layout/metric-card'
import { formatDate } from '@/lib/utils'
import { ROUTES } from '@/lib/routes'
import { mockBuyerRequests } from '@/lib/mock-data/buyer-requests'
import { SELLER_STATUS_CONFIG } from '@/lib/requests/status'

// ─── Derived counts ───────────────────────────────────────────────────────────

const totalCount        = mockBuyerRequests.length
const newCount          = mockBuyerRequests.filter((r) => r.status === 'new').length
const needsPriceCount   = mockBuyerRequests.filter((r) => r.status === 'needs_price').length
const withResponseCount = mockBuyerRequests.filter((r) => r.priceSent !== undefined || !!r.replyNote).length

const recentRequests = [...mockBuyerRequests]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 5)

// ─── Quick link card ──────────────────────────────────────────────────────────

function AdminLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3.5 hover:bg-slate-50 transition-colors"
    >
      <span className="text-sm font-medium text-slate-900">{label}</span>
      <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  return (
    <PageContainer className="pb-10">
      <SectionHeader title="Admin overview" subtitle="Εικόνα αιτημάτων, πωλητών και marketplace." />

      {/* Metrics */}
      <DashboardGrid cols={4} className="mb-8">
        <MetricCard label="Αιτήματα"      value={totalCount} />
        <MetricCard label="Νέα"           value={newCount} />
        <MetricCard label="Θέλουν τιμή"   value={needsPriceCount} />
        <MetricCard label="Με απάντηση"   value={withResponseCount} />
      </DashboardGrid>

      {/* Quick links */}
      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Διαχείριση</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
        <AdminLink href={ROUTES.ADMIN.ORDERS}        label="Αιτήματα" />
        <AdminLink href={ROUTES.ADMIN.LISTINGS}      label="Listings" />
        <AdminLink href={ROUTES.ADMIN.VERIFICATIONS} label="Verifications" />
        <AdminLink href={ROUTES.ADMIN.DISPUTES}      label="Disputes" />
      </div>

      {/* Recent requests */}
      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Πρόσφατα αιτήματα</h2>
      <div className="space-y-2">
        {recentRequests.map((req) => {
          const { label: statusLabel, variant: statusVariant } = SELLER_STATUS_CONFIG[req.status]
          return (
            <div key={req.id} className="bg-white border border-slate-200 rounded-xl px-4 py-3">
              <div className="flex items-start justify-between gap-3 mb-1">
                <div className="flex items-center gap-2 min-w-0 flex-wrap">
                  <span className="text-xs font-mono text-slate-400 flex-shrink-0">{req.id}</span>
                  <Badge variant={statusVariant}>{statusLabel}</Badge>
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">{formatDate(req.createdAt)}</span>
              </div>
              <p className="text-sm font-medium text-slate-900 truncate">{req.partName}</p>
              <p className="text-xs text-slate-500 truncate">
                {req.buyerCompany}
                <span className="text-slate-300 mx-1.5">→</span>
                {req.sellerName ?? 'Πωλητής'}
              </p>
            </div>
          )
        })}
      </div>
    </PageContainer>
  )
}
