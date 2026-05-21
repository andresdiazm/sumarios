import { create } from 'zustand'
import type { LexDocument } from '../types'

const MOCK_DOCUMENTS: LexDocument[] = [
  {
    id: '1',
    name: 'Resolución de Apertura SA-2024-0147',
    originalFileName: 'resolucion_apertura.pdf',
    type: 'resolucion',
    status: 'firmado',
    folio: '001',
    uploadedAt: new Date('2024-01-02'),
    fileSize: 348160,
    tags: [],
    etapa: 'instruccion',
    selected: false,
    url: '',
    file: null as unknown as File,
  },
  {
    id: '2',
    name: 'Acta de Notificación al Inculpado',
    originalFileName: 'acta_notificacion.pdf',
    type: 'notificacion',
    status: 'firmado',
    folio: '002',
    uploadedAt: new Date('2024-01-05'),
    fileSize: 122880,
    tags: [],
    etapa: 'instruccion',
    selected: false,
    url: '',
    file: null as unknown as File,
  },
  {
    id: '3',
    name: 'Informe Auditoría Interna DAF',
    originalFileName: 'auditoria_daf.pdf',
    type: 'auditoria',
    status: 'firmado',
    folio: '003',
    uploadedAt: new Date('2024-01-08'),
    fileSize: 870400,
    tags: [],
    etapa: 'instruccion',
    selected: false,
    url: '',
    file: null as unknown as File,
  },
  {
    id: '4',
    name: 'Declaración Inculpado — 1ª Sesión',
    originalFileName: 'decl_inculpado_1.pdf',
    type: 'declaracion',
    status: 'firmado',
    folio: '004',
    uploadedAt: new Date('2024-01-12'),
    fileSize: 215040,
    tags: [],
    etapa: 'instruccion',
    selected: false,
    url: '',
    file: null as unknown as File,
  },
  {
    id: '5',
    name: 'Declaración Testigo — Roberto Aguilar',
    originalFileName: 'decl_testigo_aguilar.pdf',
    type: 'declaracion',
    status: 'sin_firma',
    folio: '006',
    uploadedAt: new Date('2024-01-18'),
    fileSize: 179200,
    tags: [],
    etapa: 'instruccion',
    selected: false,
    url: '',
    file: null as unknown as File,
  },
]

interface DocumentStore {
  documents: LexDocument[]
  selectedDocumentId: string | null
  searchQuery: string
  typeFilter: string | null

  addDocument: (doc: LexDocument) => void
  updateDocument: (id: string, partial: Partial<LexDocument>) => void
  removeDocument: (id: string) => void
  toggleSelect: (id: string) => void
  selectAll: () => void
  deselectAll: () => void
  setSelectedDocumentId: (id: string | null) => void
  setSearchQuery: (q: string) => void
  setTypeFilter: (t: string | null) => void
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: MOCK_DOCUMENTS,
  selectedDocumentId: null,
  searchQuery: '',
  typeFilter: null,

  addDocument: (doc) => set((s) => ({ documents: [...s.documents, doc] })),

  updateDocument: (id, partial) =>
    set((s) => ({
      documents: s.documents.map((d) => (d.id === id ? { ...d, ...partial } : d)),
    })),

  removeDocument: (id) =>
    set((s) => ({ documents: s.documents.filter((d) => d.id !== id) })),

  toggleSelect: (id) =>
    set((s) => ({
      documents: s.documents.map((d) =>
        d.id === id ? { ...d, selected: !d.selected } : d,
      ),
    })),

  selectAll: () =>
    set((s) => ({ documents: s.documents.map((d) => ({ ...d, selected: true })) })),

  deselectAll: () =>
    set((s) => ({ documents: s.documents.map((d) => ({ ...d, selected: false })) })),

  setSelectedDocumentId: (id) => set({ selectedDocumentId: id }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setTypeFilter: (t) => set({ typeFilter: t }),
}))
