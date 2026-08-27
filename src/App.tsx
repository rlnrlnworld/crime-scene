import { useEffect, useMemo, useState } from 'react'
import { Circle, Database } from 'lucide-react'
import { CaseFileModal } from './components/CaseFileModal'
import { CaseHero } from './components/CaseHero'
import { CasePanel } from './components/CasePanel'
import { ConsoleResultSplit } from './components/ConsoleResultSplit'
import { HintsModal } from './components/HintsModal'
import { ResultTable } from './components/ResultTable'
import { SqlEditor } from './components/SqlEditor'
import { cases } from './cases'
import { resetDb, runQuery, type QueryResult } from './lib/db'
import {
  loadHistory,
  saveHistory,
  type HistoryEntry,
} from './lib/history'

function App() {
  const case_ = cases[0]
  const [ready, setReady] = useState(false)
  const [sql, setSql] = useState('SELECT * FROM members;')
  const [result, setResult] = useState<QueryResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [answer, setAnswer] = useState('')
  const [verdict, setVerdict] = useState<'correct' | 'wrong' | null>(null)
  const [caseFileOpen, setCaseFileOpen] = useState(false)
  const [hintsOpen, setHintsOpen] = useState(false)
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [history, setHistory] = useState<HistoryEntry[]>(() =>
    loadHistory(case_.id),
  )
  const [resultTab, setResultTab] = useState<'result' | 'archive'>('result')

  useEffect(() => {
    resetDb(case_.seedSql)
      .then(() => setReady(true))
      .catch((e) => setError(String(e)))
  }, [case_.seedSql])

  useEffect(() => {
    saveHistory(case_.id, history)
  }, [case_.id, history])

  const nextId = useMemo(() => {
    let n = 0
    return () => `q${Date.now().toString(36)}${(n++).toString(36)}`
  }, [])

  async function handleRun() {
    if (!ready) return
    const target = sql.trim()
    if (!target) return
    setError(null)
    const at = Date.now()
    try {
      const r = await runQuery(target)
      setResult(r)
      setHistory((h) => [
        {
          id: nextId(),
          sql: target,
          result: r,
          error: null,
          at,
          pinned: false,
        },
        ...h,
      ])
      setResultTab('result')
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setError(msg)
      setResult(null)
      setHistory((h) => [
        {
          id: nextId(),
          sql: target,
          result: null,
          error: msg,
          at,
          pinned: false,
        },
        ...h,
      ])
      setResultTab('result')
    }
  }

  function handleSubmit() {
    const normalized = answer.trim()
    setVerdict(normalized === case_.solution.answer ? 'correct' : 'wrong')
  }

  function handleRestore(s: string) {
    setSql(s)
    setResultTab('result')
  }

  function handlePin(id: string) {
    setHistory((h) =>
      h.map((e) => (e.id === id ? { ...e, pinned: !e.pinned } : e)),
    )
  }

  function handleDelete(id: string) {
    setHistory((h) => h.filter((e) => e.id !== id))
  }

  return (
    <div
      className="h-screen w-screen grid text-[15px]"
      style={{
        gridTemplateColumns: '1fr minmax(340px, 420px)',
        gridTemplateRows: 'auto auto minmax(0, 1fr)',
      }}
    >
      <header className="col-span-2 border-b-[2.5px] border-[var(--color-line)] px-5 py-3 flex items-center justify-between bg-[var(--color-ink-2)]">
        <div className="flex items-center gap-3">
          <Circle className="w-3 h-3 text-[var(--color-blood)] fill-[var(--color-blood)] animate-pulse" />
          <div className="text-[18px] tracking-wide text-[var(--color-paper)] font-bold">
            크라임씬
          </div>
          <div className="hidden md:inline-block ml-1 px-2 py-0.5 border-[2px] border-[var(--color-line)] sketchy-tag font-bold text-[15px] text-[var(--color-accent)] bg-[var(--color-surface)] -rotate-2">
            archive
          </div>
        </div>
        <div className="flex items-center gap-2 text-[15px] text-[var(--color-muted)] font-mono">
          <Database className="w-4 h-4" strokeWidth={2.5} />
          <span>{ready ? 'PGlite ready' : 'booting…'}</span>
        </div>
      </header>

      <div
        className="border-r-[2.5px] border-b-[2.5px] border-[var(--color-line)] overflow-hidden"
        style={{ gridColumn: 1, gridRow: 2 }}
      >
        <CaseHero
          case_={case_}
          onOpenFile={() => setCaseFileOpen(true)}
          onOpenHints={() => setHintsOpen(true)}
          hintsRevealed={hintsRevealed}
        />
      </div>

      <div
        className="border-l-[2.5px] border-[var(--color-line)] overflow-hidden bg-[var(--color-ink-2)]"
        style={{ gridColumn: 2, gridRow: '2 / 4' }}
      >
        <CasePanel
          case_={case_}
          answer={answer}
          onAnswerChange={setAnswer}
          onSubmit={handleSubmit}
          verdict={verdict}
        />
      </div>

      <div
        className="border-r-[2.5px] border-[var(--color-line)] overflow-hidden"
        style={{ gridColumn: 1, gridRow: 3 }}
      >
        <ConsoleResultSplit
          top={<SqlEditor value={sql} onChange={setSql} onRun={handleRun} />}
          bottom={
            <ResultTable
              result={result}
              error={error}
              tab={resultTab}
              onTabChange={setResultTab}
              history={history}
              onRestore={handleRestore}
              onPin={handlePin}
              onDelete={handleDelete}
            />
          }
        />
      </div>

      <CaseFileModal
        case_={case_}
        open={caseFileOpen}
        onClose={() => setCaseFileOpen(false)}
      />

      <HintsModal
        hints={case_.hints}
        revealed={hintsRevealed}
        open={hintsOpen}
        onClose={() => setHintsOpen(false)}
        onReveal={() =>
          setHintsRevealed((n) => Math.min(n + 1, case_.hints.length))
        }
      />
    </div>
  )
}

export default App
