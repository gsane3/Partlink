import Link from 'next/link'
import { mockParts } from '@/lib/mock-data/parts'
import { DashboardGrid } from '@/components/layout/dashboard-grid'
import { MetricCard } from '@/components/layout/metric-card'
import { SectionHeader } from '@/components/layout/section-header'
import { PageContainer } from '@/components/layout/page-container'
import { InventoryList } from '@/components/inventory/inventory-list'
import { ROUTES } from '@/lib/routes'
import { formatPrice } from '@/lib/utils'

const SELLER_ID = 'seller-001'

export default function SellerInventoryPage() {
  const parts = mockParts.filter((p) => p.sellerId === SELLER_ID)

  const available = parts.filter((p) => p.status === 'available')
  const published = parts.filter((p) => p.isPublished)
  const stockValue = available.reduce((sum, p) => sum + p.price * p.quantity, 0)
  const missingQR = parts.filter((p) => !p.qrCodeId).length

  return (
    <PageContainer className="pb-36 lg:pb-6">
      <SectionHeader
        title="Το stock μου"
        subtitle={`${parts.length} ανταλλακτικά συνολικά`}
        action={
          <Link
            href={ROUTES.SELLER.INVENTORY_ADD}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Πρόσθεσε</span>
          </Link>
        }
      />

      {/* Summary cards */}
      <DashboardGrid cols={4} className="mb-6">
        <MetricCard
          className="p-3 lg:p-4"
          label="Σύνολο"
          value={parts.length}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />
        <MetricCard
          className="p-3 lg:p-4"
          label="Διαθέσιμα"
          value={available.length}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <MetricCard
          className="p-3 lg:p-4"
          label="Δημοσιευμένα"
          value={published.length}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
          }
        />
        <MetricCard
          className="p-3 lg:p-4"
          label="Αξία stock"
          value={formatPrice(stockValue)}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </DashboardGrid>

      {/* Alerts for missing QR */}
      {missingQR > 0 && (
        <div className="mb-4 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm text-amber-800">
            <span className="font-semibold">{missingQR} ανταλλακτικά</span> χωρίς QR label.
          </p>
          <button type="button" className="ml-auto text-xs font-medium text-amber-700 hover:text-amber-900 flex-shrink-0">
            Εκτύπωση
          </button>
        </div>
      )}

      {/* Inventory list with filters */}
      <div className="lg:max-w-4xl">
        <InventoryList parts={parts} />
      </div>
    </PageContainer>
  )
}
