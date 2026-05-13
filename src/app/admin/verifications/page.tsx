import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { PageContainer } from '@/components/layout/page-container'
import { SectionHeader } from '@/components/layout/section-header'
import { currentSellerProfile, currentBuyerProfile } from '@/lib/mock-data/profiles'

// ─── Verification card ────────────────────────────────────────────────────────

function VerificationCard({
  typeBadge,
  name,
  contact,
  city,
  note,
  href,
}: {
  typeBadge: string
  name: string
  contact: string
  city: string
  note: string
  href: string
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="brand">{typeBadge}</Badge>
          <span className="text-sm font-semibold text-slate-900">{name}</span>
        </div>
        <Badge variant="success">Επαληθευμένο</Badge>
      </div>

      <p className="text-sm text-slate-600">{contact}</p>
      <p className="text-xs text-slate-400 mt-0.5 mb-2">{city}</p>
      <p className="text-xs text-slate-500 mb-3">{note}</p>

      <Link
        href={href}
        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
      >
        Προβολή
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminVerificationsPage() {
  return (
    <PageContainer className="pb-10">
      <SectionHeader
        title="Επαληθεύσεις"
        subtitle="Επισκόπηση επαληθευμένων προφίλ πωλητών και αγοραστών."
      />

      <div className="space-y-3 max-w-2xl">
        <VerificationCard
          typeBadge="Πωλητής"
          name={currentSellerProfile.businessName}
          contact={currentSellerProfile.contactName}
          city={currentSellerProfile.city}
          note="Εμφανίζεται σε Marketplace και αιτήματα."
          href="/admin/verifications/seller-profile"
        />
        <VerificationCard
          typeBadge="Αγοραστής"
          name={currentBuyerProfile.companyName}
          contact={currentBuyerProfile.contactName}
          city={currentBuyerProfile.city}
          note="Χρησιμοποιείται στα αιτήματα προς πωλητές."
          href="/admin/verifications/buyer-profile"
        />
      </div>
    </PageContainer>
  )
}
