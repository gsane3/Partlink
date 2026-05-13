import { PartDetailScreen } from '@/components/inventory/part-detail/part-detail-screen'

export default async function Page({
  params,
}: {
  params: Promise<{ partId: string }>
}) {
  const { partId } = await params
  return <PartDetailScreen partId={partId} />
}
