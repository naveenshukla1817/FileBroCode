type Props = {
  extension: string
  size?: number
  className?: string
}

const ext = (value: string) => value.replace(/^\./, '').toLowerCase()

export default function FileTypeIcon({ extension, size = 32, className = '' }: Props) {
  const e = ext(extension)

  if (e === 'pdf') {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <rect x="5" y="3" width="30" height="34" rx="7" fill="#D93025" />
        <path d="M13 28.7c5.8-1.7 9.1-6.6 10.3-13.5.6-3.2-1.4-5-3.2-3.8-2.1 1.4-1.3 5.6.4 8.7 1.9 3.5 4.8 5.6 8.4 6.8" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <path d="M11.4 29.7c2.7-1.4 7.3-2.3 11.5-1.2 3.8 1 5.4 2.4 6.4 3.2" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }

  if (e === 'docx' || e === 'doc') {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <path d="M8 3h17l7 7v27H8z" fill="#2B74C8" />
        <path d="M25 3v8h7" fill="#67A2E7" />
        <text x="20" y="27" textAnchor="middle" fill="#fff" fontSize="17" fontWeight="800" fontFamily="Arial, sans-serif">W</text>
      </svg>
    )
  }

  if (e === 'xlsx' || e === 'xls') {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <path d="M8 3h17l7 7v27H8z" fill="#1F9D55" />
        <path d="M25 3v8h7" fill="#57C57D" />
        <text x="20" y="27" textAnchor="middle" fill="#fff" fontSize="17" fontWeight="800" fontFamily="Arial, sans-serif">X</text>
      </svg>
    )
  }

  if (e === 'pptx' || e === 'ppt') {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <path d="M8 3h17l7 7v27H8z" fill="#D95F35" />
        <path d="M25 3v8h7" fill="#F18C69" />
        <text x="20" y="27" textAnchor="middle" fill="#fff" fontSize="17" fontWeight="800" fontFamily="Arial, sans-serif">P</text>
      </svg>
    )
  }

  if (e === 'mp3' || e === 'wav' || e === 'flac') {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <rect x="4" y="4" width="32" height="32" rx="9" fill="#C83B92" />
        <path d="M12 17.2v5.6M16 14v12M20 11v18M24 15v10M28 17.2v5.6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    )
  }

  if (e === 'mp4' || e === 'webm' || e === 'mov' || e === 'mkv') {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <rect x="4" y="4" width="32" height="32" rx="9" fill="#2E7DD7" />
        <path d="m16 12.5 11 7.5-11 7.5Z" fill="#fff" />
      </svg>
    )
  }

  if (e === 'png' || e === 'jpg' || e === 'jpeg' || e === 'webp' || e === 'gif' || e === 'svg') {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <rect x="4" y="4" width="32" height="32" rx="9" fill="#7A55D7" />
        <circle cx="14" cy="14" r="3" fill="#fff" />
        <path d="m9 29 8-8 5 5 3-3 6 6H9Z" fill="#fff" opacity=".94" />
      </svg>
    )
  }

  if (e === 'code') {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <rect x="4" y="4" width="32" height="32" rx="9" fill="#242B33" />
        <path d="m16 12-7 8 7 8M24 12l7 8-7 8" fill="none" stroke="#9CDCFE" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (e === 'figma') {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <path d="M13 4h7v10h-7a5 5 0 1 1 0-10Z" fill="#F24E1E" />
        <path d="M20 4h7a5 5 0 1 1 0 10h-7V4Z" fill="#FF7262" />
        <path d="M13 14h7v10h-7a5 5 0 1 1 0-10Z" fill="#A259FF" />
        <circle cx="25" cy="19" r="5" fill="#1ABCFE" />
        <path d="M13 24h7v7a5 5 0 1 1-7-7Z" fill="#0ACF83" />
      </svg>
    )
  }

  if (e === 'zip') {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <path d="M9 3h22v34H9z" fill="#D89B2B" />
        <path d="M18 3h4v5h-4zm0 7h4v5h-4zm0 7h4v5h-4zm0 7h4v5h-4z" fill="#fff" />
        <path d="M17 32h6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }

  if (e === 'json' || e === 'xml' || e === 'md' || e === 'log') {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <rect x="4" y="4" width="32" height="32" rx="9" fill="#334A5C" />
        <path d="M14 12 9 20l5 8M26 12l5 8-5 8M23 11l-6 18" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (e === 'csv' || e === 'txt') {
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
        <path d="M8 3h17l7 7v27H8z" fill="#707780" />
        <path d="M25 3v8h7" fill="#9AA0A8" />
        <path d="M13 16h14M13 22h14M13 28h9" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".94" />
      </svg>
    )
  }

  return (
    <svg className={className} width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <path d="M8 3h17l7 7v27H8z" fill="#6A6F75" />
      <path d="M25 3v8h7" fill="#9AA0A8" />
      <path d="M13 18h14M13 24h11M13 30h7" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".94" />
    </svg>
  )
}
