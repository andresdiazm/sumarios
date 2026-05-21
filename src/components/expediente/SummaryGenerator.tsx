import React, { useState } from 'react'
import { Copy, Download, Plus, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { DocumentTypeBadge } from '../ui/Badge'
import type { LexDocument } from '../../types'

interface SummaryGeneratorProps {
  open: boolean
  onClose: () => void
  documents: LexDocument[]
}

const KEY_FINDINGS = [
  'Ausencia de órdenes de compra correlativas en 14 facturas observadas',
  'Declaración del Jefe de Control confirma omisión del proceso de visación',
  'Código de usuario JPEREZF aparece en todas las transacciones irregulares',
  'Dos proveedores presentan antecedentes tributarios irregulares en SII',
]

const REFERENCES = ['Art. 61 EA', 'Art. 125 EA', 'DS 98/2004', 'Dic. CGR N°24.112/2019']

export function SummaryGenerator({ open, onClose, documents }: SummaryGeneratorProps) {
  const [instruction, setInstruction] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const summaryText = result
    ? result
    : `El análisis de los ${documents.length} documentos seleccionados del expediente SA-2024-0147 revela un patrón consistente de irregularidades en la gestión de fondos públicos durante el período enero–marzo 2024. Las declaraciones recabadas presentan contradicciones relevantes respecto a los procedimientos de autorización, y la evidencia documental del sistema SIGFE vincula directamente al inculpado con las transacciones observadas. Se sugiere avanzar a la formulación de cargos considerando los artículos 61 literal b) y 125 del Estatuto Administrativo.`

  function handleGenerate() {
    setIsGenerating(true)
    setResult(null)
    setTimeout(() => {
      setIsGenerating(false)
      setResult(summaryText)
    }, 2500)
  }

  function handleCopy() {
    const text = buildFullText()
    navigator.clipboard.writeText(text)
    toast.success('Resumen copiado al portapapeles')
  }

  function handleDownload() {
    const text = buildFullText()
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resumen-SA-2024-0147-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Resumen descargado')
  }

  function buildFullText(): string {
    return [
      `RESUMEN DEL EXPEDIENTE SA-2024-0147`,
      `Documentos analizados: ${documents.length}`,
      `Generado: ${new Date().toLocaleString('es-CL')}`,
      '',
      summaryText,
      '',
      'HALLAZGOS CLAVE:',
      ...KEY_FINDINGS.map((f) => `• ${f}`),
      '',
      'REFERENCIAS LEGALES:',
      REFERENCES.join(', '),
    ].join('\n')
  }

  function handleReset() {
    setResult(null)
    setInstruction('')
  }

  return (
    <Modal
      open={open}
      onClose={() => { onClose(); handleReset() }}
      title="Generar resumen IA"
      width="max-w-2xl"
    >
      <div className="p-5 space-y-4">
        {/* Documents list */}
        <div>
          <p className="text-xs mb-2 font-medium" style={{ color: 'var(--text-muted)' }}>
            Documentos incluidos ({documents.length})
          </p>
          <div className="space-y-1.5">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 px-3 py-2"
                style={{ backgroundColor: 'var(--bg-panel2)', border: '1px solid var(--border)' }}
              >
                <DocumentTypeBadge type={doc.type} size="sm" />
                <span className="text-sm flex-1 truncate" style={{ color: 'var(--text-primary)' }}>
                  {doc.name}
                </span>
                <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                  F.{doc.folio}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Instruction */}
        {!result && (
          <div>
            <label
              htmlFor="summary-instruction"
              className="block text-xs mb-1.5 font-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              Instrucción adicional{' '}
              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(opcional)</span>
            </label>
            <textarea
              id="summary-instruction"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              rows={2}
              placeholder="Ej: Énfasis en las inconsistencias de las declaraciones del testigo Aguilar…"
              className="w-full text-sm outline-none resize-none"
              style={{
                backgroundColor: 'var(--bg-panel2)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                padding: '8px 10px',
                fontFamily: 'Inter, sans-serif',
              }}
            />
          </div>
        )}

        {/* Loading skeleton */}
        {isGenerating && (
          <div className="space-y-3 py-4">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} style={{ color: 'var(--gold)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--gold)' }}>
                Analizando documentos…
              </span>
            </div>
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-11/12" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-4/5" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-3/4" />
          </div>
        )}

        {/* Result */}
        {result && !isGenerating && (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color: 'var(--gold)' }}>
                <Sparkles size={12} />
                Resumen del expediente — {documents.length} documentos
              </p>
              <div
                className="text-sm leading-relaxed p-4"
                style={{
                  backgroundColor: 'var(--bg-panel2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
              >
                {summaryText}
              </div>
            </div>

            {/* Hallazgos */}
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
                HALLAZGOS CLAVE
              </p>
              <ul className="space-y-1.5">
                {KEY_FINDINGS.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-primary)' }}>
                    <span style={{ color: 'var(--gold)', marginTop: '2px', flexShrink: 0 }}>•</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Referencias */}
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
                REFERENCIAS LEGALES CITADAS
              </p>
              <div className="flex flex-wrap gap-2">
                {REFERENCES.map((r) => (
                  <span
                    key={r}
                    className="text-xs font-mono px-2 py-1"
                    style={{ backgroundColor: 'var(--gold-bg)', color: 'var(--gold)' }}
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>

            {/* Result actions */}
            <div className="flex items-center gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy size={13} />
                Copiar
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download size={13} />
                Descargar TXT
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  toast.success('Resumen agregado al expediente')
                  onClose()
                  handleReset()
                }}
              >
                <Plus size={13} />
                Agregar al expediente
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {!result && (
        <div
          className="flex items-center justify-end gap-3 px-5 py-3"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="sm"
            loading={isGenerating}
            onClick={handleGenerate}
          >
            <Sparkles size={14} />
            Generar resumen
          </Button>
        </div>
      )}
    </Modal>
  )
}
