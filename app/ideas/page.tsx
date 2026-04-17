"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { EmptyState } from "@/components/shared/empty-state"
import { ScoreGauge } from "@/components/shared/score-gauge"
import { SavedIdea, LS_SAVED_IDEAS } from "@/types/analysis"
import {
  BookOpen, Sparkles, Trash2, ExternalLink,
  Scale, Pencil, Calendar, Building2, Search,
  TrendingUp, CheckCircle2, X
} from "lucide-react"
import { cn } from "@/lib/utils"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  })
}

function getScoreColor(score: number) {
  if (score >= 8) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
  if (score >= 6) return "text-purple-400 bg-purple-500/10 border-purple-500/30"
  if (score >= 4) return "text-amber-400 bg-amber-500/10 border-amber-500/30"
  return "text-red-400 bg-red-500/10 border-red-500/30"
}

export default function IdeasPage() {
  const router = useRouter()
  const [ideas, setIdeas] = useState<SavedIdea[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [renameId, setRenameId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const [compareIds, setCompareIds] = useState<string[]>([])

  useEffect(() => {
    setIsMounted(true)
    const raw = localStorage.getItem(LS_SAVED_IDEAS)
    if (raw) setIdeas(JSON.parse(raw))
  }, [])

  const save = (updated: SavedIdea[]) => {
    setIdeas(updated)
    localStorage.setItem(LS_SAVED_IDEAS, JSON.stringify(updated))
  }

  const handleDelete = (id: string) => {
    save(ideas.filter(i => i.id !== id))
    setCompareIds(prev => prev.filter(cid => cid !== id))
  }

  const handleRenameStart = (idea: SavedIdea) => {
    setRenameId(idea.id)
    setRenameValue(idea.ideaName)
  }

  const handleRenameSave = () => {
    if (!renameId || !renameValue.trim()) return
    save(ideas.map(i => i.id === renameId ? { ...i, ideaName: renameValue.trim() } : i))
    setRenameId(null)
  }

  const handleOpen = (idea: SavedIdea) => {
    localStorage.setItem("lastStartupAnalysis", JSON.stringify(idea.analysis))
    localStorage.setItem("lastAnalysisInput", JSON.stringify({
      ideaName: idea.ideaName,
      idea: idea.ideaDescription,
      industry: idea.industry,
      targetMarket: idea.targetMarket,
    }))
    router.push("/analyze/results")
  }

  const toggleCompare = (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(cid => cid !== id)
      if (prev.length >= 2) return [prev[1], id]
      return [...prev, id]
    })
  }

  const handleCompare = () => {
    if (compareIds.length !== 2) return
    const [idA, idB] = compareIds
    localStorage.setItem("compareIdeaA", idA)
    localStorage.setItem("compareIdeaB", idB)
    router.push("/compare?mode=ai")
  }

  const filtered = ideas.filter(i =>
    i.ideaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.industry.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isMounted) return null

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-foreground mb-1">
              Ideas <span className="gradient-text">Library</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              {ideas.length} saved {ideas.length === 1 ? "idea" : "ideas"} · Compare up to 2 at a time
            </p>
          </div>
          <button
            onClick={() => router.push("/analyze")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
              bg-gradient-to-r from-purple-600 to-indigo-600 text-white
              hover:from-purple-500 hover:to-indigo-500 transition-all
              shadow-lg shadow-purple-500/25 border border-purple-500/30"
          >
            <Sparkles className="w-4 h-4" />
            Analyze New Idea
          </button>
        </div>

        {/* Compare bar */}
        {compareIds.length > 0 && (
          <div className="mb-6 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-5 py-3 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-300">
                {compareIds.length === 1 ? "Select 1 more to compare" : "Ready to compare"}
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {compareIds.map(cid => {
                const idea = ideas.find(i => i.id === cid)
                return (
                  <span key={cid} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                    bg-indigo-500/20 border border-indigo-500/30 text-xs text-indigo-200">
                    {idea?.ideaName ?? "Unknown"}
                    <button onClick={() => toggleCompare(cid)}>
                      <X className="w-3 h-3 hover:text-white" />
                    </button>
                  </span>
                )
              })}
            </div>
            {compareIds.length === 2 && (
              <button
                onClick={handleCompare}
                className="ml-auto px-4 py-1.5 rounded-lg text-sm font-semibold
                  bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
              >
                Compare Now →
              </button>
            )}
          </div>
        )}

        {/* Search */}
        {ideas.length > 0 && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by idea name or industry…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10
                text-foreground placeholder:text-muted-foreground text-sm
                focus:outline-none focus:border-purple-500/50 transition-all"
            />
          </div>
        )}

        {/* Empty state */}
        {ideas.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No Saved Ideas Yet"
            description="Run an analysis on the Analyze page and click 'Save to Library' to start building your collection."
            action={
              <button
                onClick={() => router.push("/analyze")}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600
                  text-white font-semibold text-sm shadow-lg shadow-purple-500/25
                  hover:from-purple-500 hover:to-indigo-500 transition-all"
              >
                Analyze Your First Idea
              </button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No Matching Ideas"
            description={`No ideas match "${searchQuery}". Try a different search.`}
            action={
              <button onClick={() => setSearchQuery("")} className="text-sm text-purple-400 hover:text-purple-300">
                Clear search
              </button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {filtered.map(idea => {
              const isSelected = compareIds.includes(idea.id)
              const scoreClass = getScoreColor(idea.analysis.viabilityScore)

              return (
                <div
                  key={idea.id}
                  className={cn(
                    "rounded-2xl border bg-white/[0.03] backdrop-blur-xl p-5",
                    "transition-all duration-300 hover:bg-white/[0.05]",
                    isSelected
                      ? "border-indigo-500/60 shadow-lg shadow-indigo-500/10"
                      : "border-white/10 hover:border-white/20"
                  )}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      {renameId === idea.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            autoFocus
                            value={renameValue}
                            onChange={e => setRenameValue(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === "Enter") handleRenameSave()
                              if (e.key === "Escape") setRenameId(null)
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-white/10 border border-purple-500/40
                              text-foreground text-sm focus:outline-none"
                          />
                          <button onClick={handleRenameSave}>
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 hover:text-emerald-300" />
                          </button>
                        </div>
                      ) : (
                        <h3 className="font-bold text-foreground text-base truncate">{idea.ideaName}</h3>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <Building2 className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{idea.industry}</span>
                        <span className="text-border text-xs">·</span>
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{formatDate(idea.createdAt)}</span>
                      </div>
                    </div>

                    {/* Score badge */}
                    <div className={cn("flex-shrink-0 px-3 py-1.5 rounded-xl border text-center", scoreClass)}>
                      <p className="text-lg font-black leading-none">{idea.analysis.viabilityScore}</p>
                      <p className="text-[10px] opacity-80">/10</p>
                    </div>
                  </div>

                  {/* Business brief snippet */}
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                    {idea.analysis.businessBrief}
                  </p>

                  {/* SWOT pill summary */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                      ✓ {idea.analysis.swot.strengths.length} Strengths
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/25">
                      ✗ {idea.analysis.swot.weaknesses.length} Weaknesses
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/25">
                      ↑ {idea.analysis.swot.opportunities.length} Opportunities
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/25">
                      ⚠ {idea.analysis.swot.threats.length} Threats
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                    <button
                      onClick={() => handleOpen(idea)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
                        bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open
                    </button>
                    <button
                      onClick={() => toggleCompare(idea.id)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all border",
                        isSelected
                          ? "bg-indigo-500/30 border-indigo-500/50 text-indigo-200"
                          : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                      )}
                    >
                      <Scale className="w-3.5 h-3.5" />
                      {isSelected ? "Selected" : "Compare"}
                    </button>
                    <button
                      onClick={() => handleRenameStart(idea)}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-muted-foreground
                        hover:text-foreground hover:bg-white/10 transition-all"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(idea.id)}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-muted-foreground
                        hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
