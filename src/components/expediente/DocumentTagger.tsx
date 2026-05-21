import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { TIPOS_DOCUMENTO, ETAPAS_PROCESO } from '../../lib/constants'
import type { LexDocument, DocumentType, DocumentStatus } from '../../types'

const schema = z.object({
  name:   z.string().min(1, 'El nombre es requerido'),
  type:   z.string().min(1, 'Seleccione un tipo'),
  folio:  z.string().min(1, 'El folio es requerido'),
  status: z.enum(['firmado', 'sin_firma', 'pendiente']),
  etapa:  z.string().min(1, 'Seleccione una etapa'),
  notes:  z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface DocumentTaggerProps {
  open: boolean
  onClose: () => void
  onSave: (data: Partial<LexDocument>) => void
  initial?: Partial<LexDocument>
  mode?: 'add' | 'edit'
}

const fieldStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: 'var(--bg-panel2)',
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

export function DocumentTagger({ open, onClose, onSave, initial, mode = 'add' }: DocumentTaggerProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:   initial?.name ?? initial?.originalFileName ?? '',
      type:   initial?.type ?? 'declaracion',
      folio:  initial?.folio ?? '',
      status: initial?.status ?? 'sin_firma',
      etapa:  initial?.etapa ?? 'instruccion',
      notes:  initial?.notes ?? '',
    },
  })

  React.useEffect(() => {
    if (open) {
      reset({
        name:   initial?.name ?? initial?.originalFileName ?? '',
        type:   initial?.type ?? 'declaracion',
        folio:  initial?.folio ?? '',
        status: initial?.status ?? 'sin_firma',
        etapa:  initial?.etapa ?? 'instruccion',
        notes:  initial?.notes ?? '',
      })
    }
  }, [open, initial, reset])

  function onSubmit(data: FormData) {
    onSave({
      name:   data.name,
      type:   data.type as DocumentType,
      folio:  data.folio,
      status: data.status as DocumentStatus,
      etapa:  data.etapa,
      notes:  data.notes,
    })
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'add' ? 'Agregar documento al expediente' : 'Editar etiquetas del documento'}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="p-5 space-y-4">
          {/* Nombre */}
          <div>
            <label style={labelStyle} htmlFor="doc-name">
              Nombre del documento <span style={{ color: 'var(--red)' }}>*</span>
            </label>
            <input
              id="doc-name"
              {...register('name')}
              style={fieldStyle}
              placeholder="Ej: Declaración inculpado — 2ª sesión"
            />
            {errors.name && (
              <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>{errors.name.message}</p>
            )}
          </div>

          {/* Tipo + Folio */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label style={labelStyle} htmlFor="doc-type">
                Tipo de documento <span style={{ color: 'var(--red)' }}>*</span>
              </label>
              <select id="doc-type" {...register('type')} style={fieldStyle}>
                {TIPOS_DOCUMENTO.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              {errors.type && (
                <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>{errors.type.message}</p>
              )}
            </div>
            <div>
              <label style={labelStyle} htmlFor="doc-folio">
                Número de folio <span style={{ color: 'var(--red)' }}>*</span>
              </label>
              <input
                id="doc-folio"
                {...register('folio')}
                style={fieldStyle}
                placeholder="Ej: 007"
                className="font-mono"
              />
              {errors.folio && (
                <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>{errors.folio.message}</p>
              )}
            </div>
          </div>

          {/* Estado */}
          <div>
            <p style={labelStyle}>Estado del documento</p>
            <div className="flex items-center gap-6">
              {(['firmado', 'sin_firma', 'pendiente'] as const).map((val) => {
                const labels = { firmado: 'Firmado', sin_firma: 'Sin firma', pendiente: 'Pendiente' }
                return (
                  <label key={val} className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: 'var(--text-primary)' }}>
                    <input
                      type="radio"
                      value={val}
                      {...register('status')}
                      style={{ accentColor: 'var(--gold)' }}
                    />
                    {labels[val]}
                  </label>
                )
              })}
            </div>
          </div>

          {/* Etapa */}
          <div>
            <label style={labelStyle} htmlFor="doc-etapa">
              Etapa del proceso <span style={{ color: 'var(--red)' }}>*</span>
            </label>
            <select id="doc-etapa" {...register('etapa')} style={fieldStyle}>
              {ETAPAS_PROCESO.map((e) => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
          </div>

          {/* Notas */}
          <div>
            <label style={labelStyle} htmlFor="doc-notes">
              Notas adicionales <span style={{ color: 'var(--text-muted)' }}>(opcional)</span>
            </label>
            <textarea
              id="doc-notes"
              {...register('notes')}
              rows={3}
              style={{ ...fieldStyle, resize: 'vertical' }}
              placeholder="Observaciones relevantes sobre este documento..."
            />
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 px-5 py-3"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="sm">
            {mode === 'add' ? 'Agregar al expediente' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
