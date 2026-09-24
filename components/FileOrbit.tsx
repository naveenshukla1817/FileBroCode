'use client'

import FileTypeIcon from '@/components/FileTypeIcon'

type FloatItem = {
  extension: string
  size: number
  className: string
  duration: number
  delay: number
  opacity: number
  blur?: number
}

// Video-reference treatment: a dense field of file logos drifting through the hero
// on calm diagonal/curved trajectories. There is no orbit ring and no central logo.
// Each item is CSS-animated, so React does not re-render per frame.
const items: FloatItem[] = [
  { extension: 'pdf', size: 44, className: 'float-a', duration: 17, delay: -8, opacity: .92 },
  { extension: 'xlsx', size: 42, className: 'float-b', duration: 19, delay: -13, opacity: .88 },
  { extension: 'pptx', size: 38, className: 'float-c', duration: 16, delay: -4, opacity: .90 },
  { extension: 'docx', size: 50, className: 'float-d', duration: 21, delay: -17, opacity: .93 },
  { extension: 'code', size: 42, className: 'float-e', duration: 18, delay: -11, opacity: .82 },
  { extension: 'mp4', size: 46, className: 'float-f', duration: 20, delay: -6, opacity: .90 },
  { extension: 'png', size: 48, className: 'float-g', duration: 22, delay: -15, opacity: .86 },
  { extension: 'mp3', size: 36, className: 'float-h', duration: 15, delay: -2, opacity: .84 },
  { extension: 'zip', size: 39, className: 'float-i', duration: 23, delay: -19, opacity: .82 },
  { extension: 'txt', size: 34, className: 'float-j', duration: 18, delay: -10, opacity: .68, blur: 1.2 },
  { extension: 'figma', size: 40, className: 'float-k', duration: 20, delay: -16, opacity: .83 },
  { extension: 'mkv', size: 38, className: 'float-l', duration: 24, delay: -9, opacity: .76, blur: 1 },
  { extension: 'jpg', size: 36, className: 'float-m', duration: 17, delay: -14, opacity: .82 },
  { extension: 'json', size: 43, className: 'float-n', duration: 22, delay: -3, opacity: .76 },
  { extension: 'csv', size: 37, className: 'float-o', duration: 19, delay: -18, opacity: .72, blur: 1 },
  { extension: 'pdf', size: 52, className: 'float-p', duration: 25, delay: -21, opacity: .86 },
  { extension: 'docx', size: 30, className: 'float-q', duration: 16, delay: -7, opacity: .56, blur: 2 },
  { extension: 'xlsx', size: 31, className: 'float-r', duration: 18, delay: -12, opacity: .60, blur: 1.8 },
  { extension: 'pptx', size: 32, className: 'float-s', duration: 21, delay: -1, opacity: .58, blur: 2 },
  { extension: 'mp4', size: 33, className: 'float-t', duration: 23, delay: -20, opacity: .64, blur: 1.5 },
  { extension: 'png', size: 28, className: 'float-u', duration: 17, delay: -5, opacity: .50, blur: 2 },
  { extension: 'zip', size: 29, className: 'float-v', duration: 20, delay: -15, opacity: .55, blur: 1.8 },
  { extension: 'code', size: 35, className: 'float-w', duration: 24, delay: -8, opacity: .70 },
  { extension: 'mp3', size: 31, className: 'float-x', duration: 19, delay: -6, opacity: .66 },
  { extension: 'jpg', size: 34, className: 'float-y', duration: 22, delay: -14, opacity: .72 },
  { extension: 'txt', size: 30, className: 'float-z', duration: 18, delay: -17, opacity: .58, blur: 1.5 },
  { extension: 'pdf', size: 40, className: 'float-aa', duration: 20, delay: -9, opacity: .74 },
  { extension: 'docx', size: 34, className: 'float-ab', duration: 22, delay: -2, opacity: .66, blur: .8 },
  { extension: 'xlsx', size: 37, className: 'float-ac', duration: 18, delay: -15, opacity: .70 },
  { extension: 'pptx', size: 36, className: 'float-ad', duration: 24, delay: -6, opacity: .68 },
  { extension: 'mp4', size: 39, className: 'float-ae', duration: 21, delay: -12, opacity: .72 },
  { extension: 'png', size: 35, className: 'float-af', duration: 19, delay: -4, opacity: .67 },
  { extension: 'mp3', size: 33, className: 'float-ag', duration: 23, delay: -18, opacity: .63 },
  { extension: 'zip', size: 32, className: 'float-ah', duration: 17, delay: -7, opacity: .61 },
  { extension: 'json', size: 38, className: 'float-ai', duration: 25, delay: -14, opacity: .64, blur: .8 },
  { extension: 'figma', size: 35, className: 'float-aj', duration: 20, delay: -20, opacity: .69 },
  { extension: 'jpg', size: 31, className: 'float-ak', duration: 22, delay: -11, opacity: .59, blur: 1 },
  { extension: 'code', size: 37, className: 'float-al', duration: 19, delay: -3, opacity: .65 },
]

export default function FileOrbit() {
  return (
    <div className="file-orbit" aria-hidden="true">
      <div className="file-marquee-wash" />
      <div className="file-marquee-field">
        {items.map((item) => (
          <span
            key={`${item.className}-${item.extension}`}
            className={`file-float-item ${item.className}`}
            style={{
              ['--float-duration' as string]: `${item.duration}s`,
              ['--float-delay' as string]: `${item.delay}s`,
              ['--float-opacity' as string]: item.opacity,
              ['--float-blur' as string]: `${item.blur ?? 0}px`,
            }}
          >
            <FileTypeIcon extension={item.extension} size={item.size} />
          </span>
        ))}
      </div>
    </div>
  )
}
