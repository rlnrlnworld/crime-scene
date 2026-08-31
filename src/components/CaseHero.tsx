import { FileSearch, Lightbulb, RotateCcw } from 'lucide-react'
import { Button } from './Button'
import { LiarNotice } from './LiarNotice'
import type { Case } from '../cases'

type Props = {
  case_: Case
  onOpenFile: () => void
  onOpenHints: () => void
  onReset: () => void
  hintsRevealed: number
}

export function CaseHero({
  case_,
  onOpenFile,
  onOpenHints,
  onReset,
  hintsRevealed,
}: Props) {
  const totalHints = case_.hints.length
  return (
    <div className="relative h-full overflow-auto p-4 bg-[var(--color-ink)]">
      <div className="relative border-[2.5px] border-[var(--color-line)] bg-[var(--color-surface)] sketchy px-5 py-6 shadow-[4px_4px_0_var(--color-shadow)]">
        <div className="absolute -top-3 -left-2 px-2.5 py-0.5 border-[2px] border-[var(--color-line)] bg-[var(--color-blood)] text-white font-bold text-[15px] sketchy-tag -rotate-[6deg] wobble shadow-[2px_2px_0_var(--color-shadow)]">
          CASE FILE
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-[15px] text-[var(--color-muted)] font-mono">
              <span>file</span>
              <span className="text-[var(--color-accent)]">#{case_.id}</span>
            </div>
            <h1 className="mt-1 text-[26px] md:text-[30px] font-bold text-[var(--color-paper)] leading-[1.15] tracking-tight">
              {case_.title}
            </h1>
            <p className="mt-2 text-[15px] text-[var(--color-paper)]/90 leading-relaxed max-w-2xl">
              {case_.brief}
            </p>
          </div>

          <div className="shrink-0 flex flex-col gap-3 items-stretch">
            <Button variant="secondary" size="sm" onClick={onOpenFile}>
              <FileSearch className="w-4 h-4" strokeWidth={2.5} />
              사건 파일 열람
            </Button>
            <Button variant="secondary" size="sm" onClick={onOpenHints}>
              <Lightbulb className="w-4 h-4" strokeWidth={2.5} />
              단서 확인
              <span className="ml-0.5 font-mono text-[var(--color-muted)]">
                · {hintsRevealed}/{totalHints}
              </span>
            </Button>
            <Button variant="danger" size="sm" onClick={onReset}>
              <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
              기록 초기화
            </Button>
          </div>
        </div>

        {case_.difficulty >= 3 && <LiarNotice />}
      </div>
    </div>
  )
}
