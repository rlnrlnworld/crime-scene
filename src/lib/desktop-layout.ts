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

export const GRID_W = 130
export const GRID_H = 128
export const GRID_OX = 32
export const GRID_OY = 32

export function defaultPos(index: number): IconPos {
  const rowsPerCol = 4
  const col = Math.floor(index / rowsPerCol)
  const row = index % rowsPerCol
  return { x: GRID_OX + col * GRID_W, y: GRID_OY + row * GRID_H }
}

export function snapToGrid(pos: IconPos): IconPos {
  const col = Math.max(0, Math.round((pos.x - GRID_OX) / GRID_W))
  const row = Math.max(0, Math.round((pos.y - GRID_OY) / GRID_H))
  return {
    x: GRID_OX + col * GRID_W,
    y: GRID_OY + row * GRID_H,
  }
}
