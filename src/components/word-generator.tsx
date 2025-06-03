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
import { FileDown, Plus } from 'lucide-react'

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

const VOCALI_COMUNI = ['/a/', '/e/', '/i/', '/o/', '/u/']

export function WordGenerator() {
  const [selectedSyllables, setSelectedSyllables] =
    useState<SyllableCount>(null)
  const [consonantiSorde, setConsonantiSorde] = useState('')
  const [consonantiSonore, setConsonantiSonore] = useState('')
  const [vocali, setVocali] = useState('')
  const [numeroDoppie, setNumeroDoppie] = useState(0)
  const [paroleGenerate, setParoleGenerate] = useState('')
  const [risultato, setRisultato] = useState('')
  const [salvaPDF, setSalvaPDF] = useState(true)
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
        return '⚠️ Requisiti minimi: almeno 2 consonanti sorde, 2 consonanti sonore e 2 vocali. Si consiglia di evitare le consonanti che differiscono solo per il tratto sordo-sonoro.'
      case 3:
        return '⚠️ Requisiti minimi: almeno 2 consonanti sorde, 2 consonanti sonore e 4 vocali. Si consiglia di evitare le consonanti che differiscono solo per il tratto sordo-sonoro.'
      case 4:
        return '⚠️ Requisiti minimi: almeno 2 consonanti sorde, 2 consonanti sonore e 4 vocali. Si consiglia di evitare le consonanti che differiscono solo per il tratto sordo-sonoro.'
      default:
        return ''
    }
  }

  const getMinVocali = () => {
    return selectedSyllables === 2 ? 2 : 4
  }

  const addPhoneme = (phoneme: string, type: 'sorde' | 'sonore' | 'vocali') => {
    const cleanPhoneme = phoneme.replace(/\//g, '')

    switch (type) {
      case 'sorde':
        if (!consonantiSorde.includes(cleanPhoneme)) {
          setConsonantiSorde((prev) =>
            prev ? `${prev} ${cleanPhoneme}` : cleanPhoneme
          )
        }
        break
      case 'sonore':
        if (!consonantiSonore.includes(cleanPhoneme)) {
          setConsonantiSonore((prev) =>
            prev ? `${prev} ${cleanPhoneme}` : cleanPhoneme
          )
        }
        break
      case 'vocali':
        if (!vocali.includes(cleanPhoneme)) {
          setVocali((prev) => (prev ? `${prev} ${cleanPhoneme}` : cleanPhoneme))
        }
        break
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

    const minVocali = getMinVocali()

    if (
      sordeArray.length < 2 ||
      sonoreArray.length < 2 ||
      vocaliArray.length < minVocali
    ) {
      alert(
        `⚠️ Requisiti non soddisfatti!\n\nInserisci almeno:\n• 2 consonanti sorde (attualmente: ${sordeArray.length})\n• 2 consonanti sonore (attualmente: ${sonoreArray.length})\n• ${minVocali} vocali (attualmente: ${vocaliArray.length})`
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

          // Logica migliorata per consonanti doppie
          if (
            i > 0 &&
            numeroDoppie > 0 &&
            countNumeroDoppie < numeroDoppie &&
            !doppiaGiaInserita
          ) {
            const shouldAddDouble =
              Math.random() <
              (numeroDoppie - countNumeroDoppie) / (totalWords - j)

            if (shouldAddDouble) {
              if (selectedSyllables === 2 && i === 1) {
                consonanteRandom += ':'
                countNumeroDoppie++
                doppiaGiaInserita = true
              } else if (selectedSyllables === 3 && (i === 1 || i === 2)) {
                consonanteRandom += ':'
                countNumeroDoppie++
                doppiaGiaInserita = true
              } else if (
                selectedSyllables === 4 &&
                (i === 1 || i === 2 || i === 3)
              ) {
                consonanteRandom += ':'
                countNumeroDoppie++
                doppiaGiaInserita = true
              }
            }
          }

          // Logica per l'accento - USO APOSTROFO NORMALE
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
            parola += "'" + consonanteRandom + vocaleRandom
          } else {
            parola += consonanteRandom + vocaleRandom
          }
        }

        if (paroleGenerate.includes(parola)) {
          if (doppiaGiaInserita) countNumeroDoppie--
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
      generatePDF(result, words)
    }
  }

  const generatePDF = (result: string, words: string[]) => {
    try {
      const doc = new jsPDF('p', 'mm', 'a4')

      // Impostazioni per il PDF
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')

      // Titolo
      doc.text('Liste di Non-Parole per Pratica Fonetica', 105, 20, {
        align: 'center',
      })

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(
        `Parole ${selectedSyllables}-sillabiche • ${
          words.length
        } parole • ${new Date().toLocaleDateString('it-IT')}`,
        105,
        30,
        { align: 'center' }
      )

      let yPosition = 45
      const pageHeight = 280
      // const columnWidth = 90
      const leftMargin = 15
      const rightMargin = 105

      // Divide le liste in due colonne
      const lists = result.split('\n\n').filter((list) => list.trim())

      for (let i = 0; i < lists.length; i++) {
        const lista = lists[i].trim()
        const lines = lista.split('\n')

        // Determina la colonna (sinistra per liste dispari, destra per pari)
        const isLeftColumn = i % 2 === 0
        const xPosition = isLeftColumn ? leftMargin : rightMargin

        // Se siamo nella colonna sinistra e non è la prima lista, potrebbe servire una nuova pagina
        if (
          isLeftColumn &&
          i > 0 &&
          yPosition + lines.length * 5 > pageHeight
        ) {
          doc.addPage()
          yPosition = 20
        }

        // Se siamo nella colonna destra, usa la stessa y della colonna sinistra
        if (!isLeftColumn) {
          yPosition = yPosition - lists[i - 1].split('\n').length * 4.5 - 8
        }

        // Titolo della lista
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(11)
        doc.text(lines[0], xPosition, yPosition)
        yPosition += 8

        // Parole della lista
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)

        for (let j = 1; j < lines.length; j++) {
          if (lines[j].trim()) {
            doc.text(lines[j], xPosition, yPosition)
            yPosition += 4.5
          }
        }

        // Se siamo nella colonna sinistra, lascia spazio per la colonna destra
        if (isLeftColumn) {
          yPosition += 8
        } else {
          // Se siamo nella colonna destra, vai alla riga successiva
          yPosition += 15
        }
      }

      // Salva il PDF con nome più descrittivo
      const fileName = `non-parole-${selectedSyllables}sill-${
        new Date().toISOString().split('T')[0]
      }.pdf`
      doc.save(fileName)

      // Feedback all'utente
      alert(`✅ PDF generato con successo!\nFile: ${fileName}`)
    } catch (error) {
      console.error('Errore nella generazione del PDF:', error)
      alert('❌ Errore nella generazione del PDF. Riprova.')
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Selezione sillabe */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl sm:text-2xl text-center">
            Seleziona il numero di sillabe
          </CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            Scegli quante sillabe devono avere le parole generate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {[2, 3, 4].map((num) => (
              <Button
                key={num}
                variant={selectedSyllables === num ? 'default' : 'outline'}
                onClick={() => handleSyllableSelection(num as SyllableCount)}
                className="w-full sm:w-auto min-w-[120px] h-12 text-base font-medium"
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
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">
              Configurazione fonemi
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed p-3 bg-amber-50 border border-amber-200 rounded-lg">
              {getInstructions()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Consonanti Sorde */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">
                  Consonanti Sorde
                  <span className="text-sm text-muted-foreground ml-2">
                    (min. 2)
                  </span>
                </Label>
                <div className="text-xs text-muted-foreground">
                  Selezionate:{' '}
                  {
                    consonantiSorde
                      .trim()
                      .split(' ')
                      .filter((c) => c.length > 0).length
                  }
                  /2+
                </div>
              </div>

              <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg">
                {CONSONANTI_SORDE.map((consonante) => (
                  <Button
                    key={consonante}
                    variant="outline"
                    size="sm"
                    onClick={() => addPhoneme(consonante, 'sorde')}
                    className="h-8 px-3 text-sm"
                    disabled={consonantiSorde.includes(
                      consonante.replace(/\//g, '')
                    )}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {consonante}
                  </Button>
                ))}
              </div>

              <Textarea
                placeholder="es: p t f s"
                value={consonantiSorde}
                onChange={(e) => setConsonantiSorde(e.target.value)}
                className="min-h-[60px] text-base"
              />
              <p className="text-xs text-muted-foreground">
                Inserisci le consonanti separate da spazi o usa i bottoni sopra
              </p>
            </div>

            {/* Consonanti Sonore */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">
                  Consonanti Sonore
                  <span className="text-sm text-muted-foreground ml-2">
                    (min. 2)
                  </span>
                </Label>
                <div className="text-xs text-muted-foreground">
                  Selezionate:{' '}
                  {
                    consonantiSonore
                      .trim()
                      .split(' ')
                      .filter((c) => c.length > 0).length
                  }
                  /2+
                </div>
              </div>

              <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg">
                {CONSONANTI_SONORE.map((consonante) => (
                  <Button
                    key={consonante}
                    variant="outline"
                    size="sm"
                    onClick={() => addPhoneme(consonante, 'sonore')}
                    className="h-8 px-3 text-sm"
                    disabled={consonantiSonore.includes(
                      consonante.replace(/\//g, '')
                    )}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {consonante}
                  </Button>
                ))}
              </div>

              <Textarea
                placeholder="es: b d v z m n l r"
                value={consonantiSonore}
                onChange={(e) => setConsonantiSonore(e.target.value)}
                className="min-h-[60px] text-base"
              />
              <p className="text-xs text-muted-foreground">
                Inserisci le consonanti separate da spazi o usa i bottoni sopra
              </p>
            </div>

            {/* Vocali */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">
                  Vocali
                  <span className="text-sm text-muted-foreground ml-2">
                    (min. {getMinVocali()})
                  </span>
                </Label>
                <div className="text-xs text-muted-foreground">
                  Selezionate:{' '}
                  {
                    vocali
                      .trim()
                      .split(' ')
                      .filter((v) => v.length > 0).length
                  }
                  /{getMinVocali()}+
                </div>
              </div>

              <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg">
                {VOCALI_COMUNI.map((vocale) => (
                  <Button
                    key={vocale}
                    variant="outline"
                    size="sm"
                    onClick={() => addPhoneme(vocale, 'vocali')}
                    className="h-8 px-3 text-sm"
                    disabled={vocali.includes(vocale.replace(/\//g, ''))}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {vocale}
                  </Button>
                ))}
              </div>

              <Textarea
                placeholder="es: a e i o u"
                value={vocali}
                onChange={(e) => setVocali(e.target.value)}
                className="min-h-[60px] text-base"
              />
              <p className="text-xs text-muted-foreground">
                Inserisci le vocali separate da spazi o usa i bottoni sopra
              </p>
            </div>

            {/* Numero doppie */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Numero di parole con consonanti doppie
              </Label>
              <Input
                type="number"
                min="0"
                max="15"
                value={numeroDoppie || ''}
                onChange={(e) => setNumeroDoppie(parseInt(e.target.value) || 0)}
                className="max-w-32 h-12 text-base"
              />
              <p className="text-xs text-muted-foreground">
                Quante parole devono contenere consonanti doppie (max 15)
              </p>
            </div>

            <Button
              onClick={generateWords}
              className="w-full h-12 text-base font-medium"
              size="lg"
            >
              Genera Parole
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Risultati e generazione liste */}
      {showResults && (
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">
              Parole Generate
            </CardTitle>
            <CardDescription className="text-sm">
              Puoi modificare manualmente le parole prima di generare le liste
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Non-parole generate
              </Label>
              <Textarea
                value={paroleGenerate}
                onChange={(e) => setParoleGenerate(e.target.value)}
                className="min-h-32 font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Le parole sono separate da tab. Puoi modificarle se necessario.
              </p>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
              <Checkbox
                id="salva-pdf"
                checked={salvaPDF}
                onCheckedChange={(checked) => setSalvaPDF(!!checked)}
                className="h-5 w-5"
              />
              <div className="flex-1">
                <Label
                  htmlFor="salva-pdf"
                  className="text-base font-medium cursor-pointer flex items-center"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Genera automaticamente PDF professionale
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF ottimizzato per la stampa con layout a due colonne
                </p>
              </div>
            </div>

            <Button
              onClick={generateLists}
              className="w-full h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              size="lg"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Genera 5 Liste Randomizzate
              {salvaPDF && ' + PDF'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Risultato finale */}
      {risultato && (
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">Liste Generate</CardTitle>
            <CardDescription className="text-sm">
              5 liste con ordine randomizzato delle parole
              {salvaPDF && ' • PDF generato automaticamente'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Label className="text-base font-medium">Risultato</Label>
              <Textarea
                value={risultato}
                readOnly
                className="min-h-96 font-mono text-xs leading-relaxed"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground p-3 bg-green-50 border border-green-200 rounded-lg">
                <span>✅ Le 5 liste sono pronte per l'uso</span>
                {salvaPDF && <span>📄 PDF salvato automaticamente</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
