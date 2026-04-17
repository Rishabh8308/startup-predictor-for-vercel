"use client"

import { cn } from "@/lib/utils"
import { AnalysisResult } from "@/types/analysis"
import { FileText, Lightbulb } from "lucide-react"

interface BusinessBriefProps {
  analysis: AnalysisResult
  ideaName: string
  industry: string
  className?: string
}

export function BusinessBrief({ analysis, ideaName, industry, className }: BusinessBriefProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Executive Summary */}
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-sm font-semibold text-foreground">Executive Summary</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {analysis.businessBrief}
        </p>
      </div>

      {/* Key Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
          <p className="text-2xl font-black text-foreground mb-0.5">{analysis.viabilityScore}<span className="text-sm text-muted-foreground">/10</span></p>
          <p className="text-xs text-muted-foreground">Viability</p>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
          <p className="text-2xl font-black text-foreground mb-0.5">{analysis.competitors.length}</p>
          <p className="text-xs text-muted-foreground">Competitors</p>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
          <p className="text-lg font-black text-foreground mb-0.5 truncate">{industry}</p>
          <p className="text-xs text-muted-foreground">Industry</p>
        </div>
      </div>

      {/* Recommendation */}
      <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-sm font-semibold text-foreground">Investor Recommendation</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {analysis.recommendation}
        </p>
      </div>
    </div>
  )
}
