import { useEffect, useMemo, useState } from 'react'
import { CaseFileModal } from './CaseFileModal'
import { CaseHero } from './CaseHero'
import { CasePanel } from './CasePanel'
import { ConsoleResultSplit } from './ConsoleResultSplit'
import { HintsModal } from './HintsModal'
import { NotebookModal } from './NotebookModal'
import { ResultTable } from './ResultTable'
import { SolvedOverlay } from './SolvedOverlay'
import { SqlEditor } from './SqlEditor'
import type { Case } from '../cases'
import { resetDb, runQuery, type QueryResult } from '../lib/db'
import {
  loadHintsRevealed,
  loadHistory,
  markSolved,
  saveHintsRevealed,
  saveHistory,
  type HistoryEntry,
} from '../lib/history'

type Props = {
  case_: Case
}

export function CaseView({ case_ }: Props) {
  const [ready, setReady] = useState(false)
  const [sql, setSql] = useState(case_.starterSql ?? '')
  const [result, setResult] = useState<QueryResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [answer, setAnswer] = useState('')
  const [verdict, setVerdict] = useState<'correct' | 'wrong' | null>(null)
  const [caseFileOpen, setCaseFileOpen] = useState(false)
  const [hintsOpen, setHintsOpen] = useState(false)
  const [notebookOpen, setNotebookOpen] = useState(false)
  const [solvedOverlayOpen, setSolvedOverlayOpen] = useState(false)
  const [hintsRevealed, setHintsRevealed] = useState(() =>
    loadHintsRevealed(case_.id),
  )
  const [history, setHistory] = useState<HistoryEntry[]>(() =>
    loadHistory(case_.id),
  )
  const [resultTab, setResultTab] = useState<'result' | 'archive'>('result')

  useEffect(() => {
    setReady(false)
    resetDb(case_.seedSql)
      .then(() => setReady(true))
      .catch((e) => setError(String(e)))
  }, [case_.seedSql])

  useEffect(() => {
    saveHistory(case_.id, history)
  }, [case_.id, history])

  useEffect(() => {
    saveHintsRevealed(case_.id, hintsRevealed)
  }, [case_.id, hintsRevealed])

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
    const correct = normalized === case_.solution.answer
    setVerdict(correct ? 'correct' : 'wrong')
    if (correct) {
      markSolved(case_.id)
      setSolvedOverlayOpen(true)
    }
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
    <div className="relative h-full w-full">
    <div
      className="h-full w-full grid text-[15px] bg-[var(--color-ink)]"
      style={{
        gridTemplateColumns: '1fr minmax(340px, 420px)',
        gridTemplateRows: 'auto minmax(0, 1fr)',
      }}
    >
      <div
        className="border-r-[2.5px] border-b-[2.5px] border-[var(--color-line)] overflow-hidden"
        style={{ gridColumn: 1, gridRow: 1 }}
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
        style={{ gridColumn: 2, gridRow: '1 / 3' }}
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
        style={{ gridColumn: 1, gridRow: 2 }}
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
              onOpenNotebook={() => setNotebookOpen(true)}
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

      <NotebookModal
        open={notebookOpen}
        caseId={case_.id}
        caseTitle={case_.title}
        onClose={() => setNotebookOpen(false)}
      />
    </div>

    {solvedOverlayOpen && (
      <SolvedOverlay
        answer={case_.solution.answer}
        onClose={() => setSolvedOverlayOpen(false)}
      />
    )}
    </div>
  )
}
