import { MarketplaceDetail } from '@/components/marketplace/marketplace-detail'

export default async function MarketplacePartDetailPage({
  params,
}: {
  params: Promise<{ partId: string }>
}) {
  const { partId } = await params
  return <MarketplaceDetail partId={partId} />
}
