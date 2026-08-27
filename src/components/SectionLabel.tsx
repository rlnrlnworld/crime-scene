import type { ReactNode } from 'react'

type Props = {
  icon?: ReactNode
  children: ReactNode
  meta?: ReactNode
  className?: string
  underline?: boolean
}

export function SectionLabel({
  icon,
  children,
  meta,
  className = '',
  underline = false,
}: Props) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div
        className={`inline-flex items-center gap-2 text-[15px] font-bold text-[var(--color-paper)] ${
          underline ? 'scribble-underline' : ''
        }`}
      >
        {icon}
        <span>{children}</span>
      </div>
      {meta && (
        <span className="text-[15px] text-[var(--color-muted)] font-mono">
          {meta}
        </span>
      )}
    </div>
  )
}
