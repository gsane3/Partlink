import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'

export default function BuyerProfilePage() {
  return (
    <PageContainer>
      <SectionHeader title="Προφίλ μου" subtitle="Στοιχεία αποστολής και τιμολόγησης" />
      <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-sm text-slate-400">
        Σε ανάπτυξη — Phase 8
      </div>
    </PageContainer>
  )
}
