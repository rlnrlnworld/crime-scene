import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'danger'
type Size = 'sm' | 'md'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  children: ReactNode
  fullWidth?: boolean
}

const OUTER: Record<Variant, string> = {
  primary: 'border-[var(--color-line)] bg-[var(--color-accent-shadow)]',
  secondary: 'border-[var(--color-line)] bg-[var(--color-ink)]',
  danger: 'border-[var(--color-line)] bg-[#2a0808]',
}

const INNER: Record<Variant, string> = {
  primary:
    'bg-[var(--color-accent)] text-black border-[var(--color-line)] group-hover:brightness-[1.06]',
  secondary:
    'bg-[var(--color-surface-2)] text-[var(--color-paper)] border-[var(--color-line)] group-hover:bg-[var(--color-accent)] group-hover:text-black',
  danger:
    'bg-[var(--color-blood)] text-white border-[var(--color-line)] group-hover:brightness-110',
}

const SIZE_INNER: Record<Size, string> = {
  sm: 'px-3 py-1 gap-1.5 text-[15px]',
  md: 'px-4 py-1.5 gap-2 text-[15px]',
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth,
  className = '',
  disabled,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={`group relative inline-block border-[2px] sketchy-btn transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${OUTER[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
    >
      <span
        className={`inline-flex items-center justify-center border-[2px] sketchy-btn font-bold select-none mx-[-2px] w-[calc(100%+4px)] translate-y-[-3px] group-hover:translate-y-[-4px] group-active:translate-y-[-1px] group-disabled:!translate-y-[-3px] transition-transform duration-100 ${INNER[variant]} ${SIZE_INNER[size]}`}
      >
        {children}
      </span>
    </button>
  )
}
