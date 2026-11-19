import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description: string
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({ title, description, icon = '✦', action }: EmptyStateProps) {
  return (
    <section className="rounded-panel border-2 border-dashed border-soft-caramel bg-vanilla-cream px-6 py-10 text-center" aria-labelledby="empty-state-title">
      <span className="mb-3 inline-grid size-12 place-items-center rounded-full bg-soft-lavender text-2xl text-cocoa-plum" aria-hidden="true">{icon}</span>
      <h2 id="empty-state-title" className="pixel-heading text-xs text-cocoa-plum">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-cocoa-plum/80">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </section>
  )
}
