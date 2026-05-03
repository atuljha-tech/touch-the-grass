import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { DemoAuthProvider } from '@/contexts/DemoAuthContext'
import { AppStoreProvider } from '@/contexts/AppStoreContext'
import { ProjectsProvider } from '@/contexts/ProjectsContext'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500"]
});

export const metadata: Metadata = {
  title: 'TouchTheGrass — Build Beyond the Noise',
  description: 'From hackathons to real-world impact — showcase your work, find your team, and grow alongside builders who care.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#004466',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <DemoAuthProvider>
          <AppStoreProvider>
            {children}
          </AppStoreProvider>
        </DemoAuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
