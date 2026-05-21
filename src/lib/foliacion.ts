const UNITS = [
  '', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
  'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve',
]

const VEINTI = [
  '', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco',
  'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve',
]

const TENS = [
  '', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa',
]

const HUNDREDS = [
  '', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos',
  'seiscientos', 'setecientos', 'ochocientos', 'novecientos',
]

export function numberToSpanish(n: number): string {
  if (n === 0) return 'cero'
  if (n === 100) return 'cien'
  if (n < 20) return UNITS[n]
  if (n < 30) return VEINTI[n - 20]
  if (n < 100) {
    const t = Math.floor(n / 10)
    const u = n % 10
    return u === 0 ? TENS[t] : `${TENS[t]} y ${UNITS[u]}`
  }
  if (n < 1000) {
    const h = Math.floor(n / 100)
    const rest = n % 100
    if (rest === 0) return HUNDREDS[h]
    return `${HUNDREDS[h]} ${numberToSpanish(rest)}`
  }
  if (n === 1000) return 'mil'
  if (n < 2000) return `mil ${numberToSpanish(n - 1000)}`
  return `${UNITS[Math.floor(n / 1000)]} mil ${n % 1000 > 0 ? numberToSpanish(n % 1000) : ''}`.trim()
}

export function formatFolioLabel(n: number): string {
  return `${n} — ${numberToSpanish(n)}`
}

export function formatFolioPadded(n: number): string {
  return String(n).padStart(3, '0')
}

export function getNextFolioNumber(existingFolios: string[]): number {
  const nums = existingFolios
    .map((f) => parseInt(f.replace(/\D/g, ''), 10))
    .filter((n) => !isNaN(n))
  return nums.length > 0 ? Math.max(...nums) + 1 : 1
}
