import type { HTMLAttributes, ReactNode } from 'react'

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  shadow?: 'none' | 'sm' | 'md'
  shape?: 'sketchy' | 'sketchy-2' | 'sketchy-3'
}

const SHADOW = {
  none: '',
  sm: 'shadow-[3px_3px_0_var(--color-shadow)]',
  md: 'shadow-[5px_5px_0_var(--color-shadow)]',
}

export function Card({
  children,
  shadow = 'sm',
  shape = 'sketchy',
  className = '',
  ...rest
}: Props) {
  return (
    <div
      {...rest}
      className={`border-[2.5px] border-[var(--color-line)] bg-[var(--color-surface)] ${shape} ${SHADOW[shadow]} ${className}`}
    >
      {children}
    </div>
  )
}
