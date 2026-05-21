import React from 'react'
import { Eye, Tag, Trash2, AlertTriangle } from 'lucide-react'
import type { LexDocument } from '../../types'
import { DocumentTypeBadge, StatusBadge } from '../ui/Badge'
import { ETAPA_LABELS } from '../../lib/constants'
import { formatDate, formatFileSize } from '../../lib/utils'
import { Tooltip } from '../ui/Tooltip'

interface DocumentRowProps {
  doc: LexDocument
  index: number
  onSelect: () => void
  onClick: () => void
  onEdit: () => void
  onDelete: () => void
  isActive: boolean
}

export function DocumentRow({
  doc,
  index,
  onSelect,
  onClick,
  onEdit,
  onDelete,
  isActive,
}: DocumentRowProps) {
  return (
    <tr
      onClick={onClick}
      className="cursor-pointer transition-colors duration-100 group"
      style={{
        backgroundColor: isActive
          ? 'var(--gold-bg)'
          : doc.selected
          ? 'var(--bg-panel2)'
          : 'transparent',
        borderBottom: '1px solid var(--border)',
      }}
      onMouseEnter={(e) => {
        if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-panel2)'
      }}
      onMouseLeave={(e) => {
        if (!isActive)
          (e.currentTarget as HTMLElement).style.backgroundColor = doc.selected
            ? 'var(--bg-panel2)'
            : 'transparent'
      }}
    >
      {/* Checkbox */}
      <td className="pl-4 pr-2 py-3 w-8" onClick={(e) => { e.stopPropagation(); onSelect() }}>
        <input
          type="checkbox"
          checked={doc.selected}
          onChange={onSelect}
          onClick={(e) => e.stopPropagation()}
          style={{ accentColor: 'var(--gold)' }}
          aria-label={`Seleccionar ${doc.name}`}
        />
      </td>

      {/* # */}
      <td className="px-2 py-3 w-10 text-center">
        <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
          {String(index + 1).padStart(2, '0')}
        </span>
      </td>

      {/* Nombre */}
      <td className="px-3 py-3 min-w-0">
        <div className="flex items-center gap-2">
          {doc.status === 'sin_firma' && (
            <Tooltip content="Sin firma">
              <AlertTriangle size={13} style={{ color: 'var(--orange)', flexShrink: 0 }} />
            </Tooltip>
          )}
          <span
            className="text-sm truncate block max-w-xs"
            style={{
              color: isActive ? 'var(--gold)' : 'var(--text-primary)',
              fontWeight: isActive ? 500 : 400,
            }}
          >
            {doc.name}
          </span>
        </div>
        {doc.notes && (
          <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {doc.notes}
          </p>
        )}
      </td>

      {/* Tipo */}
      <td className="px-3 py-3 whitespace-nowrap">
        <DocumentTypeBadge type={doc.type} size="sm" />
      </td>

      {/* Folio */}
      <td className="px-3 py-3 whitespace-nowrap">
        <span className="font-mono text-xs" style={{ color: 'var(--text-muted2)' }}>
          {doc.folio}
        </span>
      </td>

      {/* Estado */}
      <td className="px-3 py-3 whitespace-nowrap">
        <StatusBadge status={doc.status} />
      </td>

      {/* Etapa */}
      <td className="px-3 py-3 whitespace-nowrap">
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {ETAPA_LABELS[doc.etapa] ?? doc.etapa}
        </span>
      </td>

      {/* Fecha */}
      <td className="px-3 py-3 whitespace-nowrap">
        <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
          {formatDate(doc.uploadedAt)}
        </span>
      </td>

      {/* Acciones */}
      <td
        className="px-3 py-3 whitespace-nowrap"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip content="Ver">
            <button
              onClick={onClick}
              className="p-1.5 transition-colors"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Ver documento"
            >
              <Eye size={14} />
            </button>
          </Tooltip>
          <Tooltip content="Editar etiquetas">
            <button
              onClick={onEdit}
              className="p-1.5 transition-colors"
              style={{ color: 'var(--text-muted)' }}
              aria-label="Editar etiquetas"
            >
              <Tag size={14} />
            </button>
          </Tooltip>
          <Tooltip content="Eliminar">
            <button
              onClick={onDelete}
              className="p-1.5 transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--red)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
              aria-label="Eliminar documento"
            >
              <Trash2 size={14} />
            </button>
          </Tooltip>
        </div>
      </td>
    </tr>
  )
}
