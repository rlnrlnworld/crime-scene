import type { QueryResult } from './db'

export type HistoryEntry = {
  id: string
  sql: string
  result: QueryResult | null
  error: string | null
  at: number
  pinned: boolean
  note?: string
}

const STORAGE_KEY = 'crime-scene:history'
const MAX = 50

export function loadHistory(caseId: string): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}:${caseId}`)
    if (!raw) return []
    return JSON.parse(raw) as HistoryEntry[]
  } catch {
    return []
  }
}

export function saveHistory(caseId: string, entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(
      `${STORAGE_KEY}:${caseId}`,
      JSON.stringify(entries.slice(0, MAX)),
    )
  } catch {
    // ignore quota errors
  }
}

const HINTS_KEY = 'crime-scene:hints'

export function loadHintsRevealed(caseId: string): number {
  try {
    const raw = localStorage.getItem(`${HINTS_KEY}:${caseId}`)
    if (!raw) return 0
    const n = parseInt(raw, 10)
    return Number.isFinite(n) ? n : 0
  } catch {
    return 0
  }
}

export function saveHintsRevealed(caseId: string, n: number): void {
  try {
    localStorage.setItem(`${HINTS_KEY}:${caseId}`, String(n))
  } catch {
    // ignore
  }
}

const SOLVED_KEY = 'crime-scene:solved'

export function loadSolved(): Set<string> {
  try {
    const raw = localStorage.getItem(SOLVED_KEY)
    if (!raw) return new Set()
    const arr = JSON.parse(raw) as string[]
    return new Set(arr)
  } catch {
    return new Set()
  }
}

export function markSolved(caseId: string): void {
  try {
    const s = loadSolved()
    s.add(caseId)
    localStorage.setItem(SOLVED_KEY, JSON.stringify([...s]))
  } catch {
    // ignore
  }
}

export function timeAgo(ts: number, now = Date.now()): string {
  const s = Math.floor((now - ts) / 1000)
  if (s < 5) return '방금'
  if (s < 60) return `${s}초 전`
  if (s < 3600) return `${Math.floor(s / 60)}분 전`
  if (s < 86400) return `${Math.floor(s / 3600)}시간 전`
  return `${Math.floor(s / 86400)}일 전`
}
