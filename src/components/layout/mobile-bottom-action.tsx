import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface MobileBottomActionProps {
  primary: ReactNode
  secondary?: ReactNode
  className?: string
}

export function MobileBottomAction({ primary, secondary, className }: MobileBottomActionProps) {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-4 py-3',
        'flex gap-3 lg:hidden',
        className
      )}
    >
      {secondary && <div className="flex-shrink-0">{secondary}</div>}
      <div className="flex-1">{primary}</div>
    </div>
  )
}
