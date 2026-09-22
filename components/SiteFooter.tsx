'use client'

import { useState } from 'react'

type InfoKey = 'features' | 'formats' | 'how' | 'faq' | 'privacy' | 'terms' | 'security' | 'contact'

type InfoContent = {
  title: string
  body: string
  items?: string[]
}

const INFO: Record<InfoKey, InfoContent> = {
  features: {
    title: 'Features',
    body: 'FileBroCode is designed for quick, quiet file viewing directly in your browser. Choose a supported file, open it instantly, search your local library, switch between light and dark mode, and use reading or fullscreen controls where available.',
    items: ['Instant file opening after selection', 'Local browser-based viewing', 'PDF, Office, text, image and media support', 'Search, filter, sorting and drag-and-drop'],
  },
  formats: {
    title: 'Supported Formats',
    body: 'The current viewer supports these file types. Legacy Office binary formats can be detected and explained, but they are not rendered locally.',
    items: ['PDF', 'DOCX, XLSX, PPTX', 'TXT, CSV, JSON, XML, MD, LOG', 'JPG, JPEG, PNG, SVG, WEBP, GIF', 'MP3, WAV, FLAC', 'MP4, WEBM, MOV'],
  },
  how: {
    title: 'How It Works',
    body: 'Pick or drop a supported file. FileBroCode creates a temporary browser object URL or parses the file locally, then opens the viewer immediately. The file is not uploaded by the app.',
    items: ['Choose a file or folder', 'The selected file opens immediately', 'Use the viewer controls to read or play it', 'Your library remembers file metadata locally for convenience'],
  },
  faq: {
    title: 'FAQ',
    body: 'Common questions about FileBroCode.',
    items: [
      'Does FileBroCode upload my files? No. The current viewer processes files in the browser and does not send them to a FileBroCode upload service.',
      'Why does a restored file need to be selected again? Browser file permissions do not persist as reusable File objects after a page reload, so the app keeps metadata but asks you to re-select the original file.',
      'Why can’t old .doc/.xls/.ppt files open? Those legacy binary formats need a dedicated parser. FileBroCode currently avoids remote document conversion for local privacy.',
      'Can I use FileBroCode offline? Core viewing works locally once the app assets are available; files themselves are handled on the device.',
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    body: 'FileBroCode is built around local viewing. The viewer uses browser APIs such as File, Blob and localStorage. Your selected file content is not intentionally uploaded to a FileBroCode server by the current client application.',
    items: ['Files stay in the browser session for viewing', 'Only library metadata is persisted locally', 'No account is required', 'No advertising SDK is included in the viewer'],
  },
  terms: {
    title: 'Terms of Service',
    body: 'Use FileBroCode only with files you are permitted to access. The application is provided for personal file viewing, and compatibility can vary by browser and file format.',
    items: ['You are responsible for your files and their contents', 'Do not use the service to process material you do not have permission to access', 'Unsupported or damaged files may fail to render', 'Do not rely on the viewer as the sole backup for important files'],
  },
  security: {
    title: 'Security',
    body: 'The current architecture minimizes server-side exposure by keeping file handling in the browser. Security still depends on the browser, device, installed extensions, and the source of the file you choose to open.',
    items: ['Local file processing where supported', 'No built-in file upload endpoint in the viewer', 'Temporary object URLs are revoked when the viewer closes', 'Keep your browser and operating system updated'],
  },
  contact: {
    title: 'Contact',
    body: 'For feedback, compatibility reports, or project questions, use the project repository or the contact channel you publish with your FileBroCode deployment. Keep the message focused on the file type, browser, and steps that reproduce the issue.',
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

export default function SiteFooter() {
  const [activeInfo, setActiveInfo] = useState<InfoKey | null>(null)
  const active = activeInfo ? INFO[activeInfo] : null

  const link = (key: InfoKey, label: string) => (
    <button type="button" className="footer-link inline-block transition-transform duration-200 hover:scale-110" onClick={() => setActiveInfo(key)}>{label}</button>
  )

  return (
    <footer className="site-footer" id="create-footer">
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
              <div className="footer-brand-name">File bro code</div>
              <p>A simple local document viewer.<br />Open and read your files — privately, instantly.</p>
              <div className="footer-microcopy">ANY FILE&nbsp;&nbsp;·&nbsp;&nbsp;ANY DEVICE&nbsp;&nbsp;·&nbsp;&nbsp;ANYWHERE</div>
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
        <span>© {new Date().getFullYear()} File bro code. All rights reserved.</span>
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
            {active.items && <ul>{active.items.map((item) => <li key={item}>{item}</li>)}</ul>}
          </section>
        </div>
      )}
    </footer>
  )
}
