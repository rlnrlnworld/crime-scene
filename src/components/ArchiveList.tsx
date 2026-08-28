import { useEffect, useState } from 'react'
import { AlertTriangle, ArrowUpRight, Pin, PinOff, Trash2 } from 'lucide-react'
import { timeAgo, type HistoryEntry } from '../lib/history'

type Props = {
  entries: HistoryEntry[]
  onRestore: (sql: string) => void
  onPin: (id: string) => void
  onDelete: (id: string) => void
}

export function ArchiveList({ entries, onRestore, onPin, onDelete }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [, tick] = useState(0)

  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 30_000)
    return () => clearInterval(t)
  }, [])

  const sorted = [...entries].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return b.at - a.at
  })

  if (sorted.length === 0) {
    return (
      <div className="p-4 text-[var(--color-muted)] font-mono">
        &gt; 아직 기록이 없다. 쿼리를 실행하면 이곳에 쌓인다.
      </div>
    )
  }

  return (
    <div className="p-3 space-y-2.5">
      {sorted.map((e) => {
        const isOpen = openId === e.id
        return (
          <div
            key={e.id}
            className="border-[2px] border-[var(--color-line)] bg-[var(--color-surface)] sketchy-2 shadow-[3px_3px_0_var(--color-shadow)]"
          >
            <div className="px-3 py-2 flex items-start gap-2">
              <button
                type="button"
                onClick={() => onPin(e.id)}
                aria-label={e.pinned ? '핀 해제' : '핀'}
                className={`shrink-0 w-6 h-6 flex items-center justify-center rounded border-[1.5px] ${
                  e.pinned
                    ? 'bg-[var(--color-accent)] text-black border-[var(--color-line)]'
                    : 'bg-transparent text-[var(--color-muted)] border-[var(--color-line-dim)] hover:text-[var(--color-paper)]'
                }`}
              >
                {e.pinned ? (
                  <Pin className="w-3 h-3 fill-current" strokeWidth={2.5} />
                ) : (
                  <PinOff className="w-3 h-3" strokeWidth={2.5} />
                )}
              </button>

              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : e.id)}
                className="flex-1 min-w-0 text-left"
              >
                <div className="flex items-center gap-2 text-[13px] text-[var(--color-muted)] font-mono">
                  <span>{timeAgo(e.at)}</span>
                  {e.error ? (
                    <span className="text-[var(--color-blood)] inline-flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" strokeWidth={2.5} />
                      error
                    </span>
                  ) : e.result ? (
                    <span>
                      {e.result.rowCount} rows · {e.result.elapsedMs}ms
                    </span>
                  ) : null}
                </div>
                <pre className="mt-1 text-[14px] font-mono text-[var(--color-paper)] whitespace-pre-wrap break-all line-clamp-2">
                  {e.sql}
                </pre>
              </button>

              <div className="flex flex-col gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onRestore(e.sql)}
                  aria-label="에디터로 복원"
                  className="w-6 h-6 flex items-center justify-center rounded border-[1.5px] border-[var(--color-line-dim)] text-[var(--color-muted)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]"
                >
                  <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(e.id)}
                  aria-label="삭제"
                  className="w-6 h-6 flex items-center justify-center rounded border-[1.5px] border-[var(--color-line-dim)] text-[var(--color-muted)] hover:text-[var(--color-blood)] hover:border-[var(--color-blood)]"
                >
                  <Trash2 className="w-3 h-3" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {isOpen && (
              <div className="border-t-[1.5px] border-[var(--color-line-dim)] bg-[var(--color-ink-2)]">
                {e.error && (
                  <pre className="p-3 text-[13px] text-[var(--color-blood)] whitespace-pre-wrap font-mono">
                    {e.error}
                  </pre>
                )}
                {!e.error && e.result && e.result.rowCount > 0 && (
                  <div className="max-h-56 overflow-auto">
                    <table className="w-full border-collapse font-mono text-[13px]">
                      <thead className="sticky top-0 bg-[var(--color-ink-2)]">
                        <tr>
                          {e.result.columns.map((c) => (
                            <th
                              key={c}
                              className="text-left px-2 py-1.5 border-b-[1.5px] border-[var(--color-line-dim)] text-[var(--color-accent)] whitespace-nowrap"
                            >
                              {c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {e.result.rows.slice(0, 20).map((row, i) => (
                          <tr key={i}>
                            {row.map((cell, j) => (
                              <td
                                key={j}
                                className="px-2 py-1 border-b border-[var(--color-line-dim)]/30 text-[var(--color-paper)] whitespace-nowrap"
                              >
                                {String(cell ?? 'NULL')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {e.result.rowCount > 20 && (
                      <div className="p-2 text-[13px] text-[var(--color-muted)] font-mono text-center">
                        … +{e.result.rowCount - 20} rows
                      </div>
                    )}
                  </div>
                )}
                {!e.error &&
                  e.result &&
                  e.result.rowCount === 0 && (
                    <div className="p-3 text-[13px] text-[var(--color-muted)] font-mono">
                      &gt; 결과 없음
                    </div>
                  )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
