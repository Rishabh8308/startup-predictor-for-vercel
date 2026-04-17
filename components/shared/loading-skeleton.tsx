"use client"

import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string
  rows?: number
}

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg bg-white/5 animate-pulse",
        className
      )}
    />
  )
}

export function LoadingSkeleton({ className, rows = 3 }: LoadingSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonLine
          key={i}
          className={cn(
            "h-4",
            i === 0 && "w-3/4",
            i === 1 && "w-full",
            i === 2 && "w-5/6",
            i > 2 && "w-full"
          )}
        />
      ))}
    </div>
  )
}

export function AnalysisLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Hero skeleton */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-44 h-44 rounded-full bg-white/5 animate-pulse" />
          <SkeletonLine className="w-48 h-6" />
          <SkeletonLine className="w-72 h-4" />
        </div>
      </div>

      {/* SWOT skeleton */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <SkeletonLine className="w-32 h-5 mb-5" />
        <div className="grid grid-cols-2 gap-4">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="rounded-xl bg-white/5 p-4 space-y-2">
              <SkeletonLine className="w-24 h-4" />
              <SkeletonLine className="w-full h-3" />
              <SkeletonLine className="w-5/6 h-3" />
              <SkeletonLine className="w-4/5 h-3" />
            </div>
          ))}
        </div>
      </div>

      {/* Market size skeleton */}
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map(i => (
          <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-2 animate-pulse">
            <SkeletonLine className="w-12 h-3" />
            <SkeletonLine className="w-24 h-6" />
            <SkeletonLine className="w-full h-3" />
          </div>
        ))}
      </div>
    </div>
  )
}
