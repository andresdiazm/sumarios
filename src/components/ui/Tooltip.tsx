import React, { useState } from 'react'

interface TooltipProps {
  content: string
  children: React.ReactElement
  placement?: 'top' | 'bottom'
}

export function Tooltip({ content, children, placement = 'top' }: TooltipProps) {
  const [visible, setVisible] = useState(false)

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          className="absolute z-50 px-2 py-1 text-xs whitespace-nowrap pointer-events-none"
          style={{
            backgroundColor: 'var(--bg-panel3)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            ...(placement === 'top'
              ? { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '4px' }
              : { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '4px' }),
          }}
        >
          {content}
        </span>
      )}
    </span>
  )
}
