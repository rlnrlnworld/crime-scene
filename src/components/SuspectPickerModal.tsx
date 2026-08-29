import { useEffect, useState } from 'react'
import { Clock, UserSearch, XCircle } from 'lucide-react'
import { Button } from './Button'
import type { PersonProfile, SolutionField } from '../cases/types'

type Props = {
  open: boolean
  persons: PersonProfile[]
  auxFields?: SolutionField[]
  verdict: 'correct' | 'wrong' | null
  onSubmit: (person: PersonProfile, auxAnswers: Record<string, string>) => void
  onClose: () => void
}

export function SuspectPickerModal({
  open,
  persons,
  auxFields,
  verdict,
  onSubmit,
  onClose,
}: Props) {
  const [pickedId, setPickedId] = useState<number | null>(null)
  const [auxAnswers, setAuxAnswers] = useState<Record<string, string>>({})
  const [dirty, setDirty] = useState(true)

  useEffect(() => {
    if (!open) return
    setPickedId(null)
    setAuxAnswers({})
    setDirty(true)
  }, [open])

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

  const auxComplete = (auxFields ?? []).every(
    (f) => (auxAnswers[f.id] ?? '').length > 0,
  )
  const canSubmit = pickedId != null && auxComplete
  const showWrong = verdict === 'wrong' && !dirty

  function pickPerson(id: number) {
    setPickedId(id)
    setDirty(true)
  }

  function pickAux(fieldId: string, value: string) {
    setAuxAnswers((prev) => ({ ...prev, [fieldId]: value }))
    setDirty(true)
  }

  function handleSubmit() {
    if (!canSubmit) return
    const person = persons.find((p) => p.id === pickedId)
    if (!person) return
    setDirty(false)
    onSubmit(person, auxAnswers)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-8 md:p-12 bg-black/55 backdrop-blur-[3px]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-full flex"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-4 -left-3 z-10 px-3 py-1 border-[2.5px] border-[var(--color-line)] bg-[var(--color-accent)] text-black font-bold text-[15px] sketchy-tag -rotate-[5deg] shadow-[3px_3px_0_var(--color-shadow)] inline-flex items-center gap-1.5">
          <UserSearch className="w-3.5 h-3.5" strokeWidth={2.5} />
          SUSPECTS
        </div>

        <div className="w-full max-h-full overflow-hidden sketchy border-[2.5px] border-[var(--color-line)] bg-[var(--color-surface)] shadow-[6px_6px_0_rgba(0,0,0,0.7)] flex flex-col">
          <div className="relative px-8 pt-8 pb-5 border-b-[2.5px] border-[var(--color-line)] shrink-0">
            <div className="flex items-center gap-2 text-[15px] text-[var(--color-muted)] font-mono">
              <span>suspects</span>
              <span className="text-[var(--color-accent)]">
                {persons.length}
              </span>
            </div>
            <h2 className="mt-2 text-[28px] md:text-[32px] font-bold text-[var(--color-paper)] leading-[1.1] tracking-tight">
              용의자 지목
            </h2>
            <p className="mt-3 text-[16px] text-[var(--color-paper)]/85 leading-relaxed">
              증거와 진술이 가리키는 단 한 사람을 골라라.
            </p>
          </div>

          <div className="overflow-auto px-8 py-6 flex-1">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {persons.map((p) => {
                const isSelected = pickedId === p.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => !p.disabled && pickPerson(p.id)}
                    disabled={p.disabled}
                    className={`group relative overflow-hidden p-3 flex flex-col items-center gap-2 border-[2px] sketchy-2 transition-all ${
                      isSelected
                        ? showWrong
                          ? 'border-[var(--color-blood)] bg-[var(--color-surface-2)] shadow-[4px_4px_0_var(--color-blood-dark)] -translate-y-0.5'
                          : 'border-[var(--color-accent)] bg-[var(--color-surface-2)] shadow-[4px_4px_0_var(--color-accent-shadow)] -translate-y-0.5'
                        : 'border-[var(--color-line)] bg-[var(--color-surface)] shadow-[3px_3px_0_var(--color-shadow)] hover:brightness-110'
                    } ${
                      p.disabled ? 'opacity-40 grayscale cursor-not-allowed' : ''
                    }`}
                  >
                    <div className="w-[96px] h-[110px] flex items-center justify-center">
                      <img
                        src={`/avatars/${p.avatar}.svg`}
                        alt=""
                        draggable={false}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-[15px] font-bold text-[var(--color-paper)]">
                      {p.name}
                    </div>
                    {p.role && (
                      <div className="text-[13px] font-mono text-[var(--color-muted)] px-1.5 py-0.5 border-[1.5px] border-[var(--color-line-dim)] sketchy-tag">
                        {p.role}
                      </div>
                    )}

                    {isSelected && !p.disabled && (
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
                      >
                        <div
                          className="absolute left-1/2 top-1/2 w-[180%]"
                          style={{
                            transform:
                              'translate(-50%, -50%) rotate(-22deg)',
                          }}
                        >
                          <img
                            src="/policeline.svg"
                            alt=""
                            draggable={false}
                            className="block w-full animate-police-a"
                            style={{ willChange: 'transform, opacity' }}
                          />
                        </div>
                        <div
                          className="absolute left-1/2 top-1/2 w-[180%]"
                          style={{
                            transform:
                              'translate(-50%, -50%) rotate(22deg) scaleX(-1)',
                          }}
                        >
                          <img
                            src="/policeline.svg"
                            alt=""
                            draggable={false}
                            className="block w-full animate-police-b"
                            style={{ willChange: 'transform, opacity' }}
                          />
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {auxFields && auxFields.length > 0 && (
              <div className="mt-6 pt-5 border-t-[2px] border-dashed border-[var(--color-line-dim)] space-y-5">
                {auxFields.map((f) => (
                  <div key={f.id}>
                    <div className="inline-flex items-center gap-2 text-[15px] font-bold text-[var(--color-paper)] scribble-underline mb-3">
                      {f.id === 'time' && (
                        <Clock
                          className="w-4 h-4 text-[var(--color-accent)]"
                          strokeWidth={2.5}
                        />
                      )}
                      {f.label}
                    </div>
                    {f.options ? (
                      <div className="flex flex-wrap gap-2">
                        {f.options.map((opt) => {
                          const active = auxAnswers[f.id] === opt
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => pickAux(f.id, opt)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 sketchy-tag border-[2px] font-bold text-[15px] font-mono transition ${
                                active
                                  ? 'bg-[var(--color-accent)] text-black border-[var(--color-line)] shadow-[2px_2px_0_var(--color-shadow)]'
                                  : 'bg-transparent text-[var(--color-muted)] border-[var(--color-line-dim)] hover:text-[var(--color-paper)] hover:border-[var(--color-line)]'
                              }`}
                            >
                              {opt}
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      <input
                        value={auxAnswers[f.id] ?? ''}
                        onChange={(e) => pickAux(f.id, e.target.value)}
                        placeholder={f.placeholder}
                        className="w-full max-w-xs px-3 py-2 sketchy-btn bg-[var(--color-ink)] border-[2px] border-[var(--color-line)] text-[15px] text-[var(--color-paper)] placeholder:text-[var(--color-muted)] outline-none focus:border-[var(--color-accent)]"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-8 py-4 border-t-[2.5px] border-[var(--color-line)] bg-[var(--color-ink-2)] flex items-center justify-between shrink-0 gap-3">
            {showWrong ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border-[2px] border-[var(--color-line)] bg-[var(--color-blood)] text-white text-[15px] font-bold sketchy-tag rotate-1">
                <XCircle className="w-4 h-4" strokeWidth={2.5} />
                오답. 다시 조사해보자.
              </div>
            ) : (
              <span className="text-[15px] text-[var(--color-muted)] font-mono">
                {pickedId == null
                  ? '한 명을 고를 것'
                  : !auxComplete
                    ? '나머지도 채울 것'
                    : '지목 준비 완료'}
              </span>
            )}
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="md" onClick={onClose}>
                닫기
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleSubmit}
                disabled={!canSubmit}
              >
                <UserSearch className="w-4 h-4" strokeWidth={2.5} />
                지목
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
