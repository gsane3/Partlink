'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export interface MobileNavItem {
  label: string
  href: string
  icon: ReactNode
  badge?: number
}

interface MobileBottomNavProps {
  items: MobileNavItem[]
  className?: string
}

export function MobileBottomNav({ items, className }: MobileBottomNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200',
        'flex items-stretch h-16 lg:hidden',
        className
      )}
      aria-label="Πλοήγηση"
    >
      {items.map((item) => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors relative',
              active ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
            )}
          >
            <span className="w-6 h-6 flex items-center justify-center relative" aria-hidden="true">
              {item.icon}
              {item.badge != null && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[1rem] h-4 px-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </span>
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
