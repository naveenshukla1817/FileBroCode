'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import FileViewer from '@/components/FileViewer'
import SiteFooter from '@/components/SiteFooter'
import FileOrbit from '@/components/FileOrbit'
import FileTypeIcon from '@/components/FileTypeIcon'
import { EXTENSION_LIST, FileCategory, FileMeta, formatBytes, getExtension, getFileMeta, isSupportedFile } from '@/lib/file-types'

type LibraryItem = {
  id: string
  name: string
  path: string
  size: number
  lastModified: number
  addedAt: number
  file: File | null
  meta: FileMeta
}

type PersistedItem = Omit<LibraryItem, 'file' | 'meta'> & {
  category: FileCategory
  label: string
}

function WindowsIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 5.2 10.2 4.1v7H3V5.2Zm8.3-1.3L21 2.5v8.6h-9.7V3.9ZM3 12.9h7.2v7L3 18.8v-5.9Zm8.3 0H21v8.6l-9.7-1.4v-7.2Z" fill="currentColor" />
    </svg>
  )
}

const STORAGE_KEY = 'filebrocode.next.library.v10'
const DESKTOP_DOWNLOAD_URL = process.env.NEXT_PUBLIC_DESKTOP_DOWNLOAD_URL || '/downloads/FileBro-Setup-1.0.0-x64.exe'
const FILTERS: Array<{ key: 'all' | FileCategory; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'pdf', label: 'PDF' },
  { key: 'word', label: 'Word' },
  { key: 'excel', label: 'Excel' },
  { key: 'ppt', label: 'PowerPoint' },
  { key: 'text', label: 'Text' },
  { key: 'image', label: 'Images' },
  { key: 'audio', label: 'Audio' },
  { key: 'video', label: 'Video' },
]

export default function FileBroCodeApp() {
  const [items, setItems] = useState<LibraryItem[]>([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | FileCategory>('all')
  const [sort, setSort] = useState<'name' | 'type' | 'size' | 'added'>('name')
  const [viewerFile, setViewerFile] = useState<File | null>(null)
  const [toast, setToast] = useState<{ message: string; error?: boolean } | null>(null)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const fileInput = useRef<HTMLInputElement | null>(null)
  const folderInput = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const data = JSON.parse(raw) as { items?: PersistedItem[]; filter?: typeof filter; sort?: typeof sort }
      const restored = (data.items ?? []).map((item) => {
        const extension = getExtension(item.name)
        const meta = getFileMeta(new File([], `placeholder.${extension}`)) ?? { label: item.label, category: item.category, extensions: [extension] }
        return { ...item, file: null, meta }
      })
      setItems(restored)
      if (data.filter) setFilter(data.filter)
      if (data.sort) setSort(data.sort)
    } catch {
      // Ignore malformed local storage and start clean.
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('theme-switching')
    root.dataset.theme = theme
    const timer = window.setTimeout(() => root.classList.remove('theme-switching'), 340)
    return () => window.clearTimeout(timer)
  }, [theme])

  useEffect(() => {
    // `webkitdirectory` is a non-standard browser attribute, so set it imperatively
    // instead of relying on a TypeScript JSX declaration.
    folderInput.current?.setAttribute('webkitdirectory', '')
  }, [])

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.file-card[data-scroll-reveal]'))
    if (!cards.length) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      cards.forEach((card) => card.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' })
    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [items, query, filter, sort])

  useEffect(() => {
    try {
      const payload: PersistedItem[] = items.map(({ file: _file, meta, ...item }) => ({ ...item, category: meta.category, label: meta.label }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 10, items: payload, filter, sort }))
    } catch {
      // Metadata persistence is best-effort.
    }
  }, [items, filter, sort])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 3000)
    return () => window.clearTimeout(timer)
  }, [toast])

  const visibleItems = useMemo(() => {
    const result = items.filter((item) => {
      const matchesFilter = filter === 'all' || item.meta.category === filter
      const haystack = `${item.name} ${item.path}`.toLowerCase()
      return matchesFilter && (!query.trim() || haystack.includes(query.trim().toLowerCase()))
    })
    result.sort((a, b) => {
      if (sort === 'size') return b.size - a.size || a.name.localeCompare(b.name)
      if (sort === 'type') return a.meta.category.localeCompare(b.meta.category) || a.name.localeCompare(b.name)
      if (sort === 'added') return b.addedAt - a.addedAt
      return a.name.localeCompare(b.name)
    })
    return result
  }, [filter, items, query, sort])

  const showToast = (message: string, error = false) => setToast({ message, error })

  const addFiles = (selected: File[]) => {
    const supportedFiles: File[] = []
    let added = 0
    let restored = 0
    let skipped = 0

    for (const file of selected) {
      const meta = getFileMeta(file)
      if (!meta || !isSupportedFile(file)) {
        skipped += 1
        continue
      }
      supportedFiles.push(file)
    }

    setItems((current) => {
      const next = [...current]
      for (const file of supportedFiles) {
        const meta = getFileMeta(file)
        if (!meta) continue
        const id = `${file.name}|${file.size}|${file.lastModified}`
        const index = next.findIndex((item) => item.id === id)
        const item: LibraryItem = {
          id,
          name: file.name,
          path: (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name,
          size: file.size,
          lastModified: file.lastModified,
          addedAt: index >= 0 ? next[index].addedAt : Date.now(),
          file,
          meta,
        }
        if (index >= 0) {
          next[index] = item
          restored += 1
        } else {
          next.push(item)
          added += 1
        }
      }
      return next
    })

    if (supportedFiles.length > 0) {
      setViewerFile(supportedFiles[0])
    }

    if (added || restored) {
      const parts: string[] = []
      if (added) parts.push(`${added} added`)
      if (restored) parts.push(`${restored} restored`)
      if (skipped) parts.push(`${skipped} unsupported skipped`)
      showToast(parts.join(' · '))
    } else if (skipped) {
      showToast(`${skipped} unsupported file${skipped === 1 ? '' : 's'} skipped`, true)
    } else {
      showToast('Files are already in the list')
    }
  }

  const removeItem = (id: string) => {
    const item = items.find((candidate) => candidate.id === id)
    setItems((current) => current.filter((candidate) => candidate.id !== id))
    if (item) showToast(`Removed ${item.name}`)
  }

  const clearList = () => {
    if (!items.length) return
    if (!window.confirm(`Clear all ${items.length} file${items.length === 1 ? '' : 's'} from your library?`)) return
    setItems([])
    showToast('File list cleared')
  }

  const openFiles = () => fileInput.current?.click()
  const openFolder = () => folderInput.current?.click()

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="File bro home">
          <img className="brand-logo" src="/app-logo.png" alt="" />
          <span className="brand-name"><span>File</span><b>bro</b></span>
        </a>

        <nav className="topnav" aria-label="Primary">
          {['Home', 'Files', 'Documents', 'Reading', 'Create'].map((label) => <a key={label} className="inline-block transition-transform duration-200 hover:scale-110" href={`#${label.toLowerCase()}`}>{label}</a>)}
        </nav>

        <button type="button" className="mobile-menu-btn" onClick={() => setMobileMenuOpen((open) => !open)} aria-expanded={mobileMenuOpen} aria-label="Open menu">
          <span /><span /><span />
        </button>
        {mobileMenuOpen && <div className="mobile-menu">{['Home', 'Files', 'Documents', 'Reading', 'Create'].map((label) => <a key={label} className="inline-block transition-transform duration-200 hover:scale-110" href={`#${label.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)}>{label}</a>)}</div>}

        <div className="top-actions">
          <label className="top-search" htmlFor="searchInput">
            <span className="top-search-icon" aria-hidden="true">⌕</span>
            <input id="searchInput" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search files..." autoComplete="off" />
          </label>
          <button type="button" className="top-icon theme-toggle" onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} aria-label="Toggle dark mode" title="Toggle dark mode">◐</button>
          <button type="button" className="top-new" onClick={openFiles}>＋ New</button>
        </div>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-layout">
            <div className="hero-content">
              <div className="hero-badge transition-transform duration-200 hover:scale-105">A simple local document viewer</div>
              <h1>Your files, in one<br />quiet place.</h1>
              <p>Open and read PDF, Word, Excel, PowerPoint, text, images and media directly on your device. No account, no upload, no noise.</p>
              <div className="hero-actions" id="create">
              <button type="button" className="btn btn-primary" onClick={openFiles}>Get Started <span aria-hidden="true">→</span></button>
              <button type="button" className="btn btn-secondary" onClick={openFolder}>Open folder</button>
              <a className="btn btn-desktop-download" href={DESKTOP_DOWNLOAD_URL} download>
                <WindowsIcon className="download-platform-icon" />
                <span>Download for Windows</span>
                <span className="download-arrow" aria-hidden="true">↓</span>
              </a>
                <input ref={fileInput} type="file" hidden multiple accept={EXTENSION_LIST.map((ext) => `.${ext}`).join(',')} onChange={(event) => { addFiles(Array.from(event.target.files ?? [])); event.target.value = '' }} />
                <input ref={folderInput} type="file" hidden multiple onChange={(event) => { addFiles(Array.from(event.target.files ?? [])); event.target.value = '' }} />
              </div>
            </div>
            <div className="hero-orbit-wrap">
              <FileOrbit />
            </div>
          </div>
        </section>

        <section id="documents" className="toolbar card">
          <div className="toolbar-heading">
            <div>
              <div className="section-kicker">DOCUMENT LIBRARY</div>
              <h2>Keep your reading surface clean.</h2>
            </div>
            <span className="toolbar-note">Everything stays local</span>
          </div>
          <div className="search-wrap">
            <span className="top-search-icon" aria-hidden="true">⌕</span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter the current file list..." autoComplete="off" aria-label="Filter files" />
          </div>
          <div className="toolbar-row">
            <div className="chips">
              {FILTERS.map(({ key, label }) => <button type="button" key={key} className={`chip ${filter === key ? 'active' : ''}`} onClick={() => setFilter(key)}>{label}</button>)}
            </div>
            <select className="sort-select" value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} aria-label="Sort files">
              <option value="name">Sort: Name</option>
              <option value="type">Sort: Type</option>
              <option value="size">Sort: Size</option>
              <option value="added">Sort: Added</option>
            </select>
          </div>
        </section>

        <section id="reading" className="drop-zone" onDragEnter={(event) => { event.preventDefault(); event.currentTarget.classList.add('dragover') }} onDragOver={(event) => event.preventDefault()} onDragLeave={(event) => event.currentTarget.classList.remove('dragover')} onDrop={(event) => { event.preventDefault(); event.currentTarget.classList.remove('dragover'); addFiles(Array.from(event.dataTransfer.files)) }}>
          <div className="drop-icon">↥</div>
          <div className="drop-title">Drop files here</div>
          <div className="drop-subtitle">Drag and drop your documents anywhere in this area</div>
          <div className="drop-actions">
            <button type="button" className="btn btn-small btn-secondary" onClick={openFiles}>Open files <span aria-hidden="true">→</span></button>
            <span className="drop-or">or</span>
            <button type="button" className="btn btn-small btn-ghost" onClick={openFolder}>Open folder</button>
          </div>
        </section>

        <section id="files" className="section-head">
          <div>
            <div className="section-kicker">YOUR FILES</div>
            <h2>Recent documents</h2>
            <span className="muted">{visibleItems.length} file{visibleItems.length === 1 ? '' : 's'}{visibleItems.length !== items.length ? ` · ${items.length} total` : ''}</span>
          </div>
          {items.length > 0 && <button type="button" className="text-btn" onClick={clearList}>Clear list</button>}
        </section>

        {visibleItems.length > 0 && (
          <section className="file-grid" aria-live="polite">
            {visibleItems.map((item) => {
              const unavailable = !item.file
              return (
                <article key={item.id} className={`file-card ${unavailable ? 'opacity-70' : ''}`} data-scroll-reveal tabIndex={0} role="button" onClick={() => item.file ? setViewerFile(item.file) : showToast('Re-select this file after a reload to open it.', true)} onKeyDown={(event) => { if ((event.key === 'Enter' || event.key === ' ') && item.file) setViewerFile(item.file) }}>
                  <div className="file-top">
                    <div className="file-type-mark" title={`${item.meta.label} file`}>
                      <FileTypeIcon extension={getExtension(item.name)} size={30} />
                    </div>
                    <div className="file-card-actions">
                      <button type="button" className="file-open" disabled={unavailable} onClick={(event) => { event.stopPropagation(); if (item.file) setViewerFile(item.file) }} title={unavailable ? 'Re-add file after reload' : 'Open file'}>{unavailable ? '↻' : '↗'}</button>
                      <button type="button" className="file-remove flex items-center justify-center transition-transform duration-200 hover:scale-110" onClick={(event) => { event.stopPropagation(); removeItem(item.id) }} aria-label={`Remove ${item.name}`}>×</button>
                    </div>
                  </div>
                  <div className="file-name" title={item.name}>{item.name}</div>
                  <div className="file-meta">{formatBytes(item.size)} · {item.meta.category}{unavailable ? ' · re-add required' : ''}</div>
                  <div className="file-path" title={item.path}>{item.path}</div>
                </article>
              )
            })}
          </section>
        )}

        {visibleItems.length === 0 && (
          <section className="empty-state card">
            <div className="empty-art">⌁</div>
            <h3>{items.length ? 'No matching files' : 'No files loaded'}</h3>
            <p>{items.length ? 'Try another search or filter.' : 'Choose documents or a folder to build your local reading list. Nothing leaves your device.'}</p>
            <button type="button" className="btn btn-primary" onClick={openFiles}>Open files <span aria-hidden="true">→</span></button>
          </section>
        )}
      </main>

      <SiteFooter />
      {toast && <div className={`toast show ${toast.error ? 'error' : ''}`} role="status">{toast.message}</div>}
      <FileViewer file={viewerFile} open={Boolean(viewerFile)} onClose={() => setViewerFile(null)} />
    </div>
  )
}
