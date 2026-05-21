export type DocumentType =
  | 'declaracion'
  | 'evidencia'
  | 'formulario'
  | 'notificacion'
  | 'resolucion'
  | 'auditoria'
  | 'otro'

export type DocumentStatus = 'sin_firma' | 'firmado' | 'pendiente'

export interface DocumentTag {
  id: string
  label: string
  color: string
}

export interface LexDocument {
  id: string
  name: string
  originalFileName: string
  type: DocumentType
  status: DocumentStatus
  folio: string
  uploadedAt: Date
  fileSize: number
  pageCount?: number
  url: string
  file: File
  tags: DocumentTag[]
  notes?: string
  etapa: string
  selected: boolean
}

export interface DocumentSummary {
  id: string
  documentIds: string[]
  documentNames: string[]
  generatedAt: Date
  content: string
  keyFindings: string[]
  referencedArticles: string[]
}

export interface Sumario {
  id: string
  inculpado: string
  rut: string
  cargo: string
  institucion: string
  status: 'instruccion' | 'cargos' | 'descargos' | 'vista' | 'resolucion' | 'cerrado'
  apertura: Date
  fiscal: string
  actuario: string
  expedienteId: string
}
