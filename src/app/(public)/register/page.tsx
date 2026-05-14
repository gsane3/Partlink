import Link from 'next/link'
import { PageContainer } from '@/components/layout/page-container'

const ACCOUNT_TYPES = [
  {
    title: 'Μάντρα / Πωλητής',
    description: 'Ανέβασε stock, διαχειρίσου αιτήματα, εκτύπωσε QR labels.',
    icon: (
      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    note: 'Απαιτείται επαλήθευση επιχείρησης.',
    verifyLink: true,
  },
  {
    title: 'Συνεργείο / Αγοραστής',
    description: 'Αναζήτησε ανταλλακτικά, στείλε αιτήματα, παρακολούθησε τιμές.',
    icon: (
      <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
    note: null,
    verifyLink: false,
  },
  {
    title: 'Ιδιώτης / Αγοραστής',
    description: 'Βρες ανταλλακτικό για το αυτοκίνητό σου, επικοινώνησε με πωλητές.',
    icon: (
      <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    note: null,
    verifyLink: false,
  },
]

export default function RegisterPage() {
  return (
    <PageContainer narrow>
      <div className="max-w-md mx-auto pt-8 pb-16">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Εγγραφή</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Η εγγραφή είναι placeholder στο MVP. Η τελική ροή θα υποστηρίζει
            λογαριασμό πωλητή, συνεργείου και ιδιώτη αγοραστή.
          </p>
        </div>

        {/* MVP notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 flex items-start gap-2.5">
          <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-xs text-amber-800 leading-relaxed">
            Αυτή η σελίδα είναι placeholder. Η εγγραφή και η αυθεντικοποίηση δεν έχουν υλοποιηθεί ακόμα.
          </p>
        </div>

        {/* Account type cards */}
        <div className="space-y-3 mb-6">
          {ACCOUNT_TYPES.map((type) => (
            <div
              key={type.title}
              className="bg-white border border-slate-200 rounded-xl px-4 py-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {type.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">{type.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{type.description}</p>
                  {type.note && (
                    <p className="text-xs text-slate-400 mt-1.5">{type.note}</p>
                  )}
                  {type.verifyLink && (
                    <Link
                      href="/verify-business"
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors mt-2"
                    >
                      Ξεκίνα επαλήθευση
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-slate-500">
          Έχεις ήδη λογαριασμό;{' '}
          <Link href="/login" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
            Σύνδεση
          </Link>
        </p>

      </div>
    </PageContainer>
  )
}
