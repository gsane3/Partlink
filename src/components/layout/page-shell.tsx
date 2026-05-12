import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

interface PageShellProps extends HTMLAttributes<HTMLDivElement> {
  mobileNav?: boolean
}

export function PageShell({ className, mobileNav, children, ...props }: PageShellProps) {
  return (
    <div
      className={cn(
        'min-h-screen bg-[#F8FAFC] text-slate-900',
        mobileNav && 'pb-16',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
