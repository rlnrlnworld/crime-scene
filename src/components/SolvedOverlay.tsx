import { Button } from './Button'

type Props = {
  answer: string
  onClose: () => void
}

export function SolvedOverlay({ answer, onClose }: Props) {
  return (
    <div className="absolute inset-0 z-40 bg-black/65 animate-overlay-in">
      <div
        className="absolute left-1/2 top-1/2 animate-stamp-in"
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="relative inline-block">
          <div className="absolute inset-0 translate-x-[8px] translate-y-[8px] sketchy-2 bg-black/60" />
          <div className="relative flex flex-col items-center gap-1 px-12 py-7 border-[3px] border-[var(--color-line)] sketchy-2 bg-[var(--color-teal)] shadow-[0_0_0_4px_var(--color-ink)]">
            <div className="flex items-center gap-3">
              <img
                src="/check.svg"
                alt=""
                draggable={false}
                className="w-20 h-16"
              />
              <span className="text-[56px] leading-none font-bold text-[var(--color-ink)] tracking-tight">
                사건 해결
              </span>
            </div>
            <div className="text-[14px] font-mono font-bold text-[var(--color-ink)]/70 tracking-[0.35em] mt-2">
              CASE · SOLVED
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-1/2 bottom-16 -translate-x-1/2 flex flex-col items-center gap-4 animate-solved-caption-in">
        <div className="px-4 py-2 border-[2px] border-[var(--color-line)] bg-[var(--color-ink-2)] sketchy-tag text-[var(--color-paper)] shadow-[3px_3px_0_var(--color-shadow)]">
          <span className="text-[15px] text-[var(--color-muted)] font-mono mr-2">
            범인
          </span>
          <span className="text-[17px] font-bold text-[var(--color-accent)]">
            {answer}
          </span>
        </div>
        <Button variant="secondary" size="md" onClick={onClose}>
          확인
        </Button>
      </div>
    </div>
  )
}
