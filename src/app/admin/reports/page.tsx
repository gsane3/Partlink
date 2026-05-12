import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'

export default function AdminReportsPage() {
  return (
    <PageContainer>
      <SectionHeader title="Αναφορές" subtitle="Στατιστικά και αναφορές πλατφόρμας" />
      <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-sm text-slate-400">
        Σε ανάπτυξη
      </div>
    </PageContainer>
  )
}
