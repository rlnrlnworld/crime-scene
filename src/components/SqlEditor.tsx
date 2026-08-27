import Editor from '@monaco-editor/react'
import { Play, Terminal } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Button } from './Button'

type Props = {
  value: string
  onChange: (v: string) => void
  onRun: () => void
}

export function SqlEditor({ value, onChange, onRun }: Props) {
  const onRunRef = useRef(onRun)

  useEffect(() => {
    onRunRef.current = onRun
  }, [onRun])

  return (
    <div className="flex flex-col h-full bg-[var(--color-ink)]">
      <div className="flex items-center justify-between px-4 py-2.5 border-b-[2.5px] border-[var(--color-line)] bg-[var(--color-ink-2)]">
        <div className="inline-flex items-center gap-2 text-[16px] font-bold text-[var(--color-paper)] scribble-underline">
          <Terminal
            className="w-4 h-4 text-[var(--color-accent)]"
            strokeWidth={2.5}
          />
          SQL 콘솔
        </div>
        <Button variant="primary" size="sm" onClick={onRun}>
          <Play className="w-3.5 h-3.5 fill-current" strokeWidth={0} />
          실행
          <span className="ml-0.5 font-mono text-black/60">⌘↵</span>
        </Button>
      </div>
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          defaultLanguage="sql"
          theme="vs-dark"
          value={value}
          onChange={(v) => onChange(v ?? '')}
          options={{
            fontFamily:
              'JetBrains Mono, ui-monospace, SF Mono, Menlo, monospace',
            fontSize: 15,
            lineHeight: 22,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 12 },
          }}
          onMount={(editor, monaco) => {
            editor.addCommand(
              monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
              () => onRunRef.current(),
            )
          }}
        />
      </div>
    </div>
  )
}
