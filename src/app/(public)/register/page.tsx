import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'

export default function RegisterPage() {
  return (
    <PageContainer narrow>
      <SectionHeader title="Εγγραφή" subtitle="Δημιούργησε λογαριασμό πωλητή ή αγοραστή" />
      <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-sm text-slate-400">
        Σε ανάπτυξη
      </div>
    </PageContainer>
  )
}
