"use client"

import { cn } from "@/lib/utils"
import { SWOTAnalysis } from "@/types/analysis"
import { TrendingUp, TrendingDown, Zap, AlertTriangle } from "lucide-react"

interface SWOTGridProps {
  swot: SWOTAnalysis
  className?: string
}

const quadrants = [
  {
    key: "strengths" as const,
    label: "Strengths",
    icon: TrendingUp,
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    dotColor: "bg-emerald-400",
    hover: "hover:border-emerald-500/50 hover:bg-emerald-500/10",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  {
    key: "weaknesses" as const,
    label: "Weaknesses",
    icon: TrendingDown,
    border: "border-red-500/30",
    bg: "bg-red-500/5",
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
    dotColor: "bg-red-400",
    hover: "hover:border-red-500/50 hover:bg-red-500/10",
    badge: "bg-red-500/20 text-red-300 border-red-500/30",
  },
  {
    key: "opportunities" as const,
    label: "Opportunities",
    icon: Zap,
    border: "border-blue-500/30",
    bg: "bg-blue-500/5",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    dotColor: "bg-blue-400",
    hover: "hover:border-blue-500/50 hover:bg-blue-500/10",
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  {
    key: "threats" as const,
    label: "Threats",
    icon: AlertTriangle,
    border: "border-orange-500/30",
    bg: "bg-orange-500/5",
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
    dotColor: "bg-orange-400",
    hover: "hover:border-orange-500/50 hover:bg-orange-500/10",
    badge: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  },
]

export function SWOTGrid({ swot, className }: SWOTGridProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4", className)}>
      {quadrants.map((q) => {
        const Icon = q.icon
        const items: string[] = swot[q.key] || []
        return (
          <div
            key={q.key}
            className={cn(
              "rounded-xl border p-4 transition-all duration-300",
              q.border,
              q.bg,
              q.hover
            )}
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", q.iconBg)}>
                <Icon className={cn("w-4 h-4", q.iconColor)} />
              </div>
              <span className="font-semibold text-foreground text-sm">{q.label}</span>
              <span className={cn(
                "ml-auto text-xs px-2 py-0.5 rounded-full border font-medium",
                q.badge
              )}>
                {items.length}
              </span>
            </div>

            {/* Items */}
            <ul className="space-y-2">
              {items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm">
                  <span className={cn(
                    "mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full",
                    q.dotColor
                  )} />
                  <span className="text-muted-foreground leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
