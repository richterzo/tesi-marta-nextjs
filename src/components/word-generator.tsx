'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import jsPDF from 'jspdf'

type SyllableCount = 2 | 3 | 4 | null

const CONSONANTI_SORDE = [
  '/p/',
  '/t/',
  '/k/',
  '/f/',
  '/s/',
  '/ʃ/',
  '/ts/',
  '/tʃ/',
]
const CONSONANTI_SONORE = [
  '/b/',
  '/d/',
  '/g/',
  '/v/',
  '/z/',
  '/dz/',
  '/dʒ/',
  '/m/',
  '/n/',
  '/ɲ/',
  '/l/',
  '/ʎ/',
  '/r/',
]

export function WordGenerator() {
  const [selectedSyllables, setSelectedSyllables] =
    useState<SyllableCount>(null)
  const [consonantiSorde, setConsonantiSorde] = useState('')
  const [consonantiSonore, setConsonantiSonore] = useState('')
  const [vocali, setVocali] = useState('')
  const [numeroDoppie, setNumeroDoppie] = useState(0)
  const [paroleGenerate, setParoleGenerate] = useState('')
  const [risultato, setRisultato] = useState('')
  const [salvaPDF, setSalvaPDF] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleSyllableSelection = (syllables: SyllableCount) => {
    setSelectedSyllables(syllables)
    setShowResults(false)
    setParoleGenerate('')
    setRisultato('')
  }

  const getInstructions = () => {
    switch (selectedSyllables) {
      case 2:
        return 'Inserire almeno due consonanti sorde, due consonanti sonore e almeno due vocali appartenenti all&apos;inventario fonetico del paziente. Si consiglia di evitare le consonanti che differiscono solo per il tratto sordo-sonoro'
      case 3:
        return 'Inserire due consonanti sorde, due consonanti sonore e almeno quattro vocali appartenenti all&apos;inventario fonetico del paziente. Si consiglia di evitare le consonanti che differiscono solo per il tratto sordo-sonoro'
      case 4:
        return 'Inserire almeno due consonanti sorde, due consonanti sonore e almeno quattro vocali appartenenti all&apos;inventario fonetico del paziente. Si consiglia di evitare le consonanti che differiscono solo per il tratto sordo-sonoro'
      default:
        return ''
    }
  }

  const generateWords = () => {
    if (!selectedSyllables) return

    const sordeArray = consonantiSorde
      .trim()
      .split(' ')
      .filter((c) => c.length > 0)
    const sonoreArray = consonantiSonore
      .trim()
      .split(' ')
      .filter((c) => c.length > 0)
    const vocaliArray = vocali
      .trim()
      .split(' ')
      .filter((v) => v.length > 0)

    if (
      sordeArray.length < 2 ||
      sonoreArray.length < 2 ||
      vocaliArray.length < 2
    ) {
      alert(
        'Per favore inserisci almeno 2 consonanti sorde, 2 sonore e 2 vocali'
      )
      return
    }

    const consonanti = sordeArray.concat(sonoreArray)
    const numeroCoppie = selectedSyllables
    const paroleGenerate: string[] = []
    let count = 0
    let countNumeroDoppie = 0
    const totalWords = selectedSyllables === 3 ? 21 : 20

    for (let j = 0; j < totalWords; j++) {
      let parola = ''
      let doppiaGiaInserita = false

      do {
        parola = ''
        for (let i = 0; i < numeroCoppie; i++) {
          let consonanteRandom =
            consonanti[Math.floor(Math.random() * consonanti.length)]
          let vocaleRandom =
            vocaliArray[Math.floor(Math.random() * vocaliArray.length)]

          // Evita ripetizioni nella stessa parola
          while (parola.includes(vocaleRandom)) {
            vocaleRandom =
              vocaliArray[Math.floor(Math.random() * vocaliArray.length)]
          }
          while (parola.includes(consonanteRandom)) {
            consonanteRandom =
              consonanti[Math.floor(Math.random() * consonanti.length)]
          }

          // Logica per consonanti doppie
          if (
            i > 0 &&
            numeroDoppie > countNumeroDoppie &&
            count % Math.floor(totalWords / numeroDoppie) === 0 &&
            !doppiaGiaInserita
          ) {
            if (selectedSyllables === 2 && i === 1) {
              consonanteRandom += ':'
              countNumeroDoppie++
              doppiaGiaInserita = true
            } else if (selectedSyllables === 3) {
              if (
                (countNumeroDoppie % 2 === 0 && i === 1) ||
                (countNumeroDoppie % 2 !== 0 && i === 2)
              ) {
                consonanteRandom += ':'
                countNumeroDoppie++
                doppiaGiaInserita = true
              }
            } else if (selectedSyllables === 4) {
              if (
                (countNumeroDoppie % 3 === 0 && i === 1) ||
                (countNumeroDoppie % 3 === 1 && i === 2) ||
                (countNumeroDoppie % 3 === 2 && i === 3)
              ) {
                consonanteRandom += ':'
                countNumeroDoppie++
                doppiaGiaInserita = true
              }
            }
          }

          // Logica per l'accento
          const shouldAddAccent = () => {
            if (selectedSyllables === 2) {
              return (count < 10 && i === 0) || (count >= 10 && i === 1)
            } else if (selectedSyllables === 3) {
              return (
                (count < 7 && i === 0) ||
                (count >= 7 && count < 14 && i === 1) ||
                (count >= 14 && i === 2)
              )
            } else if (selectedSyllables === 4) {
              return (
                (count < 5 && i === 0) ||
                (count >= 5 && count < 10 && i === 1) ||
                (count >= 10 && count < 15 && i === 2) ||
                (count >= 15 && i === 3)
              )
            }
            return false
          }

          if (shouldAddAccent()) {
            parola += '&apos;' + consonanteRandom + vocaleRandom
          } else {
            parola += consonanteRandom + vocaleRandom
          }
        }

        if (paroleGenerate.includes(parola)) {
          countNumeroDoppie--
        }
      } while (paroleGenerate.includes(parola))

      paroleGenerate.push(parola)
      count++
    }

    setParoleGenerate(paroleGenerate.join('\t'))
    setShowResults(true)
  }

  const generateLists = () => {
    const words = paroleGenerate.split('\t').filter((w) => w.trim().length > 0)

    if (words.length === 0) {
      alert('Per favore genera prima le parole')
      return
    }

    let result = ''

    for (let i = 0; i < 5; i++) {
      result += `LISTA NUMERO ${i + 1}:\n`
      const shuffled = [...words].sort(() => 0.5 - Math.random())
      result += shuffled.join('\n') + '\n\n'
    }

    setRisultato(result)

    if (salvaPDF) {
      const doc = new jsPDF('l')
      doc.setFontSize(11)

      const pageWidth = doc.internal.pageSize.width
      const columnWidth = pageWidth / 5

      for (let i = 0; i < 5; i++) {
        const lista = result.split('\n\n')[i]
        const lines = doc.splitTextToSize(lista, columnWidth - 20)
        const pageHeight = doc.internal.pageSize.height

        let y = 20

        for (let j = 0; j < lines.length; j++) {
          if (y > pageHeight) {
            doc.addPage()
            y = 20
          }
          doc.text(lines[j], columnWidth * i + 10, y)
          y += 5
        }
      }

      doc.save('parole_generate.pdf')
    }
  }

  return (
    <div className="space-y-8">
      {/* Selezione sillabe */}
      <Card>
        <CardHeader>
          <CardTitle>Seleziona il numero di sillabe</CardTitle>
          <CardDescription>
            Scegli quante sillabe devono avere le parole generate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 justify-center">
            {[2, 3, 4].map((num) => (
              <Button
                key={num}
                variant={selectedSyllables === num ? 'default' : 'outline'}
                onClick={() => handleSyllableSelection(num as SyllableCount)}
                className="min-w-32"
                aria-pressed={selectedSyllables === num}
              >
                {num} Sillabe
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configurazione input */}
      {selectedSyllables && (
        <Card>
          <CardHeader>
            <CardTitle>Configurazione fonemi</CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              {getInstructions()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Consonanti Sorde */}
            <div className="space-y-3">
              <Label
                htmlFor="consonanti-sorde"
                className="text-base font-medium"
              >
                Consonanti Sorde
              </Label>
              <p className="text-sm text-muted-foreground">
                Scegli tra: {CONSONANTI_SORDE.join(', ')}
              </p>
              <Textarea
                id="consonanti-sorde"
                placeholder="es: p t f s"
                value={consonantiSorde}
                onChange={(e) => setConsonantiSorde(e.target.value)}
                className="min-h-20"
                aria-describedby="consonanti-sorde-help"
              />
              <p
                id="consonanti-sorde-help"
                className="text-xs text-muted-foreground"
              >
                Inserisci le consonanti separate da spazi
              </p>
            </div>

            {/* Consonanti Sonore */}
            <div className="space-y-3">
              <Label
                htmlFor="consonanti-sonore"
                className="text-base font-medium"
              >
                Consonanti Sonore
              </Label>
              <p className="text-sm text-muted-foreground">
                Scegli tra: {CONSONANTI_SONORE.join(', ')}
              </p>
              <Textarea
                id="consonanti-sonore"
                placeholder="es: b d v z m n l r"
                value={consonantiSonore}
                onChange={(e) => setConsonantiSonore(e.target.value)}
                className="min-h-20"
                aria-describedby="consonanti-sonore-help"
              />
              <p
                id="consonanti-sonore-help"
                className="text-xs text-muted-foreground"
              >
                Inserisci le consonanti separate da spazi
              </p>
            </div>

            {/* Vocali */}
            <div className="space-y-3">
              <Label htmlFor="vocali" className="text-base font-medium">
                Vocali
              </Label>
              <Textarea
                id="vocali"
                placeholder="es: a e i o u"
                value={vocali}
                onChange={(e) => setVocali(e.target.value)}
                className="min-h-20"
                aria-describedby="vocali-help"
              />
              <p id="vocali-help" className="text-xs text-muted-foreground">
                Inserisci le vocali separate da spazi
              </p>
            </div>

            {/* Numero doppie */}
            <div className="space-y-3">
              <Label htmlFor="numero-doppie" className="text-base font-medium">
                Numero di parole con consonanti doppie
              </Label>
              <Input
                id="numero-doppie"
                type="number"
                min="0"
                max="10"
                value={numeroDoppie}
                onChange={(e) => setNumeroDoppie(parseInt(e.target.value) || 0)}
                className="max-w-32"
                aria-describedby="numero-doppie-help"
              />
              <p
                id="numero-doppie-help"
                className="text-xs text-muted-foreground"
              >
                Quante parole devono contenere consonanti doppie
              </p>
            </div>

            <Button onClick={generateWords} className="w-full" size="lg">
              Genera Parole
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Risultati e generazione liste */}
      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle>Parole Generate</CardTitle>
            <CardDescription>
              Puoi modificare manualmente le parole prima di generare le liste
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label
                htmlFor="parole-generate"
                className="text-base font-medium"
              >
                Non-parole generate
              </Label>
              <Textarea
                id="parole-generate"
                value={paroleGenerate}
                onChange={(e) => setParoleGenerate(e.target.value)}
                className="min-h-32 font-mono"
                aria-describedby="parole-generate-help"
              />
              <p
                id="parole-generate-help"
                className="text-xs text-muted-foreground"
              >
                Le parole sono separate da tab. Puoi modificarle se necessario.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="salva-pdf"
                checked={salvaPDF}
                onCheckedChange={(checked) => setSalvaPDF(checked as boolean)}
              />
              <Label htmlFor="salva-pdf" className="text-base font-medium">
                Salva anche in PDF
              </Label>
            </div>

            <Button onClick={generateLists} className="w-full" size="lg">
              Genera 5 Liste Randomizzate
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Risultato finale */}
      {risultato && (
        <Card>
          <CardHeader>
            <CardTitle>Liste Generate</CardTitle>
            <CardDescription>
              5 liste con ordine randomizzato delle parole
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Label
                htmlFor="risultato-finale"
                className="text-base font-medium"
              >
                Risultato
              </Label>
              <Textarea
                id="risultato-finale"
                value={risultato}
                readOnly
                className="min-h-96 font-mono text-sm"
                aria-describedby="risultato-finale-help"
              />
              <p
                id="risultato-finale-help"
                className="text-xs text-muted-foreground"
              >
                Le 5 liste sono pronte per l'uso. Se hai selezionato l'opzione
                PDF, è stato generato automaticamente.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
