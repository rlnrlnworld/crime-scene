import { AlertTriangle, Archive, NotebookPen, Table2 } from 'lucide-react'
import { ArchiveList } from './ArchiveList'
import type { HistoryEntry } from '../lib/history'
import type { QueryResult } from '../lib/db'

type Tab = 'result' | 'archive'

type Props = {
  result: QueryResult | null
  error: string | null
  tab: Tab
  onTabChange: (t: Tab) => void
  history: HistoryEntry[]
  onRestore: (sql: string) => void
  onPin: (id: string) => void
  onDelete: (id: string) => void
  onOpenNotebook: () => void
}

export function ResultTable({
  result,
  error,
  tab,
  onTabChange,
  history,
  onRestore,
  onPin,
  onDelete,
  onOpenNotebook,
}: Props) {
  return (
    <div className="flex flex-col h-full bg-[var(--color-ink)]">
      <div className="px-3 py-2 border-b-[2.5px] border-[var(--color-line)] bg-[var(--color-ink-2)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <TabButton
            active={tab === 'result'}
            onClick={() => onTabChange('result')}
            icon={<Table2 className="w-4 h-4" strokeWidth={2.5} />}
            label="결과"
          />
          <TabButton
            active={tab === 'archive'}
            onClick={() => onTabChange('archive')}
            icon={<Archive className="w-4 h-4" strokeWidth={2.5} />}
            label={`기록 ${history.length}`}
          />
        </div>
        <div className="flex items-center gap-3">
          {tab === 'result' && result && (
            <span className="text-[15px] text-[var(--color-muted)] font-mono">
              {result.rowCount} rows · {result.elapsedMs}ms
            </span>
          )}
          <button
            type="button"
            onClick={onOpenNotebook}
            title="사건 수첩"
            className="inline-flex items-center gap-1.5 px-3 py-1 sketchy-tag border-[2px] font-bold text-[15px] bg-transparent text-[var(--color-muted)] border-[var(--color-line-dim)] hover:text-[var(--color-paper)] hover:border-[var(--color-line)] transition"
          >
            <NotebookPen className="w-4 h-4" strokeWidth={2.5} />
            사건 수첩
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-auto text-[15px]">
        {tab === 'result' && (
          <ResultView result={result} error={error} />
        )}
        {tab === 'archive' && (
          <ArchiveList
            entries={history}
            onRestore={onRestore}
            onPin={onPin}
            onDelete={onDelete}
          />
        )}
      </div>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1 sketchy-tag border-[2px] font-bold text-[15px] transition ${
        active
          ? 'bg-[var(--color-accent)] text-black border-[var(--color-line)]'
          : 'bg-transparent text-[var(--color-muted)] border-[var(--color-line-dim)] hover:text-[var(--color-paper)] hover:border-[var(--color-line)]'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}

function ResultView({
  result,
  error,
}: {
  result: QueryResult | null
  error: string | null
}) {
  if (error) {
    return (
      <div className="p-4 flex items-start gap-2 text-[var(--color-blood)]">
        <AlertTriangle
          className="w-4 h-4 mt-0.5 shrink-0"
          strokeWidth={2.5}
        />
        <pre className="whitespace-pre-wrap font-mono font-semibold">
          {error}
        </pre>
      </div>
    )
  }
  if (!result) {
    return (
      <div className="p-4 text-[var(--color-muted)] font-mono">
        &gt; 쿼리를 실행할 것.
      </div>
    )
  }
  if (result.rowCount === 0) {
    return (
      <div className="p-4 text-[var(--color-muted)] font-mono">
        &gt; 결과 없음.
      </div>
    )
  }
  return (
    <table className="w-full border-collapse font-mono">
      <thead className="sticky top-0 bg-[var(--color-ink-2)]">
        <tr>
          {result.columns.map((c) => (
            <th
              key={c}
              className="text-left px-3 py-2.5 border-b-[2.5px] border-[var(--color-line)] text-[var(--color-accent)] font-bold whitespace-nowrap"
            >
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {result.rows.map((row, i) => (
          <tr key={i} className="hover:bg-[var(--color-surface)]">
            {row.map((cell, j) => (
              <td
                key={j}
                className="px-3 py-2 border-b border-[var(--color-line-dim)]/30 text-[var(--color-paper)] whitespace-nowrap"
              >
                {formatCell(cell)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function formatCell(v: unknown): string {
  if (v === null || v === undefined) return 'NULL'
  if (v instanceof Date) return v.toISOString().replace('T', ' ').slice(0, 19)
  return String(v)
}
