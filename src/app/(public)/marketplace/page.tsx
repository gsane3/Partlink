import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'

export default function MarketplacePage() {
  return (
    <PageContainer>
      <SectionHeader
        title="Marketplace"
        subtitle="Μεταχειρισμένα ανταλλακτικά αυτοκινήτων"
      />
      <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-sm text-slate-400">
        Σε ανάπτυξη — Phase 7
      </div>
    </PageContainer>
  )
}
