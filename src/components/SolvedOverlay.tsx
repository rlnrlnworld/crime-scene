import { useEffect } from 'react'
import { Check } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Button } from './Button'
import type { Case } from '../cases'

type Props = {
  case_: Case
  culpritName: string
  onClose: () => void
}

export function SolvedOverlay({ case_, culpritName, onClose }: Props) {
  const culprit = case_.persons?.find((p) => p.name === culpritName)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-6 md:p-10 bg-black/65 backdrop-blur-[3px] animate-overlay-in">
      <div
        className="relative w-full max-w-2xl max-h-full flex animate-solved-panel-in"
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="absolute -top-4 -left-3 z-10 px-3 py-1 border-[2.5px] border-[var(--color-line)] bg-[var(--color-teal)] text-black font-bold text-[15px] sketchy-tag -rotate-[6deg] shadow-[3px_3px_0_var(--color-shadow)] inline-flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
          SOLVED
        </div>

        <div className="w-full max-h-full overflow-hidden sketchy border-[2.5px] border-[var(--color-line)] bg-[var(--color-surface)] shadow-[6px_6px_0_rgba(0,0,0,0.7)] flex flex-col">
          <div className="relative px-8 pt-8 pb-6 border-b-[2.5px] border-[var(--color-line)] shrink-0">
            <div className="flex items-start justify-between gap-5">
              <div className="flex-1 min-w-0">
                <h2 className="text-[32px] md:text-[38px] font-bold text-[var(--color-paper)] leading-[1.1] tracking-tight">
                  사건 해결
                </h2>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-[15px] text-[var(--color-muted)] font-mono">
                    범인
                  </span>
                  <span className="text-[20px] font-bold text-[var(--color-accent)]">
                    {culpritName}
                  </span>
                </div>
              </div>
              {culprit && (
                <div className="shrink-0 w-[92px] h-[108px] border-[2px] border-[var(--color-line)] sketchy-2 bg-[var(--color-surface-2)] shadow-[3px_3px_0_var(--color-shadow)] overflow-hidden flex items-center justify-center">
                  <img
                    src={`/avatars/${culprit.avatar}.svg`}
                    alt=""
                    draggable={false}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          <article className="overflow-auto prose prose-invert max-w-none px-8 py-6 text-[16px] text-[var(--color-paper)]/90 leading-relaxed [&_h1]:hidden [&_h2]:text-[17px] [&_h2]:font-bold [&_h2]:text-[var(--color-accent)] [&_h2]:mt-6 [&_h2]:first:mt-0 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:text-[var(--color-paper)]/90 [&_strong]:text-[var(--color-paper)] [&_em]:text-[var(--color-paper)]/95 [&_code]:bg-[var(--color-ink-2)] [&_code]:text-[var(--color-accent)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:border-[1.5px] [&_code]:border-[var(--color-line-dim)] [&_code]:font-mono [&_code]:text-[15px] [&_p]:mb-3">
            <ReactMarkdown>{case_.resolution}</ReactMarkdown>
          </article>

          <div className="px-8 py-4 border-t-[2.5px] border-[var(--color-line)] bg-[var(--color-ink-2)] flex items-center justify-between shrink-0">
            <span className="text-[15px] text-[var(--color-muted)] font-mono">
              esc 로 닫을 것
            </span>
            <Button variant="primary" size="md" onClick={onClose}>
              닫기
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
