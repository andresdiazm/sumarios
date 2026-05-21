import React, { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { toast } from 'sonner'
import { useDocumentStore } from '../../store/useDocumentStore'
import { DocumentRow } from './DocumentRow'
import { DocumentTagger } from './DocumentTagger'
import { SummaryGenerator } from './SummaryGenerator'
import { EmptyState } from '../ui/EmptyState'
import { Button } from '../ui/Button'
import { TIPOS_DOCUMENTO, DOCUMENT_TYPE_LABELS } from '../../lib/constants'
import type { LexDocument, DocumentType } from '../../types'

const COL_HEADERS = ['', '#', 'Documento', 'Tipo', 'Folio', 'Estado', 'Etapa', 'Fecha', 'Acciones']

export function DocumentList() {
  const {
    documents,
    selectedDocumentId,
    searchQuery,
    typeFilter,
    toggleSelect,
    selectAll,
    deselectAll,
    updateDocument,
    removeDocument,
    setSelectedDocumentId,
    setSearchQuery,
    setTypeFilter,
  } = useDocumentStore()

  const [editingDoc, setEditingDoc] = useState<LexDocument | null>(null)
  const [summaryOpen, setSummaryOpen] = useState(false)

  const filtered = useMemo(() => {
    let list = documents
    if (typeFilter) list = list.filter((d) => d.type === typeFilter)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          DOCUMENT_TYPE_LABELS[d.type].toLowerCase().includes(q) ||
          d.folio.toLowerCase().includes(q),
      )
    }
    return list
  }, [documents, typeFilter, searchQuery])

  const selected = documents.filter((d) => d.selected)
  const allFilteredSelected = filtered.length > 0 && filtered.every((d) => d.selected)

  function handleGlobalCheck() {
    if (allFilteredSelected) deselectAll()
    else selectAll()
  }

  function handleDelete(id: string) {
    const doc = documents.find((d) => d.id === id)
    if (!doc) return
    if (confirm(`¿Eliminar "${doc.name}"?`)) {
      removeDocument(id)
      if (selectedDocumentId === id) setSelectedDocumentId(null)
      toast.success('Documento eliminado')
    }
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Toolbar */}
      <div
        className="flex items-center gap-3 px-4 py-2.5 shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        {/* Search */}
        <div
          className="flex items-center gap-2 flex-1 max-w-xs"
          style={{
            backgroundColor: 'var(--bg-panel2)',
            border: '1px solid var(--border)',
            padding: '5px 10px',
          }}
        >
          <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Buscar por nombre, tipo o folio…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none"
            style={{ color: 'var(--text-primary)' }}
            aria-label="Buscar documentos"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ color: 'var(--text-muted)' }}>
              <X size={13} />
            </button>
          )}
        </div>

        {/* Type filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setTypeFilter(null)}
            className="px-2.5 py-1 text-xs transition-colors whitespace-nowrap"
            style={{
              backgroundColor: !typeFilter ? 'var(--gold-bg)' : 'var(--bg-panel2)',
              color: !typeFilter ? 'var(--gold)' : 'var(--text-muted)',
              border: `1px solid ${!typeFilter ? 'var(--gold)' : 'var(--border)'}`,
            }}
          >
            Todos
          </button>
          {TIPOS_DOCUMENTO.map((t) => {
            const active = typeFilter === t.value
            return (
              <button
                key={t.value}
                onClick={() => setTypeFilter(active ? null : t.value)}
                className="px-2.5 py-1 text-xs transition-colors whitespace-nowrap"
                style={{
                  backgroundColor: active ? 'var(--gold-bg)' : 'var(--bg-panel2)',
                  color: active ? 'var(--gold)' : 'var(--text-muted)',
                  border: `1px solid ${active ? 'var(--gold)' : 'var(--border)'}`,
                }}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        <span className="ml-auto text-xs font-mono" style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          {filtered.length} doc{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <EmptyState
            title="Sin documentos"
            description={
              searchQuery || typeFilter
                ? 'No hay resultados para los filtros aplicados.'
                : 'Aún no hay documentos en este expediente.'
            }
          />
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-panel2)', borderBottom: '1px solid var(--border)' }}>
                <th className="pl-4 pr-2 py-2 w-8">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={handleGlobalCheck}
                    style={{ accentColor: 'var(--gold)' }}
                    aria-label="Seleccionar todos"
                  />
                </th>
                {COL_HEADERS.slice(1).map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 text-left text-xs font-medium whitespace-nowrap"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc, i) => (
                <DocumentRow
                  key={doc.id}
                  doc={doc}
                  index={i}
                  isActive={selectedDocumentId === doc.id}
                  onSelect={() => toggleSelect(doc.id)}
                  onClick={() =>
                    setSelectedDocumentId(selectedDocumentId === doc.id ? null : doc.id)
                  }
                  onEdit={() => setEditingDoc(doc)}
                  onDelete={() => handleDelete(doc.id)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Selection bar */}
      {selected.length > 0 && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 px-5 py-3"
          style={{
            backgroundColor: 'var(--bg-panel3)',
            border: '1px solid var(--border2)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          }}
        >
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {selected.length} documento{selected.length !== 1 ? 's' : ''} seleccionado{selected.length !== 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={deselectAll}>
              Desmarcar
            </Button>
            {selected.length >= 2 && (
              <Button variant="primary" size="sm" onClick={() => setSummaryOpen(true)}>
                Generar resumen IA
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editingDoc && (
        <DocumentTagger
          open={!!editingDoc}
          onClose={() => setEditingDoc(null)}
          onSave={(data) => {
            updateDocument(editingDoc.id, data)
            toast.success('Etiquetas actualizadas')
            setEditingDoc(null)
          }}
          initial={editingDoc}
          mode="edit"
        />
      )}

      {/* Summary modal */}
      <SummaryGenerator
        open={summaryOpen}
        onClose={() => setSummaryOpen(false)}
        documents={selected}
      />
    </div>
  )
}
