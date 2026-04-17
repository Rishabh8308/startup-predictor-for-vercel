"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SectionCard } from "@/components/shared/section-card"
import { ScoreGauge } from "@/components/shared/score-gauge"
import { ExportButton } from "@/components/shared/export-button"
import { EmptyState } from "@/components/shared/empty-state"
import { AnalysisLoadingSkeleton } from "@/components/shared/loading-skeleton"
import { SWOTGrid } from "@/components/analysis/swot-grid"
import { MarketSizeCards } from "@/components/analysis/market-size-cards"
import { CompetitorCards } from "@/components/analysis/competitor-cards"
import { BusinessBrief } from "@/components/analysis/business-brief"
import {
  AnalysisResult,
  AnalyzeRequest,
  SavedIdea,
  LS_LAST_ANALYSIS,
  LS_LAST_INPUT,
  LS_SAVED_IDEAS,
} from "@/types/analysis"
import {
  Zap, Globe, Building2, BarChart3, FileText,
  BookOpen, ArrowLeft, CheckCircle2, Sparkles
} from "lucide-react"

export default function AnalysisResultsPage() {
  const router = useRouter()
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [input, setInput] = useState<AnalyzeRequest | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [saved, setSaved] = useState(false)
  const pdfRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
    const raw = localStorage.getItem(LS_LAST_ANALYSIS)
    const rawInput = localStorage.getItem(LS_LAST_INPUT)
    if (raw) setAnalysis(JSON.parse(raw))
    if (rawInput) setInput(JSON.parse(rawInput))
  }, [])

  const handleSave = () => {
    if (!analysis || !input) return

    const existing: SavedIdea[] = JSON.parse(localStorage.getItem(LS_SAVED_IDEAS) || "[]")
    const newIdea: SavedIdea = {
      id: crypto.randomUUID(),
      ideaName: input.ideaName,
      industry: input.industry,
      targetMarket: input.targetMarket,
      ideaDescription: input.idea,
      createdAt: new Date().toISOString(),
      analysis,
    }
    localStorage.setItem(LS_SAVED_IDEAS, JSON.stringify([newIdea, ...existing]))
    setSaved(true)
  }

  if (!isMounted) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <AnalysisLoadingSkeleton />
        </div>
      </DashboardLayout>
    )
  }

  if (!analysis) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <EmptyState
            icon={Sparkles}
            title="No Analysis Found"
            description="Run an analysis first by entering your startup idea on the Analyze page."
            action={
              <button
                onClick={() => router.push("/analyze")}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600
                  text-white font-semibold text-sm shadow-lg shadow-purple-500/25
                  hover:from-purple-500 hover:to-indigo-500 transition-all"
              >
                Analyze an Idea
              </button>
            }
          />
        </div>
      </DashboardLayout>
    )
  }

  const filename = `${input?.ideaName?.replace(/\s+/g, "-").toLowerCase() || "startup"}-analysis.pdf`

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/analyze")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              New Analysis
            </button>
            <span className="text-border">|</span>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold text-foreground text-sm truncate max-w-[200px]">
                {input?.ideaName || "Analysis Results"}
              </span>
              {input?.industry && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {input.industry}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saved}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                border border-white/10 bg-white/5 text-foreground transition-all
                hover:bg-white/10 hover:border-white/20
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saved ? (
                <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Saved!</>
              ) : (
                <><BookOpen className="w-4 h-4" /> Save to Library</>
              )}
            </button>
            <ExportButton targetId="pdf-export-target" filename={filename} />
          </div>
        </div>

        {/* PDF Export Target */}
        <div id="pdf-export-target" ref={pdfRef} className="space-y-6">
          {/* ── HERO: Viability Score ─────────────────────────────────── */}
          <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent p-8">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <ScoreGauge
                score={analysis.viabilityScore}
                size={180}
                label="Viability Score"
              />
              <div className="flex-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/30 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-xs font-medium text-purple-300">Gemini AI Analysis</span>
                </div>
                <h1 className="text-3xl font-black text-foreground mb-2">
                  {input?.ideaName || "Startup Analysis"}
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-prose">
                  {analysis.businessBrief}
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  {input?.industry && (
                    <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                      🏢 {input.industry}
                    </span>
                  )}
                  {input?.targetMarket && (
                    <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                      🎯 {input.targetMarket}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── SWOT ──────────────────────────────────────────────────── */}
          <SectionCard
            title="SWOT Analysis"
            subtitle="AI-generated strengths, weaknesses, opportunities & threats"
            icon={Zap}
            accentColor="purple"
          >
            <SWOTGrid swot={analysis.swot} />
          </SectionCard>

          {/* ── MARKET SIZE ───────────────────────────────────────────── */}
          <SectionCard
            title="Market Size Estimation"
            subtitle="Total Addressable, Serviceable Addressable & Obtainable Market"
            icon={Globe}
            accentColor="blue"
          >
            <MarketSizeCards marketSize={analysis.marketSize} />
          </SectionCard>

          {/* ── COMPETITORS ───────────────────────────────────────────── */}
          <SectionCard
            title="Top 3 Competitors"
            subtitle="Key players in the space and how you differentiate"
            icon={Building2}
            accentColor="orange"
          >
            <CompetitorCards competitors={analysis.competitors} />
          </SectionCard>

          {/* ── BUSINESS BRIEF + RECOMMENDATION ──────────────────────── */}
          <SectionCard
            title="Business Brief & Recommendation"
            subtitle="Executive summary and investor-grade recommendation"
            icon={FileText}
            accentColor="purple"
          >
            <BusinessBrief
              analysis={analysis}
              ideaName={input?.ideaName || ""}
              industry={input?.industry || ""}
            />
          </SectionCard>

          {/* ── QUICK STATS ───────────────────────────────────────────── */}
          <SectionCard
            title="Analysis Summary"
            icon={BarChart3}
            accentColor="cyan"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-3xl font-black gradient-text">{analysis.viabilityScore}/10</p>
                <p className="text-xs text-muted-foreground mt-1">Viability</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-3xl font-black text-foreground">{
                  (analysis.swot.strengths?.length || 0) +
                  (analysis.swot.opportunities?.length || 0)
                }</p>
                <p className="text-xs text-muted-foreground mt-1">Positives</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-3xl font-black text-foreground">{
                  (analysis.swot.weaknesses?.length || 0) +
                  (analysis.swot.threats?.length || 0)
                }</p>
                <p className="text-xs text-muted-foreground mt-1">Risk Factors</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-3xl font-black text-foreground">{analysis.competitors.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Competitors</p>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-white/10">
          <button
            onClick={() => router.push("/ideas")}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            View Ideas Library
          </button>
          <div className="flex gap-3">
            {!saved && (
              <button
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-white/10
                  bg-white/5 text-foreground hover:bg-white/10 transition-all"
              >
                Save to Library
              </button>
            )}
            <button
              onClick={() => router.push("/analyze")}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold
                bg-gradient-to-r from-purple-600 to-indigo-600 text-white
                hover:from-purple-500 hover:to-indigo-500 transition-all
                shadow-lg shadow-purple-500/25 border border-purple-500/30"
            >
              Analyze Another Idea
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
