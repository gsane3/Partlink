import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'
import { ActionCard } from '@/components/layout/action-card'

export default function BuyerDashboardPage() {
  return (
    <PageContainer>
      <SectionHeader
        title="Αρχική"
        subtitle="Καλωσήρθες, Νίκος Αλεξίου"
      />
      <div className="space-y-2">
        <ActionCard
          title="Αναζήτηση ανταλλακτικών"
          description="Βρες με κατηγορία, μάρκα ή part number"
          href="/buyer/marketplace"
        />
        <ActionCard
          title="Αναζήτηση με VIN"
          description="Εισάγαγε VIN για συμβατά ανταλλακτικά"
          href="/buyer/vin-search"
        />
        <ActionCard
          title="Παραγγελίες μου"
          description="3 παραγγελίες συνολικά"
          href="/buyer/orders"
        />
      </div>
    </PageContainer>
  )
}
