'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV_LINKS = [
  { label: 'Marketplace', href: '/marketplace' },
]

export function PublicNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-6">
        <Link
          href="/"
          className="text-base font-bold text-slate-900 tracking-tight flex-shrink-0"
        >
          Partlink
        </Link>

        <nav className="hidden md:flex items-center gap-1 flex-1" aria-label="Κύρια πλοήγηση">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 h-8 rounded-md text-sm font-medium flex items-center transition-colors',
                pathname === link.href || pathname.startsWith(link.href + '/')
                  ? 'text-blue-700 bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2 ml-auto">
          <Link
            href="/login"
            className="h-8 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors flex items-center"
          >
            Σύνδεση
          </Link>
          <Link
            href="/register"
            className="h-8 px-3 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center"
          >
            Εγγραφή πωλητή
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? 'Κλείσιμο μενού' : 'Άνοιγμα μενού'}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden ml-auto w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        >
          {open ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-slate-100 pt-3 mt-3 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block text-center h-10 rounded-lg text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-colors"
            >
              Σύνδεση
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="block text-center h-10 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center transition-colors"
            >
              Εγγραφή πωλητή
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
