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

export function timeAgo(ts: number, now = Date.now()): string {
  const s = Math.floor((now - ts) / 1000)
  if (s < 5) return '방금'
  if (s < 60) return `${s}초 전`
  if (s < 3600) return `${Math.floor(s / 60)}분 전`
  if (s < 86400) return `${Math.floor(s / 3600)}시간 전`
  return `${Math.floor(s / 86400)}일 전`
}
