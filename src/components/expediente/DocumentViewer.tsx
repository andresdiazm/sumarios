import React, { useState } from 'react'
import { X, Download, Tag, ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { useDocumentStore } from '../../store/useDocumentStore'
import { DocumentTypeBadge, StatusBadge } from '../ui/Badge'
import { DocumentTagger } from './DocumentTagger'
import { Button } from '../ui/Button'
import { formatDate, formatFileSize } from '../../lib/utils'
import { toast } from 'sonner'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

export function DocumentViewer() {
  const { documents, selectedDocumentId, setSelectedDocumentId, updateDocument } = useDocumentStore()
  const doc = documents.find((d) => d.id === selectedDocumentId) ?? null

  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [editOpen, setEditOpen] = useState(false)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setPageNumber(1)
  }

  function download() {
    if (!doc?.url) return
    const a = document.createElement('a')
    a.href = doc.url
    a.download = doc.originalFileName
    a.click()
  }

  if (!doc) {
    return (
      <div
        className="w-[380px] shrink-0 flex flex-col items-center justify-center gap-3"
        style={{
          borderLeft: '1px solid var(--border)',
          backgroundColor: 'var(--bg-panel)',
        }}
      >
        <FileText size={36} style={{ color: 'var(--border2)' }} />
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Selecciona un documento para previsualizarlo
        </p>
      </div>
    )
  }

  return (
    <div
      className="w-[380px] shrink-0 flex flex-col overflow-hidden"
      style={{
        borderLeft: '1px solid var(--border)',
        backgroundColor: 'var(--bg-panel)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <p
          className="text-xs font-medium truncate flex-1 mr-2"
          style={{ color: 'var(--text-muted)' }}
        >
          Vista previa
        </p>
        <button
          onClick={() => setSelectedDocumentId(null)}
          className="p-1 transition-colors"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Cerrar visor"
        >
          <X size={14} />
        </button>
      </div>

      {/* PDF preview */}
      <div
        className="flex-1 overflow-y-auto flex items-start justify-center py-4"
        style={{ backgroundColor: 'var(--bg-base)' }}
      >
        {doc.url ? (
          <Document
            file={doc.url}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center h-40">
                <div className="skeleton w-40 h-4" />
              </div>
            }
            error={
              <div className="flex flex-col items-center gap-2 py-8 text-center px-4">
                <FileText size={32} style={{ color: 'var(--text-muted)' }} />
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  No se puede previsualizar este archivo
                </p>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              width={340}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>
        ) : (
          <div className="flex flex-col items-center gap-3 py-12">
            <FileText size={40} style={{ color: 'var(--border2)' }} />
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Documento de muestra (sin archivo real)
            </p>
            <div
              className="w-[340px] h-[460px]"
              style={{ backgroundColor: 'var(--bg-panel2)', border: '1px solid var(--border)' }}
            />
          </div>
        )}
      </div>

      {/* Page navigation */}
      {numPages > 1 && (
        <div
          className="flex items-center justify-center gap-3 py-2 shrink-0"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <button
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
            className="p-1 disabled:opacity-30"
            style={{ color: 'var(--text-muted)' }}
          >
            <ChevronLeft size={14} />
          </button>
          <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
            {pageNumber} / {numPages}
          </span>
          <button
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}
            className="p-1 disabled:opacity-30"
            style={{ color: 'var(--text-muted)' }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Metadata */}
      <div
        className="px-4 py-3 space-y-2 shrink-0 text-xs"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <p className="font-medium text-sm leading-snug" style={{ color: 'var(--text-primary)' }}>
          {doc.name}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          <DocumentTypeBadge type={doc.type} size="sm" />
          <StatusBadge status={doc.status} />
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono" style={{ color: 'var(--text-muted)' }}>
          <span>Folio</span>
          <span style={{ color: 'var(--text-muted2)' }}>{doc.folio}</span>
          <span>Fecha</span>
          <span style={{ color: 'var(--text-muted2)' }}>{formatDate(doc.uploadedAt)}</span>
          <span>Tamaño</span>
          <span style={{ color: 'var(--text-muted2)' }}>{formatFileSize(doc.fileSize)}</span>
        </div>

        {doc.notes && (
          <p style={{ color: 'var(--text-muted)' }}>{doc.notes}</p>
        )}

        <div className="flex gap-2 pt-1">
          <Button variant="outline" size="sm" onClick={download} className="flex-1">
            <Download size={13} />
            Descargar
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setEditOpen(true)} className="flex-1">
            <Tag size={13} />
            Editar
          </Button>
        </div>
      </div>

      <DocumentTagger
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={(data) => {
          updateDocument(doc.id, data)
          toast.success('Etiquetas actualizadas')
          setEditOpen(false)
        }}
        initial={doc}
        mode="edit"
      />
    </div>
  )
}
