import { useRef } from 'react'
import { Lock, Check } from 'lucide-react'
import type { IconPos } from '../lib/desktop-layout'

type Props = {
  id: string
  label: string
  sublabel?: string
  variant?: 'folder' | 'folder-solved' | 'folder-locked'
  iconSrc?: string
  position: IconPos
  selected: boolean
  disabled?: boolean
  onSelect: () => void
  onOpen?: () => void
  onMove: (pos: IconPos) => void
  onMoveEnd?: (finalPos: IconPos) => void
}

const ICON_W = 104
const DRAG_THRESHOLD = 4

export function DesktopIcon({
  label,
  sublabel,
  variant = 'folder',
  iconSrc,
  position,
  selected,
  disabled,
  onSelect,
  onOpen,
  onMove,
  onMoveEnd,
}: Props) {
  const draggedRef = useRef(false)

  function onPointerDown(e: React.PointerEvent) {
    if (disabled) return
    e.stopPropagation()
    const startX = e.clientX
    const startY = e.clientY
    const iconX = position.x
    const iconY = position.y
    draggedRef.current = false
    let latestPos: IconPos = { x: iconX, y: iconY }

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      if (!draggedRef.current && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        draggedRef.current = true
        document.body.style.cursor = "url('/cursor-grabbing.svg?v=5') 16 17, grabbing"
        document.body.style.userSelect = 'none'
      }
      if (draggedRef.current) {
        latestPos = { x: iconX + dx, y: iconY + dy }
        onMove(latestPos)
      }
    }

    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      if (draggedRef.current) onMoveEnd?.(latestPos)
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  function onClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (draggedRef.current) return
    onSelect()
  }

  function onDoubleClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (disabled) return
    onOpen?.()
  }

  return (
    <button
      type="button"
      style={{ position: 'absolute', left: position.x, top: position.y, width: ICON_W }}
      onPointerDown={onPointerDown}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onKeyDown={(e) => {
        if (disabled) return
        if (e.key === 'Enter') {
          e.preventDefault()
          onOpen?.()
        }
      }}
      className={`group flex flex-col items-center gap-1.5 p-2 rounded-md focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] ${
        selected
          ? 'bg-[var(--color-accent)]/12 outline outline-[1.5px] outline-dashed outline-[var(--color-accent)]'
          : ''
      } ${disabled ? 'opacity-55' : 'cursor-pointer'}`}
      aria-label={label}
    >
      {iconSrc ? <AppIcon src={iconSrc} /> : <FolderSvg variant={variant} />}
      <span
        className={`text-[15px] font-bold text-center leading-tight px-1.5 py-0.5 max-w-full break-keep ${
          selected
            ? 'bg-[var(--color-accent)] text-black rounded-sm'
            : 'text-[var(--color-paper)]'
        }`}
        style={{
          textShadow: selected
            ? 'none'
            : '1px 1px 0 rgba(0,0,0,0.7), -1px 1px 0 rgba(0,0,0,0.7), 1px -1px 0 rgba(0,0,0,0.7), -1px -1px 0 rgba(0,0,0,0.7)',
        }}
      >
        {label}
      </span>
      {sublabel && (
        <span
          className="text-[15px] text-[var(--color-muted)] font-mono"
          style={{
            textShadow: '1px 1px 0 rgba(0,0,0,0.7)',
          }}
        >
          {sublabel}
        </span>
      )}
    </button>
  )
}

function AppIcon({ src }: { src: string }) {
  return (
    <div
      className="flex items-center justify-center transition-transform duration-150 ease-out group-hover:scale-[1.08]"
      style={{
        width: 72,
        height: 60,
        filter: 'drop-shadow(3px 3px 0 rgba(0,0,0,0.7))',
      }}
    >
      <img
        src={src}
        alt=""
        draggable={false}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  )
}

function FolderSvg({ variant }: { variant: 'folder' | 'folder-solved' | 'folder-locked' }) {
  return (
    <div
      className="relative transition-transform duration-150 ease-out group-hover:scale-[1.08]"
      style={{
        width: 72,
        height: 54,
        filter: 'drop-shadow(3px 3px 0 rgba(0,0,0,0.7))',
      }}
    >
      <img
        src="/folder.svg"
        alt=""
        draggable={false}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          opacity: variant === 'folder-locked' ? 0.55 : 1,
          filter: variant === 'folder-locked' ? 'grayscale(1)' : undefined,
        }}
      />
      {variant === 'folder-solved' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--color-teal)] border-[2px] border-[var(--color-ink)] shadow-[2px_2px_0_var(--color-shadow)]">
            <Check className="w-4 h-4 text-[var(--color-ink)]" strokeWidth={3} />
          </div>
        </div>
      )}
      {variant === 'folder-locked' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Lock
            className="w-7 h-7 text-[var(--color-line)]"
            strokeWidth={2.5}
            style={{ filter: 'drop-shadow(1px 1px 0 rgba(0,0,0,0.7))' }}
          />
        </div>
      )}
    </div>
  )
}
