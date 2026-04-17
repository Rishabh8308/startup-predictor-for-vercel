"use client"

import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface SectionCardProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
  iconColor?: string
  children: React.ReactNode
  className?: string
  accentColor?: "purple" | "green" | "blue" | "orange" | "red" | "cyan"
  id?: string
}

const accentMap = {
  purple: {
    border: "border-purple-500/30",
    icon: "text-purple-400",
    badge: "bg-purple-500/20 text-purple-300",
    glow: "hover:border-purple-500/50 hover:shadow-purple-500/10",
  },
  green: {
    border: "border-emerald-500/30",
    icon: "text-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-300",
    glow: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
  },
  blue: {
    border: "border-blue-500/30",
    icon: "text-blue-400",
    badge: "bg-blue-500/20 text-blue-300",
    glow: "hover:border-blue-500/50 hover:shadow-blue-500/10",
  },
  cyan: {
    border: "border-cyan-500/30",
    icon: "text-cyan-400",
    badge: "bg-cyan-500/20 text-cyan-300",
    glow: "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
  },
  orange: {
    border: "border-orange-500/30",
    icon: "text-orange-400",
    badge: "bg-orange-500/20 text-orange-300",
    glow: "hover:border-orange-500/50 hover:shadow-orange-500/10",
  },
  red: {
    border: "border-red-500/30",
    icon: "text-red-400",
    badge: "bg-red-500/20 text-red-300",
    glow: "hover:border-red-500/50 hover:shadow-red-500/10",
  },
}

export function SectionCard({
  title,
  subtitle,
  icon: Icon,
  children,
  className,
  accentColor = "purple",
  id,
}: SectionCardProps) {
  const accent = accentMap[accentColor]

  return (
    <div
      id={id}
      className={cn(
        "rounded-2xl border bg-white/[0.03] backdrop-blur-xl p-6",
        "shadow-xl transition-all duration-300 hover:shadow-2xl",
        "hover:bg-white/[0.05]",
        accent.border,
        accent.glow,
        className
      )}
    >
      {(title || Icon) && (
        <div className="flex items-center gap-3 mb-5">
          {Icon && (
            <div className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center",
              "bg-white/5 border border-white/10"
            )}>
              <Icon className={cn("w-5 h-5", accent.icon)} />
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  )
}
