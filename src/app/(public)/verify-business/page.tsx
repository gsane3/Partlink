import Link from 'next/link'
import { PageContainer } from '@/components/layout/page-container'

const REQUIRED_FIELDS = [
  { label: 'Επωνυμία', description: 'Επίσημη ονομασία επιχείρησης' },
  { label: 'ΑΦΜ', description: 'Αριθμός Φορολογικού Μητρώου' },
  { label: 'ΔΟΥ', description: 'Αρμόδια Δημόσια Οικονομική Υπηρεσία' },
  { label: 'Τηλέφωνο', description: 'Τηλέφωνο επικοινωνίας' },
  { label: 'Διεύθυνση', description: 'Διεύθυνση έδρας ή χώρου δραστηριότητας' },
  { label: 'Website ή social link', description: 'Προαιρετικό — βοηθά στην επαλήθευση' },
]

const PROCESS_STEPS = [
  'Υποβολή στοιχείων επιχείρησης',
  'Χειροκίνητος έλεγχος από admin Partlink',
  'Έγκριση ή αίτηση για περισσότερα στοιχεία',
  'Ενεργοποίηση πρόσβασης στον πίνακα πωλητή',
]

export default function VerifyBusinessPage() {
  return (
    <PageContainer narrow>
      <div className="max-w-md mx-auto pt-8 pb-16">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Επαλήθευση επιχείρησης</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Η επαλήθευση γίνεται χειροκίνητα. Στο MVP demo η φόρμα είναι
            ενημερωτική και δεν αποθηκεύει δεδομένα.
          </p>
        </div>

        {/* Backend disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 flex items-start gap-2.5">
          <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-xs text-amber-800 leading-relaxed">
            Δεν γίνεται αποστολή στοιχείων σε backend σε αυτή την έκδοση. Η φόρμα επαλήθευσης θα ενεργοποιηθεί με το backend.
          </p>
        </div>

        {/* Required fields */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-4">
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Απαιτούμενα στοιχεία</p>
          </div>
          <div className="divide-y divide-slate-100">
            {REQUIRED_FIELDS.map((field) => (
              <div key={field.label} className="flex items-start gap-3 px-4 py-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{field.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{field.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Process steps */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-6">
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Διαδικασία επαλήθευσης</p>
          </div>
          <div className="px-4 py-4 space-y-3">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-slate-700 leading-snug">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Back link */}
        <p className="text-center text-sm text-slate-500">
          <Link href="/register" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
            ← Επιστροφή στην εγγραφή
          </Link>
        </p>

      </div>
    </PageContainer>
  )
}
