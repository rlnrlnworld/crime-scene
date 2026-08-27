import { X } from 'lucide-react'
import { CaseView } from './CaseView'
import type { Case } from '../cases'

type Props = {
  case_: Case
  onClose: () => void
}

export function CaseWindow({ case_, onClose }: Props) {
  return (
    <div className="fixed inset-3 z-40 flex flex-col sketchy border-[2.5px] border-[var(--color-line)] bg-[var(--color-ink)] shadow-[6px_6px_0_rgba(0,0,0,0.7)] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b-[2.5px] border-[var(--color-line)] bg-[var(--color-ink-2)] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="w-8 h-8 shrink-0 rounded-full bg-[var(--color-blood)] border-[2px] border-[var(--color-line)] text-white flex items-center justify-center hover:brightness-110 transition"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
          <div className="text-[16px] font-bold text-[var(--color-paper)] truncate">
            {case_.title}
          </div>
          <div className="px-2 py-0.5 border-[2px] border-[var(--color-line)] sketchy-tag font-mono text-[15px] text-[var(--color-accent)] bg-[var(--color-surface)] -rotate-2 shrink-0">
            #{case_.id}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <CaseView case_={case_} />
      </div>
    </div>
  )
}
