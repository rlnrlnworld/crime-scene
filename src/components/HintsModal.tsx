import { useEffect } from 'react'
import { Check, Lightbulb } from 'lucide-react'
import { Button } from './Button'

type Props = {
  hints: string[]
  revealed: number
  open: boolean
  onClose: () => void
  onReveal: () => void
}

export function HintsModal({
  hints,
  revealed,
  open,
  onClose,
  onReveal,
}: Props) {
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

  if (!open) return null

  const remaining = hints.length - revealed

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
          <Lightbulb className="w-3.5 h-3.5" strokeWidth={2.5} />
          HINT SHEET
        </div>

        <div className="w-full max-h-full overflow-hidden sketchy border-[2.5px] border-[var(--color-line)] bg-[var(--color-surface)] shadow-[6px_6px_0_rgba(0,0,0,0.7)] flex flex-col">
          <div className="relative px-8 pt-8 pb-5 border-b-[2.5px] border-[var(--color-line)] shrink-0">
            <div className="flex items-center gap-2 text-[15px] text-[var(--color-muted)] font-mono">
              <span>hints</span>
              <span className="text-[var(--color-accent)]">
                {revealed} / {hints.length}
              </span>
            </div>
            <h2 className="mt-2 text-[28px] md:text-[32px] font-bold text-[var(--color-paper)] leading-[1.1] tracking-tight">
              단서
            </h2>
            <p className="mt-3 text-[16px] text-[var(--color-paper)]/85 leading-relaxed">
              차근차근 하나씩 뜯어볼 것. 뒤로 갈수록 스포일러가 짙어진다.
            </p>
          </div>

          <div className="overflow-auto px-8 py-6 flex-1">
            {revealed === 0 ? (
              <div className="border-[2px] border-dashed border-[var(--color-line-dim)] sketchy-3 p-5 text-[15px] text-[var(--color-paper)]/80 leading-relaxed">
                아직 확인한 단서가 없다. 아래 버튼으로 첫 단서를 열어볼 것.
              </div>
            ) : (
              <ol className="space-y-3 text-[15px] text-[var(--color-paper)]/90 list-decimal pl-6 marker:text-[var(--color-accent)] marker:font-bold">
                {hints.slice(0, revealed).map((h, i) => (
                  <li key={i} className="leading-relaxed pl-1">
                    {renderHint(h)}
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="px-8 py-4 border-t-[2.5px] border-[var(--color-line)] bg-[var(--color-ink-2)] flex items-center justify-between shrink-0">
            {remaining > 0 ? (
              <span className="text-[15px] text-[var(--color-muted)] font-mono">
                남은 단서 {remaining}건
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[15px] text-[var(--color-accent)] font-bold">
                <Check className="w-4 h-4" strokeWidth={2.5} />
                모두 열람 완료.
              </span>
            )}
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="md" onClick={onClose}>
                닫기
              </Button>
              {remaining > 0 && (
                <Button variant="primary" size="md" onClick={onReveal}>
                  <Lightbulb className="w-4 h-4" strokeWidth={2.5} />
                  다음 단서 열기
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function renderHint(text: string) {
  const parts = text.split(/(`[^`]+`)/g)
  return parts.map((p, i) =>
    p.startsWith('`') && p.endsWith('`') ? (
      <code
        key={i}
        className="bg-[var(--color-accent-shadow)] text-[var(--color-accent)] px-1.5 py-0.5 rounded font-mono text-[14px]"
      >
        {p.slice(1, -1)}
      </code>
    ) : (
      <span key={i}>{p}</span>
    ),
  )
}
