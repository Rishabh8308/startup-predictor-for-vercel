"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SectionCard } from "@/components/shared/section-card"
import { Lightbulb, Sparkles, ChevronDown, Loader2, ArrowRight } from "lucide-react"
import { LS_LAST_ANALYSIS, LS_LAST_INPUT } from "@/types/analysis"

const INDUSTRIES = [
  "AI / Machine Learning",
  "FinTech",
  "HealthTech",
  "EdTech",
  "E-Commerce",
  "SaaS / B2B Software",
  "CleanTech / GreenTech",
  "PropTech",
  "Legal Tech",
  "HR Tech",
  "Gaming",
  "Web3 / Blockchain",
  "Cybersecurity",
  "AgriTech",
  "FoodTech",
  "SpaceTech",
  "BioTech",
  "Media & Entertainment",
  "Logistics & Supply Chain",
  "Other",
]

export default function AnalyzePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isHistoryLoading, setIsHistoryLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<
    Array<{
      _id: string
      request: {
        ideaName: string
        idea: string
        industry: string
        targetMarket: string
      }
      response: unknown
      createdAt: string
    }>
  >([])
  const [form, setForm] = useState({
    ideaName: "",
    idea: "",
    industry: "SaaS / B2B Software",
    targetMarket: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const wordCount = form.idea.trim().split(/\s+/).filter(Boolean).length

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/analyze?limit=5")
        if (!response.ok) return
        const data = await response.json()
        setHistory(data)
      } catch {
        // Keep page functional even without history.
      } finally {
        setIsHistoryLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.ideaName.trim() || !form.idea.trim()) return
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed. Please try again.")
      }

      // Store for results page
      if (typeof window !== "undefined") {
        localStorage.setItem(LS_LAST_ANALYSIS, JSON.stringify(data))
        localStorage.setItem(LS_LAST_INPUT, JSON.stringify(form))
      }

      setHistory((prev) => [
        {
          _id: `local-${Date.now()}`,
          request: { ...form },
          response: data,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, 5))

      router.push("/analyze/results")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">Powered by Google Gemini</span>
          </div>
          <h1 className="text-4xl font-black text-foreground mb-3">
            Analyze Your{" "}
            <span className="gradient-text">Startup Idea</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Describe your idea in plain English. Gemini AI will perform a deep analysis — SWOT,
            market sizing, competitor mapping, viability scoring, and a downloadable business brief.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <SectionCard
            title="Tell Us About Your Idea"
            subtitle="The more detail you provide, the more accurate the analysis"
            icon={Lightbulb}
            accentColor="purple"
            className="mb-6"
          >
            <div className="space-y-5">
              {/* Idea Name */}
              <div className="space-y-1.5">
                <label htmlFor="ideaName" className="text-sm font-medium text-foreground">
                  Startup Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="ideaName"
                  name="ideaName"
                  type="text"
                  placeholder="e.g. MediTrack AI"
                  value={form.ideaName}
                  onChange={handleChange}
                  required
                  className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10
                    text-foreground placeholder:text-muted-foreground text-sm
                    focus:outline-none focus:border-purple-500/50 focus:bg-purple-500/5
                    transition-all duration-200"
                />
              </div>

              {/* Industry + Target Market row */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="industry" className="text-sm font-medium text-foreground">
                    Industry <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="industry"
                      name="industry"
                      value={form.industry}
                      onChange={handleChange}
                      className="w-full h-11 pl-4 pr-10 rounded-xl bg-white/5 border border-white/10
                        text-foreground text-sm appearance-none cursor-pointer
                        focus:outline-none focus:border-purple-500/50 focus:bg-purple-500/5
                        transition-all duration-200"
                    >
                      {INDUSTRIES.map(ind => (
                        <option key={ind} value={ind} className="bg-[#0f0a1e]">
                          {ind}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="targetMarket" className="text-sm font-medium text-foreground">
                    Target Market
                  </label>
                  <input
                    id="targetMarket"
                    name="targetMarket"
                    type="text"
                    placeholder="e.g. US hospitals, SMBs"
                    value={form.targetMarket}
                    onChange={handleChange}
                    className="w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10
                      text-foreground placeholder:text-muted-foreground text-sm
                      focus:outline-none focus:border-purple-500/50 focus:bg-purple-500/5
                      transition-all duration-200"
                  />
                </div>
              </div>

              {/* Idea Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="idea" className="text-sm font-medium text-foreground">
                    Idea Description <span className="text-red-400">*</span>
                  </label>
                  <span className={`text-xs ${wordCount < 20 ? "text-orange-400" : "text-emerald-400"}`}>
                    {wordCount} words {wordCount < 20 ? "(add more detail)" : "✓"}
                  </span>
                </div>
                <textarea
                  id="idea"
                  name="idea"
                  placeholder="Describe your startup idea in detail. What problem does it solve? Who are your customers? What's your unique approach? How does it make money?

Example: MediTrack AI is a healthcare SaaS platform that uses machine learning to help hospital administrators predict patient readmission risk before discharge. By integrating with existing EHR systems, it provides real-time risk scores and actionable care recommendations, reducing 30-day readmissions by 25%..."
                  value={form.idea}
                  onChange={handleChange}
                  required
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10
                    text-foreground placeholder:text-muted-foreground text-sm
                    focus:outline-none focus:border-purple-500/50 focus:bg-purple-500/5
                    transition-all duration-200 resize-y leading-relaxed"
                />
              </div>
            </div>
          </SectionCard>

          {/* What you'll get */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {[
              { emoji: "⚡", label: "SWOT Analysis" },
              { emoji: "📊", label: "Market Size (TAM/SAM/SOM)" },
              { emoji: "🏆", label: "Top 3 Competitors" },
              { emoji: "⭐", label: "Viability Score (1–10)" },
              { emoji: "📄", label: "Business Brief" },
              { emoji: "📥", label: "PDF Export" },
            ].map(item => (
              <div
                key={item.label}
                className="flex items-center gap-2 rounded-xl bg-white/[0.03] border border-white/10 px-3 py-2.5"
              >
                <span className="text-base">{item.emoji}</span>
                <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !form.ideaName.trim() || !form.idea.trim()}
            className="w-full h-14 rounded-xl font-bold text-base text-white
              bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600
              hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500
              shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40
              transition-all duration-300 hover:scale-[1.01]
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              border border-purple-500/30 flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Gemini is analyzing your idea…
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Analyze with Gemini AI
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {isLoading && (
            <p className="text-center text-xs text-muted-foreground mt-3">
              This typically takes 10–20 seconds. Please don&apos;t close this tab.
            </p>
          )}
        </form>

        {/* Recent Analysis History */}
        <div className="mt-8 rounded-2xl border border-purple-500/30 bg-white/5 p-5">
          <h3 className="text-base font-semibold text-foreground mb-3">Recent Analyses</h3>
          {isHistoryLoading ? (
            <p className="text-sm text-muted-foreground">Loading analysis history...</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-muted-foreground">No analysis history yet.</p>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => {
                    setForm(item.request)
                    if (typeof window !== "undefined") {
                      localStorage.setItem(LS_LAST_ANALYSIS, JSON.stringify(item.response))
                      localStorage.setItem(LS_LAST_INPUT, JSON.stringify(item.request))
                    }
                    router.push("/analyze/results")
                  }}
                  className="w-full text-left rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:bg-purple-500/10 hover:border-purple-500/40 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.request.ideaName || "Untitled idea"}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.request.industry}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
