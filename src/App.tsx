import { useState } from 'react'
import { CaseWindow } from './components/CaseWindow'
import { Desktop } from './components/Desktop'
import { cases } from './cases'

function App() {
  const [openCaseId, setOpenCaseId] = useState<string | null>(null)
  const openCase = cases.find((c) => c.id === openCaseId) ?? null

  return (
    <div className="h-screen w-screen bg-[var(--color-ink)] overflow-hidden">
      <Desktop onOpen={setOpenCaseId} />
      {openCase && (
        <CaseWindow
          case_={openCase}
          onClose={() => setOpenCaseId(null)}
        />
      )}
    </div>
  )
}

export default App
