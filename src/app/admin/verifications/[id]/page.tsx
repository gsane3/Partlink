import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { PageContainer } from '@/components/layout/page-container'
import { currentSellerProfile, currentBuyerProfile } from '@/lib/mock-data/profiles'

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

// ─── Not found ────────────────────────────────────────────────────────────────

function NotFound() {
  return (
    <PageContainer>
      <div className="py-16 text-center max-w-sm mx-auto">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Ο φάκελος επαλήθευσης δεν βρέθηκε</h2>
        <p className="text-sm text-slate-500 mb-6">Μπορεί να μην υπάρχει ή να έχει αφαιρεθεί.</p>
        <Link
          href="/admin/verifications"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Επιστροφή στις επαληθεύσεις
        </Link>
      </div>
    </PageContainer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminVerificationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  if (id !== 'seller-profile' && id !== 'buyer-profile') {
    return <NotFound />
  }

  const isSeller = id === 'seller-profile'
  const seller   = currentSellerProfile
  const buyer    = currentBuyerProfile

  const title      = isSeller ? seller.businessName : buyer.companyName
  const typeBadge  = isSeller ? 'Πωλητής' : 'Αγοραστής'
  const usageNote  = isSeller
    ? 'Τα στοιχεία αυτά εμφανίζονται σε Marketplace και αιτήματα.'
    : 'Τα στοιχεία αυτά χρησιμοποιούνται στα αιτήματα προς πωλητές.'

  return (
    <div className="pb-10">
      <PageContainer>
        {/* Back */}
        <Link
          href="/admin/verifications"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-5 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Επαληθεύσεις
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{title}</h1>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <Badge variant="brand">{typeBadge}</Badge>
              <Badge variant="success">Επαληθευμένο</Badge>
            </div>
          </div>
        </div>

        <div className="space-y-4 max-w-2xl">
          {/* Profile fields */}
          {isSeller ? (
            <InfoCard title="Στοιχεία επιχείρησης">
              <div className="space-y-0">
                <InfoRow label="Επωνυμία">{seller.businessName}</InfoRow>
                <InfoRow label="Υπεύθυνος">{seller.contactName}</InfoRow>
                <InfoRow label="Τηλέφωνο">{seller.phone}</InfoRow>
                <InfoRow label="Email">{seller.email}</InfoRow>
                <InfoRow label="Πόλη">{seller.city}</InfoRow>
                <InfoRow label="Διεύθυνση">{seller.address}</InfoRow>
              </div>
            </InfoCard>
          ) : (
            <InfoCard title="Στοιχεία επιχείρησης">
              <div className="space-y-0">
                <InfoRow label="Επιχείρηση">{buyer.companyName}</InfoRow>
                <InfoRow label="Υπεύθυνος">{buyer.contactName}</InfoRow>
                <InfoRow label="Τηλέφωνο">{buyer.phone}</InfoRow>
                <InfoRow label="Email">{buyer.email}</InfoRow>
                <InfoRow label="Πόλη">{buyer.city}</InfoRow>
                <InfoRow label="Διεύθυνση">{buyer.address}</InfoRow>
                <InfoRow label="Τ.Κ.">{buyer.postalCode}</InfoRow>
                <InfoRow label="Παραστατικό">
                  {buyer.documentPreference === 'invoice' ? 'Τιμολόγιο' : 'Απόδειξη'}
                </InfoRow>
              </div>
            </InfoCard>
          )}

          {/* Usage note */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3.5">
            <p className="text-xs text-blue-700 leading-relaxed">{usageNote}</p>
          </div>

          {/* Demo action buttons — disabled */}
          <div className="flex gap-2.5">
            <button
              type="button"
              disabled
              className="flex-1 h-11 rounded-xl border border-green-200 bg-green-50 text-sm font-medium text-green-700 cursor-not-allowed"
            >
              Εγκεκριμένο
            </button>
            <button
              type="button"
              disabled
              className="flex-1 h-11 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-400 cursor-not-allowed"
            >
              Ζητήστε αλλαγές
            </button>
          </div>
          <p className="text-xs text-slate-400 text-center -mt-2">
            Οι ενέργειες επαλήθευσης θα είναι διαθέσιμες σε επόμενη έκδοση.
          </p>
        </div>
      </PageContainer>
    </div>
  )
}
