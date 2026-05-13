import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'
import { currentSellerProfile } from '@/lib/mock-data/profiles'

// ─── Layout helpers ───────────────────────────────────────────────────────────

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{title}</p>
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  )
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 first:pt-0 last:pb-0">
      <span className="text-sm text-slate-500 flex-shrink-0 w-32">{label}</span>
      <span className="text-sm font-medium text-slate-900 text-right flex-1 min-w-0">{children}</span>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SellerSettingsPage() {
  const profile = currentSellerProfile

  return (
    <PageContainer narrow className="pb-24 lg:pb-10">
      <SectionHeader title="Ρυθμίσεις" subtitle="Στοιχεία επιχείρησης και λογαριασμού." />

      {/* Verification badge */}
      <div className="flex items-center gap-2 mb-6 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
        <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium text-green-800">Επαλυθευμένος πωλητής</span>
      </div>

      <div className="space-y-4">
        {/* Business info */}
        <InfoCard title="Στοιχεία Επιχείρησης">
          <div className="space-y-0">
            <InfoRow label="Επωνυμία">{profile.businessName}</InfoRow>
            <InfoRow label="Υπεύθυνος">{profile.contactName}</InfoRow>
            <InfoRow label="Τηλέφωνο">{profile.phone}</InfoRow>
            <InfoRow label="Email">{profile.email}</InfoRow>
            <InfoRow label="Πόλη">{profile.city}</InfoRow>
            <InfoRow label="Διεύθυνση">{profile.address}</InfoRow>
          </div>
        </InfoCard>

        {/* Usage note */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3.5">
          <p className="text-xs text-blue-700 leading-relaxed">
            Τα στοιχεία αυτά εμφανίζονται σε αιτήματα και Marketplace.
          </p>
        </div>

        {/* Edit — demo placeholder */}
        <button
          type="button"
          disabled
          className="w-full h-11 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-400 cursor-not-allowed"
        >
          Επεξεργασία στοιχείων
        </button>
        <p className="text-xs text-slate-400 text-center -mt-2">
          Η επεξεργασία στοιχείων θα είναι διαθέσιμη σε επόμενη έκδοση.
        </p>
      </div>
    </PageContainer>
  )
}
