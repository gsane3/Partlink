import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'
import { ActionCard } from '@/components/layout/action-card'

export default function SellerMobilePage() {
  return (
    <PageContainer>
      <SectionHeader
        title="Αρχική"
        subtitle="Μάντρα Παπαδόπουλος"
      />

      <div className="space-y-2 mb-6">
        <ActionCard
          title="Εκκρεμείς παραγγελίες"
          description="2 παραγγελίες περιμένουν αποστολή"
          badge={2}
          href="/seller/orders"
        />
        <ActionCard
          title="Αποστολή με QR"
          description="Σκάναρε QR για γρήγορη αποστολή"
          href="/seller/inventory/scan"
        />
        <ActionCard
          title="Πρόσφατες προσθήκες"
          description="Τουρμπίνα N47, Φανάρι W204"
          href="/seller/inventory"
        />
      </div>
    </PageContainer>
  )
}
