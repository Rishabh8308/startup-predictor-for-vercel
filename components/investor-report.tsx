"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, AlertCircle, CheckCircle2, Target } from "lucide-react"

interface FeatureImportance {
  funding: number
  teamSize: number
  marketSize: number
  founderExperience: number
}

interface InvestorReportProps {
  successProbability: number
  riskLevel: string
  featureImportance: FeatureImportance
}

export function InvestorReport({
  successProbability,
  riskLevel,
  featureImportance,
}: InvestorReportProps) {
  // Convert feature importance to array and sort
  const features = [
    { name: "Funding", value: featureImportance.funding, icon: "💰" },
    { name: "Team Size", value: featureImportance.teamSize, icon: "👥" },
    { name: "Market Size", value: featureImportance.marketSize, icon: "📊" },
    { name: "Founder Experience", value: featureImportance.founderExperience, icon: "🎯" },
  ].sort((a, b) => b.value - a.value)

  const strengths = features.slice(0, 2)
  const weaknesses = features.slice(2)

  // Determine recommendation
  let recommendation = ""
  let recommendationColor = ""

  if (successProbability > 75) {
    recommendation = "Strong Investment Opportunity"
    recommendationColor = "border-green-400/30 bg-green-500/10"
  } else if (successProbability >= 50) {
    recommendation = "Moderate Opportunity"
    recommendationColor = "border-yellow-400/30 bg-yellow-500/10"
  } else {
    recommendation = "High Risk Venture"
    recommendationColor = "border-red-400/30 bg-red-500/10"
  }

  return (
    <Card className="rounded-3xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-8 hover:border-cyan-400/60 hover:bg-cyan-500/5 transition-all duration-300">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">AI Investor Report</h2>
          <p className="text-white/60">Comprehensive analysis of startup investment potential</p>
        </div>

        {/* Startup Health Score */}
        <div className="rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-white/70 text-sm font-semibold mb-1">STARTUP HEALTH SCORE</p>
              <p className="text-5xl font-bold text-cyan-400">{successProbability}</p>
              <p className="text-white/60 text-sm mt-1">out of 100</p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                riskLevel === 'low' ? 'bg-green-500/30 text-green-200 border border-green-400/50' :
                riskLevel === 'medium' ? 'bg-yellow-500/30 text-yellow-200 border border-yellow-400/50' :
                'bg-red-500/30 text-red-200 border border-red-400/50'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  riskLevel === 'low' ? 'bg-green-400' :
                  riskLevel === 'medium' ? 'bg-yellow-400' :
                  'bg-red-400'
                }`} />
                {riskLevel} Risk
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{ width: `${successProbability}%` }}
            />
          </div>
        </div>

        {/* Strengths */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <h3 className="text-xl font-bold text-white">Key Strengths</h3>
          </div>
          <div className="space-y-3">
            {strengths.map((feature) => (
              <div
                key={feature.name}
                className="rounded-lg border border-green-400/30 bg-green-500/10 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <p className="text-white font-semibold">{feature.name}</p>
                      <p className="text-green-200 text-sm">Strong contributor to success probability</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-400">
                      {(feature.value * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-white/50">importance</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risks */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-orange-400" />
            <h3 className="text-xl font-bold text-white">Areas for Improvement</h3>
          </div>
          <div className="space-y-3">
            {weaknesses.map((feature) => (
              <div
                key={feature.name}
                className="rounded-lg border border-orange-400/30 bg-orange-500/10 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <p className="text-white font-semibold">{feature.name}</p>
                      <p className="text-orange-200 text-sm">Lower impact on prediction model</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-400">
                      {(feature.value * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-white/50">importance</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Investment Recommendation */}
        <div className={`rounded-2xl border ${recommendationColor} p-6`}>
          <div className="flex items-start gap-4">
            <Target className={`w-6 h-6 flex-shrink-0 mt-1 ${
              successProbability > 75 ? 'text-green-400' :
              successProbability >= 50 ? 'text-yellow-400' :
              'text-red-400'
            }`} />
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Investment Recommendation</h3>
              <p className={`text-lg font-semibold mb-3 ${
                successProbability > 75 ? 'text-green-200' :
                successProbability >= 50 ? 'text-yellow-200' :
                'text-red-200'
              }`}>
                {recommendation}
              </p>
              <p className="text-white/80 leading-relaxed">
                {successProbability > 75
                  ? "This startup demonstrates strong fundamentals with favorable conditions for success. The high success probability suggests solid market opportunity, adequate funding, and experienced leadership. This represents an attractive investment opportunity for risk-aware investors."
                  : successProbability >= 50
                  ? "This startup shows promising potential but with moderate risk factors. Key strengths support growth opportunity, though some areas require attention. Suitable for investors with balanced risk tolerance who can provide strategic guidance."
                  : "This startup faces significant challenges that could impact success. Notable risk factors suggest heightened due diligence is required before investment. Consider waiting for improvements in key metrics or increased confidence in execution."}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="text-center">
            <p className="text-white/60 text-sm mb-1">Confidence Score</p>
            <p className="text-2xl font-bold text-cyan-400">{Math.round(successProbability / 10) * 10}%</p>
          </div>
          <div className="text-center">
            <p className="text-white/60 text-sm mb-1">Risk Assessment</p>
            <p className="text-2xl font-bold text-white uppercase">{riskLevel}</p>
          </div>
          <div className="text-center">
            <p className="text-white/60 text-sm mb-1">Top Factor</p>
            <p className="text-2xl font-bold text-cyan-400">{features[0].name}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
