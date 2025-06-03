'use client'

import React from 'react'
import { WordGenerator } from '@/components/word-generator'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Generatore di NON Parole
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Strumento per generare liste di non-parole per la pratica fonetica.
            Seleziona il numero di sillabe per iniziare.
          </p>
        </div>

        <WordGenerator />
      </div>
    </div>
  )
}
