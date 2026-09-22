# FileBroCode

A simple, client-first file viewer for opening and reading documents and media directly in your browser.

**Open a file → view it instantly → keep it private.**

## Overview

FileBroCode is a local-first file viewer built with Next.js and React.

Files are selected directly from your device and processed in the browser. The app does not require an account, database, file-upload service, or server-side document conversion for its core viewing experience.

## Features

- Open supported files directly from the file picker
- Selected files open immediately in the viewer
- Drag and drop support
- Recent/local file list
- Search, filter, and sort files
- Dark and Light modes
- Reading Mode for documents
- File metadata display
- Fullscreen document viewing
- Responsive desktop and mobile UI
- Clean, minimal FileBroCode interface
- No ads
- No login or signup
- No cloud file storage

## Supported File Formats

### Documents

- PDF
- DOCX
- XLSX
- PPTX
- TXT
- CSV
- JSON
- XML
- Markdown
- LOG

### Images

- SVG
- JPG
- JPEG
- PNG
- WEBP
- GIF

### Audio

- MP3
- WAV
- FLAC

### Video

- MP4
- WebM
- MOV

Browser codec support may vary for some audio and video files.

## Legacy Office Formats

The following formats are detected but are not rendered locally:

- `.doc`
- `.xls`
- `.ppt`

These older Office formats require a different rendering/conversion strategy. FileBroCode does not upload them to an external document viewer.

## PDF Viewer

PDF files are opened using a local object URL inside the browser PDF viewer.

The PDF viewer can expose browser-native controls such as:

- Page navigation
- Page number / total pages
- Zoom
- Sidebar / thumbnails
- Toolbar controls
- Fullscreen viewing

The exact native PDF controls depend on the browser and operating system.

## Local-First Architecture

The core flow is:

```text
User
  ↓
FileBroCode
  ↓
Device File Picker
  ↓
Browser / WebView
  ↓
Local File Processing
  ↓
Viewer
