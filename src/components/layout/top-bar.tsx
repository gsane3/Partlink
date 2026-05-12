import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface TopBarProps {
  title?: string
  left?: ReactNode
  right?: ReactNode
  className?: string
}

export function TopBar({ title, left, right, className }: TopBarProps) {
  return (
    <header
      className={cn(
        'h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-4 sticky top-0 z-30',
        className
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {left}
        {title && (
          <h2 className="text-sm font-semibold text-slate-900 truncate">{title}</h2>
        )}
      </div>
      {right && (
        <div className="flex items-center gap-2 flex-shrink-0">{right}</div>
      )}
    </header>
  )
}

export function TopBarIconButton({
  children,
  label,
  onClick,
}: {
  children: ReactNode
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 active:bg-slate-200 transition-colors"
    >
      {children}
    </button>
  )
}
