import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'
import { MarketplaceList } from '@/components/marketplace/marketplace-list'
import { getMarketplaceParts } from '@/lib/data/marketplace'

export default function MarketplacePage() {
  const count = getMarketplaceParts().length
  return (
    <PageContainer>
      <SectionHeader
        title="Marketplace"
        subtitle={`${count} διαθέσιμα ανταλλακτικά`}
      />
      <MarketplaceList />
    </PageContainer>
  )
}
