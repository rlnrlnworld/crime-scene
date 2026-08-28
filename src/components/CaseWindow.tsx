import { useEffect, useRef, useState } from 'react'
import { X, Minus } from 'lucide-react'
import { CaseView } from './CaseView'
import type { Case } from '../cases'

type Props = {
  case_: Case
  minimized?: boolean
  onMinimize?: () => void
  onClose: () => void
}

type Pos = { x: number; y: number }
type Size = { w: number; h: number }

const POS_KEY = 'crime-scene:window-pos'
const SIZE_KEY = 'crime-scene:window-size'
const MIN_VISIBLE = 120
const MIN_W = 720
const MIN_H = 480

function loadJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function saveJSON(key: string, val: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(val))
  } catch {
    // ignore
  }
}

function defaultSize(): Size {
  return {
    w: Math.max(MIN_W, Math.min(1400, window.innerWidth - 80)),
    h: Math.max(MIN_H, Math.min(900, window.innerHeight - 80)),
  }
}

function defaultPos(size: Size): Pos {
  return {
    x: Math.max(0, Math.floor((window.innerWidth - size.w) / 2)),
    y: Math.max(0, Math.floor((window.innerHeight - size.h) / 2)),
  }
}

export function CaseWindow({ case_, minimized, onMinimize, onClose }: Props) {
  const [size, setSize] = useState<Size>(() => loadJSON<Size>(SIZE_KEY) ?? defaultSize())
  const [pos, setPos] = useState<Pos>(
    () => loadJSON<Pos>(POS_KEY) ?? defaultPos(loadJSON<Size>(SIZE_KEY) ?? defaultSize()),
  )
  const posRef = useRef(pos)
  useEffect(() => {
    posRef.current = pos
  }, [pos])

  useEffect(() => {
    const onResize = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      setPos((p) => ({
        x: Math.max(-size.w + MIN_VISIBLE, Math.min(vw - MIN_VISIBLE, p.x)),
        y: Math.max(0, Math.min(vh - MIN_VISIBLE, p.y)),
      }))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [size.w])

  function onDragStart(e: React.PointerEvent) {
    e.preventDefault()
    const startX = e.clientX
    const startY = e.clientY
    const startPos = { ...posRef.current }
    let dragged = false

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      if (!dragged && Math.hypot(dx, dy) > 3) {
        dragged = true
        document.body.style.cursor = "url('/cursor-grabbing.svg?v=5') 16 17, grabbing"
        document.body.style.userSelect = 'none'
      }
      if (dragged) {
        const vw = window.innerWidth
        const vh = window.innerHeight
        setPos({
          x: Math.max(-size.w + MIN_VISIBLE, Math.min(vw - MIN_VISIBLE, startPos.x + dx)),
          y: Math.max(0, Math.min(vh - MIN_VISIBLE, startPos.y + dy)),
        })
      }
    }

    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      if (dragged) saveJSON(POS_KEY, posRef.current)
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  function onResizeStart(e: React.PointerEvent) {
    e.preventDefault()
    e.stopPropagation()
    const startX = e.clientX
    const startY = e.clientY
    const startSize = { ...size }

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      const vw = window.innerWidth
      const vh = window.innerHeight
      const nextW = Math.max(MIN_W, Math.min(vw - posRef.current.x, startSize.w + dx))
      const nextH = Math.max(MIN_H, Math.min(vh - posRef.current.y, startSize.h + dy))
      setSize({ w: nextW, h: nextH })
    }

    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      saveJSON(SIZE_KEY, size)
    }

    document.body.style.cursor = "url('/cursor-resize.svg') 15 15, nwse-resize"
    document.body.style.userSelect = 'none'
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: size.h,
        zIndex: 40,
        display: minimized ? 'none' : 'flex',
      }}
      className="flex flex-col sketchy border-[2.5px] border-[var(--color-line)] bg-[var(--color-ink)] shadow-[6px_6px_0_rgba(0,0,0,0.7)] overflow-hidden"
    >
      <div
        onPointerDown={onDragStart}
        onDoubleClick={() => {
          const s = defaultSize()
          const p = defaultPos(s)
          setSize(s)
          setPos(p)
          saveJSON(SIZE_KEY, s)
          saveJSON(POS_KEY, p)
        }}
        className="flex items-center justify-between px-4 py-2.5 border-b-[2.5px] border-[var(--color-line)] bg-[var(--color-ink-2)] shrink-0 cursor-grab active:cursor-grabbing select-none touch-none"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={onClose}
              aria-label="닫기"
              className="w-8 h-8 rounded-md bg-[var(--color-blood)] border-[2px] border-[var(--color-line)] text-white flex items-center justify-center hover:brightness-110 transition"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>
            {onMinimize && (
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={onMinimize}
                aria-label="최소화"
                className="w-8 h-8 rounded-md bg-[var(--color-accent)] border-[2px] border-[var(--color-line)] text-[var(--color-ink)] flex items-center justify-center hover:brightness-110 transition"
              >
                <Minus className="w-4 h-4" strokeWidth={2.5} />
              </button>
            )}
          </div>
          <div className="text-[16px] font-bold text-[var(--color-paper)] truncate">
            {case_.title}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <CaseView case_={case_} />
      </div>

      <div
        onPointerDown={onResizeStart}
        aria-label="크기 조절"
        className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize flex items-end justify-end p-1 z-10"
        style={{ touchAction: 'none' }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 10 L10 2 M5 10 L10 5 M8 10 L10 8"
            stroke="var(--color-line)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  )
}
