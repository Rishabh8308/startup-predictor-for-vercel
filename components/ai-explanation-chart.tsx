"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface FeatureImportance {
  funding: number
  teamSize: number
  marketSize: number
  founderExperience: number
}

interface AIExplanationChartProps {
  featureImportance: FeatureImportance
}

export function AIExplanationChart({ featureImportance }: AIExplanationChartProps) {
  // Transform feature importance data for the chart
  const chartData = [
    {
      name: "Funding",
      value: Math.round(featureImportance.funding * 100),
      percentage: (featureImportance.funding * 100).toFixed(1),
    },
    {
      name: "Team Size",
      value: Math.round(featureImportance.teamSize * 100),
      percentage: (featureImportance.teamSize * 100).toFixed(1),
    },
    {
      name: "Market Size",
      value: Math.round(featureImportance.marketSize * 100),
      percentage: (featureImportance.marketSize * 100).toFixed(1),
    },
    {
      name: "Founder Experience",
      value: Math.round(featureImportance.founderExperience * 100),
      percentage: (featureImportance.founderExperience * 100).toFixed(1),
    },
  ]

  // Colors for each bar
  const colors = ["#06B6D4", "#8B5CF6", "#10B981", "#F59E0B"]

  return (
    <Card className="rounded-3xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-8 hover:border-cyan-400/60 hover:bg-cyan-500/5 transition-all duration-300">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">AI Prediction Explanation</h2>
          <p className="text-white/60 text-sm">Feature importance breakdown of your startup prediction</p>
        </div>

        {/* Chart */}
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 100, left: 150, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
              <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" width={140} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  border: "1px solid rgba(6, 182, 212, 0.3)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#fff" }}
                formatter={(value, name) => {
                  if (name === "value") return `${value}%`
                  return value
                }}
              />
              <Bar dataKey="value" fill="#06B6D4" radius={[0, 8, 8, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend with percentages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {chartData.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all"
            >
              <div
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: colors[index] }}
              />
              <div className="flex-1">
                <p className="text-sm text-white/70">{item.name}</p>
                <p className="text-lg font-semibold text-white">{item.percentage}%</p>
              </div>
            </div>
          ))}
        </div>

        {/* Insights */}
        <div className="mt-6 p-4 rounded-lg bg-cyan-500/10 border border-cyan-400/30">
          <p className="text-sm text-cyan-200">
            <span className="font-semibold">💡 Insight:</span> The AI model prioritizes funding (40%), followed by market size (25%), team composition (20%), and founder experience (15%) when predicting startup success.
          </p>
        </div>
      </div>
    </Card>
  )
}
