import { useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { track } from '@vercel/analytics'
import { CaseWindow } from './components/CaseWindow'
import { Desktop } from './components/Desktop'
import { cases } from './cases'

function App() {
  const [openCaseId, setOpenCaseId] = useState<string | null>(null)
  const [minimized, setMinimized] = useState(false)
  const openCase = cases.find((c) => c.id === openCaseId) ?? null

  return (
    <div className="h-screen w-screen bg-[var(--color-ink)] overflow-hidden">
      <Desktop
        onOpen={(id) => {
          if (id !== openCaseId) track('case_opened', { caseId: id })
          setOpenCaseId(id)
          setMinimized(false)
        }}
        activeCase={openCase}
        minimized={minimized}
        onToggleMinimize={() => setMinimized((m) => !m)}
      />
      {openCase && (
        <CaseWindow
          case_={openCase}
          minimized={minimized}
          onMinimize={() => setMinimized(true)}
          onClose={() => {
            setOpenCaseId(null)
            setMinimized(false)
          }}
        />
      )}
      <Analytics />
    </div>
  )
}

export default App
