"use client"

import { cn } from "@/lib/utils"

interface ScoreGaugeProps {
  score: number        // 1–10
  size?: number        // px, default 180
  strokeWidth?: number // default 14
  label?: string
  showNumber?: boolean
  className?: string
}

function getScoreColor(score: number): string {
  if (score >= 8) return "#22c55e"   // green
  if (score >= 6) return "#a855f7"   // purple
  if (score >= 4) return "#f59e0b"   // amber
  return "#ef4444"                    // red
}

function getScoreLabel(score: number): string {
  if (score >= 9) return "Exceptional"
  if (score >= 8) return "Excellent"
  if (score >= 7) return "Strong"
  if (score >= 6) return "Good"
  if (score >= 5) return "Moderate"
  if (score >= 4) return "Fair"
  if (score >= 3) return "Weak"
  return "Poor"
}

export function ScoreGauge({
  score,
  size = 180,
  strokeWidth = 14,
  label,
  showNumber = true,
  className,
}: ScoreGaugeProps) {
  const clampedScore = Math.max(1, Math.min(10, score))
  const radius = (size - strokeWidth) / 2
  const center = size / 2
  const fullCircumference = 2 * Math.PI * radius

  // 270-degree gauge arc — starts from bottom-left, ends at bottom-right
  const GAUGE_DEGREES = 270
  const gaugeLength = (GAUGE_DEGREES / 360) * fullCircumference
  const gapLength = fullCircumference - gaugeLength
  const progressLength = (clampedScore / 10) * gaugeLength

  const color = getScoreColor(clampedScore)
  const scoreLabel = getScoreLabel(clampedScore)

  // rotate: start the arc at 135° from top (bottom-left corner)
  const startAngle = 135

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ overflow: "visible" }}
        >
          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${gaugeLength} ${gapLength}`}
            strokeLinecap="round"
            transform={`rotate(${startAngle}, ${center}, ${center})`}
          />
          {/* Progress arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${progressLength} ${fullCircumference - progressLength}`}
            strokeLinecap="round"
            transform={`rotate(${startAngle}, ${center}, ${center})`}
            style={{
              filter: `drop-shadow(0 0 8px ${color}80)`,
              transition: "stroke-dasharray 1s ease-in-out",
            }}
          />
          {/* Glow ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth * 0.4}
            strokeDasharray={`${progressLength} ${fullCircumference - progressLength}`}
            strokeLinecap="round"
            transform={`rotate(${startAngle}, ${center}, ${center})`}
            opacity={0.3}
          />
        </svg>

        {/* Center text */}
        {showNumber && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ paddingTop: size * 0.06 }}
          >
            <span
              className="font-black tabular-nums leading-none"
              style={{ fontSize: size * 0.28, color }}
            >
              {clampedScore}
            </span>
            <span className="text-muted-foreground font-medium" style={{ fontSize: size * 0.08 }}>
              / 10
            </span>
          </div>
        )}
      </div>

      {/* Labels */}
      <div className="text-center">
        <p className="font-semibold text-foreground" style={{ color }}>
          {scoreLabel}
        </p>
        {label && (
          <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        )}
      </div>
    </div>
  )
}
