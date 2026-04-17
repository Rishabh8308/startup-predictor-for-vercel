"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SWOTGrid } from "@/components/analysis/swot-grid"
import { ScoreGauge } from "@/components/shared/score-gauge"
import { MarketSizeCards } from "@/components/analysis/market-size-cards"
import { CompetitorCards } from "@/components/analysis/competitor-cards"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Scale, Sparkles, AlertCircle, CheckCircle, CheckCircle2,
  AlertTriangle, Target, Brain, BookOpen, ChevronDown
} from "lucide-react"
import { SavedIdea, LS_SAVED_IDEAS } from "@/types/analysis"
import { cn } from "@/lib/utils"

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface PredictionResponse {
  successProbability: number
  riskLevel: "low" | "medium" | "high"
  breakdown: {
    fundingScore: number
    teamScore: number
    marketScore: number
    experienceScore: number
  }
  featureImportance: {
    funding: number
    teamSize: number
    marketSize: number
    founderExperience: number
  }
  report: {
    strengths: string[]
    risks: string[]
    recommendation: string
  }
}

interface StartupData {
  funding: string
  teamSize: string
  marketSize: string
  founderExperience: string
}

interface ComparisonResult {
  startupA: PredictionResponse
  startupB: PredictionResponse
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

const formatCurrency = (value: number): string => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
  return `$${value}`
}

const getRiskColor = (riskLevel: "low" | "medium" | "high"): string => {
  switch (riskLevel) {
    case "low": return "bg-emerald-500/20 text-emerald-200 border border-emerald-400/40"
    case "medium": return "bg-amber-500/20 text-amber-200 border border-amber-400/40"
    case "high": return "bg-red-500/20 text-red-200 border border-red-400/40"
  }
}

/* ─── AI Compare Tab ──────────────────────────────────────────────────────── */

function AICompareTab() {
  const [ideas, setIdeas] = useState<SavedIdea[]>([])
  const [idA, setIdA] = useState("")
  const [idB, setIdB] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const raw = localStorage.getItem(LS_SAVED_IDEAS)
    if (raw) {
      const saved: SavedIdea[] = JSON.parse(raw)
      setIdeas(saved)
      // Pre-select from ideas page if available
      const storedA = localStorage.getItem("compareIdeaA")
      const storedB = localStorage.getItem("compareIdeaB")
      if (storedA && saved.find(i => i.id === storedA)) setIdA(storedA)
      if (storedB && saved.find(i => i.id === storedB)) setIdB(storedB)
      localStorage.removeItem("compareIdeaA")
      localStorage.removeItem("compareIdeaB")
    }
  }, [])

  if (!isMounted) return null

  const ideaA = ideas.find(i => i.id === idA)
  const ideaB = ideas.find(i => i.id === idB)
  const canCompare = ideaA && ideaB && idA !== idB
  const scoreA = ideaA?.analysis.viabilityScore ?? 0
  const scoreB = ideaB?.analysis.viabilityScore ?? 0
  const winner = scoreA > scoreB ? "A" : scoreB > scoreA ? "B" : "tie"

  if (ideas.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No Saved Ideas Yet"
        description="Save at least 2 analyses from the Analyze page, then return here to compare them."
        action={
          <a href="/analyze" className="inline-flex px-5 py-2.5 rounded-xl bg-gradient-to-r
            from-purple-600 to-indigo-600 text-white font-semibold text-sm
            hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/25">
            Analyze an Idea
          </a>
        }
      />
    )
  }

  if (ideas.length < 2) {
    return (
      <EmptyState
        icon={Scale}
        title="Need at Least 2 Ideas"
        description="You have only 1 saved idea. Analyze another idea to unlock AI comparison."
        action={
          <a href="/analyze" className="inline-flex px-5 py-2.5 rounded-xl bg-gradient-to-r
            from-purple-600 to-indigo-600 text-white font-semibold text-sm
            hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/25">
            Analyze Another Idea
          </a>
        }
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Selectors */}
      <div className="grid lg:grid-cols-2 gap-6">
        {(["A", "B"] as const).map((side) => {
          const selectedId = side === "A" ? idA : idB
          const setSelected = side === "A" ? setIdA : setIdB
          const idea = side === "A" ? ideaA : ideaB
          const otherSelectedId = side === "A" ? idB : idA

          return (
            <div key={side} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white",
                  side === "A" ? "bg-purple-600" : "bg-indigo-600"
                )}>
                  {side}
                </div>
                <span className="font-semibold text-foreground">Startup {side}</span>
              </div>

              <div className="relative">
                <select
                  value={selectedId}
                  onChange={e => setSelected(e.target.value)}
                  className="w-full h-11 pl-4 pr-10 rounded-xl bg-white/5 border border-white/10
                    text-foreground text-sm appearance-none cursor-pointer
                    focus:outline-none focus:border-purple-500/50 transition-all"
                >
                  <option value="" className="bg-[#0f0a1e]">— Select a saved idea —</option>
                  {ideas
                    .filter(i => i.id !== otherSelectedId)
                    .map(i => (
                      <option key={i.id} value={i.id} className="bg-[#0f0a1e]">
                        {i.ideaName} ({i.industry}) — {i.analysis.viabilityScore}/10
                      </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              {idea && (
                <div className="mt-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                  <p className="text-sm font-semibold text-foreground">{idea.ideaName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{idea.industry} · Score: {idea.analysis.viabilityScore}/10</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{idea.analysis.businessBrief}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Comparison Results */}
      {canCompare && ideaA && ideaB && (
        <div className="space-y-6">
          {/* Winner Banner */}
          <div className={cn("rounded-2xl p-5 border text-center",
            winner === "tie"
              ? "border-white/20 bg-white/5"
              : "border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-indigo-500/5"
          )}>
            {winner === "tie" ? (
              <p className="text-lg font-bold text-foreground">🤝 It&apos;s a Tie!</p>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-1">Higher Viability Score</p>
                <p className="text-2xl font-black gradient-text">
                  {winner === "A" ? ideaA.ideaName : ideaB.ideaName} wins!
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Score difference: {Math.abs(scoreA - scoreB)} point{Math.abs(scoreA - scoreB) !== 1 ? "s" : ""}
                </p>
              </>
            )}
          </div>

          {/* Viability Gauges */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="text-base font-semibold text-foreground mb-6 text-center">Viability Score</h3>
            <div className="grid grid-cols-2 gap-6">
              {[
                { idea: ideaA, side: "A", isWinner: winner === "A" },
                { idea: ideaB, side: "B", isWinner: winner === "B" },
              ].map(({ idea, side, isWinner }) => (
                <div key={side} className={cn("flex flex-col items-center rounded-xl p-4 border transition-all",
                  isWinner ? "border-purple-500/40 bg-purple-500/5" : "border-white/10 bg-white/5"
                )}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={cn("w-6 h-6 rounded-md text-xs font-black text-white flex items-center justify-center",
                      side === "A" ? "bg-purple-600" : "bg-indigo-600"
                    )}>
                      {side}
                    </div>
                    <span className="text-sm font-semibold text-foreground truncate max-w-[140px]">{idea.ideaName}</span>
                    {isWinner && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                  </div>
                  <ScoreGauge score={idea.analysis.viabilityScore} size={140} />
                </div>
              ))}
            </div>
          </div>

          {/* SWOT Side-by-Side */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="text-base font-semibold text-foreground mb-6">SWOT Comparison</h3>
            <div className="grid lg:grid-cols-2 gap-6">
              {[ideaA, ideaB].map((idea, idx) => (
                <div key={idx}>
                  <p className="text-sm font-semibold text-muted-foreground mb-3">{idea.ideaName}</p>
                  <SWOTGrid swot={idea.analysis.swot} />
                </div>
              ))}
            </div>
          </div>

          {/* Market Size Side-by-Side */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="text-base font-semibold text-foreground mb-6">Market Size Comparison</h3>
            <div className="space-y-6">
              {[ideaA, ideaB].map((idea, idx) => (
                <div key={idx}>
                  <p className="text-sm font-semibold text-muted-foreground mb-3">{idea.ideaName}</p>
                  <MarketSizeCards marketSize={idea.analysis.marketSize} />
                </div>
              ))}
            </div>
          </div>

          {/* Competitors Side-by-Side */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="text-base font-semibold text-foreground mb-6">Competitor Landscape</h3>
            <div className="grid lg:grid-cols-2 gap-6">
              {[ideaA, ideaB].map((idea, idx) => (
                <div key={idx}>
                  <p className="text-sm font-semibold text-muted-foreground mb-3">{idea.ideaName}</p>
                  <CompetitorCards competitors={idea.analysis.competitors} />
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations Side-by-Side */}
          <div className="grid lg:grid-cols-2 gap-6">
            {[ideaA, ideaB].map((idea, idx) => (
              <div key={idx} className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-4 h-4 text-indigo-400" />
                  <p className="text-sm font-semibold text-foreground">{idea.ideaName}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {idea.analysis.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!canCompare && idA && idB && idA === idB && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          Please select two different ideas to compare.
        </div>
      )}
    </div>
  )
}

/* ─── Numeric Compare Tab (original logic preserved) ─────────────────────── */

function NumericCompareTab() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null)

  const [startupA, setStartupA] = useState<StartupData>({
    funding: "", teamSize: "", marketSize: "", founderExperience: "",
  })
  const [startupB, setStartupB] = useState<StartupData>({
    funding: "", teamSize: "", marketSize: "", founderExperience: "",
  })

  const handleInputChange = (startup: "A" | "B", field: keyof StartupData, value: string) => {
    if (startup === "A") setStartupA(prev => ({ ...prev, [field]: value }))
    else setStartupB(prev => ({ ...prev, [field]: value }))
  }

  const validateInputs = (data: StartupData): boolean => {
    const funding = parseFloat(data.funding)
    const teamSize = parseFloat(data.teamSize)
    const marketSize = parseFloat(data.marketSize)
    const founderExperience = parseFloat(data.founderExperience)
    return (
      !isNaN(funding) && funding > 0 &&
      !isNaN(teamSize) && teamSize > 0 &&
      !isNaN(marketSize) && marketSize > 0 &&
      !isNaN(founderExperience) && founderExperience >= 0
    )
  }

  const handleCompare = async () => {
    setError(null)
    setComparisonResult(null)
    if (!validateInputs(startupA)) { setError("Please enter valid values for Startup A"); return }
    if (!validateInputs(startupB)) { setError("Please enter valid values for Startup B"); return }
    setIsLoading(true)

    try {
      const [responseA, responseB] = await Promise.all([
        fetch("/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            funding: parseFloat(startupA.funding),
            teamSize: parseFloat(startupA.teamSize),
            marketSize: parseFloat(startupA.marketSize),
            founderExperience: parseFloat(startupA.founderExperience),
          }),
        }),
        fetch("/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            funding: parseFloat(startupB.funding),
            teamSize: parseFloat(startupB.teamSize),
            marketSize: parseFloat(startupB.marketSize),
            founderExperience: parseFloat(startupB.founderExperience),
          }),
        }),
      ])

      if (!responseA.ok) throw new Error((await responseA.json()).error || "Failed for Startup A")
      if (!responseB.ok) throw new Error((await responseB.json()).error || "Failed for Startup B")

      const dataA = await responseA.json()
      const dataB = await responseB.json()
      setComparisonResult({ startupA: dataA, startupB: dataB })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during comparison")
    } finally {
      setIsLoading(false)
    }
  }

  const getWinner = (): "A" | "B" | "tie" => {
    if (!comparisonResult) return "tie"
    const { startupA: a, startupB: b } = comparisonResult
    if (a.successProbability > b.successProbability) return "A"
    if (b.successProbability > a.successProbability) return "B"
    return "tie"
  }

  const isWinner = (s: "A" | "B") => getWinner() === s

  const inputFields = [
    { label: "Funding Amount ($)", field: "funding" as keyof StartupData, placeholder: "e.g. 1000000" },
    { label: "Team Size", field: "teamSize" as keyof StartupData, placeholder: "e.g. 8" },
    { label: "Market Size ($)", field: "marketSize" as keyof StartupData, placeholder: "e.g. 500000000" },
    { label: "Founder Experience (yrs)", field: "founderExperience" as keyof StartupData, placeholder: "e.g. 5" },
  ]

  return (
    <div>
      {error && (
        <Alert className="mb-6 border-red-400/40 bg-red-500/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-200 ml-2">{error}</AlertDescription>
        </Alert>
      )}

      {!comparisonResult ? (
        <div>
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {(["A", "B"] as const).map(side => {
              const data = side === "A" ? startupA : startupB
              return (
                <div key={side} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white",
                      side === "A" ? "bg-purple-600" : "bg-indigo-600"
                    )}>
                      {side}
                    </div>
                    <h2 className="text-base font-bold text-foreground">Startup {side}</h2>
                  </div>
                  <div className="space-y-4">
                    {inputFields.map(({ label, field, placeholder }) => (
                      <div key={field}>
                        <Label className="text-muted-foreground text-xs mb-1.5 block">{label}</Label>
                        <Input
                          type="number"
                          placeholder={placeholder}
                          value={data[field]}
                          onChange={e => handleInputChange(side, field, e.target.value)}
                          className="bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground rounded-xl focus:border-purple-500/50"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleCompare}
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500
                text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/25
                hover:shadow-purple-500/40 disabled:opacity-50 border border-purple-500/30"
            >
              {isLoading ? "Comparing…" : "Compare Startups"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Button
            onClick={() => {
              setComparisonResult(null)
              setStartupA({ funding: "", teamSize: "", marketSize: "", founderExperience: "" })
              setStartupB({ funding: "", teamSize: "", marketSize: "", founderExperience: "" })
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-foreground rounded-xl border border-white/20"
          >
            ← New Comparison
          </Button>

          {/* Metrics Table */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 overflow-x-auto">
            <h3 className="text-base font-semibold text-foreground mb-5">Input Metrics</h3>
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-muted-foreground text-xs font-medium">Metric</th>
                  <th className={cn("text-center py-3 px-4 text-sm font-bold", isWinner("A") ? "text-purple-400" : "text-foreground")}>
                    Startup A {isWinner("A") && "🏆"}
                  </th>
                  <th className={cn("text-center py-3 px-4 text-sm font-bold", isWinner("B") ? "text-indigo-400" : "text-foreground")}>
                    Startup B {isWinner("B") && "🏆"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Funding", valA: formatCurrency(parseFloat(startupA.funding)), valB: formatCurrency(parseFloat(startupB.funding)) },
                  { label: "Team Size", valA: `${Math.round(parseFloat(startupA.teamSize))} people`, valB: `${Math.round(parseFloat(startupB.teamSize))} people` },
                  { label: "Market Size", valA: formatCurrency(parseFloat(startupA.marketSize)), valB: formatCurrency(parseFloat(startupB.marketSize)) },
                  { label: "Founder Experience", valA: `${Math.round(parseFloat(startupA.founderExperience))} yrs`, valB: `${Math.round(parseFloat(startupB.founderExperience))} yrs` },
                ].map(row => (
                  <tr key={row.label} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-muted-foreground text-sm">{row.label}</td>
                    <td className="py-3 px-4 text-center text-foreground font-semibold text-sm">{row.valA}</td>
                    <td className="py-3 px-4 text-center text-foreground font-semibold text-sm">{row.valB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Results Cards */}
          <div className="grid lg:grid-cols-2 gap-6">
            {(["A", "B"] as const).map(side => {
              const res = side === "A" ? comparisonResult.startupA : comparisonResult.startupB
              const winner = isWinner(side)
              return (
                <div key={side} className={cn(
                  "rounded-2xl border backdrop-blur-xl p-6 transition-all",
                  winner
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : "border-white/10 bg-white/[0.03]"
                )}>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-7 h-7 rounded-lg text-xs font-black text-white flex items-center justify-center",
                        side === "A" ? "bg-purple-600" : "bg-indigo-600"
                      )}>
                        {side}
                      </div>
                      <h3 className="text-base font-bold text-foreground">Startup {side}</h3>
                    </div>
                    {winner && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs text-emerald-200 font-semibold">Winner</span>
                      </div>
                    )}
                  </div>

                  <div className="text-center mb-5 p-5 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-muted-foreground text-xs mb-1">Success Probability</p>
                    <p className="text-5xl font-black text-purple-400">{res.successProbability}%</p>
                  </div>

                  <div className="mb-5">
                    <p className="text-xs text-muted-foreground mb-2">Risk Level</p>
                    <span className={cn("inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide", getRiskColor(res.riskLevel))}>
                      {res.riskLevel}
                    </span>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <p className="text-xs font-semibold text-muted-foreground">Score Breakdown</p>
                    {[
                      { label: "Funding", val: res.breakdown.fundingScore, color: "from-purple-500 to-indigo-500" },
                      { label: "Team", val: res.breakdown.teamScore, color: "from-indigo-500 to-blue-500" },
                      { label: "Market", val: res.breakdown.marketScore, color: "from-cyan-500 to-teal-500" },
                      { label: "Experience", val: res.breakdown.experienceScore, color: "from-emerald-500 to-green-500" },
                    ].map(item => (
                      <div key={item.label}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-muted-foreground">{item.label}</span>
                          <span className="text-xs font-semibold text-foreground">{item.val}/100</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className={cn("h-full bg-gradient-to-r rounded-full", item.color)}
                            style={{ width: `${item.val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Report */}
                  <div className="mt-5 pt-4 border-t border-white/10 space-y-3">
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <p className="text-xs font-semibold text-foreground">Strengths</p>
                      </div>
                      {res.report.strengths.map((s, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground mb-1">
                          <span className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                          {s}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                        <p className="text-xs font-semibold text-foreground">Risks</p>
                      </div>
                      {res.report.risks.map((r, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground mb-1">
                          <span className="w-1 h-1 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                          {r}
                        </div>
                      ))}
                    </div>
                    <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Target className="w-3.5 h-3.5 text-indigo-400" />
                        <p className="text-xs font-semibold text-foreground">Recommendation</p>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{res.report.recommendation}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Key Insights */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-base font-semibold text-foreground">Key Insights</h3>
            </div>
            <div className="space-y-4">
              {[
                {
                  label: "Success Probability Gap",
                  value: getWinner() !== "tie"
                    ? `Startup ${getWinner()} has ${Math.abs(
                        comparisonResult.startupA.successProbability - comparisonResult.startupB.successProbability
                      ).toFixed(1)}% higher success probability.`
                    : "Both startups have equal success probability.",
                },
                {
                  label: "Risk Profile",
                  value: `Startup A: ${comparisonResult.startupA.riskLevel} risk · Startup B: ${comparisonResult.startupB.riskLevel} risk`,
                },
                {
                  label: "Funding Strength",
                  value: comparisonResult.startupA.breakdown.fundingScore > comparisonResult.startupB.breakdown.fundingScore
                    ? "Startup A has stronger funding relative to market."
                    : "Startup B has stronger funding relative to market.",
                },
              ].map(item => (
                <div key={item.label} className="flex gap-3">
                  <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-0.5">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Main Compare Page ───────────────────────────────────────────────────── */

function ComparePageInner() {
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<"numeric" | "ai">(
    searchParams.get("mode") === "ai" ? "ai" : "numeric"
  )

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-4">
            <Scale className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">Side-by-Side Analysis</span>
          </div>
          <h1 className="text-3xl font-black text-foreground mb-3">Compare Startups</h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Compare two startups side-by-side — using saved AI analyses or raw numeric inputs.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1 gap-1">
            {([
              { key: "ai", label: "🤖 Compare AI Ideas", desc: "Saved analyses" },
              { key: "numeric", label: "📊 Compare by Numbers", desc: "ML prediction" },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setMode(tab.key)}
                className={cn(
                  "px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
                  mode === tab.key
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {mode === "ai" ? <AICompareTab /> : <NumericCompareTab />}
      </div>
    </DashboardLayout>
  )
}

export default function ComparePage() {
  return (
    <Suspense fallback={<DashboardLayout><div className="max-w-6xl mx-auto animate-pulse"><div className="h-8 bg-white/5 rounded-xl mb-4 w-48 mx-auto" /><div className="h-64 bg-white/5 rounded-2xl" /></div></DashboardLayout>}>
      <ComparePageInner />
    </Suspense>
  )
}
