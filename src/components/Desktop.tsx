import { useEffect, useRef, useState } from 'react'
import { Fingerprint, FolderOpen, CheckCircle2, Settings as SettingsIcon, LogOut } from 'lucide-react'
import { Button } from './Button'
import { DesktopIcon } from './DesktopIcon'
import { HelpModal } from './HelpModal'
import { SettingsModal } from './SettingsModal'
import { cases, type Case } from '../cases'
import { loadSolved } from '../lib/history'
import { loadSettings, saveSettings, type Settings } from '../lib/settings'
import {
  defaultPos,
  loadLayout,
  rightDefaultPos,
  saveLayout,
  snapToGrid,
  type IconPos,
} from '../lib/desktop-layout'
import bgUrl from '../assets/images/root-bg.svg'

type Props = {
  onOpen: (id: string) => void
  activeCase: Case | null
  minimized?: boolean
  onToggleMinimize?: () => void
}

type IconDef = {
  id: string
  label: string
  disabled: boolean
  onOpen?: () => void
  variant: 'folder' | 'folder-solved' | 'folder-locked'
  iconSrc?: string
}

const COMING_SOON: { id: string; label: string }[] = [
  { id: 'locked-atelier', label: '아뜰리에 도난' },
  { id: 'locked-metro', label: '지하철 실종' },
  { id: 'locked-pension', label: '펜션 방화' },
]

const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토']

function formatClock(d: Date) {
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

function formatDate(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day} ${WEEKDAY[d.getDay()]}`
}

export function Desktop({ onOpen, activeCase, minimized, onToggleMinimize }: Props) {
  const [solved] = useState(() => loadSolved())
  const [layout, setLayout] = useState<Record<string, IconPos>>(() =>
    loadLayout(),
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [now, setNow] = useState(() => new Date())
  const [windowWidth, setWindowWidth] = useState(() => window.innerWidth)
  const [helpOpen, setHelpOpen] = useState(false)
  const [startOpen, setStartOpen] = useState(false)
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settings, setSettings] = useState<Settings>(() => loadSettings())
  const startRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!startOpen) return
    const onDoc = (e: MouseEvent) => {
      if (!startRef.current?.contains(e.target as Node)) setStartOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setStartOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [startOpen])

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const icons: IconDef[] = [
    ...cases.map((c) => ({
      id: c.id,
      label: c.title,
      disabled: false,
      onOpen: () => onOpen(c.id),
      variant: solved.has(c.id)
        ? ('folder-solved' as const)
        : ('folder' as const),
    })),
    ...COMING_SOON.map((c) => ({
      id: c.id,
      label: c.label,
      disabled: true,
      variant: 'folder-locked' as const,
    })),
    {
      id: 'setting',
      label: 'setting',
      disabled: false,
      variant: 'folder' as const,
      iconSrc: '/setting.svg',
      onOpen: () => setSettingsOpen(true),
    },
    {
      id: 'help',
      label: 'help',
      disabled: false,
      variant: 'folder' as const,
      iconSrc: '/help.svg',
      onOpen: () => setHelpOpen(true),
    },
  ]

  function updatePosition(id: string, pos: IconPos, persist: boolean) {
    setLayout((prev) => {
      const next = { ...prev, [id]: pos }
      if (persist && settings.saveIconPositions) saveLayout(next)
      return next
    })
  }

  function updateSettings(next: Settings) {
    setSettings(next)
    saveSettings(next)
  }

  const totalCount = cases.length
  const solvedCount = cases.filter((c) => solved.has(c.id)).length

  return (
    <div
      className="h-full w-full flex flex-col"
      onClick={() => setSelectedId(null)}
    >
      <div
        className="flex-1 relative overflow-hidden"
        style={{
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'var(--color-ink)',
        }}
      >
        {icons.map((icon, i) => {
          const appIdx = icons.filter((c) => c.iconSrc).findIndex(
            (c) => c.id === icon.id,
          )
          const caseIdx = icons.filter((c) => !c.iconSrc).findIndex(
            (c) => c.id === icon.id,
          )
          const fallback = icon.iconSrc
            ? rightDefaultPos(appIdx, windowWidth)
            : defaultPos(caseIdx)
          const pos = layout[icon.id] ?? fallback
          void i
          return (
            <DesktopIcon
              key={icon.id}
              id={icon.id}
              label={icon.label}
              variant={icon.variant}
              iconSrc={icon.iconSrc}
              position={pos}
              selected={selectedId === icon.id}
              disabled={icon.disabled}
              onSelect={() => setSelectedId(icon.id)}
              onOpen={icon.onOpen}
              onMove={(p) => updatePosition(icon.id, p, false)}
              onMoveEnd={(finalPos) =>
                updatePosition(icon.id, snapToGrid(finalPos), true)
              }
            />
          )
        })}
      </div>

      <div
        className="shrink-0 border-t-[2.5px] border-[var(--color-line)] bg-[var(--color-ink-2)] px-2 py-1.5 flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative" ref={startRef}>
          <button
            type="button"
            onClick={() => setStartOpen((v) => !v)}
            className={`group flex items-center gap-2 px-3 py-1.5 sketchy-btn transition-colors ${
              startOpen
                ? 'bg-[var(--color-accent)]'
                : 'bg-transparent hover:bg-[var(--color-accent)]'
            }`}
          >
            <Fingerprint
              className={`w-5 h-5 ${
                startOpen
                  ? 'text-black'
                  : 'text-[var(--color-accent)] group-hover:text-black'
              }`}
              strokeWidth={2.5}
            />
            <span
              className={`text-[16px] font-bold tracking-[0.15em] ${
                startOpen
                  ? 'text-black'
                  : 'text-[var(--color-paper)] group-hover:text-black'
              }`}
            >
              CRIME SCENE
            </span>
            <span
              className={`text-[15px] font-mono ${
                startOpen
                  ? 'text-black/70'
                  : 'text-[var(--color-muted)] group-hover:text-black/70'
              }`}
            >
              archive
            </span>
          </button>

          {startOpen && (
            <div className="absolute bottom-full left-0 mb-2 min-w-[180px] border-[2.5px] border-[var(--color-line)] sketchy-3 bg-[var(--color-surface)] shadow-[4px_4px_0_var(--color-shadow)] py-1.5 z-50">
              <button
                type="button"
                onClick={() => {
                  setStartOpen(false)
                  setSettingsOpen(true)
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-[15px] text-[var(--color-paper)] hover:bg-[var(--color-accent)] hover:text-black transition-colors text-left"
              >
                <SettingsIcon className="w-4 h-4" strokeWidth={2.5} />
                세팅
              </button>
              <div className="h-[1.5px] mx-2 my-1 bg-[var(--color-line-dim)]/40" />
              <button
                type="button"
                onClick={() => {
                  setStartOpen(false)
                  setExitConfirmOpen(true)
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-[15px] text-[var(--color-paper)] hover:bg-[var(--color-blood)] hover:text-white transition-colors text-left"
              >
                <LogOut className="w-4 h-4" strokeWidth={2.5} />
                종료
              </button>
            </div>
          )}
        </div>

        <div className="h-9 w-[2px] bg-[var(--color-line-dim)] mx-1" />

        {activeCase && (
          <button
            type="button"
            onClick={onToggleMinimize}
            className="relative flex items-center gap-2 px-3 py-1.5 sketchy-btn bg-[var(--color-surface)] border-[2px] border-[var(--color-accent)] shadow-[2px_2px_0_var(--color-shadow)] hover:brightness-110 transition"
            title={minimized ? '사건 창 열기' : '사건 창 최소화'}
          >
            <FolderOpen
              className="w-4 h-4 text-[var(--color-accent)]"
              strokeWidth={2.5}
            />
            <span className="text-[15px] font-bold text-[var(--color-paper)] truncate max-w-[220px]">
              {activeCase.title}
            </span>
            <span className="text-[15px] font-mono text-[var(--color-muted)]">
              #{activeCase.id}
            </span>
            {!minimized && (
              <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[var(--color-accent)]" />
            )}
          </button>
        )}

        <div className="flex-1" />

        <div className="flex items-center gap-2 pl-3 border-l-[2px] border-[var(--color-line-dim)]">
          <div className="flex items-center gap-1.5 px-2 py-1 border-[2px] border-[var(--color-line)] sketchy-tag bg-[var(--color-surface)]">
            <CheckCircle2
              className="w-3.5 h-3.5 text-[var(--color-teal)]"
              strokeWidth={2.5}
            />
            <span className="text-[15px] font-bold font-mono text-[var(--color-paper)]">
              {solvedCount}
              <span className="text-[var(--color-muted)]">/{totalCount}</span>
            </span>
          </div>

          <div className="flex flex-col items-end leading-none px-1">
            <span className="text-[15px] font-bold font-mono text-[var(--color-paper)]">
              {formatClock(now)}
            </span>
            <span className="text-[15px] font-mono text-[var(--color-muted)] mt-1">
              {formatDate(now)}
            </span>
          </div>
        </div>
      </div>

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onChange={updateSettings}
      />
      <ExitConfirmModal
        open={exitConfirmOpen}
        onCancel={() => setExitConfirmOpen(false)}
        onConfirm={() => {
          setExitConfirmOpen(false)
          window.close()
        }}
      />
    </div>
  )
}

function ExitConfirmModal({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
      if (e.key === 'Enter') onConfirm()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onCancel, onConfirm])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/55 backdrop-blur-[3px]"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-4 -left-3 z-10 px-3 py-1 border-[2.5px] border-[var(--color-line)] bg-[var(--color-blood)] text-white font-bold text-[15px] sketchy-tag -rotate-[5deg] shadow-[3px_3px_0_var(--color-shadow)] inline-flex items-center gap-1.5">
          <LogOut className="w-3.5 h-3.5" strokeWidth={2.5} />
          EXIT
        </div>

        <div className="sketchy border-[2.5px] border-[var(--color-line)] bg-[var(--color-surface)] shadow-[6px_6px_0_rgba(0,0,0,0.7)] overflow-hidden">
          <div className="px-8 pt-8 pb-6">
            <h2 className="text-[22px] md:text-[24px] font-bold text-[var(--color-paper)] leading-[1.2] tracking-tight">
              종료하시겠습니까?
            </h2>
            <p className="mt-2 text-[15px] text-[var(--color-paper)]/75 leading-relaxed">
              현재 세션이 끝나고 창이 닫힙니다.
            </p>
          </div>
          <div className="px-8 py-4 border-t-[2.5px] border-[var(--color-line)] bg-[var(--color-ink-2)] flex items-center justify-end gap-2">
            <Button variant="secondary" size="md" onClick={onCancel}>
              취소
            </Button>
            <Button variant="danger" size="md" onClick={onConfirm}>
              <LogOut className="w-4 h-4" strokeWidth={2.5} />
              종료
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
