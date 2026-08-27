export type IconPos = { x: number; y: number }

const KEY = 'crime-scene:desktop-layout'

export function loadLayout(): Record<string, IconPos> {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, IconPos>
  } catch {
    return {}
  }
}

export function saveLayout(layout: Record<string, IconPos>): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(layout))
  } catch {
    // ignore
  }
}

export function defaultPos(index: number): IconPos {
  const rowsPerCol = 4
  const col = Math.floor(index / rowsPerCol)
  const row = index % rowsPerCol
  return { x: 32 + col * 130, y: 32 + row * 128 }
}
