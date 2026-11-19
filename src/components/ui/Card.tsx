import type { HTMLAttributes, ReactNode } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  interactive?: boolean
}

export function Card({ children, interactive = false, className = '', ...props }: CardProps) {
  return (
    <div className={`rounded-panel border-2 border-soft-caramel bg-vanilla-cream p-5 shadow-pixel-sm ${interactive ? 'transition duration-150 hover:-translate-y-1 hover:shadow-pixel motion-reduce:transition-none' : ''} ${className}`} {...props}>
      {children}
    </div>
  )
}

export function Panel({ children, className = '', ...props }: CardProps) {
  return <Card className={`pixel-border ${className}`} {...props}>{children}</Card>
}
