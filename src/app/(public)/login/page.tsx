import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'

export default function LoginPage() {
  return (
    <PageContainer narrow>
      <SectionHeader title="Σύνδεση" subtitle="Συνδέσου στον λογαριασμό σου" />
      <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-sm text-slate-400">
        Σε ανάπτυξη
      </div>
    </PageContainer>
  )
}
