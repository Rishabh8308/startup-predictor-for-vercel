"use client"

import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface MetricCardProps {
  label: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  accentColor?: "purple" | "green" | "blue" | "orange" | "cyan" | "red"
  size?: "sm" | "md" | "lg"
  className?: string
}

const colorMap = {
  purple: {
    icon: "text-purple-400",
    value: "text-purple-300",
    bg: "from-purple-500/10 to-purple-500/5",
    border: "border-purple-500/20",
  },
  green: {
    icon: "text-emerald-400",
    value: "text-emerald-300",
    bg: "from-emerald-500/10 to-emerald-500/5",
    border: "border-emerald-500/20",
  },
  blue: {
    icon: "text-blue-400",
    value: "text-blue-300",
    bg: "from-blue-500/10 to-blue-500/5",
    border: "border-blue-500/20",
  },
  cyan: {
    icon: "text-cyan-400",
    value: "text-cyan-300",
    bg: "from-cyan-500/10 to-cyan-500/5",
    border: "border-cyan-500/20",
  },
  orange: {
    icon: "text-orange-400",
    value: "text-orange-300",
    bg: "from-orange-500/10 to-orange-500/5",
    border: "border-orange-500/20",
  },
  red: {
    icon: "text-red-400",
    value: "text-red-300",
    bg: "from-red-500/10 to-red-500/5",
    border: "border-red-500/20",
  },
}

const sizeMap = {
  sm: { value: "text-xl", label: "text-xs", p: "p-4" },
  md: { value: "text-2xl", label: "text-sm", p: "p-5" },
  lg: { value: "text-3xl", label: "text-sm", p: "p-6" },
}

export function MetricCard({
  label,
  value,
  subtitle,
  icon: Icon,
  accentColor = "purple",
  size = "md",
  className,
}: MetricCardProps) {
  const c = colorMap[accentColor]
  const s = sizeMap[size]

  return (
    <div
      className={cn(
        "rounded-xl border bg-gradient-to-br backdrop-blur-sm",
        "transition-all duration-300 hover:scale-[1.02]",
        c.bg,
        c.border,
        s.p,
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className={cn("text-muted-foreground font-medium uppercase tracking-wide", s.label)}>
            {label}
          </p>
          <p className={cn("font-bold mt-1 truncate", s.value, c.value)}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={cn("flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10")}>
            <Icon className={cn("w-4 h-4", c.icon)} />
          </div>
        )}
      </div>
    </div>
  )
}
