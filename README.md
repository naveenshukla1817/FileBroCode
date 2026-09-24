FileBroCode v12 — UI refinements

# File bro code — Next.js

A personal, client-first file viewer rebuilt from the File bro code V10 visual system.

## Setup

Fresh project commands:

```bash
npx create-next-app@latest file-bro-code --typescript --eslint --app
cd file-bro-code
npm install jszip
npm install -D tailwindcss@3.4.17 postcss autoprefixer
npx tailwindcss init -p
npm run dev
```

When using this supplied project ZIP, just run:

```bash
npm install
npm run dev
```

Or use this repository directly:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Tech stack

- Next.js 16.3.3 + React 19.2
- TypeScript
- Tailwind CSS 3.4.17 with `tailwind.config.js`
- JSZip for lightweight client-side DOCX/XLSX/PPTX package parsing
- No database
- No login
- No ad SDK
- No server-side document conversion

Next.js 16.3.3 was the current Active LTS patch referenced by the official Next.js release notes in September 2026. Tailwind CSS currently documents v4 as the recommended installation path; this project deliberately keeps Tailwind 3.4 so the requested explicit `tailwind.config.js` remains available while preserving the V10 token system.

## File support

### Opens locally in the browser

- PDF: native `<iframe>` using a local object URL
- DOCX: lightweight OOXML text/table parsing
- XLSX: lightweight workbook/sheet parsing with sparse-cell column alignment
- PPTX: lightweight text extraction using the real `presentation.xml` slide order
- TXT/CSV/JSON/XML/MD/LOG: sliced first 8 MiB view
- MP3, WAV, FLAC: HTML5 `<audio>`
- MP4, WebM, MOV: HTML5 `<video>` (actual codec support remains browser-dependent)
- SVG, JPG, JPEG, PNG: `<img>`

### Legacy Office formats

`.doc`, `.xls`, and `.ppt` are not safely renderable from a local browser `File` object using Google Docs Viewer because Google needs a publicly reachable URL. The app detects these formats and shows a clear explanation instead of uploading the file or pretending the viewer works offline.

## UX behavior

- V10 dark visual system and typography are the default.
- Dark Mode has a working toggle; Light Mode uses a neutral derived palette rather than the original yellow/orange brief.
- Reading Mode reflows document text for longer reading sessions.
- Text/document zoom changes the actual font/layout size instead of using `transform: scale()`, preventing the dead-space and clipping problem from earlier versions.
- Fullscreen hides the viewer chrome when browser fullscreen is available; the Esc key exits native fullscreen and closes the viewer when appropriate.
- File metadata persists in localStorage; browser security means the actual File object must be re-selected after a full reload.
- Clear list asks for confirmation.

## Recent fixes
- Supported files selected from the picker now open immediately in the viewer.
- The footer matches the current dark FileBroCode visual system and removes social/connect sections.
- PDF iframe controls are enabled in normal and fullscreen viewing so the browser PDF toolbar can expose page count, navigation, zoom and sidebar controls.
- File remove hover is a red close treatment with no external/AI branding.
- Light-mode theme toggle has an explicit light-surface style.
## Desktop app download

The navbar, hero and footer desktop CTA buttons are wired to `NEXT_PUBLIC_DESKTOP_DOWNLOAD_URL`. Without that environment variable they use `/downloads/FileBro-Setup-1.0.0-x64.exe`.

For local testing, place the Windows installer at `public/downloads/FileBro-Setup-1.0.0-x64.exe`. For production, set `NEXT_PUBLIC_DESKTOP_DOWNLOAD_URL` to the URL where you host the installer.
