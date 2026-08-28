import { useEffect, useRef, useState } from 'react'
import { NotebookPen, Trash2, Plus } from 'lucide-react'
import { track } from '@vercel/analytics'
import { Button } from './Button'
import { loadNotes, saveNotes, type Note } from '../lib/notes'
import { timeAgo } from '../lib/history'

type Props = {
  open: boolean
  caseId: string
  caseTitle: string
  onClose: () => void
}

export function NotebookModal({ open, caseId, caseTitle, onClose }: Props) {
  const [notes, setNotes] = useState<Note[]>([])
  const [draft, setDraft] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!open) return
    setNotes(loadNotes(caseId))
  }, [open, caseId])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const id = requestAnimationFrame(() => textareaRef.current?.focus())
    return () => cancelAnimationFrame(id)
  }, [open])

  if (!open) return null

  function addNote() {
    const text = draft.trim()
    if (!text) return
    const note: Note = {
      id: crypto.randomUUID(),
      text,
      at: Date.now(),
    }
    const next = [note, ...notes]
    setNotes(next)
    saveNotes(caseId, next)
    track('notebook_note_added', { caseId, count: next.length })
    setDraft('')
    const el = textareaRef.current
    if (el) {
      el.value = ''
      el.blur()
      requestAnimationFrame(() => el.focus())
    }
  }

  function removeNote(id: string) {
    const next = notes.filter((n) => n.id !== id)
    setNotes(next)
    saveNotes(caseId, next)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.nativeEvent.isComposing) return
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      addNote()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-8 md:p-12 bg-black/55 backdrop-blur-[3px]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-full flex"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-4 -left-3 z-10 px-3 py-1 border-[2.5px] border-[var(--color-line)] bg-[var(--color-accent)] text-black font-bold text-[15px] sketchy-tag -rotate-[5deg] shadow-[3px_3px_0_var(--color-shadow)] inline-flex items-center gap-1.5">
          <NotebookPen className="w-3.5 h-3.5" strokeWidth={2.5} />
          CASE NOTEBOOK
        </div>

        <div className="w-full max-h-full overflow-hidden sketchy border-[2.5px] border-[var(--color-line)] bg-[var(--color-surface)] shadow-[6px_6px_0_rgba(0,0,0,0.7)] flex flex-col">
          <div className="relative px-8 pt-8 pb-5 border-b-[2.5px] border-[var(--color-line)] shrink-0">
            <div className="flex items-center gap-2 text-[15px] text-[var(--color-muted)] font-mono">
              <span>notebook</span>
              <span className="text-[var(--color-accent)]">#{caseId}</span>
            </div>
            <h2 className="mt-2 text-[28px] md:text-[32px] font-bold text-[var(--color-paper)] leading-[1.1] tracking-tight">
              사건 수첩
            </h2>
            <p className="mt-3 text-[16px] text-[var(--color-paper)]/85 leading-relaxed">
              {caseTitle} 관련 단서나 추리를 기록하라.
            </p>
          </div>

          <div className="px-8 py-5 border-b-[2.5px] border-[var(--color-line)] shrink-0 bg-[var(--color-ink-2)]">
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="새 메모..."
              rows={3}
              className="w-full resize-none text-[15px] text-[var(--color-paper)] bg-[var(--color-ink)] border-[2px] border-[var(--color-line-dim)] rounded px-3 py-2 focus:outline-none focus:border-[var(--color-accent)] placeholder:text-[var(--color-muted)] font-mono leading-relaxed"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[13px] text-[var(--color-muted)] font-mono">
                ⌘ / Ctrl + Enter 로 추가
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={addNote}
                disabled={!draft.trim()}
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                추가
              </Button>
            </div>
          </div>

          <div className="overflow-auto px-8 py-6 flex-1 min-h-[200px]">
            {notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <NotebookPen
                  className="w-10 h-10 text-[var(--color-line-dim)] mb-3"
                  strokeWidth={1.5}
                />
                <p className="text-[15px] text-[var(--color-muted)]">
                  아직 메모가 없다.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {notes.map((n, i) => (
                  <li
                    key={n.id}
                    className={`group relative p-4 pr-12 border-[2px] border-[var(--color-line)] sketchy-${
                      (i % 3) + 1
                    } bg-[var(--color-ink-2)] shadow-[3px_3px_0_var(--color-shadow)]`}
                  >
                    <div className="text-[13px] font-mono text-[var(--color-accent)] mb-1.5">
                      {timeAgo(n.at)}
                    </div>
                    <div className="text-[15px] text-[var(--color-paper)] whitespace-pre-wrap leading-relaxed">
                      {n.text}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNote(n.id)}
                      aria-label="메모 삭제"
                      className="absolute top-3 right-3 w-7 h-7 rounded-md bg-[var(--color-surface)] border-[1.5px] border-[var(--color-line-dim)] text-[var(--color-muted)] flex items-center justify-center hover:bg-[var(--color-blood)] hover:text-white hover:border-[var(--color-line)] transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="px-8 py-4 border-t-[2.5px] border-[var(--color-line)] bg-[var(--color-ink-2)] flex items-center justify-between shrink-0">
            <span className="text-[15px] text-[var(--color-muted)] font-mono">
              {notes.length} 개 기록됨 · esc 로 닫기
            </span>
            <Button variant="secondary" size="md" onClick={onClose}>
              닫기
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
