import { useEffect } from 'react'
import { RotateCcw } from 'lucide-react'
import { Button } from './Button'

type Props = {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function ResetConfirmModal({ open, onCancel, onConfirm }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-8 md:p-12 bg-black/55 backdrop-blur-[3px]"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-4 -left-3 z-10 px-3 py-1 border-[2.5px] border-[var(--color-line)] bg-[var(--color-blood)] text-white font-bold text-[15px] sketchy-tag -rotate-[5deg] shadow-[3px_3px_0_var(--color-shadow)] inline-flex items-center gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" strokeWidth={2.5} />
          RESET
        </div>

        <div className="sketchy border-[2.5px] border-[var(--color-line)] bg-[var(--color-surface)] shadow-[6px_6px_0_rgba(0,0,0,0.7)] overflow-hidden">
          <div className="px-8 pt-8 pb-6">
            <h2 className="text-[22px] md:text-[24px] font-bold text-[var(--color-paper)] leading-[1.2] tracking-tight">
              이 사건의 모든 기록을 지우겠는가?
            </h2>
            <p className="mt-2 text-[15px] text-[var(--color-paper)]/75 leading-relaxed">
              쿼리 기록 · 확인한 단서 · 수첩 메모 · 해결 상태가 되돌릴 수 없이 사라진다.
            </p>
          </div>
          <div className="px-8 py-4 border-t-[2.5px] border-[var(--color-line)] bg-[var(--color-ink-2)] flex items-center justify-end gap-2">
            <Button variant="secondary" size="md" onClick={onCancel}>
              취소
            </Button>
            <Button variant="danger" size="md" onClick={onConfirm}>
              <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
              초기화
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
