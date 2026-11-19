interface LoadingIndicatorProps {
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'size-5 border-2', md: 'size-8 border-3', lg: 'size-12 border-4' }

export function LoadingIndicator({ label = 'Loading', size = 'md' }: LoadingIndicatorProps) {
  return (
    <div className="inline-flex items-center gap-3 text-cocoa-plum" role="status">
      <span className={`${sizes[size]} animate-spin rounded-full border-cocoa-plum border-r-transparent motion-reduce:animate-none`} aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
