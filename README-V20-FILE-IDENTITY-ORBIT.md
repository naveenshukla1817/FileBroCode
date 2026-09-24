# FileBroCode v20 — file identity, PDF quick capture, and orbit hero

Changes in this pass:

- Added reusable `components/FileTypeIcon.tsx` with recognizable SVG file marks for PDF, Word, Excel, PowerPoint, text/code, image, audio, video, ZIP and Figma.
- Replaced the generic app logo in the viewer header with the opened file's type icon.
- Added a PDF-only `Quick screenshot` control in the viewer header. It uses the browser Screen Capture API, asks the user to choose the current tab, then saves a PNG.
- Added `components/FileOrbit.tsx`: SVG-native, transform/SMIL-driven infinite spiral/orbit animation on the right side of the hero. It does not run a React frame loop.
- Added a static reduced-motion arrangement for users who prefer reduced motion.
- Reshaped the site header into a compact pill shell inspired by the supplied reference while keeping FileBroCode's own black/grey theme.
- Applied benefit icon accent colors requested for the desktop feature block: light yellow, sky blue, blue, and green.
- File cards now show the file-type SVG mark instead of a text-only type badge.
- Kept the existing desktop app section, footer, theme toggle, file handling, and viewer behavior intact.

Validation performed locally:

- TypeScript/TSX syntax transpilation check passed for all app/components changed or touched.
- TypeScript type-check passed with local environment shims for unavailable installed dependencies.
- PostCSS parse passed for `app/globals.css`.
- Required changed files/import targets were checked for existence.

A full `next build` was not runnable in this environment because `npm install` could not finish before the execution timeout, so the package should still be run through the project's normal dependency install/build step on the development machine.
