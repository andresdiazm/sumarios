import React, { useState, useRef, useEffect } from 'react'
import { X, Send, Sparkles, ExternalLink, RotateCcw, ChevronRight } from 'lucide-react'
import { useChatbotStore, type ChatMessage } from '../../store/useChatbotStore'

// ── Simulated knowledge base ──────────────────────────────────────────────────
interface KBEntry {
  keywords: string[]
  response: {
    content: string
    sources: { label: string; type: 'cgr' | 'suseso' | 'tribunal' | 'ley' | 'otro' }[]
  }
}

const KNOWLEDGE_BASE: KBEntry[] = [
  {
    keywords: ['sumario', 'sumarial', 'procedimiento disciplinario', 'instrucción'],
    response: {
      content: `**Sumario Administrativo — Marco normativo**

El sumario administrativo está regulado en el Título V del Estatuto Administrativo (DFL N°29/2004), artículos 119 a 157.

**Dictámenes CGR relevantes:**
• Dict. N°24.112/2019 — Plazos del sumario y actuaciones del fiscal instructor
• Dict. N°8.521/2021 — Garantías del inculpado; derecho a defensa desde la notificación
• Dict. N°15.234/2020 — El sumario es secreto durante la etapa de instrucción; solo el fiscal tiene acceso al expediente
• Dict. N°3.441/2022 — Ampliación de plazo de instrucción: requiere resolución fundada

**Plazos clave:**
- Instrucción: 20 días hábiles (prorrogables por 20 días más)
- Formulación de cargos: dentro del plazo de instrucción
- Descargos del inculpado: 10 días hábiles desde notificación
- Vista fiscal: 5 días hábiles

**Arts. EA aplicables:** 119, 120, 121, 133, 134, 135, 136`,
      sources: [
        { label: 'Dict. CGR 24.112/2019', type: 'cgr' },
        { label: 'Dict. CGR 8.521/2021', type: 'cgr' },
        { label: 'DFL N°29/2004 Art. 119-157', type: 'ley' },
      ],
    },
  },
  {
    keywords: ['medida disciplinaria', 'sanción', 'destitución', 'suspensión', 'multa', 'censura'],
    response: {
      content: `**Medidas Disciplinarias — Estatuto Administrativo**

El Art. 121 EA establece las siguientes medidas, de menor a mayor gravedad:

1. **Censura** — Reprensión escrita, anotación en hoja de vida
2. **Multa** — 5% a 20% de la remuneración mensual
3. **Suspensión del empleo** — Hasta 30 días, sin goce de remuneraciones
4. **Destitución** — Término de la relación laboral

**Art. 125 EA — Causales de destitución:**
Lit. a) Ausentarse injustificadamente
Lit. b) Infringir gravemente los deberes del Art. 61
Lit. c) Conductas constitutivas de crimen o simple delito

**Dict. CGR N°16.842/2020:** La proporcionalidad de la medida debe guardar relación con la gravedad de los hechos y la reincidencia del funcionario.

**Dict. CGR N°31.105/2019:** La destitución es impugnable ante la CGR (Art. 154 EA) dentro de 10 días hábiles.`,
      sources: [
        { label: 'EA Art. 121-125', type: 'ley' },
        { label: 'Dict. CGR 16.842/2020', type: 'cgr' },
        { label: 'Dict. CGR 31.105/2019', type: 'cgr' },
      ],
    },
  },
  {
    keywords: ['formulación de cargos', 'cargos', 'acusación'],
    response: {
      content: `**Formulación de Cargos — Art. 133 EA**

La formulación de cargos es el acto formal que marca el término de la instrucción y da inicio a la etapa de descargos.

**Contenido obligatorio (Dict. CGR N°9.876/2021):**
1. Hechos imputados con precisión (fecha, lugar, conducta)
2. Normas supuestamente infringidas
3. Medida disciplinaria que podría aplicarse
4. Plazo para presentar descargos (mínimo 10 días hábiles)
5. Derecho a asistencia letrada

**Forma:** Resolución fundada del fiscal instructor.

**Dict. CGR N°22.341/2018:** Los cargos deben ser suficientemente determinados; la vaguedad los invalida. La nulidad puede ser declarada por CGR o judicialmente.

**Dict. CGR N°5.612/2022:** El inculpado tiene derecho a conocer todas las piezas del expediente desde la notificación de los cargos.

**Corte Suprema, Rol 4.521-2021:** La garantía del Art. 19 N°3 CPR aplica en el sumario administrativo; la indefensión genera nulidad de todo lo obrado.`,
      sources: [
        { label: 'EA Art. 133-136', type: 'ley' },
        { label: 'Dict. CGR 9.876/2021', type: 'cgr' },
        { label: 'CS Rol 4.521-2021', type: 'tribunal' },
      ],
    },
  },
  {
    keywords: ['prescripción', 'prescribe', 'plazo prescripción', 'caducidad'],
    response: {
      content: `**Prescripción de la Acción Disciplinaria — Art. 157 EA**

**Regla general:** La acción disciplinaria prescribe en **4 años** contados desde que se cometió la falta.

**Prescripción de la sanción:** 2 años contados desde que la medida quedó firme.

**Excepciones y dictámenes relevantes:**
• Dict. CGR N°11.234/2020: El plazo de prescripción se suspende durante el sumario una vez notificado el inculpado de los cargos.
• Dict. CGR N°7.891/2021: La prescripción es de orden público; el fiscal debe declararla de oficio aunque el inculpado no la alegue.
• Dict. CGR N°18.456/2019: En casos de conductas constitutivas de delito, el plazo se extiende al de la acción penal respectiva.

**Corte de Apelaciones de Santiago, Rol 8.234-2020:** Confirma que la prescripción corre desde la fecha de comisión del hecho, no desde su descubrimiento.`,
      sources: [
        { label: 'EA Art. 157', type: 'ley' },
        { label: 'Dict. CGR 11.234/2020', type: 'cgr' },
        { label: 'CA Santiago Rol 8.234-2020', type: 'tribunal' },
      ],
    },
  },
  {
    keywords: ['notificación', 'notificar', 'carta certificada', 'aviso'],
    response: {
      content: `**Notificación en el Sumario Administrativo**

**Art. 135 EA:** El inculpado debe ser notificado personalmente de los cargos o, si no es habido, mediante carta certificada al domicilio que figura en los registros institucionales.

**Formas válidas de notificación (Dict. CGR N°14.567/2021):**
1. **Personal:** Entrega directa y firma del receptor
2. **Carta certificada:** Si no es habido en 2 oportunidades en días distintos; se notifica por carta certificada a domicilio registrado
3. **Por aviso:** En casos excepcionales, mediante publicación en el Diario Oficial (requiere resolución fundada)

**Efectos:** Los plazos para el inculpado comienzan a correr desde el día siguiente a la notificación.

**Dict. CGR N°6.234/2022:** La notificación defectuosa no acarrea nulidad si el inculpado tomó conocimiento efectivo de los cargos y no se causó indefensión.

**SUSESO Circular N°3.456:** Para funcionarios en licencia médica, la notificación es válida en el domicilio particular.`,
      sources: [
        { label: 'EA Art. 135', type: 'ley' },
        { label: 'Dict. CGR 14.567/2021', type: 'cgr' },
        { label: 'SUSESO Circ. 3.456', type: 'suseso' },
      ],
    },
  },
  {
    keywords: ['recurso', 'apelación', 'impugnar', 'reclamar', 'contraloria', 'contraloría', 'CGR'],
    response: {
      content: `**Recursos contra la Medida Disciplinaria**

**Art. 154 EA — Recurso de reposición:**
- Ante la misma autoridad que dictó el acto
- Plazo: 5 días hábiles desde notificación
- La autoridad tiene 30 días para resolver

**Recurso de apelación ante CGR:**
- Procede contra resoluciones de destitución y suspensión
- Plazo: 10 días hábiles desde notificación
- La CGR puede confirmar, modificar o dejar sin efecto la medida

**Dict. CGR N°20.112/2022:** La interposición del recurso ante CGR no suspende la ejecución de la medida, salvo que la CGR así lo ordene expresamente.

**Acción de protección (Art. 20 CPR):**
- Ante Corte de Apelaciones respectiva
- Plazo: 30 días corridos desde el acto u omisión
- Procede cuando la medida vulnera derechos fundamentales (art. 19 N°2, 3, 4, etc.)

**Corte Suprema, Rol 12.456-2022 (Casación):** Confirma que el sumario administrativo debe respetar el debido proceso; la inobservancia permite acción de nulidad de derecho público.`,
      sources: [
        { label: 'EA Art. 154', type: 'ley' },
        { label: 'Dict. CGR 20.112/2022', type: 'cgr' },
        { label: 'CS Rol 12.456-2022', type: 'tribunal' },
        { label: 'CPR Art. 20', type: 'ley' },
      ],
    },
  },
  {
    keywords: ['licencia médica', 'licencia', 'enfermedad', 'accidente laboral', 'suseso'],
    response: {
      content: `**Sumario y Licencia Médica — Criterios SUSESO y CGR**

**Dict. CGR N°18.903/2021:** La licencia médica no suspende el sumario administrativo. El fiscal instructor puede continuar las diligencias aunque el inculpado esté de licencia.

**SUSESO Circular N°2.891:** Define la compatibilidad de la licencia médica con la tramitación de sumarios. El inculpado puede comparecer si su estado de salud lo permite.

**Situaciones especiales:**
• Si el inculpado no puede comparecer por razones médicas certificadas, el fiscal puede postergar la diligencia específica.
• La licencia médica no es causal de suspensión del plazo de prescripción (Dict. CGR N°4.123/2020).
• El funcionario en licencia no puede ser destituido mientras dure ésta, pero el sumario sigue tramitándose.

**Ley N°16.744 (Accidentes del trabajo):**
Si los hechos del sumario guardan relación con un accidente laboral, SUSESO tiene competencia concurrente para investigar.`,
      sources: [
        { label: 'Dict. CGR 18.903/2021', type: 'cgr' },
        { label: 'SUSESO Circ. 2.891', type: 'suseso' },
        { label: 'Ley N°16.744', type: 'ley' },
      ],
    },
  },
  {
    keywords: ['probidad', 'corrupción', 'fraude', 'malversación', 'fondos públicos', 'irregular'],
    response: {
      content: `**Probidad Administrativa y Malversación de Fondos**

**Art. 52-64 LOCBGAE (Ley N°18.575):** Define el principio de probidad y sus infracciones.

**Art. 61 lit. b) EA:** Es obligación del funcionario emplear los bienes de la institución solo para los fines institucionales.

**Tipos penales aplicables (Código Penal):**
• Art. 233: Malversación de caudales públicos — pena de presidio menor a mayor
• Art. 234: Sustracción con ánimo de lucro — agravante
• Art. 239: Negociación incompatible

**Dict. CGR N°24.112/2019:** La malversación de fondos configura simultáneamente infracción administrativa y penal; la CGR puede remitir antecedentes al Ministerio Público.

**Dict. CGR N°31.890/2021:** El fiscal debe solicitar al Departamento de Finanzas todos los registros SIGFE del período investigado. Los registros del sistema son prueba documental suficiente.

**SUSESO Circular N°1.234:** En casos de fraude que involucren cotizaciones previsionales, SUSESO es organismo competente para fiscalizar.

**Recomendación:** Solicitar informes al SII (RUT proveedores), al sistema SIGFE y a la Tesorería General de la República.`,
      sources: [
        { label: 'CP Art. 233-234', type: 'ley' },
        { label: 'LOCBGAE Art. 52-64', type: 'ley' },
        { label: 'Dict. CGR 31.890/2021', type: 'cgr' },
        { label: 'SUSESO Circ. 1.234', type: 'suseso' },
      ],
    },
  },
  {
    keywords: ['estatuto administrativo', 'DFL 29', 'funcionario público', 'deberes', 'obligaciones'],
    response: {
      content: `**Estatuto Administrativo — DFL N°29/2004**

**Obligaciones clave del funcionario (Art. 61):**
- Lit. a) Desempeñar el cargo con esmero y eficiencia
- Lit. b) Emplear bienes fiscales solo para fines institucionales
- Lit. c) Rendir fianza cuando sea requerido
- Lit. d) Obedecer las instrucciones impartidas por el superior jerárquico
- Lit. f) Observar el principio de probidad administrativa
- Lit. g) Guardar secreto en los asuntos que revistan carácter reservado

**Derechos del funcionario (Art. 89-93):**
- Estabilidad en el empleo
- Ascensos según mérito
- Permisos y feriados
- Afiliación a organizaciones sindicales

**Prohibiciones absolutas (Art. 84):**
- Ejercer facultades en contra del principio de probidad
- Realizar actividades contrarias a la institución
- Usar información privilegiada

**Dict. CGR N°5.234/2023:** El deber de obediencia tiene límites: el funcionario puede representar órdenes manifiestamente ilegales.`,
      sources: [
        { label: 'DFL N°29/2004', type: 'ley' },
        { label: 'Dict. CGR 5.234/2023', type: 'cgr' },
      ],
    },
  },
]

const QUICK_SEARCHES = [
  'Plazos del sumario administrativo',
  'Formulación de cargos Art. 133',
  'Medidas disciplinarias EA',
  'Prescripción acción disciplinaria',
  'Recursos ante CGR',
  'Probidad y malversación',
]

const SOURCE_COLORS: Record<string, { bg: string; color: string }> = {
  cgr:      { bg: 'rgba(212,175,80,0.12)', color: 'var(--gold)' },
  suseso:   { bg: 'var(--blue-bg)',         color: 'var(--blue)' },
  tribunal: { bg: 'var(--purple-bg)',       color: 'var(--purple)' },
  ley:      { bg: 'var(--green-bg)',        color: 'var(--green)' },
  otro:     { bg: 'var(--bg-panel3)',       color: 'var(--text-muted)' },
}

function findResponse(query: string): KBEntry['response'] | null {
  const q = query.toLowerCase()
  for (const entry of KNOWLEDGE_BASE) {
    if (entry.keywords.some((kw) => q.includes(kw.toLowerCase()))) {
      return entry.response
    }
  }
  return null
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user'

  return (
    <div className={`flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className="max-w-[90%] text-xs leading-relaxed px-3 py-2.5"
        style={{
          backgroundColor: isUser ? 'var(--gold-bg)' : 'var(--bg-panel2)',
          border: `1px solid ${isUser ? 'rgba(212,175,80,0.3)' : 'var(--border)'}`,
          color: 'var(--text-primary)',
          whiteSpace: 'pre-wrap',
        }}
      >
        {msg.content.split('\n').map((line, i) => {
          const isBold = line.startsWith('**') && line.includes('**', 2)
          const clean = isBold ? line.replace(/\*\*/g, '') : line
          const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-')
          return (
            <p key={i} style={{ margin: '2px 0', fontWeight: isBold ? 600 : 400, paddingLeft: isBullet ? 4 : 0 }}>
              {clean}
            </p>
          )
        })}
      </div>

      {msg.sources && msg.sources.length > 0 && (
        <div className="flex flex-wrap gap-1 max-w-[90%]">
          {msg.sources.map((s, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 font-mono"
              style={{ backgroundColor: SOURCE_COLORS[s.type].bg, color: SOURCE_COLORS[s.type].color }}
            >
              {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export function ChatbotPanel() {
  const { isOpen, close, messages, addMessage, clearMessages } = useChatbotStore()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  function sendMessage(text: string) {
    if (!text.trim()) return

    addMessage({ role: 'user', content: text })
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const found = findResponse(text)
      if (found) {
        addMessage({ role: 'assistant', content: found.content, sources: found.sources })
      } else {
        addMessage({
          role: 'assistant',
          content: `No encontré referencias específicas para "${text}" en mi base de conocimiento local.\n\nPuedo ayudarte con:\n• Plazos del sumario administrativo\n• Medidas disciplinarias y causales\n• Formulación de cargos\n• Prescripción de la acción disciplinaria\n• Recursos ante CGR y tribunales\n• Probidad y malversación de fondos\n• Notificaciones y procedimiento\n\nIntenta reformular tu búsqueda o usa uno de los accesos rápidos.`,
          sources: [],
        })
      }
      setIsTyping(false)
    }, 900 + Math.random() * 600)
  }

  if (!isOpen) return null

  return (
    <div
      className="flex flex-col w-[340px] shrink-0 h-full"
      style={{
        borderLeft: '1px solid var(--border)',
        backgroundColor: 'var(--bg-panel)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <Sparkles size={15} style={{ color: 'var(--gold)' }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Asistente Jurídico
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              CGR · SUSESO · Tribunales · EA
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearMessages}
            className="p-1.5 transition-colors"
            style={{ color: 'var(--text-muted)' }}
            title="Limpiar conversación"
          >
            <RotateCcw size={13} />
          </button>
          <button
            onClick={close}
            className="p-1.5 transition-colors"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Cerrar asistente"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="space-y-3">
            <div
              className="p-3 text-xs leading-relaxed"
              style={{ backgroundColor: 'var(--gold-bg)', border: '1px solid rgba(212,175,80,0.2)', color: 'var(--text-muted2)' }}
            >
              <p className="font-semibold mb-1" style={{ color: 'var(--gold)' }}>
                🔍 Búsqueda jurídica
              </p>
              Consulta dictámenes de Contraloría, circulares SUSESO, fallos de tribunales y artículos del Estatuto Administrativo. Base de conocimiento actualizada.
            </div>

            {/* Quick searches */}
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>BÚSQUEDAS FRECUENTES</p>
            {QUICK_SEARCHES.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors"
                style={{
                  backgroundColor: 'var(--bg-panel2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-panel3)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-panel2)' }}
              >
                <span>{q}</span>
                <ChevronRight size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              </button>
            ))}

            {/* Source legend */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {Object.entries(SOURCE_COLORS).slice(0, 4).map(([key, val]) => (
                <span key={key} className="text-xs px-2 py-0.5 font-mono" style={{ backgroundColor: val.bg, color: val.color }}>
                  {key === 'cgr' ? 'CGR' : key === 'suseso' ? 'SUSESO' : key === 'tribunal' ? 'Tribunales' : 'Ley'}
                </span>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        {isTyping && (
          <div className="flex items-center gap-2">
            <div
              className="px-3 py-2"
              style={{ backgroundColor: 'var(--bg-panel2)', border: '1px solid var(--border)' }}
            >
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: 'var(--text-muted)',
                      animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="shrink-0 p-3"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div
          className="flex items-end gap-2"
          style={{ border: '1px solid var(--border2)', backgroundColor: 'var(--bg-panel2)' }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage(input)
              }
            }}
            placeholder="Busca dictámenes, resoluciones, artículos del EA..."
            rows={2}
            className="flex-1 text-xs bg-transparent outline-none resize-none p-2"
            style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}
            aria-label="Consulta jurídica"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="p-2 mb-1 mr-1 disabled:opacity-40 transition-colors"
            style={{ color: input.trim() ? 'var(--gold)' : 'var(--text-muted)' }}
            aria-label="Enviar consulta"
          >
            <Send size={15} />
          </button>
        </div>
        <p className="text-xs mt-1.5 text-center" style={{ color: 'var(--text-muted)' }}>
          Base local — no requiere conexión a internet
        </p>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
