import React, { useState } from 'react'
import { FileText, Download, Plus, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { TEMPLATES, type DocTemplate, type TemplateId } from '../../lib/templates'
import { MOCK_SUMARIO } from '../../lib/constants'
import { generateDocumentPdf } from '../../lib/pdfUtils'
import { getNextFolioNumber, formatFolioLabel } from '../../lib/foliacion'
import { useDocumentStore } from '../../store/useDocumentStore'
import { Button } from '../ui/Button'
import type { LexDocument } from '../../types'

const fieldStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'var(--bg-base)',
  border: '1px solid var(--border)',
  color: 'var(--text-primary)',
  padding: '7px 10px',
  fontSize: '13px',
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  marginBottom: '4px',
  color: 'var(--text-muted)',
  fontWeight: 500,
}

function TemplateForm({ template, onGenerate }: { template: DocTemplate; onGenerate: (values: Record<string, string>) => void }) {
  const defaults = Object.fromEntries(
    template.fields.map((f) => [f.id, f.defaultValue ?? ''])
  )
  const { register, handleSubmit } = useForm<Record<string, string>>({ defaultValues: defaults })

  return (
    <form onSubmit={handleSubmit(onGenerate)} className="space-y-4">
      {template.fields.map((field) => (
        <div key={field.id}>
          <label style={labelStyle} htmlFor={`field-${field.id}`}>
            {field.label}
            {field.required && <span style={{ color: 'var(--red)' }}> *</span>}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              id={`field-${field.id}`}
              {...register(field.id)}
              rows={field.rows ?? 4}
              placeholder={field.placeholder}
              style={{ ...fieldStyle, resize: 'vertical' }}
            />
          ) : (
            <input
              id={`field-${field.id}`}
              type={field.type === 'date' ? 'date' : 'text'}
              {...register(field.id)}
              placeholder={field.placeholder}
              style={fieldStyle}
            />
          )}
        </div>
      ))}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" variant="primary" size="sm">
          <Eye size={14} />
          Generar documento
        </Button>
      </div>
    </form>
  )
}

interface PreviewProps {
  title: string
  docNumber: string
  body: string
  folioNumber: number
  isGenerating: boolean
  onAddToExpediente: () => void
  onDownload: () => void
}

function DocumentPreview({ title, docNumber, body, folioNumber, isGenerating, onAddToExpediente, onDownload }: PreviewProps) {
  if (isGenerating) {
    return (
      <div className="flex flex-col gap-3 p-6">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-5/6" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-2/3" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Document paper */}
      <div
        className="flex-1 overflow-y-auto p-8 font-body text-sm leading-relaxed"
        style={{
          backgroundColor: '#fff',
          color: '#111',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
          minHeight: '500px',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between mb-6 pb-3"
          style={{ borderBottom: '2px solid #D4AF50' }}
        >
          <div>
            <div style={{ fontFamily: '"Bebas Neue",sans-serif', fontSize: 20, color: '#0f1220', letterSpacing: '0.06em' }}>
              LEXSUM
            </div>
            <div style={{ fontSize: 9, color: '#666' }}>{MOCK_SUMARIO.institucion}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 9, color: '#666' }}>Sumario {MOCK_SUMARIO.id}</div>
            <div
              className="font-mono text-xs mt-1 px-2 py-0.5"
              style={{ backgroundColor: '#f5f5f0', border: '1px solid #ccc', display: 'inline-block' }}
            >
              {formatFolioLabel(folioNumber)}
            </div>
          </div>
        </div>

        {/* Doc number */}
        <p style={{ fontSize: 10, color: '#888', marginBottom: 6 }}>{docNumber}</p>

        {/* Title */}
        <h1 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', color: '#0f1220' }}>
          {title}
        </h1>

        {/* Body */}
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
          {body.split('\n').map((line, i) => {
            const isBold = line.startsWith('**') && line.endsWith('**')
            const clean = isBold ? line.slice(2, -2) : line
            return (
              <p key={i} style={{ margin: '4px 0', fontWeight: isBold ? 700 : 400 }}>
                {clean || ' '}
              </p>
            )
          })}
        </div>

        {/* Signature */}
        <div style={{ marginTop: 60 }}>
          <div style={{ borderTop: '1px solid #333', width: 180, paddingTop: 6 }}>
            <div style={{ fontWeight: 700, fontSize: 11 }}>{MOCK_SUMARIO.fiscal}</div>
            <div style={{ fontSize: 10, color: '#666' }}>Fiscal Instructor</div>
            <div style={{ fontSize: 10, color: '#666' }}>{MOCK_SUMARIO.institucion}</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div
        className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <Button variant="primary" size="sm" onClick={onAddToExpediente}>
          <Plus size={14} />
          Agregar al expediente
        </Button>
        <Button variant="outline" size="sm" onClick={onDownload}>
          <Download size={14} />
          Descargar PDF
        </Button>
      </div>
    </div>
  )
}

export function DocumentCreator() {
  const [selectedId, setSelectedId] = useState<TemplateId>('resolucion_fiscal')
  const [preview, setPreview] = useState<{
    title: string
    docNumber: string
    body: string
    folioNumber: number
    pdfBlob: Blob | null
    pdfUrl: string
  } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [templateKey, setTemplateKey] = useState(0)

  const { documents, addDocument } = useDocumentStore()
  const template = TEMPLATES.find((t) => t.id === selectedId)!

  const nextFolio = getNextFolioNumber(documents.map((d) => d.folio))

  async function handleGenerate(values: Record<string, string>) {
    setIsGenerating(true)
    const ctx = {
      sumarioId: MOCK_SUMARIO.id,
      inculpado: MOCK_SUMARIO.inculpado,
      rut: MOCK_SUMARIO.rut,
      cargo: MOCK_SUMARIO.cargo,
      institucion: MOCK_SUMARIO.institucion,
      fiscal: MOCK_SUMARIO.fiscal,
      actuario: MOCK_SUMARIO.actuario,
      fecha: values.fecha ?? new Date().toLocaleDateString('es-CL'),
      folioNumber: nextFolio,
      counter: documents.length + 1,
    }

    const body = template.buildBody(values, ctx)
    const docNumber = template.buildDocNumber(ctx)

    try {
      const { blob, url } = await generateDocumentPdf(template.label, docNumber, nextFolio, body, MOCK_SUMARIO)
      setPreview({ title: template.label, docNumber, body, folioNumber: nextFolio, pdfBlob: blob, pdfUrl: url })
    } catch {
      setPreview({ title: template.label, docNumber, body, folioNumber: nextFolio, pdfBlob: null, pdfUrl: '' })
    } finally {
      setIsGenerating(false)
    }
  }

  function handleAddToExpediente() {
    if (!preview) return
    const doc: LexDocument = {
      id: Math.random().toString(36).slice(2),
      name: preview.docNumber,
      originalFileName: `${template.id}_${Date.now()}.pdf`,
      type: template.docType,
      status: 'sin_firma',
      folio: String(preview.folioNumber).padStart(3, '0'),
      uploadedAt: new Date(),
      fileSize: preview.pdfBlob?.size ?? 0,
      url: preview.pdfUrl,
      file: preview.pdfBlob
        ? new File([preview.pdfBlob], `${template.id}.pdf`, { type: 'application/pdf' })
        : null as unknown as File,
      tags: [],
      etapa: 'instruccion',
      selected: false,
    }
    addDocument(doc)
    toast.success(`"${preview.docNumber}" agregado al expediente (folio ${preview.folioNumber})`)
    setPreview(null)
    setTemplateKey((k) => k + 1)
  }

  function handleDownload() {
    if (!preview?.pdfUrl) return
    const a = document.createElement('a')
    a.href = preview.pdfUrl
    a.download = `${template.id}_${Date.now()}.pdf`
    a.click()
    toast.success('PDF descargado')
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Template selector sidebar */}
      <div
        className="w-56 shrink-0 flex flex-col overflow-y-auto"
        style={{ borderRight: '1px solid var(--border)', backgroundColor: 'var(--bg-panel)' }}
      >
        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
            TIPO DE DOCUMENTO
          </p>
        </div>
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => { setSelectedId(t.id); setPreview(null); setTemplateKey((k) => k + 1) }}
            className="w-full text-left px-4 py-3 transition-colors"
            style={{
              backgroundColor: selectedId === t.id ? 'var(--gold-bg)' : 'transparent',
              borderLeft: selectedId === t.id ? '2px solid var(--gold)' : '2px solid transparent',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <span>{t.icon}</span>
              <span
                className="text-sm font-medium leading-tight"
                style={{ color: selectedId === t.id ? 'var(--gold)' : 'var(--text-primary)' }}
              >
                {t.label}
              </span>
            </div>
            <p className="text-xs leading-tight" style={{ color: 'var(--text-muted)', paddingLeft: '22px' }}>
              {t.description}
            </p>
          </button>
        ))}
      </div>

      {/* Form area */}
      <div
        className="flex flex-col overflow-hidden"
        style={{ width: preview ? '320px' : '100%', borderRight: preview ? '1px solid var(--border)' : 'none' }}
      >
        <div className="px-5 py-3 shrink-0 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {template.icon} {template.label}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Folio a asignar:{' '}
              <span className="font-mono" style={{ color: 'var(--gold)' }}>{formatFolioLabel(nextFolio)}</span>
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText size={14} style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              Folio {String(nextFolio).padStart(3, '0')}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <TemplateForm key={templateKey} template={template} onGenerate={handleGenerate} />
        </div>
      </div>

      {/* Preview area */}
      {(preview || isGenerating) && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 py-3 shrink-0 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
            <Eye size={14} style={{ color: 'var(--text-muted)' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
              VISTA PREVIA
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            {isGenerating ? (
              <div className="flex flex-col gap-3 p-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 12, width: `${70 + Math.random() * 25}%` }} />
                ))}
              </div>
            ) : preview ? (
              <DocumentPreview
                title={preview.title}
                docNumber={preview.docNumber}
                body={preview.body}
                folioNumber={preview.folioNumber}
                isGenerating={false}
                onAddToExpediente={handleAddToExpediente}
                onDownload={handleDownload}
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
