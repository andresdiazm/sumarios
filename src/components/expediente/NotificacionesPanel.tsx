import React, { useState } from 'react'
import { Mail, Printer, Send, CheckCircle, Clock, FileText, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useDocumentStore } from '../../store/useDocumentStore'
import { DocumentTypeBadge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { MOCK_SUMARIO } from '../../lib/constants'
import { formatDate } from '../../lib/utils'
import type { LexDocument } from '../../types'

interface NotificacionLog {
  id: string
  fecha: Date
  via: 'email' | 'presencial'
  documentos: string[]
  estado: 'enviado' | 'pendiente' | 'fallido'
}

export function NotificacionesPanel() {
  const { documents } = useDocumentStore()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [via, setVia] = useState<'email' | 'presencial'>('email')
  const [emailDest, setEmailDest] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [log, setLog] = useState<NotificacionLog[]>([])

  function toggleDoc(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectAll() {
    setSelected(new Set(documents.map((d) => d.id)))
  }

  function deselectAll() {
    setSelected(new Set())
  }

  function handlePrint() {
    const docs = documents.filter((d) => selected.has(d.id))
    if (docs.length === 0) { toast.error('Selecciona al menos un documento'); return }

    // Build a printable HTML page
    const html = `
      <!DOCTYPE html><html lang="es"><head><meta charset="utf-8"/>
      <title>Notificación Presencial — ${MOCK_SUMARIO.id}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; font-size: 12px; }
        h1 { font-size: 16px; border-bottom: 2px solid #D4AF50; padding-bottom: 8px; }
        h2 { font-size: 13px; margin-top: 24px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { border: 1px solid #ccc; padding: 6px 10px; text-align: left; }
        th { background: #f0f0e8; font-weight: 600; }
        .footer { margin-top: 60px; display: flex; gap: 80px; }
        .sig { border-top: 1px solid #333; width: 200px; padding-top: 6px; font-size: 11px; }
        .badge { display: inline-block; padding: 2px 8px; background: #f0f0e8; border: 1px solid #ccc; }
        @media print { body { margin: 20px; } }
      </style></head><body>
      <h1>NOTIFICACIÓN PRESENCIAL</h1>
      <p><strong>Sumario:</strong> ${MOCK_SUMARIO.id}</p>
      <p><strong>Inculpado:</strong> ${MOCK_SUMARIO.inculpado} — RUT ${MOCK_SUMARIO.rut}</p>
      <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      <p><strong>Fiscal instructor:</strong> ${MOCK_SUMARIO.fiscal}</p>

      <h2>Documentos Notificados</h2>
      <table>
        <thead><tr><th>#</th><th>Documento</th><th>Folio</th><th>Tipo</th><th>Estado</th></tr></thead>
        <tbody>
        ${docs.map((d, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${d.name}</td>
            <td>${d.folio}</td>
            <td>${d.type}</td>
            <td>${d.status}</td>
          </tr>`).join('')}
        </tbody>
      </table>

      <div class="footer">
        <div class="sig">
          <strong>${MOCK_SUMARIO.inculpado}</strong><br/>
          Inculpado/a — Firma y fecha
        </div>
        <div class="sig">
          <strong>${MOCK_SUMARIO.fiscal}</strong><br/>
          Fiscal Instructor
        </div>
        <div class="sig">
          <strong>${MOCK_SUMARIO.actuario}</strong><br/>
          Actuario
        </div>
      </div>
      </body></html>`

    const win = window.open('', '_blank')
    if (!win) { toast.error('Activa ventanas emergentes para imprimir'); return }
    win.document.write(html)
    win.document.close()
    win.focus()
    setTimeout(() => win.print(), 400)

    const entry: NotificacionLog = {
      id: Math.random().toString(36).slice(2),
      fecha: new Date(),
      via: 'presencial',
      documentos: docs.map((d) => d.name),
      estado: 'enviado',
    }
    setLog((l) => [entry, ...l])
    toast.success('Documento de notificación enviado a impresión')
  }

  function handleEmail() {
    const docs = documents.filter((d) => selected.has(d.id))
    if (docs.length === 0) { toast.error('Selecciona al menos un documento'); return }
    if (!emailDest.includes('@')) { toast.error('Ingresa un correo válido'); return }

    setIsSending(true)
    const subject = encodeURIComponent(`Notificación Sumario ${MOCK_SUMARIO.id}`)
    const body = encodeURIComponent(
      `Estimado/a ${MOCK_SUMARIO.inculpado}:\n\n` +
      `Por medio del presente correo se le notifica de los siguientes documentos del Sumario Administrativo ${MOCK_SUMARIO.id}:\n\n` +
      docs.map((d, i) => `${i + 1}. ${d.name} (Folio ${d.folio})`).join('\n') +
      `\n\nAtentamente,\n${MOCK_SUMARIO.fiscal}\nFiscal Instructor\n${MOCK_SUMARIO.institucion}`
    )

    setTimeout(() => {
      window.location.href = `mailto:${emailDest}?subject=${subject}&body=${body}`
      const entry: NotificacionLog = {
        id: Math.random().toString(36).slice(2),
        fecha: new Date(),
        via: 'email',
        documentos: docs.map((d) => d.name),
        estado: 'enviado',
      }
      setLog((l) => [entry, ...l])
      setIsSending(false)
      toast.success(`Notificación enviada a ${emailDest}`)
    }, 800)
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left: document selection + send */}
      <div className="flex flex-col w-[420px] shrink-0 overflow-hidden" style={{ borderRight: '1px solid var(--border)' }}>

        {/* Header */}
        <div className="px-5 py-3 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Envío de documentos
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Selecciona los documentos y elige la vía de notificación
          </p>
        </div>

        {/* Inculpado info */}
        <div className="px-5 py-3 shrink-0" style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-panel2)' }}>
          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>DESTINATARIO</p>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{MOCK_SUMARIO.inculpado}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{MOCK_SUMARIO.cargo} — RUT {MOCK_SUMARIO.rut}</p>
        </div>

        {/* Document checklist */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-between px-5 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              {selected.size} de {documents.length} seleccionados
            </span>
            <div className="flex gap-3">
              <button className="text-xs" style={{ color: 'var(--gold)' }} onClick={selectAll}>Todos</button>
              <button className="text-xs" style={{ color: 'var(--text-muted)' }} onClick={deselectAll}>Ninguno</button>
            </div>
          </div>

          {documents.map((doc) => (
            <DocCheckRow
              key={doc.id}
              doc={doc}
              checked={selected.has(doc.id)}
              onToggle={() => toggleDoc(doc.id)}
            />
          ))}
        </div>

        {/* Send options */}
        <div className="px-5 py-4 shrink-0 space-y-3" style={{ borderTop: '1px solid var(--border)' }}>
          {/* Via selector */}
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>VÍA DE NOTIFICACIÓN</p>
            <div className="flex gap-2">
              {(['email', 'presencial'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setVia(v)}
                  className="flex items-center gap-2 px-3 py-2 flex-1 text-sm transition-colors"
                  style={{
                    border: `1px solid ${via === v ? 'var(--gold)' : 'var(--border)'}`,
                    backgroundColor: via === v ? 'var(--gold-bg)' : 'var(--bg-panel2)',
                    color: via === v ? 'var(--gold)' : 'var(--text-muted)',
                  }}
                >
                  {v === 'email' ? <Mail size={14} /> : <Printer size={14} />}
                  {v === 'email' ? 'Correo electrónico' : 'Notif. presencial'}
                </button>
              ))}
            </div>
          </div>

          {/* Email input */}
          {via === 'email' && (
            <div>
              <label className="block text-xs mb-1.5" style={{ color: 'var(--text-muted)' }} htmlFor="email-dest">
                Correo del inculpado
              </label>
              <input
                id="email-dest"
                type="email"
                value={emailDest}
                onChange={(e) => setEmailDest(e.target.value)}
                placeholder="jperezf@municipalidad.cl"
                className="w-full text-sm outline-none"
                style={{
                  backgroundColor: 'var(--bg-base)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  padding: '7px 10px',
                  fontFamily: 'Inter, sans-serif',
                }}
              />
            </div>
          )}

          {/* Action button */}
          <Button
            variant="primary"
            size="sm"
            className="w-full justify-center"
            loading={isSending}
            onClick={via === 'email' ? handleEmail : handlePrint}
            disabled={selected.size === 0}
          >
            {via === 'email' ? <><Send size={14} /> Enviar notificación</> : <><Printer size={14} /> Imprimir acta de notificación</>}
          </Button>
        </div>
      </div>

      {/* Right: notification log */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-5 py-3 shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>HISTORIAL DE NOTIFICACIONES</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {log.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8">
              <Clock size={32} style={{ color: 'var(--border2)' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Las notificaciones enviadas aparecerán aquí
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {log.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4"
                  style={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {entry.via === 'email' ? <Mail size={14} style={{ color: 'var(--blue)' }} /> : <Printer size={14} style={{ color: 'var(--purple)' }} />}
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {entry.via === 'email' ? 'Correo enviado' : 'Notificación presencial'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle size={13} style={{ color: 'var(--green)' }} />
                      <span className="text-xs" style={{ color: 'var(--green)' }}>Enviado</span>
                    </div>
                  </div>
                  <p className="text-xs mb-2 font-mono" style={{ color: 'var(--text-muted)' }}>
                    {formatDate(entry.fecha)} — {entry.fecha.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <div className="space-y-1">
                    {entry.documentos.map((name, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted2)' }}>
                        <FileText size={11} />
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DocCheckRow({ doc, checked, onToggle }: { doc: LexDocument; checked: boolean; onToggle: () => void }) {
  return (
    <label
      className="flex items-start gap-3 px-5 py-3 cursor-pointer transition-colors"
      style={{
        borderBottom: '1px solid var(--border)',
        backgroundColor: checked ? 'var(--gold-bg)' : 'transparent',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        style={{ accentColor: 'var(--gold)', marginTop: 2 }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <DocumentTypeBadge type={doc.type} size="sm" />
          <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>F.{doc.folio}</span>
        </div>
        <p className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>{doc.name}</p>
        {doc.status === 'sin_firma' && (
          <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: 'var(--orange)' }}>
            <AlertCircle size={11} /> Sin firma — verificar antes de notificar
          </p>
        )}
      </div>
    </label>
  )
}
