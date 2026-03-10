"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Sparkles, DollarSign, Users, TrendingUp, Award } from "lucide-react"

interface PredictionResponse {
  successProbability: number
  riskLevel: 'low' | 'medium' | 'high'
  featureImportance: {
    funding: number
    teamSize: number
    marketSize: number
    founderExperience: number
  }
}

export default function SimulatorPage() {
  const [funding, setFunding] = useState(5000000)
  const [teamSize, setTeamSize] = useState(15)
  const [marketSize, setMarketSize] = useState(500000000)
  const [founderExperience, setFounderExperience] = useState(5)
  
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PredictionResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Debounce timer
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

  // Fetch prediction with debounce
  const fetchPrediction = useCallback(async (f: number, t: number, m: number, e: number) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          funding: f,
          teamSize: t,
          marketSize: m,
          founderExperience: e,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get prediction")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Handle slider changes with debounce
  const handleFundingChange = (value: number[]) => {
    setFunding(value[0])
    if (debounceTimer) clearTimeout(debounceTimer)
    const timer = setTimeout(() => {
      fetchPrediction(value[0], teamSize, marketSize, founderExperience)
    }, 500)
    setDebounceTimer(timer)
  }

  const handleTeamSizeChange = (value: number[]) => {
    setTeamSize(value[0])
    if (debounceTimer) clearTimeout(debounceTimer)
    const timer = setTimeout(() => {
      fetchPrediction(funding, value[0], marketSize, founderExperience)
    }, 500)
    setDebounceTimer(timer)
  }

  const handleMarketSizeChange = (value: number[]) => {
    setMarketSize(value[0])
    if (debounceTimer) clearTimeout(debounceTimer)
    const timer = setTimeout(() => {
      fetchPrediction(funding, teamSize, value[0], founderExperience)
    }, 500)
    setDebounceTimer(timer)
  }

  const handleFounderExperienceChange = (value: number[]) => {
    setFounderExperience(value[0])
    if (debounceTimer) clearTimeout(debounceTimer)
    const timer = setTimeout(() => {
      fetchPrediction(funding, teamSize, marketSize, value[0])
    }, 500)
    setDebounceTimer(timer)
  }

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
    return `$${value}`
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 mb-4">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-white/70">Interactive Simulator</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Startup Success Simulator</h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Adjust the sliders below to see how different factors affect your startup's success probability in real-time.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Sliders Section */}
          <div className="md:col-span-2 space-y-8">
            {/* Funding Slider */}
            <Card className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-6 hover:border-cyan-400/60 hover:bg-cyan-500/5 transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-cyan-400" />
                  <label className="text-white font-semibold">Funding Amount</label>
                </div>
                <Slider
                  value={[funding]}
                  onValueChange={handleFundingChange}
                  min={100000}
                  max={20000000}
                  step={100000}
                  className="w-full"
                />
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">100K</span>
                  <span className="text-2xl font-bold text-cyan-400">{formatCurrency(funding)}</span>
                  <span className="text-white/60 text-sm">20M</span>
                </div>
              </div>
            </Card>

            {/* Team Size Slider */}
            <Card className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-6 hover:border-cyan-400/60 hover:bg-cyan-500/5 transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-purple-400" />
                  <label className="text-white font-semibold">Team Size</label>
                </div>
                <Slider
                  value={[teamSize]}
                  onValueChange={handleTeamSizeChange}
                  min={1}
                  max={50}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">1</span>
                  <span className="text-2xl font-bold text-purple-400">{teamSize} people</span>
                  <span className="text-white/60 text-sm">50</span>
                </div>
              </div>
            </Card>

            {/* Market Size Slider */}
            <Card className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-6 hover:border-cyan-400/60 hover:bg-cyan-500/5 transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-teal-400" />
                  <label className="text-white font-semibold">Market Size</label>
                </div>
                <Slider
                  value={[marketSize]}
                  onValueChange={handleMarketSizeChange}
                  min={1000000}
                  max={1000000000}
                  step={10000000}
                  className="w-full"
                />
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">1M</span>
                  <span className="text-2xl font-bold text-teal-400">{formatCurrency(marketSize)}</span>
                  <span className="text-white/60 text-sm">1B</span>
                </div>
              </div>
            </Card>

            {/* Founder Experience Slider */}
            <Card className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-6 hover:border-cyan-400/60 hover:bg-cyan-500/5 transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-orange-400" />
                  <label className="text-white font-semibold">Founder Experience</label>
                </div>
                <Slider
                  value={[founderExperience]}
                  onValueChange={handleFounderExperienceChange}
                  min={0}
                  max={20}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">0 years</span>
                  <span className="text-2xl font-bold text-orange-400">{founderExperience} years</span>
                  <span className="text-white/60 text-sm">20 years</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Results Section */}
          <div className="md:col-span-1">
            <Card className="sticky top-8 rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-6 hover:border-cyan-400/60 hover:bg-cyan-500/5 transition-all duration-300 h-fit">
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white">Prediction</h2>

                {isLoading && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-8 h-8 border-2 border-white/30 border-t-cyan-400 rounded-full animate-spin mb-3" />
                    <p className="text-sm text-white/60">Analyzing...</p>
                  </div>
                )}

                {error && (
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-400/30">
                    <p className="text-sm text-red-200">{error}</p>
                  </div>
                )}

                {result && !isLoading && (
                  <div className="space-y-6">
                    {/* Success Probability */}
                    <div className="text-center">
                      <p className="text-white/70 text-sm mb-2">Success Probability</p>
                      <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-2 border-cyan-400/50 bg-gradient-to-br from-cyan-500/20 to-blue-500/10">
                        <div className="text-center">
                          <p className="text-4xl font-bold text-cyan-400">{result.successProbability}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Risk Level */}
                    <div className="flex justify-center">
                      <div
                        className={`px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide ${
                          result.riskLevel === 'low'
                            ? 'bg-green-500/30 text-green-200 border border-green-400/50'
                            : result.riskLevel === 'medium'
                            ? 'bg-yellow-500/30 text-yellow-200 border border-yellow-400/50'
                            : 'bg-red-500/30 text-red-200 border border-red-400/50'
                        }`}
                      >
                        Risk: {result.riskLevel}
                      </div>
                    </div>

                    {/* Feature Impact Hints */}
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-xs text-white/60 mb-3">Key Factors</p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-white/70">Funding</span>
                          <span className="text-cyan-400 font-semibold">
                            {(result.featureImportance.funding * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-white/70">Team</span>
                          <span className="text-purple-400 font-semibold">
                            {(result.featureImportance.teamSize * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-white/70">Market</span>
                          <span className="text-teal-400 font-semibold">
                            {(result.featureImportance.marketSize * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-white/70">Experience</span>
                          <span className="text-orange-400 font-semibold">
                            {(result.featureImportance.founderExperience * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!result && !isLoading && !error && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Sparkles className="w-8 h-8 text-cyan-400/50 mb-2" />
                    <p className="text-sm text-white/60">Adjust sliders to see prediction</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
