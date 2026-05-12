import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'

export default function AdminOrdersPage() {
  return (
    <PageContainer>
      <SectionHeader title="Παραγγελίες" subtitle="Παρακολούθηση παραγγελιών πλατφόρμας" />
      <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-sm text-slate-400">
        Σε ανάπτυξη
      </div>
    </PageContainer>
  )
}
