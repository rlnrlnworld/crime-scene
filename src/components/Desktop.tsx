import { useEffect, useState } from 'react'
import { Circle, FolderOpen, CheckCircle2 } from 'lucide-react'
import { DesktopIcon } from './DesktopIcon'
import { cases, type Case } from '../cases'
import { loadSolved } from '../lib/history'
import {
  defaultPos,
  loadLayout,
  saveLayout,
  snapToGrid,
  type IconPos,
} from '../lib/desktop-layout'
import bgUrl from '../assets/images/root-bg.svg'

type Props = {
  onOpen: (id: string) => void
  activeCase: Case | null
}

type IconDef = {
  id: string
  label: string
  disabled: boolean
  onOpen?: () => void
  variant: 'folder' | 'folder-solved' | 'folder-locked'
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

export function Desktop({ onOpen, activeCase }: Props) {
  const [solved] = useState(() => loadSolved())
  const [layout, setLayout] = useState<Record<string, IconPos>>(() =>
    loadLayout(),
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
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
  ]

  function updatePosition(id: string, pos: IconPos, persist: boolean) {
    setLayout((prev) => {
      const next = { ...prev, [id]: pos }
      if (persist) saveLayout(next)
      return next
    })
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
          const pos = layout[icon.id] ?? defaultPos(i)
          return (
            <DesktopIcon
              key={icon.id}
              id={icon.id}
              label={icon.label}
              variant={icon.variant}
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
        <button
          type="button"
          className="group flex items-center gap-2 px-3 py-1.5 sketchy-btn bg-[var(--color-surface-2)] border-[2px] border-[var(--color-line)] shadow-[2px_2px_0_var(--color-shadow)] hover:bg-[var(--color-accent)] transition-colors"
        >
          <Circle
            className="w-3 h-3 fill-[var(--color-blood)] text-[var(--color-blood)] animate-pulse group-hover:fill-black group-hover:text-black"
            strokeWidth={0}
          />
          <span className="text-[15px] font-bold tracking-wider text-[var(--color-paper)] group-hover:text-black">
            크라임씬
          </span>
          <span className="text-[15px] font-mono text-[var(--color-muted)] group-hover:text-black/70">
            archive
          </span>
        </button>

        <div className="h-9 w-[2px] bg-[var(--color-line-dim)] mx-1" />

        {activeCase ? (
          <div
            className="relative flex items-center gap-2 px-3 py-1.5 sketchy-btn bg-[var(--color-surface)] border-[2px] border-[var(--color-accent)] shadow-[2px_2px_0_var(--color-shadow)]"
            title="사건 열림"
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
            <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[var(--color-accent)]" />
          </div>
        ) : (
          <div className="text-[15px] text-[var(--color-muted)] font-mono px-2">
            &gt; 사건 폴더 더블클릭
          </div>
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
    </div>
  )
}
