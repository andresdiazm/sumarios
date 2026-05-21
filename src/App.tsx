import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Layout } from './components/layout/Layout'
import { ExpedientePage } from './pages/ExpedientePage'
import { useThemeStore } from './store/useThemeStore'

export default function App() {
  const theme = useThemeStore((s) => s.theme)

  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        theme={theme}
        toastOptions={{
          style: {
            backgroundColor: 'var(--bg-panel3)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '13px',
            borderRadius: '0',
          },
        }}
      />
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/expediente/SA-2024-0147" replace />} />
          <Route path="/expediente/:id" element={<ExpedientePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
