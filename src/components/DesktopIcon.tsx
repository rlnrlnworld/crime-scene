import { useRef } from 'react'
import type { IconPos } from '../lib/desktop-layout'

type Props = {
  id: string
  label: string
  sublabel?: string
  variant?: 'folder' | 'folder-solved' | 'folder-locked'
  position: IconPos
  selected: boolean
  disabled?: boolean
  onSelect: () => void
  onOpen?: () => void
  onMove: (pos: IconPos) => void
  onMoveEnd?: () => void
}

const ICON_W = 104
const DRAG_THRESHOLD = 4

export function DesktopIcon({
  label,
  sublabel,
  variant = 'folder',
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

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      if (!draggedRef.current && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        draggedRef.current = true
        document.body.style.cursor = 'grabbing'
        document.body.style.userSelect = 'none'
      }
      if (draggedRef.current) {
        onMove({ x: iconX + dx, y: iconY + dy })
      }
    }

    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      if (draggedRef.current) onMoveEnd?.()
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
      className={`flex flex-col items-center gap-1.5 p-2 rounded-md focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] ${
        selected
          ? 'bg-[var(--color-accent)]/12 outline outline-[1.5px] outline-dashed outline-[var(--color-accent)]'
          : ''
      } ${disabled ? 'opacity-55' : 'cursor-pointer'}`}
      aria-label={label}
    >
      <FolderSvg variant={variant} />
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

function FolderSvg({ variant }: { variant: 'folder' | 'folder-solved' | 'folder-locked' }) {
  const fill =
    variant === 'folder-solved'
      ? 'var(--color-teal)'
      : variant === 'folder-locked'
        ? 'var(--color-surface)'
        : 'var(--color-surface)'
  const stroke =
    variant === 'folder-locked' ? 'var(--color-line-dim)' : 'var(--color-line)'
  const strokeDash = variant === 'folder-locked' ? '5 3' : undefined

  return (
    <svg
      width="72"
      height="60"
      viewBox="0 0 72 60"
      fill="none"
      style={{ filter: 'drop-shadow(3px 3px 0 rgba(0,0,0,0.7))' }}
    >
      <path
        d="M4 14 L24 14 L30 8 L68 8 L68 54 L4 54 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray={strokeDash}
      />
      <path
        d="M4 22 L68 22"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={strokeDash}
      />
      {variant === 'folder-solved' && (
        <path
          d="M28 38 L34 44 L46 30"
          stroke="var(--color-ink)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      )}
      {variant === 'folder-locked' && (
        <>
          <rect
            x="30"
            y="34"
            width="14"
            height="12"
            rx="1.5"
            fill="var(--color-ink)"
            stroke="var(--color-line-dim)"
            strokeWidth="2"
          />
          <path
            d="M33 34 L33 30 Q33 26 37 26 Q41 26 41 30 L41 34"
            stroke="var(--color-line-dim)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  )
}
