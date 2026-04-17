"use client"

import { cn } from "@/lib/utils"
import { MarketSize } from "@/types/analysis"
import { Globe, Target, Crosshair } from "lucide-react"

interface MarketSizeCardsProps {
  marketSize: MarketSize
  className?: string
}

const cards = [
  {
    key: "tam" as const,
    label: "TAM",
    fullLabel: "Total Addressable Market",
    icon: Globe,
    description: "Everyone who could ever want your product",
    accent: {
      border: "border-purple-500/30",
      bg: "from-purple-500/10 to-purple-500/5",
      icon: "text-purple-400",
      iconBg: "bg-purple-500/15",
      value: "text-purple-300",
      badge: "bg-purple-500/20 text-purple-300",
    },
  },
  {
    key: "sam" as const,
    label: "SAM",
    fullLabel: "Serviceable Addressable Market",
    icon: Target,
    description: "Reachable share of the total market",
    accent: {
      border: "border-indigo-500/30",
      bg: "from-indigo-500/10 to-indigo-500/5",
      icon: "text-indigo-400",
      iconBg: "bg-indigo-500/15",
      value: "text-indigo-300",
      badge: "bg-indigo-500/20 text-indigo-300",
    },
  },
  {
    key: "som" as const,
    label: "SOM",
    fullLabel: "Serviceable Obtainable Market",
    icon: Crosshair,
    description: "Realistic capture in 1–3 years",
    accent: {
      border: "border-cyan-500/30",
      bg: "from-cyan-500/10 to-cyan-500/5",
      icon: "text-cyan-400",
      iconBg: "bg-cyan-500/15",
      value: "text-cyan-300",
      badge: "bg-cyan-500/20 text-cyan-300",
    },
  },
]

export function MarketSizeCards({ marketSize, className }: MarketSizeCardsProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-3 gap-4", className)}>
      {cards.map((card, idx) => {
        const Icon = card.icon
        const value = marketSize[card.key]

        // Extract the monetary value (e.g. "$5B") from the full string
        const shortValue = value?.split("—")[0]?.split(" ")[0]?.trim() || value
        const detail = value?.includes("—") ? value.split("—").slice(1).join("—").trim() : ""

        return (
          <div
            key={card.key}
            className={cn(
              "rounded-xl border bg-gradient-to-br p-5 transition-all duration-300",
              "hover:scale-[1.02] hover:shadow-xl",
              card.accent.border,
              card.accent.bg
            )}
          >
            {/* Header badge */}
            <div className="flex items-center justify-between mb-3">
              <span className={cn(
                "text-xs font-bold px-2 py-1 rounded-md",
                card.accent.badge
              )}>
                {card.label}
              </span>
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", card.accent.iconBg)}>
                <Icon className={cn("w-4 h-4", card.accent.icon)} />
              </div>
            </div>

            {/* Value */}
            <p className={cn("text-2xl font-black mb-1", card.accent.value)}>
              {shortValue}
            </p>

            {/* Full label */}
            <p className="text-xs font-medium text-foreground mb-2">{card.fullLabel}</p>

            {/* Detail */}
            {detail && (
              <p className="text-xs text-muted-foreground leading-relaxed">{detail}</p>
            )}
            {!detail && (
              <p className="text-xs text-muted-foreground">{card.description}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
