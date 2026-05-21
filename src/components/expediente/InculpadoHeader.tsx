import React from 'react'
import { MOCK_SUMARIO } from '../../lib/constants'
import { Badge } from '../ui/Badge'
import { formatDateLong } from '../../lib/utils'

export function InculpadoHeader() {
  const s = MOCK_SUMARIO

  return (
    <div
      className="px-6 py-4 shrink-0"
      style={{
        backgroundColor: 'var(--bg-panel)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Main info */}
        <div className="flex-1 min-w-0">
          <h1
            className="text-3xl leading-none mb-1 truncate"
            style={{ fontFamily: '"Bebas Neue", sans-serif', color: 'var(--text-primary)', letterSpacing: '0.04em' }}
          >
            {s.inculpado}
          </h1>
          <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
            {s.cargo} &mdash; {s.institucion}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <Badge bg="var(--gold-bg)" color="var(--gold)">
              Inculpado
            </Badge>
            <Badge>Contrato a plazo</Badge>
            <Badge>Grado 8</Badge>
            <Badge>+12 años servicio</Badge>
          </div>
        </div>

        {/* Metadata */}
        <div className="shrink-0 text-right text-xs font-mono space-y-1">
          <div>
            <span style={{ color: 'var(--text-muted)' }}>RUT </span>
            <span style={{ color: 'var(--text-primary)' }}>{s.rut}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Expediente </span>
            <span style={{ color: 'var(--gold)' }}>{s.id}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Apertura </span>
            <span style={{ color: 'var(--text-muted2)' }}>{formatDateLong(s.apertura)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
