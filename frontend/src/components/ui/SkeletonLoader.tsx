interface SkeletonLoaderProps {
  className?: string
}

export function SkeletonLoader({ className }: SkeletonLoaderProps) {
  return (
    <div
      className={`bg-surface-raised rounded-lg animate-pulse ${className ?? ''}`}
      aria-hidden="true"
    />
  )
}
