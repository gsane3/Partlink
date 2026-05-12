import { PublicNavbar } from '@/components/layout/public-navbar'
import type { ReactNode } from 'react'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PublicNavbar />
      <main>{children}</main>
    </div>
  )
}
