"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Scale, Sparkles, AlertCircle, CheckCircle } from "lucide-react"

interface PredictionResponse {
  successProbability: number
  riskLevel: 'low' | 'medium' | 'high'
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

const formatCurrency = (value: number): string => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
  return `$${value}`
}

const getRiskColor = (riskLevel: 'low' | 'medium' | 'high'): string => {
  switch (riskLevel) {
    case 'low':
      return 'bg-green-500/30 text-green-200 border border-green-400/50'
    case 'medium':
      return 'bg-yellow-500/30 text-yellow-200 border border-yellow-400/50'
    case 'high':
      return 'bg-red-500/30 text-red-200 border border-red-400/50'
  }
}

export default function ComparePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null)

  const [startupA, setStartupA] = useState<StartupData>({
    funding: "",
    teamSize: "",
    marketSize: "",
    founderExperience: "",
  })

  const [startupB, setStartupB] = useState<StartupData>({
    funding: "",
    teamSize: "",
    marketSize: "",
    founderExperience: "",
  })

  const handleInputChange = (
    startup: 'A' | 'B',
    field: keyof StartupData,
    value: string
  ) => {
    if (startup === 'A') {
      setStartupA(prev => ({ ...prev, [field]: value }))
    } else {
      setStartupB(prev => ({ ...prev, [field]: value }))
    }
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

    // Validate inputs
    if (!validateInputs(startupA)) {
      setError("Please enter valid values for Startup A")
      return
    }
    if (!validateInputs(startupB)) {
      setError("Please enter valid values for Startup B")
      return
    }

    setIsLoading(true)

    try {
      // Make both API calls in parallel
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

      if (!responseA.ok) {
        const errorData = await responseA.json()
        throw new Error(errorData.error || "Failed to get prediction for Startup A")
      }
      if (!responseB.ok) {
        const errorData = await responseB.json()
        throw new Error(errorData.error || "Failed to get prediction for Startup B")
      }

      const dataA = await responseA.json()
      const dataB = await responseB.json()

      setComparisonResult({
        startupA: dataA,
        startupB: dataB,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during comparison")
    } finally {
      setIsLoading(false)
    }
  }

  const getWinner = (): 'A' | 'B' | 'tie' => {
    if (!comparisonResult) return 'tie'
    const probA = comparisonResult.startupA.successProbability
    const probB = comparisonResult.startupB.successProbability
    if (probA > probB) return 'A'
    if (probB > probA) return 'B'
    return 'tie'
  }

  const isWinner = (startup: 'A' | 'B'): boolean => {
    return getWinner() === startup
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 mb-4">
            <Scale className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-white/70">Side-by-Side Analysis</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Compare Startups</h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Compare two startups side-by-side to analyze their success probability and key metrics.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-8 border-red-400/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-200 ml-2">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Input Section */}
        {!comparisonResult && (
          <div>
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Startup A Inputs */}
              <div className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-8 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-6">Startup A</h2>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="fundingA" className="text-white/70 text-sm mb-2 block">
                      Funding Amount ($)
                    </Label>
                    <Input
                      id="fundingA"
                      type="number"
                      placeholder="e.g., 1000000"
                      value={startupA.funding}
                      onChange={(e) => handleInputChange('A', 'funding', e.target.value)}
                      className="bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="teamSizeA" className="text-white/70 text-sm mb-2 block">
                      Team Size
                    </Label>
                    <Input
                      id="teamSizeA"
                      type="number"
                      placeholder="e.g., 8"
                      value={startupA.teamSize}
                      onChange={(e) => handleInputChange('A', 'teamSize', e.target.value)}
                      className="bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="marketSizeA" className="text-white/70 text-sm mb-2 block">
                      Market Size ($)
                    </Label>
                    <Input
                      id="marketSizeA"
                      type="number"
                      placeholder="e.g., 500000000"
                      value={startupA.marketSize}
                      onChange={(e) => handleInputChange('A', 'marketSize', e.target.value)}
                      className="bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experienceA" className="text-white/70 text-sm mb-2 block">
                      Founder Experience (years)
                    </Label>
                    <Input
                      id="experienceA"
                      type="number"
                      placeholder="e.g., 5"
                      value={startupA.founderExperience}
                      onChange={(e) => handleInputChange('A', 'founderExperience', e.target.value)}
                      className="bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Startup B Inputs */}
              <div className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-8 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-6">Startup B</h2>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="fundingB" className="text-white/70 text-sm mb-2 block">
                      Funding Amount ($)
                    </Label>
                    <Input
                      id="fundingB"
                      type="number"
                      placeholder="e.g., 500000"
                      value={startupB.funding}
                      onChange={(e) => handleInputChange('B', 'funding', e.target.value)}
                      className="bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="teamSizeB" className="text-white/70 text-sm mb-2 block">
                      Team Size
                    </Label>
                    <Input
                      id="teamSizeB"
                      type="number"
                      placeholder="e.g., 3"
                      value={startupB.teamSize}
                      onChange={(e) => handleInputChange('B', 'teamSize', e.target.value)}
                      className="bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="marketSizeB" className="text-white/70 text-sm mb-2 block">
                      Market Size ($)
                    </Label>
                    <Input
                      id="marketSizeB"
                      type="number"
                      placeholder="e.g., 20000000"
                      value={startupB.marketSize}
                      onChange={(e) => handleInputChange('B', 'marketSize', e.target.value)}
                      className="bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experienceB" className="text-white/70 text-sm mb-2 block">
                      Founder Experience (years)
                    </Label>
                    <Input
                      id="experienceB"
                      type="number"
                      placeholder="e.g., 1"
                      value={startupB.founderExperience}
                      onChange={(e) => handleInputChange('B', 'founderExperience', e.target.value)}
                      className="bg-white/5 border border-white/10 text-white placeholder:text-white/30 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Compare Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleCompare}
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
              >
                {isLoading ? 'Comparing...' : 'Compare Startups'}
              </Button>
            </div>
          </div>
        )}

        {/* Comparison Results */}
        {comparisonResult && (
          <div className="space-y-8">
            {/* Back Button */}
            <div>
              <Button
                onClick={() => {
                  setComparisonResult(null)
                  setStartupA({ funding: "", teamSize: "", marketSize: "", founderExperience: "" })
                  setStartupB({ funding: "", teamSize: "", marketSize: "", founderExperience: "" })
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 border border-white/20"
              >
                ← New Comparison
              </Button>
            </div>

            {/* Metrics Comparison Table */}
            <div className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-8 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 shadow-2xl overflow-x-auto">
              <h2 className="text-2xl font-bold text-white mb-8">Input Metrics</h2>
              <div className="min-w-full">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4 text-white/60 text-sm font-medium">Metric</th>
                      <th className={`text-center py-3 px-4 text-white font-semibold ${isWinner('A') ? 'text-cyan-400' : ''}`}>
                        Startup A
                      </th>
                      <th className={`text-center py-3 px-4 text-white font-semibold ${isWinner('B') ? 'text-cyan-400' : ''}`}>
                        Startup B
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 text-white/80">Funding</td>
                      <td className="py-4 px-4 text-center text-white font-semibold">
                        {formatCurrency(parseFloat(startupA.funding))}
                      </td>
                      <td className="py-4 px-4 text-center text-white font-semibold">
                        {formatCurrency(parseFloat(startupB.funding))}
                      </td>
                    </tr>
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 text-white/80">Team Size</td>
                      <td className="py-4 px-4 text-center text-white font-semibold">
                        {Math.round(parseFloat(startupA.teamSize))} people
                      </td>
                      <td className="py-4 px-4 text-center text-white font-semibold">
                        {Math.round(parseFloat(startupB.teamSize))} people
                      </td>
                    </tr>
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 text-white/80">Market Size</td>
                      <td className="py-4 px-4 text-center text-white font-semibold">
                        {formatCurrency(parseFloat(startupA.marketSize))}
                      </td>
                      <td className="py-4 px-4 text-center text-white font-semibold">
                        {formatCurrency(parseFloat(startupB.marketSize))}
                      </td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 text-white/80">Founder Experience</td>
                      <td className="py-4 px-4 text-center text-white font-semibold">
                        {Math.round(parseFloat(startupA.founderExperience))} years
                      </td>
                      <td className="py-4 px-4 text-center text-white font-semibold">
                        {Math.round(parseFloat(startupB.founderExperience))} years
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Results Comparison Cards */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Startup A Results */}
              <div className={`rounded-2xl border backdrop-blur-xl p-8 transition-all duration-300 shadow-2xl ${
                isWinner('A')
                  ? 'border-green-400/50 bg-green-500/10 hover:border-green-400/80 hover:bg-green-500/15'
                  : 'border-cyan-400/30 bg-white/10 hover:border-cyan-400/60 hover:bg-cyan-500/10'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Startup A</h3>
                  {isWinner('A') && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-400/50">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-200 font-semibold">Winner</span>
                    </div>
                  )}
                </div>

                {/* Success Probability */}
                <div className="mb-8 p-6 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-white/60 text-sm mb-3">Success Probability</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-cyan-400">
                      {comparisonResult.startupA.successProbability}%
                    </span>
                  </div>
                </div>

                {/* Risk Level */}
                <div className="mb-6">
                  <p className="text-white/60 text-sm mb-3">Risk Level</p>
                  <div className={`inline-block px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wide ${
                    getRiskColor(comparisonResult.startupA.riskLevel)
                  }`}>
                    {comparisonResult.startupA.riskLevel}
                  </div>
                </div>

                {/* Breakdown Scores */}
                <div className="space-y-3 pt-6 border-t border-white/10">
                  <p className="text-white/60 text-sm font-semibold">Score Breakdown</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Funding</span>
                      <span className="text-white font-semibold">{comparisonResult.startupA.breakdown.fundingScore}/100</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                        style={{ width: `${comparisonResult.startupA.breakdown.fundingScore}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-3 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Team</span>
                      <span className="text-white font-semibold">{comparisonResult.startupA.breakdown.teamScore}/100</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        style={{ width: `${comparisonResult.startupA.breakdown.teamScore}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-3 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Market</span>
                      <span className="text-white font-semibold">{comparisonResult.startupA.breakdown.marketScore}/100</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-cyan-500"
                        style={{ width: `${comparisonResult.startupA.breakdown.marketScore}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-3 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Experience</span>
                      <span className="text-white font-semibold">{comparisonResult.startupA.breakdown.experienceScore}/100</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-pink-500"
                        style={{ width: `${comparisonResult.startupA.breakdown.experienceScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Startup B Results */}
              <div className={`rounded-2xl border backdrop-blur-xl p-8 transition-all duration-300 shadow-2xl ${
                isWinner('B')
                  ? 'border-green-400/50 bg-green-500/10 hover:border-green-400/80 hover:bg-green-500/15'
                  : 'border-cyan-400/30 bg-white/10 hover:border-cyan-400/60 hover:bg-cyan-500/10'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">Startup B</h3>
                  {isWinner('B') && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-400/50">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-200 font-semibold">Winner</span>
                    </div>
                  )}
                </div>

                {/* Success Probability */}
                <div className="mb-8 p-6 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-white/60 text-sm mb-3">Success Probability</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-cyan-400">
                      {comparisonResult.startupB.successProbability}%
                    </span>
                  </div>
                </div>

                {/* Risk Level */}
                <div className="mb-6">
                  <p className="text-white/60 text-sm mb-3">Risk Level</p>
                  <div className={`inline-block px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wide ${
                    getRiskColor(comparisonResult.startupB.riskLevel)
                  }`}>
                    {comparisonResult.startupB.riskLevel}
                  </div>
                </div>

                {/* Breakdown Scores */}
                <div className="space-y-3 pt-6 border-t border-white/10">
                  <p className="text-white/60 text-sm font-semibold">Score Breakdown</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Funding</span>
                      <span className="text-white font-semibold">{comparisonResult.startupB.breakdown.fundingScore}/100</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                        style={{ width: `${comparisonResult.startupB.breakdown.fundingScore}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-3 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Team</span>
                      <span className="text-white font-semibold">{comparisonResult.startupB.breakdown.teamScore}/100</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        style={{ width: `${comparisonResult.startupB.breakdown.teamScore}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-3 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Market</span>
                      <span className="text-white font-semibold">{comparisonResult.startupB.breakdown.marketScore}/100</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-cyan-500"
                        style={{ width: `${comparisonResult.startupB.breakdown.marketScore}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-3 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Experience</span>
                      <span className="text-white font-semibold">{comparisonResult.startupB.breakdown.experienceScore}/100</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-pink-500"
                        style={{ width: `${comparisonResult.startupB.breakdown.experienceScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights Section */}
            <div className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-8 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6">Key Insights</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-cyan-400 mt-1" />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">Success Probability Gap</p>
                    <p className="text-white/70">
                      {getWinner() !== 'tie'
                        ? `Startup ${getWinner()} has ${Math.abs(
                            comparisonResult.startupA.successProbability -
                            comparisonResult.startupB.successProbability
                          ).toFixed(1)}% higher success probability.`
                        : "Both startups have equal success probability."}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-cyan-400 mt-1" />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">Risk Profile</p>
                    <p className="text-white/70">
                      Startup A carries a {comparisonResult.startupA.riskLevel} risk level, while Startup B carries a{" "}
                      {comparisonResult.startupB.riskLevel} risk level.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-cyan-400 mt-1" />
                  </div>
                  <div>
                    <p className="text-white font-semibold mb-1">Strongest Factors</p>
                    <p className="text-white/70">
                      {comparisonResult.startupA.breakdown.fundingScore > comparisonResult.startupB.breakdown.fundingScore
                        ? "Startup A leads in funding strength. "
                        : "Startup B leads in funding strength. "}
                      {comparisonResult.startupA.breakdown.marketScore > comparisonResult.startupB.breakdown.marketScore
                        ? "Startup A has a larger addressable market."
                        : "Startup B has a larger addressable market."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
