"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AIExplanationChart } from "@/components/ai-explanation-chart"
import { InvestorReport } from "@/components/investor-report"
import { Sparkles, DollarSign, Users, TrendingUp, Award } from "lucide-react"

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

export default function PredictPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PredictionResponse | null>(null)
  const [formData, setFormData] = useState({
    funding: "",
    teamSize: "",
    marketSize: "",
    founderExperience: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResult(null)
    
    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          funding: parseFloat(formData.funding),
          teamSize: parseFloat(formData.teamSize),
          marketSize: parseFloat(formData.marketSize),
          founderExperience: parseFloat(formData.founderExperience),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get prediction")
      }

      const data = await response.json()
      setResult(data)

      // Save prediction to localStorage
      const history = JSON.parse(localStorage.getItem("predictionHistory") || "[]")
      history.push({
        ...data,
        timestamp: new Date().toISOString(),
      })
      localStorage.setItem("predictionHistory", JSON.stringify(history))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 mb-4">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-white/70">AI-Powered Prediction</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Predict Startup Success</h1>
          <p className="text-white/60 max-w-xl mx-auto">
            Enter your startup details below and our AI model will predict your success probability.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-8 border-red-400/50 bg-red-500/10">
            <AlertDescription className="text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Results Section */}
        {result && (
          <div className="mb-8 rounded-3xl border border-green-400/30 bg-green-500/10 backdrop-blur-xl p-8 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Prediction Results</h2>
              <div className="inline-flex items-center justify-center w-40 h-40 rounded-full border-2 border-green-400/50 bg-gradient-to-br from-green-500/20 to-cyan-500/10">
                <div className="text-center">
                  <p className="text-5xl font-bold text-green-400">{result.successProbability}%</p>
                  <p className="text-sm text-white/70 mt-2">Success Probability</p>
                </div>
              </div>
            </div>

            {/* Risk Level Badge */}
            <div className="flex justify-center">
              <div className={`px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wide ${
                result.riskLevel === 'low' ? 'bg-green-500/30 text-green-200 border border-green-400/50' :
                result.riskLevel === 'medium' ? 'bg-yellow-500/30 text-yellow-200 border border-yellow-400/50' :
                'bg-red-500/30 text-red-200 border border-red-400/50'
              }`}>
                Risk Level: {result.riskLevel}
              </div>
            </div>

            {/* Breakdown Scores */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <p className="text-white/60 text-sm mb-2">Funding Score</p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold text-cyan-400">{result.breakdown.fundingScore}</p>
                  <span className="text-white/40 text-sm">/100</span>
                </div>
                <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    style={{ width: `${result.breakdown.fundingScore}%` }}
                  />
                </div>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <p className="text-white/60 text-sm mb-2">Team Score</p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold text-cyan-400">{result.breakdown.teamScore}</p>
                  <span className="text-white/40 text-sm">/100</span>
                </div>
                <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${result.breakdown.teamScore}%` }}
                  />
                </div>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <p className="text-white/60 text-sm mb-2">Market Score</p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold text-cyan-400">{result.breakdown.marketScore}</p>
                  <span className="text-white/40 text-sm">/100</span>
                </div>
                <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-500"
                    style={{ width: `${result.breakdown.marketScore}%` }}
                  />
                </div>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <p className="text-white/60 text-sm mb-2">Experience Score</p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold text-cyan-400">{result.breakdown.experienceScore}</p>
                  <span className="text-white/40 text-sm">/100</span>
                </div>
                <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-pink-500"
                    style={{ width: `${result.breakdown.experienceScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* AI Explanation Chart */}
            <div className="mt-8">
              <AIExplanationChart featureImportance={result.featureImportance} />
            </div>

            {/* Investor Report */}
            <div className="mt-8">
              <InvestorReport
                successProbability={result.successProbability}
                riskLevel={result.riskLevel}
                featureImportance={result.featureImportance}
              />
            </div>

            {/* Try Again Button */}
            <button
              onClick={() => {
                setResult(null)
                setFormData({ funding: "", teamSize: "", marketSize: "", founderExperience: "" })
              }}
              className="w-full px-4 py-2 text-white/70 hover:text-white border border-white/20 hover:border-white/40 rounded-lg transition-all"
            >
              Try Another Prediction
            </button>
          </div>
        )}

        {/* Prediction Form */}
        {!result && (
          <form onSubmit={handleSubmit} className="rounded-3xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-8 space-y-8 hover:border-cyan-400/60 hover:bg-cyan-500/5 transition-all duration-300 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Funding Amount */}
              <div className="space-y-2">
                <Label htmlFor="funding" className="text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-cyan-400" />
                  Funding Amount (USD)
                </Label>
                <Input
                  id="funding"
                  type="number"
                  placeholder="e.g., 5000000"
                  value={formData.funding}
                  onChange={(e) => setFormData({ ...formData, funding: e.target.value })}
                  className="bg-white/5 border-white/20 focus:border-cyan-400/50 h-12 rounded-xl text-white placeholder:text-white/40"
                  required
                />
                <p className="text-xs text-white/40">Total funding raised by your startup</p>
              </div>

              {/* Team Size */}
              <div className="space-y-2">
                <Label htmlFor="teamSize" className="text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  Team Size
                </Label>
                <Input
                  id="teamSize"
                  type="number"
                  placeholder="e.g., 25"
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                  className="bg-white/5 border-white/20 focus:border-cyan-400/50 h-12 rounded-xl text-white placeholder:text-white/40"
                  required
                />
                <p className="text-xs text-white/40">Number of employees (optimal: ~25)</p>
              </div>

              {/* Market Size */}
              <div className="space-y-2">
                <Label htmlFor="marketSize" className="text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  Market Size (USD)
                </Label>
                <Input
                  id="marketSize"
                  type="number"
                  placeholder="e.g., 5000000000"
                  value={formData.marketSize}
                  onChange={(e) => setFormData({ ...formData, marketSize: e.target.value })}
                  className="bg-white/5 border-white/20 focus:border-cyan-400/50 h-12 rounded-xl text-white placeholder:text-white/40"
                  required
                />
                <p className="text-xs text-white/40">Total addressable market size</p>
              </div>

              {/* Founder Experience */}
              <div className="space-y-2">
                <Label htmlFor="founderExperience" className="text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-cyan-400" />
                  Founder Experience (Years)
                </Label>
                <Input
                  id="founderExperience"
                  type="number"
                  placeholder="e.g., 10"
                  value={formData.founderExperience}
                  onChange={(e) => setFormData({ ...formData, founderExperience: e.target.value })}
                  className="bg-white/5 border-white/20 focus:border-cyan-400/50 h-12 rounded-xl text-white placeholder:text-white/40"
                  required
                />
                <p className="text-xs text-white/40">Years of relevant industry experience</p>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-lg rounded-xl shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing with AI...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Predict Startup Success
                </div>
              )}
            </Button>
          </form>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="rounded-xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-4 text-center hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300">
            <p className="text-2xl font-bold text-white mb-1">95%</p>
            <p className="text-sm text-white/60">Model Accuracy</p>
          </div>
          <div className="rounded-xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-4 text-center hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300">
            <p className="text-2xl font-bold text-white mb-1">10K+</p>
            <p className="text-sm text-white/60">Startups Analyzed</p>
          </div>
          <div className="rounded-xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-4 text-center hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300">
            <p className="text-2xl font-bold text-white mb-1">{"<"}2s</p>
            <p className="text-sm text-white/60">Analysis Time</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
