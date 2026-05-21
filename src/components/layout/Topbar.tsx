import React from 'react'
import { Sun, Moon, Plus, ChevronRight } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { Button } from '../ui/Button'

export function Topbar() {
  const { isDark, toggle } = useTheme()

  return (
    <header
      className="h-12 flex items-center justify-between px-4 shrink-0 z-20"
      style={{
        backgroundColor: 'var(--bg-panel)',
        borderBottom: '1px solid var(--border)',
        boxShadow: '0 1px 8px rgba(0,0,0,0.12)',
      }}
    >
      {/* Left: logo + breadcrumb */}
      <div className="flex items-center gap-3">
        <span
          className="text-xl tracking-widest select-none"
          style={{ fontFamily: '"Bebas Neue", sans-serif', color: 'var(--gold)' }}
        >
          LEXSUM
        </span>

        <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          <ChevronRight size={12} />
          <span style={{ color: 'var(--text-muted2)' }}>Expedientes</span>
          <ChevronRight size={12} />
          <span
            className="font-mono font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            SA-2024-0147
          </span>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <Button variant="primary" size="sm">
          <Plus size={14} />
          Nueva actuación
        </Button>

        <button
          onClick={toggle}
          className="p-2 transition-colors focus-ring"
          style={{ color: 'var(--text-muted)' }}
          aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          title={isDark ? 'Modo claro' : 'Modo oscuro'}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  )
}
