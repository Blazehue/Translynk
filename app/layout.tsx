import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import TranslatorClient from './translator-client'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Translynk — AI Translator',
  description: 'Advanced AI-powered translator with speech recognition, OCR, and voice synthesis',
  generator: 'v0.app',
  themeColor: '#00f6ff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} site`}>
        <header className="site-header">
          <div className="container header-inner">
            <div className="brand">
              <div className="logo" aria-hidden>🌐</div>
              <div>
                <h1 className="title">Translynk</h1>
                <p className="subtitle">Speak • Translate • Listen • OCR</p>
              </div>
            </div>
            <nav className="nav">
              <a href="#" className="nav-link">Translate</a>
              <a href="#" className="nav-link">History</a>
              <a href="#" className="nav-link">About</a>
            </nav>
          </div>
        </header>

        <main className="container">
          <section className="card main-card" aria-labelledby="translator-heading">
            <h2 id="translator-heading" className="card-title">Translator</h2>
            <TranslatorClient />
          </section>
        </main>

        <footer className="site-footer">
          <div className="container">
            <p className="muted">© {new Date().getFullYear()} Translynk</p>
          </div>
        </footer>

        <Analytics />
      </body>
    </html>
  )
}
