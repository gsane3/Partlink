import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'

export default function SellerOrdersPage() {
  return (
    <PageContainer>
      <SectionHeader
        title="Παραγγελίες"
        subtitle="Διαχείριση παραγγελιών"
      />
      <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-sm text-slate-400">
        Σε ανάπτυξη — Phase 9
      </div>
    </PageContainer>
  )
}
