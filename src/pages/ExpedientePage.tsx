import React, { useState } from 'react'
import { InculpadoHeader } from '../components/expediente/InculpadoHeader'
import { DocumentList } from '../components/expediente/DocumentList'
import { DocumentViewer } from '../components/expediente/DocumentViewer'
import { DocumentUploader } from '../components/expediente/DocumentUploader'
import { useDocumentStore } from '../store/useDocumentStore'

const TABS = ['Documentos', 'Declaraciones', 'Evidencias', 'Proceso', 'Análisis IA']

export function ExpedientePage() {
  const [activeTab, setActiveTab] = useState('Documentos')
  const selectedDocumentId = useDocumentStore((s) => s.selectedDocumentId)

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <InculpadoHeader />

      {/* Tabs */}
      <div
        className="flex items-center gap-0 px-0 shrink-0"
        style={{
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--bg-panel)',
        }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab
          const isStub = tab !== 'Documentos'
          return (
            <button
              key={tab}
              onClick={() => !isStub && setActiveTab(tab)}
              className="px-5 py-2.5 text-sm transition-colors relative"
              style={{
                color: active ? 'var(--gold)' : isStub ? 'var(--text-muted)' : 'var(--text-muted2)',
                backgroundColor: active ? 'var(--gold-bg)' : 'transparent',
                borderBottom: active ? '2px solid var(--gold)' : '2px solid transparent',
                cursor: isStub ? 'default' : 'pointer',
                fontWeight: active ? 500 : 400,
              }}
            >
              {tab}
              {isStub && (
                <span className="ml-1.5 text-xs opacity-50">·</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {activeTab === 'Documentos' ? (
        <div className="flex flex-1 overflow-hidden">
          {/* Left: uploader + list */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <div
              className="px-4 py-3 shrink-0"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <DocumentUploader />
            </div>
            <DocumentList />
          </div>

          {/* Right: viewer (only when document selected) */}
          {selectedDocumentId && <DocumentViewer />}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-display mb-2" style={{ color: 'var(--border2)' }}>
              PRÓXIMAMENTE
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              El módulo <strong style={{ color: 'var(--text-muted2)' }}>{activeTab}</strong> estará disponible en la siguiente versión.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
