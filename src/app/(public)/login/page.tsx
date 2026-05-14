import Link from 'next/link'
import { PageContainer } from '@/components/layout/page-container'

const DEMO_LINKS = [
  { label: 'Marketplace', href: '/marketplace', description: 'Αναζήτηση ανταλλακτικών' },
  { label: 'Πίνακας αγοραστή', href: '/buyer', description: 'Αιτήματα, αναζήτηση, προφίλ' },
  { label: 'Πίνακας πωλητή', href: '/seller', description: 'Stock, αιτήματα, QR αποστολή' },
  { label: 'Admin', href: '/admin', description: 'Επαλήθευση, listings, monitoring' },
]

export default function LoginPage() {
  return (
    <PageContainer narrow>
      <div className="max-w-md mx-auto pt-8 pb-16">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Σύνδεση</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Η σύνδεση θα ενεργοποιηθεί όταν συνδεθεί το backend.
            Στο MVP demo μπορείς να δεις απευθείας τις ροές αγοραστή, πωλητή και admin.
          </p>
        </div>

        {/* MVP notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 flex items-start gap-2.5">
          <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-xs text-amber-800 leading-relaxed">
            Αυτή η σελίδα είναι placeholder. Η πραγματική σύνδεση με backend δεν έχει υλοποιηθεί ακόμα.
          </p>
        </div>

        {/* Demo navigation */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-6">
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Πλοήγηση demo</p>
          </div>
          <div className="divide-y divide-slate-100">
            {DEMO_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 transition-colors group"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {link.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{link.description}</p>
                </div>
                <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-500 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-slate-500">
          Δεν έχεις λογαριασμό;{' '}
          <Link href="/register" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
            Εγγραφή
          </Link>
        </p>

      </div>
    </PageContainer>
  )
}
