import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Generatore di NON Parole - Strumento per la Pratica Fonetica',
  description:
    'Strumento per la generazione di liste di non-parole per la pratica fonetica. Supporta parole bi, tri e quadrisillabiche con controllo di consonanti e vocali.',
  keywords:
    'fonetica, logopedia, non-parole, generatore, pratica fonetica, sillabe',
  authors: [{ name: 'Tesi Marta' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Skip link per migliorare l'accessibilità */}
        <a href="#main-content" className="skip-link">
          Vai al contenuto principale
        </a>

        <div id="root">
          <header role="banner" className="sr-only">
            <h1>Generatore di NON Parole</h1>
          </header>

          <main id="main-content" role="main">
            {children}
          </main>

          <footer
            role="contentinfo"
            className="mt-16 py-8 text-center text-sm text-muted-foreground border-t"
          >
            <p>
              Strumento per la generazione di liste di non-parole per la pratica
              fonetica
            </p>
          </footer>
        </div>
      </body>
    </html>
  )
}
