import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import type { ReactNode } from 'react'

interface FormFieldProps {
  label?: string
  htmlFor?: string
  required?: boolean
  error?: string
  hint?: string
  children: ReactNode
  className?: string
}

export function FormField({ label, htmlFor, required, error, hint, children, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      )}
      {children}
      {hint && !error && (
        <p className="text-xs text-slate-500">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}
