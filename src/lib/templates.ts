import type { DocumentType } from '../types'

export type TemplateId =
  | 'resolucion_fiscal'
  | 'acta_fiscal'
  | 'oficio'
  | 'oficio_reservado'
  | 'formulacion_cargos'

export interface TemplateField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'date'
  placeholder?: string
  defaultValue?: string
  rows?: number
  required?: boolean
}

export interface DocTemplate {
  id: TemplateId
  label: string
  description: string
  docType: DocumentType
  icon: string
  fields: TemplateField[]
  buildBody: (values: Record<string, string>, ctx: TemplateContext) => string
  buildDocNumber: (ctx: TemplateContext) => string
}

export interface TemplateContext {
  sumarioId: string
  inculpado: string
  rut: string
  cargo: string
  institucion: string
  fiscal: string
  actuario: string
  fecha: string
  folioNumber: number
  counter: number
}

export const TEMPLATES: DocTemplate[] = [
  {
    id: 'resolucion_fiscal',
    label: 'Resolución Fiscal',
    description: 'Resolución que adopta una decisión formal en el procedimiento sumarial.',
    docType: 'resolucion',
    icon: '📋',
    fields: [
      { id: 'lugar', label: 'Lugar', type: 'text', defaultValue: 'Santiago', required: true },
      { id: 'fecha', label: 'Fecha', type: 'date', required: true },
      { id: 'vistos', label: 'Vistos', type: 'textarea', rows: 4, required: true,
        placeholder: 'Lo dispuesto en los artículos ... del Estatuto Administrativo (DFL N°29/2004)...' },
      { id: 'considerando', label: 'Considerando', type: 'textarea', rows: 6, required: true,
        placeholder: '1°) Que con fecha ... se instruyó sumario administrativo...\n2°) Que ...' },
      { id: 'resuelvo', label: 'Resuelvo', type: 'textarea', rows: 4, required: true,
        placeholder: '1°) Declarar que ...\n2°) Notifíquese ...' },
    ],
    buildDocNumber: (ctx) => `Resolución N° ${String(ctx.counter).padStart(3, '0')}/${new Date().getFullYear()} — ${ctx.sumarioId}`,
    buildBody: (v, _ctx) => `${v.lugar}, ${v.fecha}

**VISTOS:**

${v.vistos}

**CONSIDERANDO:**

${v.considerando}

**RESUELVO:**

${v.resuelvo}

Anótese, comuníquese y archívese.`,
  },

  {
    id: 'acta_fiscal',
    label: 'Acta Fiscal',
    description: 'Registro formal de actuaciones, diligencias o declaraciones.',
    docType: 'declaracion',
    icon: '📝',
    fields: [
      { id: 'lugar', label: 'Lugar', type: 'text', defaultValue: 'Santiago', required: true },
      { id: 'fecha', label: 'Fecha', type: 'date', required: true },
      { id: 'hora', label: 'Hora de inicio', type: 'text', placeholder: '09:30 hrs.', required: true },
      { id: 'comparecientes', label: 'Comparecientes', type: 'textarea', rows: 3, required: true,
        placeholder: 'Compareció don/doña ... RUT ... en calidad de ...' },
      { id: 'desarrollo', label: 'Desarrollo del acta', type: 'textarea', rows: 8, required: true,
        placeholder: 'En este acto el/la compareciente expone:...' },
      { id: 'cierre', label: 'Cierre', type: 'text', placeholder: '10:30 hrs.',
        defaultValue: 'Sin más que consignar, se cierra el presente acto a las' },
    ],
    buildDocNumber: (ctx) => `Acta Fiscal N° ${String(ctx.counter).padStart(3, '0')} — ${ctx.sumarioId}`,
    buildBody: (v, ctx) => `En ${v.lugar}, a ${v.fecha}, siendo las ${v.hora}, ante el Fiscal Instructor ${ctx.fiscal}, actuando con la asesoría del Actuario ${ctx.actuario}:

**COMPARECIENTES:**

${v.comparecientes}

**DESARROLLO:**

${v.desarrollo}

**CIERRE:**

${v.cierre} ${v.cierre.includes('hrs') ? '' : 'hrs.'} Leída la presente acta por el compareciente, la ratifica y firma junto al Fiscal Instructor y el Actuario.`,
  },

  {
    id: 'oficio',
    label: 'Oficio',
    description: 'Comunicación oficial dirigida a otra institución o persona.',
    docType: 'notificacion',
    icon: '✉️',
    fields: [
      { id: 'lugar', label: 'Lugar', type: 'text', defaultValue: 'Santiago', required: true },
      { id: 'fecha', label: 'Fecha', type: 'date', required: true },
      { id: 'destinatario', label: 'Destinatario (nombre y cargo)', type: 'text', required: true,
        placeholder: 'Sr. Juan Pérez, Jefe de Recursos Humanos' },
      { id: 'institucion_dest', label: 'Institución destinataria', type: 'text', required: true,
        placeholder: 'Municipalidad de San Pedro' },
      { id: 'asunto', label: 'Asunto', type: 'text', required: true,
        placeholder: 'Solicita antecedentes sumario SA-2024-0147' },
      { id: 'cuerpo', label: 'Cuerpo del oficio', type: 'textarea', rows: 8, required: true,
        placeholder: 'En el contexto del sumario administrativo instruido en esta Fiscalía...' },
    ],
    buildDocNumber: (ctx) => `Oficio N° ${String(ctx.counter).padStart(3, '0')}/${new Date().getFullYear()}`,
    buildBody: (v, ctx) => `${v.lugar}, ${v.fecha}

**OFICIO N° ${String(ctx.counter).padStart(3, '0')}/${new Date().getFullYear()}**

A: ${v.destinatario}
    ${v.institucion_dest}

**ASUNTO:** ${v.asunto}

${v.cuerpo}

Sin otro particular, saluda atentamente a Ud.`,
  },

  {
    id: 'oficio_reservado',
    label: 'Oficio Reservado',
    description: 'Comunicación oficial de carácter confidencial.',
    docType: 'notificacion',
    icon: '🔒',
    fields: [
      { id: 'lugar', label: 'Lugar', type: 'text', defaultValue: 'Santiago', required: true },
      { id: 'fecha', label: 'Fecha', type: 'date', required: true },
      { id: 'destinatario', label: 'Destinatario (nombre y cargo)', type: 'text', required: true },
      { id: 'institucion_dest', label: 'Institución destinataria', type: 'text', required: true },
      { id: 'asunto', label: 'Asunto', type: 'text', required: true },
      { id: 'cuerpo', label: 'Cuerpo del oficio', type: 'textarea', rows: 8, required: true },
      { id: 'motivo_reserva', label: 'Motivo de la reserva', type: 'text', required: true,
        placeholder: 'Ley N° 20.285, Art. 21 N° 1 — Afecta el debido proceso sumarial' },
    ],
    buildDocNumber: (ctx) => `Oficio Reservado N° ${String(ctx.counter).padStart(3, '0')}/${new Date().getFullYear()}`,
    buildBody: (v, ctx) => `*** RESERVADO — ${v.motivo_reserva} ***

${v.lugar}, ${v.fecha}

**OFICIO RESERVADO N° ${String(ctx.counter).padStart(3, '0')}/${new Date().getFullYear()}**

A: ${v.destinatario}
    ${v.institucion_dest}

**ASUNTO:** ${v.asunto}

${v.cuerpo}

Sin otro particular, saluda atentamente a Ud.

*** El presente documento tiene carácter de RESERVADO conforme a ${v.motivo_reserva} ***`,
  },

  {
    id: 'formulacion_cargos',
    label: 'Formulación de Cargos',
    description: 'Resolución que formula cargos al inculpado conforme al Art. 133 EA.',
    docType: 'resolucion',
    icon: '⚖️',
    fields: [
      { id: 'lugar', label: 'Lugar', type: 'text', defaultValue: 'Santiago', required: true },
      { id: 'fecha', label: 'Fecha', type: 'date', required: true },
      { id: 'hechos', label: 'Hechos imputados', type: 'textarea', rows: 6, required: true,
        placeholder: '1) Que con fecha ... el inculpado habría ...\n2) Que ...' },
      { id: 'normas', label: 'Normas infringidas', type: 'textarea', rows: 3, required: true,
        placeholder: 'Artículo 61 letra b) del Estatuto Administrativo; Art. 125 del mismo cuerpo legal...' },
      { id: 'fundamento', label: 'Fundamento jurídico', type: 'textarea', rows: 4, required: true,
        placeholder: 'Que los hechos descritos configuran una infracción al deber de...' },
      { id: 'plazo_descargos', label: 'Plazo para descargos (días hábiles)', type: 'text',
        defaultValue: '10', required: true },
    ],
    buildDocNumber: (ctx) => `Resolución de Formulación de Cargos — ${ctx.sumarioId}`,
    buildBody: (v, ctx) => `${v.lugar}, ${v.fecha}

**FORMULACIÓN DE CARGOS**
**Sumario Administrativo ${ctx.sumarioId}**

**INCULPADO:** ${ctx.inculpado}
**RUT:** ${ctx.rut}
**CARGO:** ${ctx.cargo}
**INSTITUCIÓN:** ${ctx.institucion}

Vistos lo dispuesto en los artículos 133 y siguientes del Estatuto Administrativo (DFL N°29/2004), y teniendo presente los antecedentes reunidos durante la etapa de instrucción:

**I. HECHOS IMPUTADOS**

${v.hechos}

**II. NORMAS INFRINGIDAS**

${v.normas}

**III. FUNDAMENTO JURÍDICO**

${v.fundamento}

**IV. DERECHOS DEL INCULPADO**

Se hace presente que el/la inculpado/a tiene derecho a presentar sus descargos y defensas dentro del plazo de ${v.plazo_descargos} días hábiles contados desde la notificación de la presente resolución, conforme al artículo 134 del Estatuto Administrativo.

El/La inculpado/a podrá hacerse asesorar por un abogado de su confianza y solicitar la práctica de diligencias probatorias.

Notifíquese personalmente o por carta certificada al inculpado.`,
  },
]
