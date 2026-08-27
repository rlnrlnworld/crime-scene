import { useState } from 'react'
import { Circle } from 'lucide-react'
import { DesktopIcon } from './DesktopIcon'
import { cases } from '../cases'
import { loadSolved } from '../lib/history'
import {
  defaultPos,
  loadLayout,
  saveLayout,
  type IconPos,
} from '../lib/desktop-layout'

type Props = {
  onOpen: (id: string) => void
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

export function Desktop({ onOpen }: Props) {
  const [solved] = useState(() => loadSolved())
  const [layout, setLayout] = useState<Record<string, IconPos>>(() =>
    loadLayout(),
  )
  const [selectedId, setSelectedId] = useState<string | null>(null)

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
      <div className="flex-1 relative overflow-hidden">
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
              onMoveEnd={() => updatePosition(icon.id, pos, true)}
            />
          )
        })}
      </div>

      <div className="shrink-0 border-t-[2.5px] border-[var(--color-line)] bg-[var(--color-ink-2)] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Circle className="w-3 h-3 text-[var(--color-blood)] fill-[var(--color-blood)] animate-pulse" />
          <div className="text-[16px] font-bold text-[var(--color-paper)] tracking-wide">
            크라임씬
          </div>
          <div className="px-2 py-0.5 border-[2px] border-[var(--color-line)] sketchy-tag font-bold text-[15px] text-[var(--color-accent)] bg-[var(--color-surface)] -rotate-2">
            archive
          </div>
        </div>
        <div className="text-[15px] text-[var(--color-muted)] font-mono">
          {solvedCount} / {totalCount} solved · 폴더를 더블클릭
        </div>
      </div>
    </div>
  )
}
