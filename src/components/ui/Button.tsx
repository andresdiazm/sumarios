import React from 'react'
import { cn } from '../../lib/utils'

type Variant = 'primary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantStyles: Record<Variant, string> = {
  primary: 'text-[var(--bg-base)] font-semibold hover:opacity-90 active:opacity-80',
  outline: 'border border-[var(--border2)] text-[var(--text-primary)] hover:bg-[var(--bg-panel2)] active:bg-[var(--bg-panel3)]',
  ghost:   'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-panel2)]',
  danger:  'bg-[var(--red-bg)] text-[var(--red)] border border-[var(--red)] border-opacity-30 hover:opacity-80',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-sm gap-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  style,
  ...props
}: ButtonProps) {
  const isPrimary = variant === 'primary'

  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-body transition-all duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed focus-ring',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      style={isPrimary ? { backgroundColor: 'var(--gold)', ...style } : style}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
