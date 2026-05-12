import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'
import { DashboardGrid } from '@/components/layout/dashboard-grid'
import { MetricCard } from '@/components/layout/metric-card'
import { ActionCard } from '@/components/layout/action-card'

export default function AdminDashboardPage() {
  return (
    <PageContainer>
      <SectionHeader title="Επισκόπηση" subtitle="Partlink Admin" />

      <DashboardGrid cols={4} className="mb-6">
        <MetricCard label="Ενεργοί πωλητές" value="18" />
        <MetricCard label="Εκκρεμείς επαληθεύσεις" value="2" />
        <MetricCard label="Ενεργές αγγελίες" value="341" />
        <MetricCard label="Παραγγελίες σήμερα" value="7" delta="3 από χθες" deltaPositive />
      </DashboardGrid>

      <div className="space-y-2">
        <ActionCard
          title="Επαληθεύσεις"
          description="2 αιτήματα σε αναμονή"
          badge={2}
          href="/admin/verifications"
        />
        <ActionCard
          title="Αγγελίες"
          description="341 ενεργές αγγελίες"
          href="/admin/listings"
        />
        <ActionCard
          title="Παραγγελίες"
          description="Παρακολούθηση και διαχείριση"
          href="/admin/orders"
        />
      </div>
    </PageContainer>
  )
}
