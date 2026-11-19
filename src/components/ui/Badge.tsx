import type { HTMLAttributes } from 'react'

type BadgeVariant = 'neutral' | 'available' | 'on_mission' | 'injured' | 'deactivated' | 'magic' | 'danger'

const styles: Record<BadgeVariant, string> = {
  neutral: 'bg-soft-caramel text-cocoa-plum-dark',
  available: 'bg-mint-sage text-cocoa-plum-dark',
  on_mission: 'bg-soft-lavender text-cocoa-plum-dark',
  injured: 'bg-dusty-pink text-cocoa-plum-dark',
  deactivated: 'bg-cocoa-plum text-white',
  magic: 'bg-soft-lavender text-cocoa-plum-dark',
  danger: 'bg-berry-red text-white',
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export function Badge({ variant = 'neutral', className = '', children, ...props }: BadgeProps) {
  return <span className={`inline-flex items-center rounded-full border border-cocoa-plum px-2.5 py-1 text-xs font-extrabold ${styles[variant]} ${className}`} {...props}>{children}</span>
}
