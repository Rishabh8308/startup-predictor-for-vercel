"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  TrendingUp, Users, Zap, Clock, ArrowUpRight, ArrowDownRight,
  Sparkles, Target, BookOpen, BarChart3,
} from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts"
import { SavedIdea, LS_SAVED_IDEAS } from "@/types/analysis"

// ─── Static chart data ────────────────────────────────────────────────────────

const fundingVsSuccessData = [
  { funding: "$0-1M", success: 35 },
  { funding: "$1-5M", success: 48 },
  { funding: "$5-10M", success: 62 },
  { funding: "$10-25M", success: 71 },
  { funding: "$25-50M", success: 78 },
  { funding: "$50M+", success: 85 },
]

const PIE_COLORS = [
  "var(--chart-5)",
  "var(--chart-3)",
  "var(--chart-2)",
  "var(--chart-1)",
  "var(--chart-4)",
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffH = Math.floor(diffMs / 3600000)
  const diffD = Math.floor(diffH / 24)
  if (diffH < 1) return "Just now"
  if (diffH < 24) return `${diffH}h ago`
  if (diffD === 1) return "1 day ago"
  return `${diffD} days ago`
}

function getScoreColor(score: number) {
  if (score >= 8) return "text-emerald-400"
  if (score >= 6) return "text-purple-400"
  if (score >= 4) return "text-amber-400"
  return "text-red-400"
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const raw = localStorage.getItem(LS_SAVED_IDEAS)
    if (raw) setSavedIdeas(JSON.parse(raw))
  }, [])

  // Derived stats from real data
  const totalAnalyzed = savedIdeas.length
  const avgScore =
    savedIdeas.length > 0
      ? (savedIdeas.reduce((acc, i) => acc + i.analysis.viabilityScore, 0) / savedIdeas.length).toFixed(1)
      : "—"

  // Compute industry distribution for pie chart
  const baseCategories = ["AI", "SaaS", "FinTech", "EdTech"]
  const industryCounts: Record<string, number> = {}
  
  // Ensure basic expected categories always show up
  baseCategories.forEach(cat => { industryCounts[cat] = 0 })

  savedIdeas.forEach((i) => {
    industryCounts[i.industry] = (industryCounts[i.industry] || 0) + 1
  })
  
  const pieData = Object.entries(industryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }))

  const recentIdeas = [...savedIdeas].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5)

  const hasIdeas = savedIdeas.length > 0

  const stats: {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down" | "neutral";
    icon: any;
    description: string;
    href: string;
  }[] = [
    {
      title: "Ideas Analyzed",
      value: isMounted ? String(totalAnalyzed) : "—",
      change: totalAnalyzed > 0 ? "Real data" : "Start analyzing",
      trend: "up",
      icon: Users,
      description: "saved in your library",
      href: "/ideas",
    },
    {
      title: "Avg Viability Score",
      value: isMounted ? (hasIdeas ? `${avgScore}/10` : "—") : "—",
      change: hasIdeas ? "across all ideas" : "No data yet",
      trend: "up" as const,
      icon: TrendingUp,
      description: "from Gemini AI",
      href: "/ideas",
    },
    {
      title: "Top Feature",
      value: "Analyze",
      change: "Powered by Gemini",
      trend: "neutral" as const,
      icon: Zap,
      description: "AI-powered idea analysis",
      href: "/analyze",
    },
    {
      title: "Predictions Made",
      value: isMounted ? String(totalAnalyzed) : "—",
      change: totalAnalyzed > 0 ? `+${Math.min(totalAnalyzed, 47)} this session` : "Run your first",
      trend: totalAnalyzed > 0 ? ("up" as const) : ("neutral" as const),
      icon: Clock,
      description: "ideas analyzed total",
      href: "/analyze",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-white/70">
            {hasIdeas && isMounted
              ? `Showing live data for ${totalAnalyzed} analyzed ${totalAnalyzed === 1 ? "idea" : "ideas"}`
              : "Real-time insights into startup predictions and trends"}
          </p>
        </div>

        {/* CTA Banner if no ideas yet */}
        {isMounted && !hasIdeas && (
          <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-lg mb-1">
                No analyses saved yet
              </p>
              <p className="text-white/60 text-sm">
                Use Gemini AI to analyze your startup idea. Results will appear here in real-time.
              </p>
            </div>
            <Link
              href="/analyze"
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500
                text-white font-semibold text-sm shadow-lg shadow-purple-500/25 border border-purple-500/30 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Analyze Your First Idea
            </Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Link
                  href={stat.href}
                  className="group rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-6 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 shadow-2xl block hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <stat.icon className="w-5 h-5 text-cyan-400" />
                    </div>
                <span
                  className={`text-xs font-medium flex items-center gap-1 ${
                    stat.trend === "up"
                      ? "text-green-400"
                      : stat.trend === "down"
                      ? "text-red-400"
                      : "text-white/60"
                  }`}
                >
                  {stat.trend === "up" && <ArrowUpRight className="w-4 h-4" />}
                  {stat.trend === "down" && <ArrowDownRight className="w-4 h-4" />}
                  {stat.change}
                </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  <motion.span 
                    key={stat.value} 
                    initial={{ opacity: 0, filter: "blur(4px)" }} 
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.4 }}
                  >
                    {stat.value}
                  </motion.span>
                </h3>
                <p className="text-sm text-white/70">{stat.title}</p>
              </Link>
             </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Industry Distribution (real data) / Fallback pie */}
          <div className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                {hasIdeas && isMounted ? "Ideas by Industry" : "Success Distribution"}
              </h3>
              {hasIdeas && isMounted && (
                <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded-full">
                  Live Data
                </span>
              )}
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={
                      hasIdeas && isMounted
                        ? pieData
                        : [
                            { name: "AI", value: 35 },
                            { name: "SaaS", value: 25 },
                            { name: "EdTech", value: 20 },
                            { name: "FinTech", value: 15 },
                            { name: "Others", value: 5 },
                          ]
                    }
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={1500}
                    animationEasing="ease-out"
                  >
                    {(hasIdeas && isMounted ? pieData : [1, 2, 3, 4, 5]).map(
                      (_entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      )
                    )}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(22, 22, 30, 0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Funding vs Success (static benchmark data) */}
          <div className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                Funding vs Success Probability
              </h3>
              <span className="text-xs text-white/40 bg-white/5 border border-white/10 px-2 py-1 rounded-full">
                Benchmark Data
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fundingVsSuccessData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="funding"
                    tick={{ fill: "#e5e7eb", fontSize: 11 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
                  />
                  <YAxis
                    tick={{ fill: "#e5e7eb", fontSize: 11 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(22, 22, 30, 0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                    formatter={(value) => [`${value}%`, "Success Rate"]}
                  />
                  <Bar 
                    dataKey="success" 
                    fill="url(#barGradient)" 
                    radius={[6, 6, 0, 0]} 
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Ideas / Predictions Table */}
        <div className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              {hasIdeas && isMounted ? "Recent Analyses" : "Recent Predictions"}
            </h3>
            {hasIdeas && isMounted && (
              <Link
                href="/ideas"
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                View All Ideas
              </Link>
            )}
          </div>

          {isMounted && hasIdeas ? (
            /* Real data table */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-xs font-medium text-white/60 pb-4">Startup</th>
                    <th className="text-left text-xs font-medium text-white/60 pb-4">Industry</th>
                    <th className="text-left text-xs font-medium text-white/60 pb-4">Viability Score</th>
                    <th className="text-right text-xs font-medium text-white/60 pb-4">Analyzed</th>
                  </tr>
                </thead>
                <tbody>
                  {recentIdeas.map((idea) => (
                    <tr
                      key={idea.id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4">
                        <span className="font-semibold text-white">{idea.ideaName}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-white/60">{idea.industry}</span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-purple-400 to-indigo-500"
                              style={{ width: `${idea.analysis.viabilityScore * 10}%` }}
                            />
                          </div>
                          <span className={`text-sm font-bold ${getScoreColor(idea.analysis.viabilityScore)}`}>
                            {idea.analysis.viabilityScore}/10
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-right text-sm text-white/60">
                        {formatDate(idea.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Empty / Loading state */
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto">
                <BarChart3 className="w-7 h-7 text-purple-400" />
              </div>
              {isMounted ? (
                <>
                  <p className="text-white font-semibold">No analyses yet</p>
                  <p className="text-white/50 text-sm">
                    Run a Gemini AI analysis and save it to see live data here.
                  </p>
                  <Link
                    href="/analyze"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                      bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm
                      hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/25"
                  >
                    <Sparkles className="w-4 h-4" />
                    Analyze an Idea
                  </Link>
                </>
              ) : (
                /* Skeleton rows */
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex gap-4">
                      <div className="h-4 bg-white/10 rounded flex-1 animate-pulse" />
                      <div className="h-4 bg-white/10 rounded w-24 animate-pulse" />
                      <div className="h-4 bg-white/10 rounded w-16 animate-pulse" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Sparkles, label: "Analyze Idea", href: "/analyze", color: "text-purple-400 bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20" },
            { icon: Target, label: "Predict Startup", href: "/predict", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20" },
            { icon: BookOpen, label: "Ideas Library", href: "/ideas", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30 hover:bg-indigo-500/20" },
            { icon: TrendingUp, label: "Analytics", href: "/analytics", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20" },
          ].map(({ icon: Icon, label, href, color }) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${color}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
