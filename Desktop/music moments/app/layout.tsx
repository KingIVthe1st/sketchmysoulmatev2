import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MusicMoments - Turn Your Story Into a Song',
  description: 'Create full songs with lyrics and vocals using AI in seconds',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
