import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'magic' | 'success' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-dusty-pink text-cocoa-plum-dark hover:bg-soft-caramel',
  secondary: 'bg-soft-caramel text-cocoa-plum-dark hover:bg-dusty-pink',
  magic: 'bg-soft-lavender text-cocoa-plum-dark hover:bg-dusty-pink',
  success: 'bg-mint-sage text-cocoa-plum-dark hover:bg-soft-caramel',
  danger: 'bg-berry-red text-white hover:bg-cocoa-plum',
  ghost: 'bg-transparent text-cocoa-plum hover:bg-soft-caramel/40',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3 text-sm',
  md: 'min-h-11 px-4 text-base',
  lg: 'min-h-12 px-5 text-lg',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  children: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  variant = 'primary', size = 'md', loading = false, disabled, children, className = '', type = 'button', ...props
}, ref) {
  const isDisabled = disabled || loading

  return (
    <button
      ref={ref}
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-panel border-2 border-cocoa-plum font-bold transition duration-150 hover:-translate-y-0.5 hover:shadow-pixel-sm active:translate-y-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 disabled:hover:shadow-none motion-reduce:transition-none ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none" aria-hidden="true" />}
      <span>{children}</span>
    </button>
  )
})
