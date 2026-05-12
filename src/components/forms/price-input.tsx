import { cn } from '@/lib/utils'
import { forwardRef, type InputHTMLAttributes } from 'react'

interface PriceInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const PriceInput = forwardRef<HTMLInputElement, PriceInputProps>(
  ({ className, error, ...props }, ref) => (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 pointer-events-none select-none">
        €
      </span>
      <input
        ref={ref}
        type="number"
        min="0"
        step="0.01"
        inputMode="decimal"
        className={cn(
          'w-full h-10 pl-7 pr-3 text-sm bg-white border border-slate-200 rounded-lg',
          'text-slate-900 placeholder:text-slate-400',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:opacity-50 disabled:bg-slate-50',
          '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
    </div>
  )
)
PriceInput.displayName = 'PriceInput'
