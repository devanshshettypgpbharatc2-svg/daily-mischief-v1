function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-white/[0.06] ${className ?? ''}`} />
}

export function ProductCardSkeleton() {
  return (
    <div>
      <Skeleton className="w-full aspect-[3/4] mb-4" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  )
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-[2px]">
      {Array.from({ length: count }).map((_, i) => <ProductCardSkeleton key={i} />)}
    </div>
  )
}

export function ProductPageSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen pt-20">
      <Skeleton className="w-full aspect-[3/4]" />
      <div className="p-10 lg:p-20 space-y-6">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-12 w-4/5" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-12 w-56 mt-8" />
      </div>
    </div>
  )
}

export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 py-6 border-b border-white/[0.06]">
      <Skeleton className="w-[68px] h-[84px] flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/4 mt-4" />
      </div>
    </div>
  )
}
