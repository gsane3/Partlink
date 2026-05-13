import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'
import { MarketplaceList } from '@/components/marketplace/marketplace-list'

export default function MarketplacePage() {
  return (
    <PageContainer>
      <SectionHeader
        title="Marketplace ανταλλακτικών"
        subtitle="Βρες μεταχειρισμένα ανταλλακτικά από επαγγελματίες πωλητές"
      />
      <MarketplaceList />
    </PageContainer>
  )
}
