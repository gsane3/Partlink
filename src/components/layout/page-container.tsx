import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  narrow?: boolean
}

export function PageContainer({ className, narrow, children, ...props }: PageContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8 py-6',
        narrow ? 'max-w-3xl' : 'max-w-7xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
