'use client'

import React from 'react'
import { WordGenerator } from '@/components/word-generator'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-5xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Generatore di NON Parole
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Strumento professionale per generare liste di non-parole per la
            pratica fonetica.
            <br className="hidden sm:block" />
            Seleziona il numero di sillabe e configura i fonemi per iniziare.
          </p>
        </div>

        <WordGenerator />
      </div>
    </div>
  )
}
