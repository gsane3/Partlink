'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useState } from 'react'

interface FabAction {
  label: string
  href: string
  icon: React.ReactNode
}

interface MobileFABProps {
  actions: FabAction[]
  className?: string
}

export function MobileFAB({ actions, className }: MobileFABProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      <div className={cn('fixed bottom-20 right-4 z-50 flex flex-col-reverse items-end gap-3 lg:hidden', className)}>
        {open && actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 bg-white border border-slate-200 rounded-full pl-4 pr-5 h-11 shadow-md text-sm font-medium text-slate-800 hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            <span className="w-5 h-5 text-slate-600" aria-hidden="true">{action.icon}</span>
            {action.label}
          </Link>
        ))}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Κλείσιμο μενού' : 'Γρήγορες ενέργειες'}
          className={cn(
            'w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg',
            'flex items-center justify-center',
            'hover:bg-blue-700 active:bg-blue-800 transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
          )}
        >
          <svg
            className={cn('w-6 h-6 transition-transform duration-200', open && 'rotate-45')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </>
  )
}
