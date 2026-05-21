import React, { useState } from 'react'
import { InculpadoHeader } from '../components/expediente/InculpadoHeader'
import { DocumentList } from '../components/expediente/DocumentList'
import { DocumentViewer } from '../components/expediente/DocumentViewer'
import { DocumentUploader } from '../components/expediente/DocumentUploader'
import { DocumentCreator } from '../components/expediente/DocumentCreator'
import { NotificacionesPanel } from '../components/expediente/NotificacionesPanel'
import { ChatbotPanel } from '../components/chatbot/ChatbotPanel'
import { useDocumentStore } from '../store/useDocumentStore'
import { useChatbotStore } from '../store/useChatbotStore'

interface Tab {
  id: string
  label: string
  stub?: boolean
}

const TABS: Tab[] = [
  { id: 'documentos',     label: 'Documentos' },
  { id: 'crear',          label: 'Crear documento' },
  { id: 'notificaciones', label: 'Notificaciones' },
  { id: 'declaraciones',  label: 'Declaraciones', stub: true },
  { id: 'evidencias',     label: 'Evidencias', stub: true },
  { id: 'proceso',        label: 'Proceso', stub: true },
  { id: 'analisis',       label: 'Análisis IA', stub: true },
]

export function ExpedientePage() {
  const [activeTab, setActiveTab] = useState('documentos')
  const selectedDocumentId = useDocumentStore((s) => s.selectedDocumentId)
  const chatOpen = useChatbotStore((s) => s.isOpen)

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <InculpadoHeader />

      {/* Tabs */}
      <div
        className="flex items-center shrink-0 overflow-x-auto"
        style={{
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--bg-panel)',
        }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => !tab.stub && setActiveTab(tab.id)}
              className="px-5 py-2.5 text-sm transition-colors relative whitespace-nowrap shrink-0"
              style={{
                color: active ? 'var(--gold)' : tab.stub ? 'var(--text-muted)' : 'var(--text-muted2)',
                backgroundColor: active ? 'var(--gold-bg)' : 'transparent',
                borderBottom: active ? '2px solid var(--gold)' : '2px solid transparent',
                cursor: tab.stub ? 'default' : 'pointer',
                fontWeight: active ? 500 : 400,
              }}
            >
              {tab.label}
              {tab.stub && (
                <span className="ml-1.5 text-xs opacity-40">·</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Content + chatbot */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {activeTab === 'documentos' && (
            <div className="flex flex-1 overflow-hidden">
              <div className="flex flex-col flex-1 overflow-hidden">
                <div
                  className="px-4 py-3 shrink-0"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <DocumentUploader />
                </div>
                <DocumentList />
              </div>
              {selectedDocumentId && <DocumentViewer />}
            </div>
          )}

          {activeTab === 'crear' && (
            <DocumentCreator />
          )}

          {activeTab === 'notificaciones' && (
            <NotificacionesPanel />
          )}

          {['declaraciones', 'evidencias', 'proceso', 'analisis'].includes(activeTab) && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p
                  className="text-2xl mb-2"
                  style={{ fontFamily: '"Bebas Neue",sans-serif', color: 'var(--border2)', letterSpacing: '0.06em' }}
                >
                  PRÓXIMAMENTE
                </p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  El módulo{' '}
                  <strong style={{ color: 'var(--text-muted2)' }}>
                    {TABS.find((t) => t.id === activeTab)?.label}
                  </strong>{' '}
                  estará disponible en la siguiente versión.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Chatbot panel */}
        {chatOpen && <ChatbotPanel />}
      </div>
    </div>
  )
}
