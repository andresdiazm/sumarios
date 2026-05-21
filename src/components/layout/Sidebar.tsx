import React from 'react'
import { FileText, MessageSquare, Shield, GitBranch, Cpu, AlertTriangle } from 'lucide-react'
import { MOCK_SUMARIO } from '../../lib/constants'

interface NavItem {
  icon: React.ReactNode
  label: string
  active?: boolean
  stub?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { icon: <FileText size={16} />, label: 'Documentos', active: true },
  { icon: <MessageSquare size={16} />, label: 'Declaraciones', stub: true },
  { icon: <Shield size={16} />, label: 'Evidencias', stub: true },
  { icon: <GitBranch size={16} />, label: 'Proceso', stub: true },
  { icon: <Cpu size={16} />, label: 'Análisis IA', stub: true },
]

const ETAPA_LABELS: Record<string, string> = {
  instruccion: 'Instrucción',
  cargos:      'Form. de cargos',
  descargos:   'Descargos',
  vista:       'Vista fiscal',
  resolucion:  'Resolución',
  cerrado:     'Cerrado',
}

export function Sidebar() {
  const { diasTranscurridos, plazoLegal, id, status } = MOCK_SUMARIO
  const isCritical = diasTranscurridos > plazoLegal

  return (
    <aside
      className="w-[220px] shrink-0 flex flex-col h-full"
      style={{
        backgroundColor: 'var(--bg-panel)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Sumario ID */}
      <div
        className="px-4 py-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>
          Sumario
        </p>
        <p
          className="font-mono font-medium text-sm"
          style={{ color: 'var(--text-primary)' }}
        >
          {id}
        </p>
        <span
          className="inline-block mt-1 text-xs px-2 py-0.5"
          style={{ backgroundColor: 'var(--gold-bg)', color: 'var(--gold)' }}
        >
          {ETAPA_LABELS[status] ?? status}
        </span>
      </div>

      {/* Plazo widget */}
      <div
        className="px-4 py-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Días transcurridos
          </p>
          {isCritical && (
            <AlertTriangle size={12} style={{ color: 'var(--red)' }} />
          )}
        </div>
        <p
          className="font-display text-4xl leading-none"
          style={{ color: isCritical ? 'var(--red)' : 'var(--text-primary)' }}
        >
          {diasTranscurridos}
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          Plazo legal: {plazoLegal} días
        </p>
        {/* Progress bar */}
        <div
          className="mt-2 h-1"
          style={{ backgroundColor: 'var(--border)' }}
        >
          <div
            className="h-full transition-all"
            style={{
              width: `${Math.min((diasTranscurridos / plazoLegal) * 100, 100)}%`,
              backgroundColor: isCritical ? 'var(--red)' : 'var(--gold)',
            }}
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors"
            style={{
              backgroundColor: item.active ? 'var(--gold-bg)' : 'transparent',
              color: item.active
                ? 'var(--gold)'
                : item.stub
                ? 'var(--text-muted)'
                : 'var(--text-muted2)',
              cursor: item.stub ? 'default' : 'pointer',
              borderLeft: item.active ? '2px solid var(--gold)' : '2px solid transparent',
            }}
          >
            {item.icon}
            <span>{item.label}</span>
            {item.stub && (
              <span
                className="ml-auto text-xs px-1.5 py-0.5"
                style={{ backgroundColor: 'var(--bg-panel2)', color: 'var(--text-muted)' }}
              >
                pronto
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="px-4 py-3 text-xs"
        style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}
      >
        <p>Fiscal: <span style={{ color: 'var(--text-muted2)' }}>{MOCK_SUMARIO.fiscal}</span></p>
        <p className="mt-0.5">Actuario: <span style={{ color: 'var(--text-muted2)' }}>{MOCK_SUMARIO.actuario}</span></p>
      </div>
    </aside>
  )
}
