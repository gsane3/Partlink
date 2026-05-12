import { SellerMobileDashboard } from '@/components/seller/seller-mobile-dashboard'
import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'
import { DashboardGrid } from '@/components/layout/dashboard-grid'
import { MetricCard } from '@/components/layout/metric-card'
import { ActionCard } from '@/components/layout/action-card'

export default function SellerDashboardPage() {
  return (
    <>
      {/* Mobile: show mobile dashboard */}
      <div className="lg:hidden">
        <SellerMobileDashboard />
      </div>

      {/* Desktop: show desktop dashboard */}
      <div className="hidden lg:block">
        <PageContainer>
          <SectionHeader
            title="Αρχική"
            subtitle="Καλωσήρθες, Μάντρα Παπαδόπουλος"
          />

          <DashboardGrid cols={4} className="mb-6">
            <MetricCard label="Ανταλλακτικά σε stock" value="47" />
            <MetricCard label="Πωλήσεις μήνα" value="12" delta="3 από χθες" deltaPositive />
            <MetricCard label="Εκκρεμείς παραγγελίες" value="2" />
            <MetricCard label="Αξία stock" value="€ 8.450" />
          </DashboardGrid>

          <div className="space-y-2">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Γρήγορες ενέργειες</h2>
            <ActionCard
              title="Το stock μου"
              description="47 ανταλλακτικά διαθέσιμα"
              href="/seller/inventory"
            />
            <ActionCard
              title="Εκκρεμείς παραγγελίες"
              description="2 παραγγελίες περιμένουν αποστολή"
              badge={2}
              href="/seller/orders"
            />
          </div>
        </PageContainer>
      </div>
    </>
  )
}
