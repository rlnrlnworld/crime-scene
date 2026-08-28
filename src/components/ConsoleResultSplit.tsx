import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

type Props = {
  top: ReactNode
  bottom: ReactNode
  /** initial ratio of the top panel (0..1). */
  initialRatio?: number
}

/** Height of each panel's header — measured from the DOM. Fallback if not yet mounted. */
const FALLBACK_HEADER_PX = 48

export function ConsoleResultSplit({
  top,
  bottom,
  initialRatio = 0.5,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const topWrapRef = useRef<HTMLDivElement>(null)
  const bottomWrapRef = useRef<HTMLDivElement>(null)
  const [ratio, setRatio] = useState(initialRatio)
  const [minTopPx, setMinTopPx] = useState(FALLBACK_HEADER_PX)
  const [minBottomPx, setMinBottomPx] = useState(FALLBACK_HEADER_PX)

  useLayoutEffect(() => {
    const headerHeight = (wrapper: HTMLElement | null): number => {
      const panel = wrapper?.firstElementChild as HTMLElement | null
      const header = panel?.firstElementChild as HTMLElement | null
      if (!header) return FALLBACK_HEADER_PX
      return Math.ceil(header.getBoundingClientRect().height)
    }
    setMinTopPx(headerHeight(topWrapRef.current))
    setMinBottomPx(headerHeight(bottomWrapRef.current))
  }, [])

  function onDragStart(e: React.PointerEvent) {
    e.preventDefault()
    const container = containerRef.current
    if (!container) return

    const apply = (clientY: number) => {
      const rect = container.getBoundingClientRect()
      const total = rect.height
      if (total <= 0) return
      const y = clientY - rect.top
      const min = minTopPx / total
      const max = (total - minBottomPx) / total
      setRatio(Math.max(min, Math.min(max, y / total)))
    }

    const move = (ev: PointerEvent) => apply(ev.clientY)
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    document.body.style.userSelect = 'none'
    document.body.style.cursor = "url('/cursor-resize.svg') 15 15, row-resize"
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full min-h-0 bg-[var(--color-ink)]"
    >
      <div
        ref={topWrapRef}
        style={{ height: `${ratio * 100}%` }}
        className="overflow-hidden min-h-0"
      >
        {top}
      </div>
      <div
        role="separator"
        aria-orientation="horizontal"
        aria-label="콘솔 · 결과 크기 조절"
        onPointerDown={onDragStart}
        className="group relative h-2 shrink-0 bg-[var(--color-line-dim)]/25 hover:bg-[var(--color-accent)]/30 active:bg-[var(--color-accent)]/60 cursor-row-resize touch-none border-y-[1.5px] border-[var(--color-line)]/40"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-[3px] rounded-full bg-[var(--color-line-dim)] group-hover:bg-[var(--color-accent)] transition-colors" />
        </div>
      </div>
      <div ref={bottomWrapRef} className="flex-1 min-h-0 overflow-hidden">
        {bottom}
      </div>
    </div>
  )
}
