'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export interface NavItem {
  label: string
  href: string
  icon: ReactNode
  badge?: number
  exact?: boolean
}

interface DesktopSidebarProps {
  navItems: NavItem[]
  bottomItems?: NavItem[]
  logo?: ReactNode
  className?: string
}

function isActive(pathname: string, item: NavItem): boolean {
  if (item.exact) return pathname === item.href
  return pathname === item.href || pathname.startsWith(item.href + '/')
}

export function DesktopSidebar({ navItems, bottomItems, logo, className }: DesktopSidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col w-60 min-h-screen bg-white border-r border-slate-200 sticky top-0 max-h-screen overflow-y-auto',
        className
      )}
    >
      <div className="h-14 flex items-center px-4 border-b border-slate-200 flex-shrink-0">
        {logo ?? (
          <span className="text-base font-bold text-slate-900 tracking-tight">Partlink</span>
        )}
      </div>

      <nav className="flex-1 py-3 px-2">
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <SidebarItem key={item.href} item={item} active={isActive(pathname, item)} />
          ))}
        </ul>
      </nav>

      {bottomItems && bottomItems.length > 0 && (
        <div className="border-t border-slate-200 py-3 px-2 flex-shrink-0">
          <ul className="space-y-0.5">
            {bottomItems.map((item) => (
              <SidebarItem key={item.href} item={item} active={isActive(pathname, item)} />
            ))}
          </ul>
        </div>
      )}
    </aside>
  )
}

function SidebarItem({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <li>
      <Link
        href={item.href}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex items-center gap-3 px-3 h-10 rounded-lg text-sm font-medium transition-colors',
          active
            ? 'bg-blue-50 text-blue-700'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        )}
      >
        <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center" aria-hidden="true">
          {item.icon}
        </span>
        <span className="flex-1 truncate">{item.label}</span>
        {item.badge != null && item.badge > 0 && (
          <span className="min-w-[1.25rem] h-5 px-1 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center">
            {item.badge}
          </span>
        )}
      </Link>
    </li>
  )
}
