import { RequestDetailScreen } from '@/components/orders/request-detail-screen'

export default async function SellerRequestDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params
  return <RequestDetailScreen requestId={orderId} />
}
