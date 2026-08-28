const KEY = 'crime-scene:settings'

export type Settings = {
  saveIconPositions: boolean
}

const DEFAULTS: Settings = {
  saveIconPositions: true,
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...DEFAULTS }
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) }
  } catch {
    return { ...DEFAULTS }
  }
}

export function saveSettings(s: Settings): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    // ignore
  }
}
