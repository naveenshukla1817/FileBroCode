'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getExtension, getFileMeta, formatBytes } from '@/lib/file-types'
import { parseDocx, parsePptx, parseXlsx } from '@/lib/office'
import FileTypeIcon from '@/components/FileTypeIcon'

type FileViewerProps = {
  file: File | null
  open: boolean
  onClose: () => void
}

const TEXT_EXTENSIONS = new Set(['txt', 'csv', 'json', 'xml', 'md', 'log'])
const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif'])
const AUDIO_EXTENSIONS = new Set(['mp3', 'wav', 'flac'])
const VIDEO_EXTENSIONS = new Set(['mp4', 'webm', 'mov'])

function getMediaType(extension: string): 'image' | 'audio' | 'video' | 'text' | 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'legacy' | 'unsupported' {
  if (extension === 'pdf') return 'pdf'
  if (extension === 'docx') return 'docx'
  if (extension === 'xlsx') return 'xlsx'
  if (extension === 'pptx') return 'pptx'
  if (TEXT_EXTENSIONS.has(extension)) return 'text'
  if (IMAGE_EXTENSIONS.has(extension)) return 'image'
  if (AUDIO_EXTENSIONS.has(extension)) return 'audio'
  if (VIDEO_EXTENSIONS.has(extension)) return 'video'
  if (new Set(['doc', 'xls', 'ppt']).has(extension)) return 'legacy'
  return 'unsupported'
}

function ViewerError({ children }: { children: React.ReactNode }) {
  return (
    <div className="error-panel">
      <strong>Could not open this file</strong>
      <p>{children}</p>
      <p>The original file has not been modified.</p>
    </div>
  )
}

export default function FileViewer({ file, open, onClose }: FileViewerProps) {
  const [readingMode, setReadingMode] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [officeHtml, setOfficeHtml] = useState<string | null>(null)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const [fullScreen, setFullScreen] = useState(false)
  const [captureMessage, setCaptureMessage] = useState<string | null>(null)
  const viewerRef = useRef<HTMLDivElement>(null)

  const extension = useMemo(() => (file ? getExtension(file.name) : ''), [file])
  const kind = getMediaType(extension)
  const meta = file ? getFileMeta(file) : null

  useEffect(() => {
    if (!open || !file) return
    setReadingMode(false)
    setZoom(1)
    setError(null)
    setOfficeHtml(null)
    setFullScreen(false)
    setLoading(true)

    let currentUrl: string | null = null
    const load = async () => {
      try {
        if (kind === 'image' || kind === 'audio' || kind === 'video' || kind === 'pdf') {
          currentUrl = URL.createObjectURL(file)
          setObjectUrl(currentUrl)
        } else if (kind === 'text') {
          const text = await file.slice(0, 8 * 1024 * 1024).text()
          setOfficeHtml(`<pre class="text-content">${escapeHtml(text)}</pre>`)
        } else if (kind === 'docx') {
          setOfficeHtml(`<div class="doc-content">${await parseDocx(file)}</div>`)
        } else if (kind === 'xlsx') {
          setOfficeHtml(`<div class="doc-content">${await parseXlsx(file)}</div>`)
        } else if (kind === 'pptx') {
          setOfficeHtml(await parsePptx(file))
        } else if (kind === 'legacy') {
          setError(`.${extension} is a legacy Office binary format. Google Docs Viewer can render it only from a publicly reachable URL; a browser-local File/blob URL cannot be fetched by Google. The V10 client-only viewer therefore keeps this local and safe instead of uploading the file.`)
        } else {
          setError(`.${extension || 'unknown'} is not supported by the current viewer.`)
        }
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : 'Unsupported or corrupted document.')
      } finally {
        setLoading(false)
      }
    }

    void load()
    return () => {
      if (currentUrl) URL.revokeObjectURL(currentUrl)
      setObjectUrl(null)
    }
  }, [open, file, kind, extension])

  const syncFullscreenState = useCallback(() => {
    const viewer = viewerRef.current
    const fullscreenElement = document.fullscreenElement
    const enteredFromViewer = Boolean(
      viewer && fullscreenElement && (fullscreenElement === viewer || viewer.contains(fullscreenElement)),
    )
    setFullScreen(enteredFromViewer)
  }, [])

  useEffect(() => {
    if (!open) {
      setFullScreen(false)
      return
    }

    const onFullscreenChange = () => syncFullscreenState()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      // Native fullscreen is exited by the browser; wait for fullscreenchange.
      const fullscreenElement = document.fullscreenElement
      const viewer = viewerRef.current
      if (fullscreenElement && viewer && (fullscreenElement === viewer || viewer.contains(fullscreenElement))) return

      // Our fallback presentation mode has no browser fullscreen element.
      if (fullScreen) {
        event.preventDefault()
        setFullScreen(false)
        return
      }

      onClose()
    }

    document.addEventListener('fullscreenchange', onFullscreenChange)
    document.addEventListener('keydown', onKeyDown)
    onFullscreenChange()

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose, syncFullscreenState, fullScreen])

  useEffect(() => {
    if (open) return
    const viewer = viewerRef.current
    const fullscreenElement = document.fullscreenElement
    if (viewer && fullscreenElement && (fullscreenElement === viewer || viewer.contains(fullscreenElement))) {
      void document.exitFullscreen().catch(() => undefined)
    }
  }, [open])

  const takeQuickScreenshot = async () => {
    if (!file) return
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setCaptureMessage('Quick screenshot is not supported in this browser.')
      return
    }

    let stream: MediaStream | null = null
    try {
      setCaptureMessage('Choose this tab in the capture picker…')
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser', preferCurrentTab: true },
        audio: false,
      } as any)

      const video = document.createElement('video')
      video.muted = true
      video.playsInline = true
      video.srcObject = stream
      await video.play()
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

      const width = video.videoWidth || window.innerWidth
      const height = video.videoHeight || window.innerHeight
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Could not create screenshot canvas.')
      context.drawImage(video, 0, 0, width, height)

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
      if (!blob) throw new Error('Could not create screenshot image.')

      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      const baseName = file.name.replace(/\.[^/.]+$/, '') || 'filebro-screenshot'
      anchor.href = url
      anchor.download = `${baseName}-screenshot.png`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 0)
      setCaptureMessage('Screenshot saved')
    } catch (cause) {
      const message = cause instanceof DOMException && cause.name === 'NotAllowedError'
        ? 'Screenshot cancelled'
        : cause instanceof Error ? cause.message : 'Screenshot failed'
      setCaptureMessage(message)
    } finally {
      stream?.getTracks().forEach((track) => track.stop())
      window.setTimeout(() => setCaptureMessage(null), 2400)
    }
  }

  if (!open || !file) return null

  const handleClose = async () => {
    try {
      const fullscreenElement = document.fullscreenElement
      const viewer = viewerRef.current
      if (fullscreenElement && viewer && (fullscreenElement === viewer || viewer.contains(fullscreenElement))) {
        await document.exitFullscreen()
      }
    } catch {
      // Ignore browser fullscreen API failures while closing.
    } finally {
      setFullScreen(false)
      onClose()
    }
  }

  const toggleFullscreen = async () => {
    const viewer = viewerRef.current
    if (!viewer) return

    try {
      const fullscreenElement = document.fullscreenElement
      if (fullscreenElement === viewer || (fullscreenElement && viewer.contains(fullscreenElement))) {
        await document.exitFullscreen()
        return
      }

      if (fullscreenElement) {
        await document.exitFullscreen()
      }

      await viewer.requestFullscreen({ navigationUI: 'hide' })
    } catch {
      // Some embedded browsers/webviews do not expose Fullscreen API.
      // Keep a real immersive fallback controlled by React state.
      setFullScreen(true)
    }
  }

  const title = file.name
  const metaText = `${formatBytes(file.size)} · ${meta?.label ?? extension.toUpperCase()}`

  let body: React.ReactNode
  switch (kind) {
    case 'pdf':
      body = objectUrl ? <iframe title={title} className="pdf-frame" src={`${objectUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`} allowFullScreen /> : null
      break
    case 'image':
      body = objectUrl ? <div className="image-stage"><img src={objectUrl} alt={title} /></div> : null
      break
    case 'audio':
      body = objectUrl ? <div className="media-stage"><audio controls preload="metadata" src={objectUrl} /></div> : null
      break
    case 'video':
      body = objectUrl ? <div className="media-stage"><video controls playsInline preload="metadata" src={objectUrl} /></div> : null
      break
    case 'text':
    case 'docx':
    case 'xlsx':
      body = (
        <div className="doc-wrap zoomable-document" style={{ '--viewer-scale': zoom } as React.CSSProperties}>
          <div className="doc-sheet">
            <div className={`${readingMode ? 'reading ' : ''}` + (kind === 'text' ? 'text-content' : '')} dangerouslySetInnerHTML={{ __html: officeHtml ?? '' }} />
          </div>
        </div>
      )
      break
    case 'pptx':
      body = <div className="doc-wrap zoomable-document" style={{ '--viewer-scale': zoom } as React.CSSProperties} dangerouslySetInnerHTML={{ __html: officeHtml ?? '' }} />
      break
    case 'legacy':
    case 'unsupported':
      body = <ViewerError>{error ?? 'This file format cannot be rendered locally.'}</ViewerError>
      break
    default:
      body = <ViewerError>Unsupported file format.</ViewerError>
  }

  return (
    <div
      ref={viewerRef}
      className={`viewer ${fullScreen ? 'is-presentation' : ''}`}
      data-file-viewer
      data-fullscreen={fullScreen ? 'true' : 'false'}
    >
      <div className="viewer-topbar">
        <button type="button" className="viewer-back" onClick={() => void handleClose()} aria-label="Back to files" title="Back to files"><span aria-hidden="true" /></button>
        <div className="viewer-file-icon">
          <FileTypeIcon extension={extension} size={34} />
        </div>
        <div className="viewer-title-wrap">
          <div className="viewer-title">{title}</div>
          <div className="viewer-meta">{metaText}</div>
        </div>
        <div className="viewer-actions">
          {['text', 'docx', 'xlsx', 'pptx'].includes(kind) && (
            <>
              <button type="button" className="top-icon" onClick={() => setZoom((z) => Math.max(.75, Number((z - .1).toFixed(2))))} title="Zoom out" aria-label="Zoom out">−</button>
              <button type="button" className="top-icon" onClick={() => setZoom((z) => Math.min(2.2, Number((z + .1).toFixed(2))))} title="Zoom in" aria-label="Zoom in">＋</button>
              <button type="button" className="btn btn-small btn-secondary" onClick={() => setReadingMode((value) => !value)}>
                {readingMode ? 'Standard mode' : 'Reading mode'}
              </button>
            </>
          )}
          {kind === 'pdf' && (
            <button type="button" className="top-icon viewer-screenshot" onClick={() => void takeQuickScreenshot()} aria-label="Quick screenshot" title="Quick screenshot">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 6.5 10 4h4l1.5 2.5H19a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3.5Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><circle cx="12" cy="12.5" r="3.1" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>
            </button>
          )}
          <button type="button" className="top-icon" onClick={toggleFullscreen} aria-label={fullScreen ? 'Exit fullscreen' : 'Enter fullscreen'} title={fullScreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
            {fullScreen ? '⛶' : '⛶'}
          </button>
        </div>
      </div>
      {captureMessage && <div className="viewer-capture-message" role="status">{captureMessage}</div>}
      <div className="viewer-body">
        {loading ? (
          <div className="viewer-loading"><div className="spinner" /><div>Opening document…</div></div>
        ) : error && !officeHtml ? (
          <ViewerError>{error}</ViewerError>
        ) : body}
      </div>
    </div>
  )
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>\"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] ?? char))
}
