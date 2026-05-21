import React, { useRef, useState, useCallback } from 'react'
import { Upload, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { useDocumentUpload } from '../../hooks/useDocumentUpload'
import { useDocumentStore } from '../../store/useDocumentStore'
import { DocumentTagger } from './DocumentTagger'
import { generateId } from '../../lib/utils'
import type { LexDocument } from '../../types'

export function DocumentUploader() {
  const [isDragging, setIsDragging] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [pendingUrl, setPendingUrl] = useState<string>('')
  const [taggerOpen, setTaggerOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { prepareFile, isLoading, progress, error, validate } = useDocumentUpload()
  const addDocument = useDocumentStore((s) => s.addDocument)

  async function handleFile(file: File) {
    const validationError = validate(file)
    if (validationError) {
      toast.error(validationError)
      return
    }
    const result = await prepareFile(file)
    if (!result) return
    setPendingFile(file)
    setPendingUrl(result.url)
    setTaggerOpen(true)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [])

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback(() => setIsDragging(false), [])

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  function onTaggerSave(data: Partial<LexDocument>) {
    if (!pendingFile) return
    const doc: LexDocument = {
      id:               generateId(),
      name:             data.name ?? pendingFile.name,
      originalFileName: pendingFile.name,
      type:             data.type ?? 'otro',
      status:           data.status ?? 'sin_firma',
      folio:            data.folio ?? '',
      etapa:            data.etapa ?? 'instruccion',
      notes:            data.notes,
      uploadedAt:       new Date(),
      fileSize:         pendingFile.size,
      url:              pendingUrl,
      file:             pendingFile,
      tags:             [],
      selected:         false,
    }
    addDocument(doc)
    toast.success(`"${doc.name}" agregado al expediente`)
    setPendingFile(null)
    setPendingUrl('')
  }

  function onTaggerClose() {
    setTaggerOpen(false)
    setPendingFile(null)
    if (pendingUrl) URL.revokeObjectURL(pendingUrl)
    setPendingUrl('')
  }

  return (
    <>
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className="cursor-pointer transition-all duration-150"
        style={{
          border: `2px dashed ${isDragging ? 'var(--gold)' : 'var(--border2)'}`,
          backgroundColor: isDragging ? 'var(--gold-bg)' : 'transparent',
          padding: '28px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        {isLoading ? (
          <>
            <FileText size={28} style={{ color: 'var(--gold)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Procesando archivo…
            </p>
            <div
              className="w-48 h-1 overflow-hidden"
              style={{ backgroundColor: 'var(--border)' }}
            >
              <div
                className="h-full transition-all duration-150"
                style={{ width: `${progress}%`, backgroundColor: 'var(--gold)' }}
              />
            </div>
          </>
        ) : (
          <>
            <Upload size={28} style={{ color: isDragging ? 'var(--gold)' : 'var(--text-muted)' }} />
            <div className="text-center">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Arrastra archivos PDF aquí o{' '}
                <span style={{ color: 'var(--gold)', textDecoration: 'underline' }}>
                  haz clic para seleccionar
                </span>
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Solo PDF — máximo 50 MB
              </p>
            </div>
          </>
        )}
        {error && (
          <p className="text-xs" style={{ color: 'var(--red)' }}>{error}</p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={onInputChange}
        aria-label="Seleccionar archivo PDF"
      />

      <DocumentTagger
        open={taggerOpen}
        onClose={onTaggerClose}
        onSave={onTaggerSave}
        initial={pendingFile ? { originalFileName: pendingFile.name, name: pendingFile.name } : undefined}
        mode="add"
      />
    </>
  )
}
