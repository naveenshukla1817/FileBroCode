export type FileCategory = 'pdf' | 'word' | 'excel' | 'ppt' | 'text' | 'image' | 'video' | 'audio' | 'other'

export type FileMeta = {
  label: string
  category: FileCategory
  extensions: string[]
}

export const FILE_TYPES: Record<string, FileMeta> = {
  pdf: { label: 'PDF', category: 'pdf', extensions: ['pdf'] },
  docx: { label: 'WORD', category: 'word', extensions: ['docx'] },
  xlsx: { label: 'XLS', category: 'excel', extensions: ['xlsx'] },
  pptx: { label: 'PPT', category: 'ppt', extensions: ['pptx'] },
  txt: { label: 'TXT', category: 'text', extensions: ['txt'] },
  csv: { label: 'CSV', category: 'text', extensions: ['csv'] },
  json: { label: 'JSON', category: 'text', extensions: ['json'] },
  xml: { label: 'XML', category: 'text', extensions: ['xml'] },
  md: { label: 'MD', category: 'text', extensions: ['md'] },
  log: { label: 'LOG', category: 'text', extensions: ['log'] },
  mp3: { label: 'MP3', category: 'audio', extensions: ['mp3'] },
  wav: { label: 'WAV', category: 'audio', extensions: ['wav'] },
  flac: { label: 'FLAC', category: 'audio', extensions: ['flac'] },
  mp4: { label: 'MP4', category: 'video', extensions: ['mp4'] },
  webm: { label: 'WEBM', category: 'video', extensions: ['webm'] },
  mov: { label: 'MOV', category: 'video', extensions: ['mov'] },
  svg: { label: 'SVG', category: 'image', extensions: ['svg'] },
  jpg: { label: 'JPG', category: 'image', extensions: ['jpg'] },
  jpeg: { label: 'JPG', category: 'image', extensions: ['jpeg'] },
  png: { label: 'PNG', category: 'image', extensions: ['png'] },
  webp: { label: 'WEBP', category: 'image', extensions: ['webp'] },
  gif: { label: 'GIF', category: 'image', extensions: ['gif'] },
}

export const EXTENSION_LIST = Object.keys(FILE_TYPES)

export function getExtension(name: string): string {
  const clean = name.split(/[?#]/)[0]
  const index = clean.lastIndexOf('.')
  return index === -1 ? '' : clean.slice(index + 1).toLowerCase()
}

export function getFileMeta(file: File): FileMeta | null {
  return FILE_TYPES[getExtension(file.name)] ?? null
}

export function formatBytes(bytes: number): string {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unit = 0
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024
    unit += 1
  }
  const digits = size >= 10 || unit === 0 ? 0 : 1
  return `${size.toFixed(digits)} ${units[unit]}`
}

export function isSupportedFile(file: File): boolean {
  return Boolean(getFileMeta(file))
}
