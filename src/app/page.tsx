import { PublicNavbar } from '@/components/layout/public-navbar'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PublicNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
            Partlink — Ανταλλακτικά αυτοκινήτων
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            Βρες και πούλα μεταχειρισμένα ανταλλακτικά πιο γρήγορα.
          </h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Το Partlink οργανώνει το stock της μάντρας και βοηθά συνεργεία και ιδιώτες να βρίσκουν διαθέσιμα ανταλλακτικά σε όλη την Ελλάδα.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/marketplace"
              className="h-11 px-6 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center"
            >
              Αναζήτηση ανταλλακτικών
            </Link>
            <Link
              href="/register"
              className="h-11 px-6 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors flex items-center"
            >
              Εγγραφή πωλητή
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: 'Πωλητές', desc: 'Οργανώστε το stock σας με SKU και QR label ανά ανταλλακτικό.', href: '/seller' },
            { title: 'Αγοραστές', desc: 'Βρείτε ανταλλακτικά με VIN, part number ή κατηγορία.', href: '/buyer/marketplace' },
            { title: 'Διαχείριση', desc: 'Επαλήθευση πωλητών, παρακολούθηση παραγγελιών.', href: '/admin' },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm hover:border-slate-300 transition-all group"
            >
              <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{card.title}</p>
              <p className="mt-1 text-sm text-slate-500">{card.desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
