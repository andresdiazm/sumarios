import React from 'react'
import type { DocumentType } from '../../types'
import { DOCUMENT_TYPE_COLORS, DOCUMENT_TYPE_LABELS } from '../../lib/constants'

interface BadgeProps {
  type: DocumentType
  size?: 'sm' | 'md'
}

export function DocumentTypeBadge({ type, size = 'md' }: BadgeProps) {
  const { bg, text } = DOCUMENT_TYPE_COLORS[type]
  const label = DOCUMENT_TYPE_LABELS[type]

  return (
    <span
      className={size === 'sm' ? 'inline-flex items-center px-2 py-0.5 text-xs font-mono font-medium' : 'inline-flex items-center px-2.5 py-1 text-xs font-mono font-medium'}
      style={{ backgroundColor: bg, color: text }}
    >
      {label}
    </span>
  )
}

interface StatusBadgeProps {
  status: 'sin_firma' | 'firmado' | 'pendiente'
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    firmado:   { bg: 'var(--green-bg)', color: 'var(--green)', label: 'Firmado' },
    sin_firma: { bg: 'var(--orange-bg)', color: 'var(--orange)', label: 'Sin firma' },
    pendiente: { bg: 'var(--blue-bg)', color: 'var(--blue)', label: 'Pendiente' },
  }
  const { bg, color, label } = styles[status]

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono"
      style={{ backgroundColor: bg, color }}
    >
      {status === 'sin_firma' && (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )}
      {label}
    </span>
  )
}

interface GenericBadgeProps {
  children: React.ReactNode
  color?: string
  bg?: string
}

export function Badge({ children, color, bg }: GenericBadgeProps) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 text-xs font-mono"
      style={{ backgroundColor: bg ?? 'var(--bg-panel3)', color: color ?? 'var(--text-muted)' }}
    >
      {children}
    </span>
  )
}
