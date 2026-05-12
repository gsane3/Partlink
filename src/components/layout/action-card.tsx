'use client'

import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface ActionCardProps {
  icon?: ReactNode
  title: string
  description?: string
  onClick?: () => void
  href?: string
  className?: string
  badge?: string | number
}

export function ActionCard({ icon, title, description, onClick, badge, className }: ActionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4',
        'text-left transition-colors hover:bg-slate-50 active:bg-slate-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        className
      )}
    >
      {icon && (
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">{title}</p>
        {description && (
          <p className="text-xs text-slate-500 mt-0.5 truncate">{description}</p>
        )}
      </div>
      {badge != null && (
        <span className="flex-shrink-0 min-w-[1.5rem] h-6 px-1.5 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center">
          {badge}
        </span>
      )}
      <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  )
}
