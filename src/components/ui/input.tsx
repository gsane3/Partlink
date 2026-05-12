import { cn } from '@/lib/utils'
import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-lg',
        'text-slate-900 placeholder:text-slate-400',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        'disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed',
        error && 'border-red-500 focus:ring-red-500',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'
