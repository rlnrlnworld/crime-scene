import { useEffect } from 'react'
import { Search } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Button } from './Button'
import type { Case } from '../cases'

type Props = {
  case_: Case
  open: boolean
  onClose: () => void
}

export function CaseFileModal({ case_, open, onClose }: Props) {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-8 md:p-12 bg-black/55 backdrop-blur-[3px]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-full flex"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-4 -left-3 z-10 px-3 py-1 border-[2.5px] border-[var(--color-line)] bg-[var(--color-blood)] text-white font-bold text-[15px] sketchy-tag -rotate-[6deg] shadow-[3px_3px_0_var(--color-shadow)]">
          CASE FILE
        </div>

        <div className="w-full max-h-full overflow-hidden sketchy border-[2.5px] border-[var(--color-line)] bg-[var(--color-surface)] shadow-[6px_6px_0_rgba(0,0,0,0.7)] flex flex-col">
          <div className="relative px-8 pt-8 pb-6 border-b-[2.5px] border-[var(--color-line)] shrink-0">
            <div className="flex items-center gap-2 text-[15px] text-[var(--color-muted)] font-mono">
              <span>file</span>
              <span className="text-[var(--color-accent)]">#{case_.id}</span>
            </div>
            <h2 className="mt-2 text-[32px] md:text-[38px] font-bold text-[var(--color-paper)] leading-[1.1] tracking-tight">
              {case_.title}
            </h2>
            <p className="mt-4 text-[17px] text-[var(--color-paper)]/90 leading-relaxed">
              {case_.brief}
            </p>
          </div>

          <article className="overflow-auto prose prose-invert max-w-none px-8 py-6 text-[16px] text-[var(--color-paper)]/90 leading-relaxed [&_h1]:hidden [&_h2]:text-[17px] [&_h2]:font-bold [&_h2]:text-[var(--color-accent)] [&_h2]:mt-6 [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:text-[var(--color-paper)]/90 [&_strong]:text-[var(--color-paper)] [&_code]:bg-[var(--color-ink-2)] [&_code]:text-[var(--color-accent)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:border-[1.5px] [&_code]:border-[var(--color-line-dim)] [&_code]:font-mono [&_code]:text-[15px] [&_p]:mb-3">
            <ReactMarkdown>{case_.story}</ReactMarkdown>
          </article>

          <div className="px-8 py-4 border-t-[2.5px] border-[var(--color-line)] bg-[var(--color-ink-2)] flex justify-end shrink-0">
            <Button variant="primary" size="md" onClick={onClose}>
              <Search className="w-4 h-4" strokeWidth={2.5} />
              수사 시작
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
