'use client'

import { useEffect, useRef, useState } from 'react'

type InfoKey = 'features' | 'formats' | 'how' | 'faq' | 'privacy' | 'terms' | 'security' | 'contact'

type InfoContent = {
  title: string
  body: string
  items?: string[]
}

const DESKTOP_DOWNLOAD_URL = process.env.NEXT_PUBLIC_DESKTOP_DOWNLOAD_URL || '/downloads/FileBro-Setup-1.0.0-x64.exe'

const INFO: Record<InfoKey, InfoContent> = {
  features: {
    title: 'Features',
    body: 'Open supported files from your device, browse your library, and use the right viewer for each file type.',
    items: ['Open a file or folder', 'Search, filter, and sort your library', 'Read documents and text files in the browser', 'Preview images and play supported audio and video'],
  },
  formats: {
    title: 'Supported Formats',
    body: 'FileBroCode supports common document, text, image, audio, and video formats. Support can vary by browser.',
    items: ['PDF', 'DOCX, XLSX, PPTX', 'TXT, CSV, JSON, XML, MD, LOG', 'JPG, JPEG, PNG, SVG, WEBP, GIF', 'MP3, WAV, FLAC', 'MP4, WEBM, MOV'],
  },
  how: {
    title: 'How It Works',
    body: 'Select a file or folder and FileBroCode opens supported content in the browser. File data is handled on your device by the viewer.',
    items: ['Choose files or open a folder', 'FileBroCode identifies supported types', 'Open the file in its viewer', 'Library metadata is saved locally for convenience'],
  },
  faq: {
    title: 'FAQ',
    body: 'A few common questions about using FileBroCode.',
    items: [
      'Does FileBroCode upload my files? The current viewer handles selected files in the browser and does not provide a built-in upload flow.',
      'Why do I need to select a file again after a refresh? Browsers do not keep reusable File objects after a page reload, so the file must be selected again.',
      'Why do some older Office files not open? Legacy .doc, .xls, and .ppt files use older binary formats that the current viewer does not render locally.',
      'Can I use FileBroCode without an account? Yes. The current web viewer does not require an account.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    body: 'FileBroCode is designed around local file viewing. The web app uses browser APIs for selected files and stores library metadata locally.',
    items: ['Selected file content is handled in the browser', 'Library metadata is stored in localStorage', 'No account is required for the viewer', 'The current viewer has no built-in advertising SDK'],
  },
  terms: {
    title: 'Terms of Service',
    body: 'Use FileBroCode with files you are allowed to access. The service is provided as a file-viewing tool, and compatibility depends on the browser and file format.',
    items: ['You are responsible for the files you open', 'Do not use the app for content you do not have permission to access', 'Unsupported or damaged files may fail to open', 'Keep copies of important files elsewhere'],
  },
  security: {
    title: 'Security',
    body: 'The current viewer keeps file handling close to the browser and avoids a built-in file upload path. Your browser, device, extensions, and operating system still matter to overall security.',
    items: ['Local processing for supported viewers', 'No built-in file upload endpoint', 'Temporary object URLs are cleaned up when they are no longer needed', 'Keep your browser and operating system up to date'],
  },
  contact: {
    title: 'Contact',
    body: 'For feedback, compatibility reports, or project questions, email:',
  },
}

function FeatureIcon({ type }: { type: 'bolt' | 'lock' | 'shield' }) {
  if (type === 'bolt') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.2 2 5.5 13h5.2L9.8 22 18.5 10h-5.3L13.2 2Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>
  }
  if (type === 'lock') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5.2" y="10" width="13.6" height="10.4" rx="2.1" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M8.1 10V7.4a3.9 3.9 0 1 1 7.8 0V10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><circle cx="12" cy="15.2" r="1.1" fill="currentColor" /></svg>
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 7.4 2.7v5.7c0 4.9-3.1 7.9-7.4 9.6-4.3-1.7-7.4-4.7-7.4-9.6V5.7L12 3Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="m8.8 12.2 2.1 2.1 4.5-4.7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
}


function WindowsIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 5.2 10.2 4.1v7H3V5.2Zm8.3-1.3L21 2.5v8.6h-9.7V3.9ZM3 12.9h7.2v7L3 18.8v-5.9Zm8.3 0H21v8.6l-9.7-1.4v-7.2Z" fill="currentColor" />
    </svg>
  )
}

function DesktopFeatureIcon({ type }: { type: 'bolt' | 'offline' | 'window' | 'shield' }) {
  if (type === 'bolt') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.2 2 5.5 13h5.2L9.8 22 18.5 10h-5.3L13.2 2Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>
  }
  if (type === 'offline') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15.5a4.4 4.4 0 0 1 3.5-4.3 5 5 0 0 1 9.4 2.3A3.5 3.5 0 0 1 18 20H7.5a3.5 3.5 0 0 1-1.5-6.8Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="m8 8 8 8M16 8l-8 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
  }
  if (type === 'window') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2.2" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M4.5 9h15M8 7h.01M11 7h.01M14 7h.01" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 7.4 2.7v5.7c0 4.9-3.1 7.9-7.4 9.6-4.3-1.7-7.4-4.7-7.4-9.6V5.7L12 3Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="m8.8 12.2 2.1 2.1 4.5-4.7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.1c-3.14.68-3.8-1.33-3.8-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.62 1.22 3.26.93.1-.73.39-1.22.71-1.5-2.5-.28-5.12-1.25-5.12-5.57 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.08 1.15a10.7 10.7 0 0 1 5.61 0c2.13-1.45 3.08-1.15 3.08-1.15.61 1.55.23 2.7.11 2.98.72.79 1.16 1.79 1.16 3.02 0 4.33-2.63 5.28-5.14 5.56.4.35.76 1.03.76 2.08v3.08c0 .3.2.65.78.54A11.2 11.2 0 0 0 12 .8Z"/>
    </svg>
  )
}


function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M5.1 3.3A2.3 2.3 0 1 1 5.1 7.9 2.3 2.3 0 0 1 5.1 3.3Zm-2 6.2h4v11.2h-4V9.5Zm6.5 0h3.8v1.5h.1c.5-.9 1.8-1.9 3.7-1.9 4 0 4.8 2.6 4.8 6v5.6h-4v-5c0-1.2 0-2.8-1.8-2.8-1.8 0-2.1 1.3-2.1 2.7v5.1h-4V9.5Z"/>
    </svg>
  )
}
export default function SiteFooter() {
  const [activeInfo, setActiveInfo] = useState<InfoKey | null>(null)
  const active = activeInfo ? INFO[activeInfo] : null
  const desktopFeatureRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = desktopFeatureRef.current
    if (!root) return

    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-scroll-reveal]'))
    if (!targets.length) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      targets.forEach((target) => target.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const target = entry.target as HTMLElement
        target.classList.add('is-visible')
        observer.unobserve(target)
      })
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' })

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])


  const link = (key: InfoKey, label: string) => (
    <button type="button" className="footer-link inline-block transition-transform duration-200 hover:scale-110" onClick={() => setActiveInfo(key)}>{label}</button>
  )

  return (
    <footer className="site-footer" id="create-footer">
      <section ref={desktopFeatureRef} className="desktop-download-feature" id="desktop-app" aria-labelledby="desktop-download-title">
        <div className="desktop-preview-shell desktop-reveal desktop-reveal-left" data-scroll-reveal aria-hidden="true">
          <div className="desktop-window">
            <div className="desktop-window-bar">
              <div className="desktop-window-traffic-lights" aria-hidden="true">
                <span className="traffic-light red" />
                <span className="traffic-light yellow" />
                <span className="traffic-light green" />
              </div>
              <div className="desktop-window-brand">
                <img src="/app-logo.png" alt="" />
                <span className="desktop-wordmark"><span>File</span><b>bro</b></span>
              </div>
            </div>
            <div className="desktop-window-body">
              <aside className="desktop-sidebar">
                <span className="desktop-sidebar-active">⌂ <b>Home</b></span>
                <span>▱ Files</span>
                <span>▤ Documents</span>
                <span>◫ Reading</span>
                <span>＋ Create</span>
              </aside>
              <div className="desktop-content">
                <div className="desktop-content-kicker">FILE BRO CODE</div>
                <h3>Everything you open.<br />Stays on your device.</h3>
                <div className="desktop-content-search">⌕ <span>Search files...</span></div>
                <div className="desktop-content-cards">
                  <div><strong>PDF</strong><span>Ready to read</span></div>
                  <div><strong>DOCX</strong><span>Open locally</span></div>
                  <div><strong>MP4</strong><span>Play instantly</span></div>
                </div>
              </div>
            </div>
          </div>
          <div className="desktop-preview-glow" />
        </div>

        <div className="desktop-download-copy desktop-reveal desktop-reveal-right" data-scroll-reveal>
          <div className="desktop-download-kicker"><span className="desktop-kicker-dot" /> FILE BRO DESKTOP</div>
          <h2 id="desktop-download-title">Take your files to desktop.</h2>
          <p>Get a faster, focused experience with a dedicated Windows app. Open your files locally, keep your workspace close and work without browser clutter.</p>

          <div className="desktop-benefits" aria-label="Desktop app benefits" data-scroll-reveal>
            <div className="desktop-benefit desktop-benefit-reveal"><span className="desktop-benefit-icon"><DesktopFeatureIcon type="bolt" /></span><span>Faster access</span></div>
            <div className="desktop-benefit desktop-benefit-reveal"><span className="desktop-benefit-icon"><DesktopFeatureIcon type="offline" /></span><span>Works offline</span></div>
            <div className="desktop-benefit desktop-benefit-reveal"><span className="desktop-benefit-icon"><DesktopFeatureIcon type="window" /></span><span>Better windows</span></div>
            <div className="desktop-benefit desktop-benefit-reveal"><span className="desktop-benefit-icon"><DesktopFeatureIcon type="shield" /></span><span>Always local</span></div>
          </div>

          <div className="desktop-download-actions desktop-reveal desktop-reveal-up" data-scroll-reveal>
            <a className="desktop-download-button" href={DESKTOP_DOWNLOAD_URL} download>
              <WindowsIcon className="download-platform-icon" />
              <span>Download for Windows</span>
              <span className="download-arrow" aria-hidden="true">↓</span>
            </a>
            <span className="desktop-download-meta">v1.0.0 · 122 MB · x64</span>
          </div>
        </div>
      </section>

      <div className="footer-features" aria-label="FileBroCode benefits">
        <div className="footer-feature">
          <div className="footer-feature-icon"><FeatureIcon type="bolt" /></div>
          <div><strong>Open Instantly</strong><span>View any file in seconds.</span></div>
        </div>
        <div className="footer-feature-divider" aria-hidden="true" />
        <div className="footer-feature">
          <div className="footer-feature-icon"><FeatureIcon type="lock" /></div>
          <div><strong>100% Private</strong><span>Your files never leave your device.</span></div>
        </div>
        <div className="footer-feature-divider" aria-hidden="true" />
        <div className="footer-feature">
          <div className="footer-feature-icon"><FeatureIcon type="shield" /></div>
          <div><strong>Always Free</strong><span>No installation. No sign up.</span></div>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-brand-block">
          <div className="footer-brand-row">
            <img src="/app-logo.png" alt="" className="footer-logo" />
            <div>
              <div className="footer-brand-name"><span>File</span><b>bro</b></div>
              <p>A simple local document viewer.<br />Open and read your files — privately, instantly.</p>
              <div className="footer-microcopy">ANY FILE&nbsp;&nbsp;·&nbsp;&nbsp;ANY DEVICE&nbsp;&nbsp;·&nbsp;&nbsp;ANYWHERE</div>
              <div className="footer-credit-row">
                <div className="footer-credit">Built by <strong>Naveen Shukla</strong></div>
                <div className="footer-socials" aria-label="Social links">
                  <a className="social-link" href="https://github.com/naveenshukla1817" target="_blank" rel="noreferrer" aria-label="Naveen Shukla on GitHub" title="GitHub"><GitHubIcon /></a>
                  <a className="social-link" href="https://www.linkedin.com/in/naveenshukla99/" target="_blank" rel="noreferrer" aria-label="Naveen Shukla on LinkedIn" title="LinkedIn"><LinkedInIcon /></a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-column">
          <h3>Product</h3>
          <nav className="footer-link-list" aria-label="Product">
            {link('features', 'Features')}
            {link('formats', 'Supported Formats')}
            {link('how', 'How It Works')}
            {link('faq', 'FAQ')}
          </nav>
        </div>

        <div className="footer-column">
          <h3>Resources</h3>
          <nav className="footer-link-list" aria-label="Resources">
            {link('privacy', 'Privacy Policy')}
            {link('terms', 'Terms of Service')}
            {link('security', 'Security')}
            {link('contact', 'Contact')}
          </nav>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} File bro. All rights reserved.</span>
        <span>100% local · 0 ads · no login</span>
      </div>

      {active && (
        <div className="info-overlay" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setActiveInfo(null) }}>
          <section className="info-modal font-sans antialiased" role="dialog" aria-modal="true" aria-labelledby="footer-info-title">
            <div className="info-modal-head">
              <div>
                <div className="section-kicker">FILE BRO CODE</div>
                <h2 id="footer-info-title">{active.title}</h2>
              </div>
              <button type="button" className="info-close flex items-center justify-center pt-px transition-transform duration-200 hover:scale-110" onClick={() => setActiveInfo(null)} aria-label="Close">×</button>
            </div>
            <p>{active.body}</p>
            {activeInfo === 'contact' ? (
              <a className="contact-email" href="mailto:workfornewshukla@gmail.com">workfornewshukla@gmail.com</a>
            ) : null}
            {active.items && <ul>{active.items.map((item) => <li key={item}>{item}</li>)}</ul>}
          </section>
        </div>
      )}
    </footer>
  )
}
