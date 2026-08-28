export type Note = {
  id: string
  text: string
  at: number
}

const KEY = 'crime-scene:notes'

export function loadNotes(caseId: string): Note[] {
  try {
    const raw = localStorage.getItem(`${KEY}:${caseId}`)
    if (!raw) return []
    return JSON.parse(raw) as Note[]
  } catch {
    return []
  }
}

export function saveNotes(caseId: string, notes: Note[]): void {
  try {
    localStorage.setItem(`${KEY}:${caseId}`, JSON.stringify(notes))
  } catch {
    // ignore quota errors
  }
}
