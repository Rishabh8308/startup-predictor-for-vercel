"use client"

import { cn } from "@/lib/utils"
import { Competitor } from "@/types/analysis"
import { Building2, ArrowRight } from "lucide-react"

interface CompetitorCardsProps {
  competitors: Competitor[]
  className?: string
}

const rankColors = [
  {
    badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    border: "border-yellow-500/20",
    bg: "hover:bg-yellow-500/5",
    dot: "bg-yellow-400",
    rank: "#1",
  },
  {
    badge: "bg-slate-400/20 text-slate-300 border-slate-400/30",
    border: "border-slate-400/20",
    bg: "hover:bg-slate-400/5",
    dot: "bg-slate-400",
    rank: "#2",
  },
  {
    badge: "bg-orange-500/15 text-orange-400 border-orange-500/25",
    border: "border-orange-500/20",
    bg: "hover:bg-orange-500/5",
    dot: "bg-orange-400",
    rank: "#3",
  },
]

export function CompetitorCards({ competitors, className }: CompetitorCardsProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {competitors.slice(0, 3).map((competitor, idx) => {
        const colors = rankColors[idx] || rankColors[2]
        return (
          <div
            key={idx}
            className={cn(
              "rounded-xl border border-white/10 bg-white/[0.02] p-4",
              "transition-all duration-300 hover:border-white/20",
              colors.bg
            )}
          >
            <div className="flex items-start gap-4">
              {/* Rank + Icon */}
              <div className="flex-shrink-0 flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className={cn(
                  "text-xs font-bold px-1.5 py-0.5 rounded border",
                  colors.badge
                )}>
                  {colors.rank}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-foreground text-sm">{competitor.name}</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  {competitor.description}
                </p>

                {/* Differentiator */}
                <div className="flex items-start gap-2 rounded-lg bg-purple-500/10 border border-purple-500/20 px-3 py-2">
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-purple-300 block mb-0.5">
                      Your Edge
                    </span>
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      {competitor.differentiator}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
