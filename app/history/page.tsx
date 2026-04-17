"use client"

import { useEffect, useMemo, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"

type HistoryTypeFilter = "all" | "prediction" | "analysis"

type PredictionRecord = {
  _id: string
  createdAt: string
  request?: {
    funding?: number
    teamSize?: number
    marketSize?: number
    founderExperience?: number
  }
  response?: {
    successProbability?: number
    riskLevel?: "low" | "medium" | "high"
  }
}

type AnalysisRecord = {
  _id: string
  createdAt: string
  request?: {
    ideaName?: string
    idea?: string
    industry?: string
    targetMarket?: string
  }
  response?: {
    viabilityScore?: number
  }
}

type UnifiedHistoryItem =
  | {
      kind: "prediction"
      id: string
      createdAt: string
      searchText: string
      payload: PredictionRecord
    }
  | {
      kind: "analysis"
      id: string
      createdAt: string
      searchText: string
      payload: AnalysisRecord
    }

const PAGE_SIZE = 10

export default function HistoryPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<HistoryTypeFilter>("all")
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [items, setItems] = useState<UnifiedHistoryItem[]>([])

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [predictRes, analyzeRes] = await Promise.all([
          fetch("/api/predict?limit=100"),
          fetch("/api/analyze?limit=100"),
        ])

        if (!predictRes.ok || !analyzeRes.ok) {
          throw new Error("Failed to load history from server")
        }

        const predictions: PredictionRecord[] = await predictRes.json()
        const analyses: AnalysisRecord[] = await analyzeRes.json()

        const normalized: UnifiedHistoryItem[] = [
          ...predictions.map((entry) => ({
            kind: "prediction" as const,
            id: entry._id,
            createdAt: entry.createdAt,
            searchText: [
              "prediction",
              entry.response?.riskLevel ?? "",
              String(entry.response?.successProbability ?? ""),
              String(entry.request?.funding ?? ""),
              String(entry.request?.teamSize ?? ""),
              String(entry.request?.marketSize ?? ""),
              String(entry.request?.founderExperience ?? ""),
            ]
              .join(" ")
              .toLowerCase(),
            payload: entry,
          })),
          ...analyses.map((entry) => ({
            kind: "analysis" as const,
            id: entry._id,
            createdAt: entry.createdAt,
            searchText: [
              "analysis",
              entry.request?.ideaName ?? "",
              entry.request?.industry ?? "",
              entry.request?.targetMarket ?? "",
              entry.request?.idea ?? "",
              String(entry.response?.viabilityScore ?? ""),
            ]
              .join(" ")
              .toLowerCase(),
            payload: entry,
          })),
        ].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )

        setItems(normalized)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load history")
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, typeFilter])

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    return items.filter((item) => {
      const matchesType = typeFilter === "all" || item.kind === typeFilter
      const matchesSearch = !query || item.searchText.includes(query)
      return matchesType && matchesSearch
    })
  }, [items, search, typeFilter])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE
    return filteredItems.slice(start, start + PAGE_SIZE)
  }, [filteredItems, safePage])

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">History</h1>
          <p className="text-white/60 mt-2">
            Browse saved predictions and analyses from MongoDB.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-6">
          <div className="grid md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Search by idea name, industry, risk, values..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="md:col-span-2 h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50"
            />
            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as HistoryTypeFilter)
              }
              className="h-11 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/50"
            >
              <option value="all">All Types</option>
              <option value="prediction">Predictions</option>
              <option value="analysis">Analyses</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-white/70">
            Loading history...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 text-red-200">
            {error}
          </div>
        ) : paginatedItems.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-white/70">
            No history entries match your filter.
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedItems.map((item) => {
              if (item.kind === "prediction") {
                const p = item.payload
                return (
                  <div
                    key={`${item.kind}-${item.id}`}
                    className="rounded-xl border border-cyan-400/20 bg-cyan-500/5 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-cyan-200">
                        Prediction
                      </p>
                      <p className="text-xs text-white/50">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-sm text-white/80 mt-1">
                      Success: {p.response?.successProbability ?? "-"}% | Risk:{" "}
                      {(p.response?.riskLevel ?? "-").toUpperCase()}
                    </p>
                    <p className="text-xs text-white/60 mt-2">
                      Funding ${p.request?.funding?.toLocaleString() ?? "-"} |
                      Team {p.request?.teamSize ?? "-"} | Market $
                      {p.request?.marketSize?.toLocaleString() ?? "-"} |
                      Experience {p.request?.founderExperience ?? "-"}y
                    </p>
                  </div>
                )
              }

              const a = item.payload
              return (
                <div
                  key={`${item.kind}-${item.id}`}
                  className="rounded-xl border border-purple-400/20 bg-purple-500/5 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-purple-200">
                      Analysis
                    </p>
                    <p className="text-xs text-white/50">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm text-white/90 mt-1">
                    {a.request?.ideaName || "Untitled idea"}
                  </p>
                  <p className="text-xs text-white/60 mt-1">
                    Industry: {a.request?.industry || "-"} | Target:{" "}
                    {a.request?.targetMarket || "-"} | Viability:{" "}
                    {a.response?.viabilityScore ?? "-"}/10
                  </p>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="text-sm text-white/60">
            Showing {paginatedItems.length} of {filteredItems.length} records
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="px-4 py-2 rounded-lg border border-white/15 text-sm text-white/80 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-white/70">
              Page {safePage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="px-4 py-2 rounded-lg border border-white/15 text-sm text-white/80 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
