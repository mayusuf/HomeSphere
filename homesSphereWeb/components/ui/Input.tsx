'use client'

import { cn } from '@/lib/utils'
import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, success, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-hs-text">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full px-3 py-2 text-sm bg-white border rounded-lg outline-none transition-colors',
              'placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20',
              error
                ? 'border-error focus:border-error focus:ring-error/20'
                : success
                ? 'border-success focus:border-success focus:ring-success/20 pr-8'
                : 'border-border',
              className
            )}
            {...props}
          />
          {success && !error && (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-success text-sm">✓</span>
          )}
        </div>
        {error && <span className="text-xs text-error">{error}</span>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
