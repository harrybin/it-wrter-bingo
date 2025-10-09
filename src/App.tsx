import { useState, useEffect, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toaster } from '@/components/ui/sonner'
import { Plus, Crown, ArrowCounterClockwise, Shuffle, Trash, ArrowsOut, GridNine, ListBullets } from '@phosphor-icons/react'
import { toast } from 'sonner'

const TECH_TERMS = [
  'Algorithmus',
  'Hardware', 
  'Software',
  'Daten',
  'Git',
  'Protokoll',
  'Speicher',
  'Prozessor',
  'Benutzeroberfläche',
  'Programmieren',
  'Datenbank',
  'Betriebssystem',
  'Cybersecurity',
  'Virtualisierung',
  'Cloud Computing',
  'Künstliche Intelligenz (KI)',
  'Maschinelles Lernen (ML)',
  'Datenstruktur',
  'Rekursion',
  'Kryptographie',
  'Informationssicherheit',
  'Compiler',
  'Datenanalyse',
  'Computernetzwerke',
  'Programmiersprache'
]

type BingoField = {
  id: number
  term: string
  selected: boolean
}

type WinningLine = {
  type: 'row' | 'column' | 'diagonal'
  index: number
  positions: number[]
}

type GameStats = {
  gamesPlayed: number
  bingosAchieved: number
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function generateBingoGrid(): BingoField[] {
  const shuffledTerms = shuffleArray(TECH_TERMS)
  return shuffledTerms.slice(0, 25).map((term, index) => ({
    id: index,
    term,
    selected: false
  }))
}

function checkForBingo(fields: BingoField[]): WinningLine[] {
  const winningLines: WinningLine[] = []
  
  // Check rows
  for (let row = 0; row < 5; row++) {
    const positions = Array.from({ length: 5 }, (_, col) => row * 5 + col)
    if (positions.every(pos => fields[pos].selected)) {
      winningLines.push({ type: 'row', index: row, positions })
    }
  }
  
  // Check columns
  for (let col = 0; col < 5; col++) {
    const positions = Array.from({ length: 5 }, (_, row) => row * 5 + col)
    if (positions.every(pos => fields[pos].selected)) {
      winningLines.push({ type: 'column', index: col, positions })
    }
  }
  
  // Check diagonals
  const diagonal1 = [0, 6, 12, 18, 24]
  const diagonal2 = [4, 8, 12, 16, 20]
  
  if (diagonal1.every(pos => fields[pos].selected)) {
    winningLines.push({ type: 'diagonal', index: 0, positions: diagonal1 })
  }
  
  if (diagonal2.every(pos => fields[pos].selected)) {
    winningLines.push({ type: 'diagonal', index: 1, positions: diagonal2 })
  }
  
  return winningLines
}

function App() {
  const [bingoFields, setBingoFields] = useKV<BingoField[]>('bingo-fields', [])
  const [winningLines, setWinningLines] = useState<WinningLine[]>([])
  const [gameStats, setGameStats] = useKV<GameStats>('game-stats', { gamesPlayed: 0, bingosAchieved: 0 })
  const [randomlySelectedTerms, setRandomlySelectedTerms] = useKV<string[]>('randomly-selected-terms', [])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState('bingo')

  useEffect(() => {
    if (!bingoFields || bingoFields.length === 0) {
      setBingoFields(generateBingoGrid())
    }
  }, [bingoFields, setBingoFields])

  useEffect(() => {
    if (bingoFields && bingoFields.length > 0) {
      const lines = checkForBingo(bingoFields)
      setWinningLines(lines)
      
      if (lines.length > 0 && winningLines.length === 0) {
        toast.success(`🎉 BINGO! ${lines.length === 1 ? 'Eine Linie' : `${lines.length} Linien`} geschafft!`, {
          duration: 4000,
        })
        setGameStats(prev => ({ 
          gamesPlayed: prev?.gamesPlayed || 0, 
          bingosAchieved: (prev?.bingosAchieved || 0) + lines.length 
        }))
      }
    }
  }, [bingoFields, winningLines.length, setGameStats])

  const toggleField = useCallback((fieldId: number) => {
    setBingoFields(currentFields => 
      currentFields?.map(field => 
        field.id === fieldId 
          ? { ...field, selected: !field.selected }
          : field
      ) || []
    )
  }, [setBingoFields])

  const startNewGame = useCallback(() => {
    setBingoFields(generateBingoGrid())
    setWinningLines([])
    setGameStats(prev => ({ 
      gamesPlayed: (prev?.gamesPlayed || 0) + 1, 
      bingosAchieved: prev?.bingosAchieved || 0 
    }))
    toast.success('Neues Spiel gestartet!')
  }, [setBingoFields, setGameStats])

  const resetGame = useCallback(() => {
    setBingoFields(currentFields => 
      currentFields?.map(field => ({ ...field, selected: false })) || []
    )
    setWinningLines([])
  }, [setBingoFields])

  const selectRandomTerm = useCallback(() => {
    if (!bingoFields || bingoFields.length === 0) return

    const availableTerms = bingoFields.filter(field => 
      !randomlySelectedTerms?.includes(field.term)
    )

    if (availableTerms.length === 0) {
      toast.info('Alle Begriffe wurden bereits ausgewählt!')
      return
    }

    const randomIndex = Math.floor(Math.random() * availableTerms.length)
    const selectedTerm = availableTerms[randomIndex]

    setRandomlySelectedTerms(currentTerms => [
      ...(currentTerms || []),
      selectedTerm.term
    ])

    toast.success(`Begriff ausgewählt: ${selectedTerm.term}`)
  }, [bingoFields, randomlySelectedTerms, setRandomlySelectedTerms])

  const clearRandomSelections = useCallback(() => {
    setRandomlySelectedTerms([])
    toast.success('Zufallsauswahl zurückgesetzt!')
  }, [setRandomlySelectedTerms])

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev)
  }, [])

  const isFieldInWinningLine = (fieldId: number): boolean => {
    return winningLines.some(line => line.positions.includes(fieldId))
  }

  const selectedCount = bingoFields?.filter(field => field.selected).length || 0
  const remainingRandomTerms = bingoFields?.filter(field => 
    !randomlySelectedTerms?.includes(field.term)
  ).length || 0

  if (!bingoFields || bingoFields.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Spiel wird geladen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen p-4 md:p-8 ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      <Toaster />
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Tech Bingo
            </h1>
            <Button
              onClick={toggleFullscreen}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowsOut size={16} />
              {isFullscreen ? 'Normal' : 'Vollbild'}
            </Button>
            <p className="text-muted-foreground text-lg">
              IT-Begriffe spielerisch lernen
            </p>
          </div>
          
          {/* Stats and Controls */}
          <div className="flex justify-center gap-3 flex-wrap items-center">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Ausgewählt: {selectedCount}/25
            </Badge>
            <Badge variant="outline" className="text-sm px-3 py-1">
              Spiele: {gameStats?.gamesPlayed || 0}
            </Badge>
            <Badge variant="outline" className="text-sm px-3 py-1">
              Bingos: {gameStats?.bingosAchieved || 0}
            </Badge>
            
            <Button 
              onClick={startNewGame}
              className="flex items-center gap-2 px-6"
              size="lg"
            >
              <Plus size={18} />
              Neues Spiel
            </Button>
            
            <Button 
              onClick={resetGame}
              variant="outline"
              className="flex items-center gap-2 px-6"
              size="lg"
            >
              <ArrowCounterClockwise size={18} />
              Zurücksetzen
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="bingo" className="flex items-center gap-2">
              <GridNine size={16} />
              Bingo-Feld
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <ListBullets size={16} />
              Begriff-Liste
            </TabsTrigger>
          </TabsList>

          {/* Bingo Grid Tab */}
          <TabsContent value="bingo" className="space-y-6">
            <Card className="glass-card p-4 md:p-6">
              <div className={`grid grid-cols-5 gap-2 md:gap-3 ${isFullscreen ? 'gap-4' : ''}`}>
                {bingoFields.map((field) => (
                  <button
                    key={field.id}
                    onClick={() => toggleField(field.id)}
                    className={`
                      bingo-field glass-card p-2 md:p-3 rounded-lg text-xs md:text-sm font-medium
                      ${isFullscreen ? 'min-h-24 md:min-h-28 text-base md:text-lg p-4' : 'min-h-16 md:min-h-20'}
                      flex items-center justify-center text-center
                      border-2 transition-all duration-200
                      ${field.selected ? 'selected' : ''}
                      ${isFieldInWinningLine(field.id) ? 'winning' : ''}
                    `}
                  >
                    <span className="leading-tight break-words hyphens-auto text-center block">
                      {field.term}
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Winning Status for Bingo Tab */}
            {winningLines.length > 0 && (
              <Card className="glass-card p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-secondary mb-2">
                  <Crown size={24} />
                  <span className="text-xl font-bold">BINGO!</span>
                </div>
                <p className="text-muted-foreground">
                  {winningLines.length === 1 
                    ? 'Eine Linie geschafft!' 
                    : `${winningLines.length} Linien geschafft!`
                  }
                </p>
              </Card>
            )}
          </TabsContent>

          {/* Random Term List Tab */}
          <TabsContent value="list" className="space-y-6">
            <Card className="glass-card p-4 md:p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    Zufallsauswahl
                  </h3>
                  <Badge variant="outline" className="text-sm">
                    Verfügbar: {remainingRandomTerms}/25
                  </Badge>
                </div>
                
                <div className="flex gap-3 justify-center flex-wrap">
                  <Button 
                    onClick={selectRandomTerm}
                    disabled={remainingRandomTerms === 0}
                    className="flex items-center gap-2 px-6"
                    size="lg"
                  >
                    <Shuffle size={18} />
                    Begriff wählen
                  </Button>
                  
                  {randomlySelectedTerms && randomlySelectedTerms.length > 0 && (
                    <Button 
                      onClick={clearRandomSelections}
                      variant="destructive"
                      className="flex items-center gap-2 px-6"
                      size="lg"
                    >
                      <Trash size={18} />
                      Liste löschen
                    </Button>
                  )}
                </div>

                {randomlySelectedTerms && randomlySelectedTerms.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="font-medium text-muted-foreground text-center">
                      Ausgewählte Begriffe ({randomlySelectedTerms.length})
                    </h4>
                    <div className={`grid gap-3 ${isFullscreen ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'} max-h-96 overflow-y-auto`}>
                      {randomlySelectedTerms.map((term, index) => (
                        <div 
                          key={index}
                          className={`glass-card rounded-lg text-center border border-border/50 bg-accent/20 ${isFullscreen ? 'p-6 text-lg' : 'p-3 text-sm'}`}
                        >
                          <span className="break-words hyphens-auto text-foreground font-medium">
                            {term}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-lg">
                      Noch keine Begriffe ausgewählt
                    </p>
                    <p className="text-muted-foreground text-sm mt-2">
                      Klicke auf "Begriff wählen" um zu starten
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App