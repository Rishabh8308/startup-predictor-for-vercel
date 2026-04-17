"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, TrendingDown, Building2, DollarSign, Users } from "lucide-react"

const industrySuccessData = [
  { name: "Technology", rate: 72, startups: 450, fill: "var(--chart-1)" },
  { name: "Healthcare", rate: 68, startups: 320, fill: "var(--chart-2)" },
  { name: "Finance", rate: 65, startups: 280, fill: "var(--chart-3)" },
  { name: "E-commerce", rate: 58, startups: 420, fill: "var(--chart-4)" },
  { name: "Education", rate: 55, startups: 190, fill: "var(--chart-5)" },
  { name: "Energy", rate: 62, startups: 150, fill: "var(--chart-1)" },
]

const fundingGrowthData = [
  { funding: "Seed", avgGrowth: 45, successRate: 42 },
  { funding: "Series A", avgGrowth: 120, successRate: 58 },
  { funding: "Series B", avgGrowth: 180, successRate: 72 },
  { funding: "Series C", avgGrowth: 250, successRate: 81 },
  { funding: "Series D+", avgGrowth: 320, successRate: 88 },
]

const survivalRateData = [
  { year: "Year 1", rate: 80 },
  { year: "Year 2", rate: 65 },
  { year: "Year 3", rate: 52 },
  { year: "Year 4", rate: 44 },
  { year: "Year 5", rate: 38 },
  { year: "Year 6", rate: 35 },
  { year: "Year 7", rate: 33 },
]

const teamSizeImpact = [
  { size: "1-5", success: 35 },
  { size: "6-15", success: 52 },
  { size: "16-30", success: 68 },
  { size: "31-50", success: 74 },
  { size: "51-100", success: 78 },
  { size: "100+", success: 72 },
]

const monthlyPredictions = [
  { month: "Jan", predictions: 245 },
  { month: "Feb", predictions: 312 },
  { month: "Mar", predictions: 428 },
  { month: "Apr", predictions: 389 },
  { month: "May", predictions: 456 },
  { month: "Jun", predictions: 523 },
]

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-white/60">Comprehensive insights from startup success predictions</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-5 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-xs text-white/60">Avg Success</span>
            </div>
            <p className="text-2xl font-bold text-white">64.2%</p>
          </div>
          <div className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-5 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-xs text-white/60">Industries</span>
            </div>
            <p className="text-2xl font-bold text-white">10</p>
          </div>
          <div className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-5 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-xs text-white/60">Avg Funding</span>
            </div>
            <p className="text-2xl font-bold text-white">$8.2M</p>
          </div>
          <div className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-5 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-xs text-white/60">Avg Team</span>
            </div>
            <p className="text-2xl font-bold text-white">32</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Industries by Success Rate */}
          <div className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-6 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">Top Industries by Success Rate</h3>
            <p className="text-sm text-white/60 mb-6">Performance across different sectors</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={industrySuccessData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                  <XAxis 
                    type="number"
                    tick={{ fill: '#e5e7eb', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 100]}
                  />
                  <YAxis 
                    type="category"
                    dataKey="name"
                    tick={{ fill: '#e5e7eb', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(22, 22, 30, 0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff"
                    }}
                    itemStyle={{ color: "#fff" }}
                    formatter={(value, name) => [
                      name === "rate" ? `${value}%` : value,
                      name === "rate" ? "Success Rate" : "Startups"
                    ]}
                  />
                  <Bar dataKey="rate" radius={[0, 6, 6, 0]}>
                    {industrySuccessData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Funding vs Growth */}
          <div className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-6 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">Funding Stage Performance</h3>
            <p className="text-sm text-white/60 mb-6">Success rate by funding stage</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={fundingGrowthData}>
                  <defs>
                    <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="funding"
                    tick={{ fill: '#e5e7eb', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                  />
                  <YAxis 
                    tick={{ fill: '#e5e7eb', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(22, 22, 30, 0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff"
                    }}
                    itemStyle={{ color: "#fff" }}
                    formatter={(value) => [`${value}%`, "Success Rate"]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="successRate" 
                    stroke="#06b6d4" 
                    strokeWidth={2}
                    fill="url(#successGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Startup Survival Rate */}
          <div className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-6 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">Startup Survival Rate</h3>
            <p className="text-sm text-white/60 mb-6">Percentage of startups surviving over time</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={survivalRateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="year"
                    tick={{ fill: '#e5e7eb', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                  />
                  <YAxis 
                    tick={{ fill: '#e5e7eb', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(22, 22, 30, 0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff"
                    }}
                    itemStyle={{ color: "#fff" }}
                    formatter={(value) => [`${value}%`, "Survival Rate"]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#06b6d4" 
                    strokeWidth={3}
                    dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#0891b2' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Team Size Impact */}
          <div className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-6 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">Team Size Impact</h3>
            <p className="text-sm text-white/60 mb-6">Success rate by team size range</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={teamSizeImpact}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="size"
                    tick={{ fill: '#e5e7eb', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                  />
                  <YAxis 
                    tick={{ fill: '#e5e7eb', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(22, 22, 30, 0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff"
                    }}
                    itemStyle={{ color: "#fff" }}
                    formatter={(value) => [`${value}%`, "Success Rate"]}
                  />
                  <Bar 
                    dataKey="success" 
                    fill="url(#teamGradient)"
                    radius={[6, 6, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="teamGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Monthly Predictions Trend */}
        <div className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-6 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 shadow-2xl">
          <h3 className="text-lg font-semibold text-white mb-2">Prediction Activity</h3>
          <p className="text-sm text-white/60 mb-6">Monthly prediction volume over time</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyPredictions}>
                <defs>
                  <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="month"
                  tick={{ fill: '#e5e7eb', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                />
                <YAxis 
                  tick={{ fill: '#e5e7eb', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(22, 22, 30, 0.9)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#fff"
                  }}
                  itemStyle={{ color: "#fff" }}
                  formatter={(value) => [value, "Predictions"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="predictions" 
                  stroke="url(#strokeGradient)"
                  strokeWidth={3}
                  fill="url(#predictionGradient)"
                />
                <defs>
                  <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
