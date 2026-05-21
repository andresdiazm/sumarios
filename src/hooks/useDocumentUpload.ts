import { useState } from 'react'

const MAX_SIZE = 50 * 1024 * 1024 // 50 MB

interface UploadState {
  progress: number
  isLoading: boolean
  error: string | null
}

export function useDocumentUpload() {
  const [state, setState] = useState<UploadState>({
    progress: 0,
    isLoading: false,
    error: null,
  })

  function validate(file: File): string | null {
    if (file.type !== 'application/pdf') return 'Solo se aceptan archivos PDF.'
    if (file.size > MAX_SIZE) return 'El archivo supera el límite de 50 MB.'
    return null
  }

  function simulateProgress(): Promise<void> {
    return new Promise((resolve) => {
      let progress = 0
      setState((s) => ({ ...s, isLoading: true, progress: 0, error: null }))
      const interval = setInterval(() => {
        progress += Math.random() * 30
        if (progress >= 100) {
          clearInterval(interval)
          setState((s) => ({ ...s, progress: 100 }))
          setTimeout(resolve, 200)
        } else {
          setState((s) => ({ ...s, progress }))
        }
      }, 120)
    })
  }

  async function prepareFile(file: File): Promise<{ url: string } | null> {
    const error = validate(file)
    if (error) {
      setState((s) => ({ ...s, error }))
      return null
    }
    await simulateProgress()
    const url = URL.createObjectURL(file)
    setState({ isLoading: false, progress: 0, error: null })
    return { url }
  }

  function reset() {
    setState({ isLoading: false, progress: 0, error: null })
  }

  return { ...state, prepareFile, reset, validate }
}
