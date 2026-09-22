import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FileBroCode',
  description: 'Fast local document and media viewer.',
  icons: {
    icon: '/app-logo.png',
    apple: '/app-logo.png',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
