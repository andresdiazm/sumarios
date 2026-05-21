import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { formatFolioLabel } from './foliacion'
import type { MOCK_SUMARIO } from './constants'

// ── Stamp existing PDF with folio on every page ──────────────────────────────
export async function stampFolioPdf(
  file: File,
  folioNumber: number,
): Promise<{ blob: Blob; url: string }> {
  const arrayBuffer = await file.arrayBuffer()
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true })
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const label = formatFolioLabel(folioNumber)
  const fontSize = 8
  const padding = 10

  for (const page of pdfDoc.getPages()) {
    const { width, height } = page.getSize()
    const textWidth = font.widthOfTextAtSize(label, fontSize)

    // White background box
    page.drawRectangle({
      x: width - textWidth - padding * 2,
      y: height - fontSize - padding * 2,
      width: textWidth + padding * 2,
      height: fontSize + padding,
      color: rgb(1, 1, 1),
      opacity: 0.9,
    })

    // Border
    page.drawRectangle({
      x: width - textWidth - padding * 2,
      y: height - fontSize - padding * 2,
      width: textWidth + padding * 2,
      height: fontSize + padding,
      borderColor: rgb(0.4, 0.4, 0.4),
      borderWidth: 0.5,
    })

    // Folio text
    page.drawText(label, {
      x: width - textWidth - padding,
      y: height - fontSize - padding * 1.5 + 2,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    })
  }

  const bytes = await pdfDoc.save()
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  return { blob, url }
}

// ── Generate a document PDF from a template ──────────────────────────────────
type SumarioData = typeof MOCK_SUMARIO

export async function generateDocumentPdf(
  title: string,
  docNumber: string,
  folioNumber: number,
  body: string,
  sumario: SumarioData,
): Promise<{ blob: Blob; url: string }> {
  const pdfDoc = await PDFDocument.create()
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const PAGE_W = 595   // A4 width in pts
  const PAGE_H = 842   // A4 height in pts
  const MARGIN = 60
  const CONTENT_W = PAGE_W - MARGIN * 2

  function addPage() {
    const page = pdfDoc.addPage([PAGE_W, PAGE_H])

    // Header band
    page.drawRectangle({ x: 0, y: PAGE_H - 60, width: PAGE_W, height: 60, color: rgb(0.05, 0.07, 0.12) })

    // LEXSUM logo text
    page.drawText('LEXSUM', {
      x: MARGIN, y: PAGE_H - 38,
      size: 22, font: fontBold, color: rgb(0.83, 0.69, 0.31),
    })

    // Institution
    page.drawText(sumario.institucion, {
      x: MARGIN, y: PAGE_H - 52,
      size: 7, font: fontRegular, color: rgb(0.7, 0.7, 0.7),
    })

    // Sumario ID
    const sid = `Sumario ${sumario.id}`
    const sidW = fontRegular.widthOfTextAtSize(sid, 8)
    page.drawText(sid, {
      x: PAGE_W - MARGIN - sidW, y: PAGE_H - 38,
      size: 8, font: fontRegular, color: rgb(0.7, 0.7, 0.7),
    })

    // Footer line
    page.drawLine({
      start: { x: MARGIN, y: 40 }, end: { x: PAGE_W - MARGIN, y: 40 },
      thickness: 0.5, color: rgb(0.7, 0.7, 0.7),
    })

    // Footer text
    const footerText = `Expediente ${sumario.id} — ${sumario.inculpado}`
    page.drawText(footerText, {
      x: MARGIN, y: 28,
      size: 7, font: fontRegular, color: rgb(0.6, 0.6, 0.6),
    })

    return page
  }

  const page = addPage()
  let y = PAGE_H - 90

  // Folio stamp
  const folioLabel = formatFolioLabel(folioNumber)
  const folioW = fontBold.widthOfTextAtSize(folioLabel, 8)
  page.drawRectangle({ x: PAGE_W - MARGIN - folioW - 12, y: y - 2, width: folioW + 12, height: 14, color: rgb(0.97, 0.97, 0.97), borderColor: rgb(0.6, 0.6, 0.6), borderWidth: 0.5 })
  page.drawText(folioLabel, { x: PAGE_W - MARGIN - folioW - 6, y: y + 2, size: 8, font: fontBold, color: rgb(0, 0, 0) })

  // Document number
  page.drawText(docNumber, {
    x: MARGIN, y,
    size: 9, font: fontBold, color: rgb(0.4, 0.4, 0.4),
  })
  y -= 24

  // Title
  page.drawText(title.toUpperCase(), {
    x: MARGIN, y,
    size: 14, font: fontBold, color: rgb(0.05, 0.07, 0.12),
  })
  y -= 8

  // Gold underline
  page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 1.5, color: rgb(0.83, 0.69, 0.31) })
  y -= 24

  // Body text — wrap lines
  const lines = body.split('\n')
  for (const line of lines) {
    if (y < 70) break // simple overflow guard — production would add new page

    if (line.trim() === '') {
      y -= 10
      continue
    }

    // Word wrap
    const words = line.split(' ')
    let currentLine = ''
    for (const word of words) {
      const test = currentLine ? `${currentLine} ${word}` : word
      const testW = fontRegular.widthOfTextAtSize(test, 10)
      if (testW > CONTENT_W && currentLine) {
        page.drawText(currentLine, { x: MARGIN, y, size: 10, font: fontRegular, color: rgb(0, 0, 0) })
        y -= 16
        currentLine = word
        if (y < 70) break
      } else {
        currentLine = test
      }
    }
    if (currentLine && y >= 70) {
      const isHeading = line.startsWith('**') || line === line.toUpperCase()
      page.drawText(currentLine.replace(/\*\*/g, ''), {
        x: MARGIN, y, size: 10,
        font: isHeading ? fontBold : fontRegular,
        color: rgb(0, 0, 0),
      })
      y -= 16
    }
  }

  // Signature block
  y = Math.min(y - 40, 180)
  page.drawLine({ start: { x: MARGIN, y }, end: { x: MARGIN + 160, y }, thickness: 0.5, color: rgb(0, 0, 0) })
  page.drawText(sumario.fiscal, { x: MARGIN, y: y - 14, size: 9, font: fontBold, color: rgb(0, 0, 0) })
  page.drawText('Fiscal Instructor', { x: MARGIN, y: y - 26, size: 8, font: fontRegular, color: rgb(0.4, 0.4, 0.4) })
  page.drawText(sumario.institucion, { x: MARGIN, y: y - 38, size: 8, font: fontRegular, color: rgb(0.4, 0.4, 0.4) })

  const bytes = await pdfDoc.save()
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  return { blob, url }
}
