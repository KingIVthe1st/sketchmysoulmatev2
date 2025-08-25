import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SongGram - AI-Powered Music Creation',
  description: 'Transform your memories into personalized AI songs with custom vocals in seconds',
  keywords: 'AI music, personalized songs, music generation, custom vocals, song creation',
  authors: [{ name: 'SongGram' }],
  creator: 'SongGram',
  publisher: 'SongGram',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SongGram',
  },
  applicationName: 'SongGram',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#8b5cf6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e1b4b' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* PWA and iOS-specific meta tags */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Prevent iOS Safari zoom on input focus */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @supports (-webkit-touch-callout: none) {
              input, textarea, select {
                font-size: 16px !important;
              }
            }
          `
        }} />
      </head>
      <body className="overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
