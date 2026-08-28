import { useEffect } from 'react'
import { Settings as SettingsIcon } from 'lucide-react'
import { Button } from './Button'
import type { Settings } from '../lib/settings'

type Props = {
  open: boolean
  onClose: () => void
  settings: Settings
  onChange: (next: Settings) => void
}

export function SettingsModal({ open, onClose, settings, onChange }: Props) {
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
        className="relative w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-4 -left-3 z-10 px-3 py-1 border-[2.5px] border-[var(--color-line)] bg-[var(--color-accent)] text-black font-bold text-[15px] sketchy-tag -rotate-[5deg] shadow-[3px_3px_0_var(--color-shadow)] inline-flex items-center gap-1.5">
          <SettingsIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
          SETTINGS
        </div>

        <div className="sketchy border-[2.5px] border-[var(--color-line)] bg-[var(--color-surface)] shadow-[6px_6px_0_rgba(0,0,0,0.7)] overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b-[2.5px] border-[var(--color-line)]">
            <div className="flex items-center gap-2 text-[15px] text-[var(--color-muted)] font-mono">
              <span>preferences</span>
            </div>
            <h2 className="mt-2 text-[28px] md:text-[32px] font-bold text-[var(--color-paper)] leading-[1.1] tracking-tight">
              설정
            </h2>
          </div>

          <div className="px-8 py-5">
            <SettingRow
              label="아이콘 위치 저장"
              desc="바탕화면 폴더 위치를 기억. 끄면 새 위치가 저장되지 않음."
              checked={settings.saveIconPositions}
              onChange={(v) =>
                onChange({ ...settings, saveIconPositions: v })
              }
            />
          </div>

          <div className="px-8 py-4 border-t-[2.5px] border-[var(--color-line)] bg-[var(--color-ink-2)] flex items-center justify-between">
            <span className="text-[15px] text-[var(--color-muted)] font-mono">
              esc 로 닫기
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

function SettingRow({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string
  desc: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="flex-1 min-w-0">
        <div className="text-[16px] font-bold text-[var(--color-paper)]">
          {label}
        </div>
        <div className="text-[15px] text-[var(--color-muted)] mt-0.5 leading-relaxed">
          {desc}
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  )
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative shrink-0 w-11 h-5 border-[1.5px] border-[var(--color-line)] sketchy-tag transition-colors ${
        checked
          ? 'bg-[var(--color-accent)]'
          : 'bg-[var(--color-surface-2)]'
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-1/2 -translate-y-1/2 w-[18px] h-7 border-[2.5px] border-[var(--color-line)] sketchy-tag transition-all shadow-[2px_2px_0_var(--color-shadow)] ${
          checked
            ? 'left-[calc(100%-14px)] bg-[var(--color-ink)]'
            : 'left-[-4px] bg-[var(--color-line-dim)]'
        }`}
      />
    </button>
  )
}
