import React from 'react'
import { FileText } from 'lucide-react'
import { Button } from './Button'

interface EmptyStateProps {
  title: string
  description: string
  action?: { label: string; onClick: () => void }
  icon?: React.ReactNode
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <div
        className="mb-5 p-4"
        style={{ color: 'var(--text-muted)', backgroundColor: 'var(--bg-panel2)' }}
      >
        {icon ?? <FileText size={32} />}
      </div>
      <p className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
        {title}
      </p>
      <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
        {description}
      </p>
      {action && (
        <Button variant="primary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
