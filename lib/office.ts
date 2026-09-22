import JSZip from 'jszip'

const MAX_OFFICE_BYTES = 150 * 1024 * 1024
const MAX_XLSX_ROWS = 5000
const MAX_XLSX_COLS = 100
const MAX_PPT_SLIDES = 200

export function esc(value: unknown): string {
  return String(value).replace(/[&<>\'\"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[char] ?? char)
}

function parseXml(text: string): XMLDocument {
  const parser = new DOMParser()
  const document = parser.parseFromString(text, 'application/xml')
  if (document.querySelector('parsererror')) throw new Error('Malformed XML inside the document.')
  return document
}

function resolveZipPath(baseDir: string, target: string): string {
  const raw = String(target || '').replace(/\\/g, '/')
  const parts = (raw.startsWith('/') ? raw.slice(1).split('/') : baseDir.split('/').concat(raw.split('/')))
  const stack: string[] = []
  for (const part of parts) {
    if (!part || part === '.') continue
    if (part === '..') stack.pop()
    else stack.push(part)
  }
  return stack.join('/')
}

async function openZip(file: File): Promise<JSZip> {
  if (file.size > MAX_OFFICE_BYTES) {
    throw new Error(`This file is ${formatOfficeBytes(file.size)}. Files above ${formatOfficeBytes(MAX_OFFICE_BYTES)} are blocked to protect browser memory.`)
  }
  return JSZip.loadAsync(await file.arrayBuffer(), { createFolders: false, checkCRC32: false })
}

async function zipText(zip: JSZip, name: string): Promise<string | null> {
  const entry = zip.file(name)
  return entry ? entry.async('text') : null
}

function formatOfficeBytes(bytes: number): string {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let n = bytes
  let i = 0
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i += 1 }
  return `${n.toFixed(n >= 10 || i === 0 ? 0 : 1)} ${units[i]}`
}

function colToNum(ref: string): number {
  const match = String(ref).match(/[A-Z]+/i)
  if (!match) return 0
  let number = 0
  for (const ch of match[0].toUpperCase()) number = number * 26 + (ch.charCodeAt(0) - 64)
  return number
}

function parseSharedStrings(xmlText: string): string[] {
  const xml = parseXml(xmlText)
  return [...xml.getElementsByTagNameNS('*', 'si')].map((si) =>
    [...si.getElementsByTagNameNS('*', 't')].map((node) => node.textContent ?? '').join(''),
  )
}

function cellValue(cell: Element, shared: string[]): string {
  const type = cell.getAttribute('t')
  const value = cell.getElementsByTagNameNS('*', 'v')[0]?.textContent ?? ''
  if (type === 's') return shared[Number(value)] ?? ''
  if (type === 'inlineStr') return [...cell.getElementsByTagNameNS('*', 't')].map((n) => n.textContent ?? '').join('')
  if (type === 'b') return value === '1' ? 'TRUE' : 'FALSE'
  return value
}

export async function parseDocx(file: File): Promise<string> {
  const zip = await openZip(file)
  const xmlText = await zipText(zip, 'word/document.xml')
  if (!xmlText) throw new Error('word/document.xml is missing or the DOCX is corrupted.')
  const doc = parseXml(xmlText)
  const body = doc.getElementsByTagNameNS('*', 'body')[0]
  if (!body) throw new Error('The DOCX does not contain a readable document body.')
  const blocks: string[] = []
  for (const child of [...body.children]) {
    if (child.localName === 'p') {
      const text = [...child.getElementsByTagNameNS('*', 't')].map((n) => n.textContent ?? '').join('')
      const listPr = child.getElementsByTagNameNS('*', 'numPr')[0]
      blocks.push(`<p>${listPr ? '• ' : ''}${esc(text)}</p>`)
    } else if (child.localName === 'tbl') {
      const rows = [...child.children]
        .filter((node) => node.localName === 'tr')
        .map((tr) => {
          const cells = [...tr.children]
            .filter((node) => node.localName === 'tc')
            .map((tc) => `<td>${esc([...tc.getElementsByTagNameNS('*', 't')].map((n) => n.textContent ?? '').join(''))}</td>`)
            .join('')
          return `<tr>${cells}</tr>`
        }).join('')
      blocks.push(`<div class="table-scroll"><table>${rows}</table></div>`)
    }
  }
  return blocks.join('') || '<p>No readable document body found.</p>'
}

export async function parseXlsx(file: File): Promise<string> {
  const zip = await openZip(file)
  const workbookText = await zipText(zip, 'xl/workbook.xml')
  if (!workbookText) throw new Error('xl/workbook.xml is missing or the XLSX is corrupted.')
  const relationshipsText = await zipText(zip, 'xl/_rels/workbook.xml.rels')
  const sharedText = await zipText(zip, 'xl/sharedStrings.xml')
  const shared = sharedText ? parseSharedStrings(sharedText) : []
  const workbook = parseXml(workbookText)
  const relationships = parseXml(relationshipsText ?? '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>')
  const relationMap: Record<string, string> = {}
  for (const rel of [...relationships.getElementsByTagName('*')].filter((node) => node.localName === 'Relationship')) {
    const id = rel.getAttribute('Id')
    const target = rel.getAttribute('Target')
    if (id && target) relationMap[id] = target
  }
  const sheets = [...workbook.getElementsByTagNameNS('*', 'sheet')]
  if (!sheets.length) throw new Error('This workbook contains no sheets.')
  const parts: string[] = []
  let sheetNumber = 0
  for (const sheetNode of sheets.slice(0, 30)) {
    const rid = sheetNode.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id') ?? sheetNode.getAttribute('r:id')
    const target = rid ? relationMap[rid] : undefined
    if (!target) continue
    const path = resolveZipPath('xl', target)
    const sheetText = await zipText(zip, path)
    if (!sheetText) continue
    const sheet = parseXml(sheetText)
    const rows = [...sheet.getElementsByTagNameNS('*', 'row')].slice(0, MAX_XLSX_ROWS)
    let maxColumn = 0
    const parsedRows = rows.map((row) => {
      const map = new Map<number, string>()
      for (const cell of [...row.getElementsByTagNameNS('*', 'c')]) {
        const ref = cell.getAttribute('r') ?? ''
        const column = colToNum(ref)
        if (column < 1 || column > MAX_XLSX_COLS) continue
        map.set(column, cellValue(cell, shared))
        maxColumn = Math.max(maxColumn, column)
      }
      return map
    })
    const rowsHtml = parsedRows.map((map) => {
      const cells = Array.from({ length: maxColumn }, (_, index) => `<td>${esc(map.get(index + 1) ?? '')}</td>`).join('')
      return `<tr>${cells}</tr>`
    }).join('')
    parts.push(`<div class="slide-num">Sheet ${++sheetNumber} · ${esc(sheetNode.getAttribute('name') ?? 'Untitled')}</div><div class="table-scroll"><table>${rowsHtml}</table></div>`)
  }
  return parts.join('<br />') || '<p>No readable worksheet data found.</p>'
}

async function getPptSlideOrder(zip: JSZip): Promise<string[]> {
  const presentationText = await zipText(zip, 'ppt/presentation.xml')
  const relationshipsText = await zipText(zip, 'ppt/_rels/presentation.xml.rels')
  if (!presentationText || !relationshipsText) return []
  const presentation = parseXml(presentationText)
  const relationships = parseXml(relationshipsText)
  const map: Record<string, string> = {}
  for (const relation of [...relationships.getElementsByTagName('*')].filter((node) => node.localName === 'Relationship')) {
    const id = relation.getAttribute('Id')
    const target = relation.getAttribute('Target')
    if (id && target) map[id] = target
  }
  const result: string[] = []
  for (const slideId of [...presentation.getElementsByTagNameNS('*', 'sldId')]) {
    const rid = slideId.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id') ?? slideId.getAttribute('r:id')
    const target = rid ? map[rid] : undefined
    if (!target) continue
    const path = resolveZipPath('ppt', target)
    if (zip.file(path)) result.push(path)
  }
  return result
}

export async function parsePptx(file: File): Promise<string> {
  const zip = await openZip(file)
  let ordered = await getPptSlideOrder(zip)
  if (!ordered.length) {
    ordered = Object.keys(zip.files)
      .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
      .sort((a, b) => Number(a.match(/slide(\d+)/)?.[1] ?? 0) - Number(b.match(/slide(\d+)/)?.[1] ?? 0))
  }
  if (!ordered.length) throw new Error('No readable slides found.')
  return (await Promise.all(ordered.slice(0, MAX_PPT_SLIDES).map(async (path, index) => {
    const xmlText = await zipText(zip, path)
    if (!xmlText) return ''
    const slide = parseXml(xmlText)
    const text = [...slide.getElementsByTagNameNS('*', 't')].map((node) => node.textContent ?? '').filter(Boolean)
    const title = esc(text[0] ?? 'Untitled slide')
    const body = text.slice(1).map((value) => `<p>${esc(value)}</p>`).join('')
    return `<section class="slide"><div class="slide-num">Slide ${index + 1}</div><h2>${title}</h2>${body}</section>`
  }))).filter(Boolean).join('')
}
