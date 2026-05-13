import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'
import { DashboardGrid } from '@/components/layout/dashboard-grid'
import { MetricCard } from '@/components/layout/metric-card'
import { mockBuyerRequests } from '@/lib/mock-data/buyer-requests'

// ─── Derived counts ───────────────────────────────────────────────────────────

const reqs           = mockBuyerRequests
const total          = reqs.length
const newCount       = reqs.filter((r) => r.status === 'new').length
const needsPrice     = reqs.filter((r) => r.status === 'needs_price').length
const inProgress     = reqs.filter((r) => r.status === 'in_progress').length
const completed      = reqs.filter((r) => r.status === 'completed').length
const priceSentCount = reqs.filter((r) => r.priceSent !== undefined).length

const deliveryShipping = reqs.filter((r) => r.delivery === 'shipping').length
const deliveryPickup   = reqs.filter((r) => r.delivery === 'pickup').length
const deliveryUnknown  = reqs.filter((r) => r.delivery === 'unknown').length

const noListingPrice   = reqs.filter((r) => r.partPrice === 0).length
const pricePending     = reqs.filter((r) => r.priceSent !== undefined && r.status !== 'completed').length
const unknownDelivery  = reqs.filter((r) => r.delivery === 'unknown' && r.status !== 'completed').length

// ─── Funnel row ───────────────────────────────────────────────────────────────

function FunnelRow({ label, count, total: t, color }: { label: string; count: number; total: number; color: string }) {
  const pct = t > 0 ? Math.round((count / t) * 100) : 0
  return (
    <div className="py-2 first:pt-0 last:pb-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-slate-700">{label}</span>
        <span className="text-sm font-semibold text-slate-900 tabular-nums">{count}</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5">
        <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{title}</p>
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  )
}

// ─── Insight card ─────────────────────────────────────────────────────────────

function InsightCard({
  label, value, note, accent,
}: {
  label: string; value: number; note: string; accent: string
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-4">
      <p className={`text-2xl font-bold tabular-nums mb-1 ${accent}`}>{value}</p>
      <p className="text-sm font-medium text-slate-900 mb-0.5">{label}</p>
      <p className="text-xs text-slate-500 leading-relaxed">{note}</p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminReportsPage() {
  if (reqs.length === 0) {
    return (
      <PageContainer>
        <SectionHeader title="Reports" subtitle="Σύνοψη δραστηριότητας από αιτήματα marketplace." />
        <div className="bg-white border border-dashed border-slate-300 rounded-xl py-16 text-center">
          <p className="text-sm text-slate-400">Δεν υπάρχουν δεδομένα αναφορών</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="pb-10">
      <SectionHeader
        title="Reports"
        subtitle="Σύνοψη δραστηριότητας από αιτήματα marketplace."
      />

      {/* Top metrics */}
      <DashboardGrid cols={4} className="mb-6">
        <MetricCard label="Σύνολο αιτημάτων" value={total} />
        <MetricCard label="Αναμονή τιμής"    value={needsPrice} />
        <MetricCard label="Τιμή στάλθηκε"    value={priceSentCount} />
        <MetricCard label="Ολοκληρωμένα demo" value={completed} />
      </DashboardGrid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Request funnel */}
        <SectionCard title="Ροή αιτημάτων">
          <div className="divide-y divide-slate-100">
            <FunnelRow label="Νέα αιτήματα"        count={newCount}   total={total} color="bg-amber-400" />
            <FunnelRow label="Χρειάζονται τιμή"    count={needsPrice} total={total} color="bg-amber-500" />
            <FunnelRow label="Σε εξέλιξη"          count={inProgress} total={total} color="bg-blue-500" />
            <FunnelRow label="Ολοκληρωμένα demo"   count={completed}  total={total} color="bg-green-500" />
          </div>
        </SectionCard>

        {/* Delivery overview */}
        <SectionCard title="Τρόπος παραλαβής">
          <div className="divide-y divide-slate-100">
            <FunnelRow label="Αποστολή"         count={deliveryShipping} total={total} color="bg-blue-500" />
            <FunnelRow label="Παραλαβή"         count={deliveryPickup}   total={total} color="bg-green-500" />
            <FunnelRow label="Αδιευκρίνιστο"    count={deliveryUnknown}  total={total} color="bg-slate-400" />
          </div>
        </SectionCard>
      </div>

      {/* Insight cards */}
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-3">Ενδείξεις review</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <InsightCard
          label="Χωρίς τιμή καταχώρησης"
          value={noListingPrice}
          note="Ανταλλακτικά κατόπιν ζήτησης. Σε παρακολούθηση."
          accent="text-amber-600"
        />
        <InsightCard
          label="Τιμή προς αποδοχή"
          value={pricePending}
          note="Πωλητής έστειλε τιμή. Αναμένεται αποδοχή αγοραστή."
          accent="text-blue-600"
        />
        <InsightCard
          label="Αδιευκρίνιστη παραλαβή"
          value={unknownDelivery}
          note="Τρόπος παραλαβής δεν έχει συμφωνηθεί — review."
          accent="text-amber-600"
        />
        <InsightCard
          label="Demo ολοκληρώσεις"
          value={completed}
          note="Αιτήματα που έκλεισαν στο demo."
          accent="text-green-600"
        />
      </div>
    </PageContainer>
  )
}
