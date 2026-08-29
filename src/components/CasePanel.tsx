import { Database, Send, UserSearch, XCircle } from 'lucide-react'
import { Button } from './Button'
import { Card } from './Card'
import { SectionLabel } from './SectionLabel'
import type { Case } from '../cases'

type Props = {
  case_: Case
  answers: Record<string, string>
  onAnswerChange: (id: string, v: string) => void
  onSubmit: () => void
  verdict: 'correct' | 'wrong' | null
  onOpenSuspectPicker: () => void
}

export function CasePanel({
  case_,
  answers,
  onAnswerChange,
  onSubmit,
  verdict,
  onOpenSuspectPicker,
}: Props) {
  const fields = case_.solution.fields
  const canSubmit = fields.every((f) => (answers[f.id] ?? '').trim().length > 0)
  const usePicker = Boolean(case_.persons)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 min-h-0 overflow-auto p-4 space-y-6">
        <section>
          <SectionLabel
            icon={
              <Database
                className="w-4 h-4 text-[var(--color-accent)]"
                strokeWidth={2.5}
              />
            }
            className="mb-3"
            underline
          >
            스키마
          </SectionLabel>
          <div className="space-y-3">
            {case_.schemas.map((s) => (
              <Card
                key={s.table}
                shadow="sm"
                shape="sketchy-2"
                className="overflow-hidden"
              >
                <div className="px-3 py-2 bg-[var(--color-surface-2)] border-b-[2px] border-[var(--color-line)] font-mono text-[15px] text-[var(--color-accent)] font-bold">
                  {s.table}
                </div>
                <div className="p-3 text-[15px] font-mono space-y-1">
                  {s.columns.map((c) => (
                    <div key={c.name} className="flex gap-3">
                      <span className="text-[var(--color-paper)]">
                        {c.name}
                      </span>
                      <span className="text-[var(--color-muted)]">
                        {c.type}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <div className="p-4 border-t-[2.5px] border-[var(--color-line)] bg-[var(--color-ink-2)]">
        <SectionLabel className="mb-2" underline>
          {case_.solution.question}
        </SectionLabel>
        {usePicker ? (
          <div className="mt-2">
            <Button
              variant="primary"
              size="md"
              onClick={onOpenSuspectPicker}
              fullWidth
            >
              <UserSearch className="w-4 h-4" strokeWidth={2.5} />
              용의자 지목하기
            </Button>
          </div>
        ) : (
          <div className="space-y-2 mt-2">
            {fields.map((f) => (
              <div key={f.id} className="flex items-center gap-2">
                <label
                  htmlFor={`answer-${f.id}`}
                  className="shrink-0 w-24 text-[14px] font-bold text-[var(--color-muted)]"
                >
                  {f.label}
                </label>
                <input
                  id={`answer-${f.id}`}
                  value={answers[f.id] ?? ''}
                  onChange={(e) => onAnswerChange(f.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.nativeEvent.isComposing) return
                    if (e.key === 'Enter' && canSubmit) onSubmit()
                  }}
                  placeholder={f.placeholder}
                  className="flex-1 px-3 py-2 sketchy-btn bg-[var(--color-ink)] border-[2px] border-[var(--color-line)] text-[15px] text-[var(--color-paper)] placeholder:text-[var(--color-muted)] outline-none focus:border-[var(--color-accent)]"
                />
              </div>
            ))}
            <div className="flex justify-end pt-1">
              <Button
                variant="primary"
                size="md"
                onClick={onSubmit}
                disabled={!canSubmit}
              >
                <Send className="w-3.5 h-3.5" strokeWidth={2.5} />
                지목
              </Button>
            </div>
          </div>
        )}
        {!usePicker && verdict === 'wrong' && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 border-[2px] border-[var(--color-line)] bg-[var(--color-blood)] text-white text-[15px] font-bold sketchy-tag rotate-1">
            <XCircle className="w-4 h-4" strokeWidth={2.5} />
            오답. 다시 조사해보자.
          </div>
        )}
      </div>
    </div>
  )
}
