import type { DocumentType } from '../types'

export const TIPOS_DOCUMENTO: { value: DocumentType; label: string }[] = [
  { value: 'declaracion',  label: 'Declaración' },
  { value: 'evidencia',    label: 'Evidencia' },
  { value: 'formulario',   label: 'Formulario' },
  { value: 'notificacion', label: 'Notificación' },
  { value: 'resolucion',   label: 'Resolución' },
  { value: 'auditoria',    label: 'Auditoría' },
  { value: 'otro',         label: 'Otro' },
]

export const ETAPAS_PROCESO = [
  { value: 'instruccion',  label: 'Instrucción' },
  { value: 'cargos',       label: 'Formulación de cargos' },
  { value: 'descargos',    label: 'Descargos' },
  { value: 'vista',        label: 'Vista fiscal' },
  { value: 'resolucion',   label: 'Resolución' },
]

export const DOCUMENT_TYPE_COLORS: Record<DocumentType, { bg: string; text: string }> = {
  declaracion:  { bg: 'var(--blue-bg)',   text: 'var(--blue)' },
  evidencia:    { bg: 'var(--red-bg)',    text: 'var(--red)' },
  formulario:   { bg: 'var(--green-bg)',  text: 'var(--green)' },
  notificacion: { bg: 'var(--orange-bg)', text: 'var(--orange)' },
  resolucion:   { bg: 'var(--purple-bg)', text: 'var(--purple)' },
  auditoria:    { bg: 'var(--gold-bg)',   text: 'var(--gold)' },
  otro:         { bg: 'rgba(128,128,128,0.12)', text: 'var(--text-muted)' },
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  declaracion:  'Declaración',
  evidencia:    'Evidencia',
  formulario:   'Formulario',
  notificacion: 'Notificación',
  resolucion:   'Resolución',
  auditoria:    'Auditoría',
  otro:         'Otro',
}

export const STATUS_LABELS: Record<string, string> = {
  sin_firma: 'Sin firma',
  firmado:   'Firmado',
  pendiente: 'Pendiente',
}

export const ETAPA_LABELS: Record<string, string> = {
  instruccion: 'Instrucción',
  cargos:      'Form. de cargos',
  descargos:   'Descargos',
  vista:       'Vista fiscal',
  resolucion:  'Resolución',
}

export const MOCK_SUMARIO = {
  id: 'SA-2024-0147',
  inculpado: 'PÉREZ FUENTES, J.A.',
  rut: '12.345.678-9',
  cargo: 'Jefe de Administración y Finanzas',
  institucion: 'Municipalidad de San Pedro',
  status: 'instruccion' as const,
  apertura: new Date('2024-01-02'),
  fiscal: 'Marcela Vidal Rojas',
  actuario: 'Andrés Gómez Torres',
  expedienteId: 'EXP-2024-0147',
  diasTranscurridos: 142,
  plazoLegal: 60,
}
