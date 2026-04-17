"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertTriangle, XCircle, TrendingUp, Shield, Zap, ArrowRight, RotateCcw, DollarSign, Users, Building2, Calendar } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from "recharts"
import { Suspense } from "react"

function ResultsContent() {
  const searchParams = useSearchParams()
  
  // Get form data from URL params
  const funding = Number(searchParams.get("funding")) || 5000000
  const team = Number(searchParams.get("team")) || 25
  const industry = searchParams.get("industry") || "technology"
  const years = Number(searchParams.get("years")) || 3
  const rounds = Number(searchParams.get("rounds")) || 2
  const milestones = Number(searchParams.get("milestones")) || 5

  // Calculate success probability based on inputs (simulated AI model)
  const calculateProbability = () => {
    let score = 50
    
    // Funding impact (up to +20)
    if (funding > 10000000) score += 20
    else if (funding > 5000000) score += 15
    else if (funding > 1000000) score += 10
    else score += 5
    
    // Team size impact (up to +15)
    if (team >= 20 && team <= 100) score += 15
    else if (team >= 10) score += 10
    else score += 5
    
    // Years active impact (up to +10)
    if (years >= 3 && years <= 7) score += 10
    else if (years >= 2) score += 5
    
    // Funding rounds impact (up to +10)
    score += Math.min(rounds * 3, 10)
    
    // Milestones impact (up to +15)
    score += Math.min(milestones * 2, 15)
    
    return Math.min(score, 95)
  }

  const successProbability = calculateProbability()
  
  const getRiskLevel = (prob: number) => {
    if (prob >= 70) return { level: "Low", color: "text-green-400", bg: "bg-green-400/10", icon: CheckCircle2 }
    if (prob >= 50) return { level: "Medium", color: "text-yellow-400", bg: "bg-yellow-400/10", icon: AlertTriangle }
    return { level: "High", color: "text-red-400", bg: "bg-red-400/10", icon: XCircle }
  }

  const getGrowthPotential = (prob: number) => {
    if (prob >= 75) return { level: "High", color: "text-green-400" }
    if (prob >= 55) return { level: "Moderate", color: "text-yellow-400" }
    return { level: "Low", color: "text-red-400" }
  }

  const risk = getRiskLevel(successProbability)
  const growth = getGrowthPotential(successProbability)

  const featureImportance = [
    { name: "Funding", value: 32, fill: "var(--chart-1)" },
    { name: "Team Size", value: 24, fill: "var(--chart-2)" },
    { name: "Milestones", value: 18, fill: "var(--chart-3)" },
    { name: "Industry", value: 14, fill: "var(--chart-4)" },
    { name: "Years Active", value: 12, fill: "var(--chart-5)" },
  ]

  const gaugeData = [
    { name: "Probability", value: successProbability, fill: "url(#gaugeGradient)" }
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-3">Prediction Results</h1>
        <p className="text-muted-foreground">
          AI analysis complete for your {industry.charAt(0).toUpperCase() + industry.slice(1)} startup
        </p>
      </div>

      {/* Main Results Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Success Probability Card */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-8">
          <h2 className="text-lg font-semibold text-foreground mb-6">Success Probability</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="100%"
                  barSize={20}
                  data={gaugeData}
                  startAngle={180}
                  endAngle={0}
                >
                  <defs>
                    <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    background={{ fill: "rgba(255,255,255,0.05)" }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="text-center -mt-20">
                <span className="text-5xl font-bold gradient-text">{successProbability}%</span>
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${risk.bg} flex items-center justify-center`}>
                  <risk.icon className={`w-6 h-6 ${risk.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Risk Level</p>
                  <p className={`text-xl font-semibold ${risk.color}`}>{risk.level}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-400/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Growth Potential</p>
                  <p className={`text-xl font-semibold ${growth.color}`}>{growth.level}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-400/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Model Confidence</p>
                  <p className="text-xl font-semibold text-foreground">92%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input Summary */}
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Input Summary</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm">Funding</span>
              </div>
              <span className="text-sm font-medium text-foreground">${(funding / 1000000).toFixed(1)}M</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="text-sm">Team Size</span>
              </div>
              <span className="text-sm font-medium text-foreground">{team} people</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="w-4 h-4" />
                <span className="text-sm">Industry</span>
              </div>
              <span className="text-sm font-medium text-foreground capitalize">{industry}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Years Active</span>
              </div>
              <span className="text-sm font-medium text-foreground">{years} years</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="w-4 h-4" />
                <span className="text-sm">Funding Rounds</span>
              </div>
              <span className="text-sm font-medium text-foreground">{rounds}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Importance Chart */}
      <div className="glass-card rounded-3xl p-8">
        <h2 className="text-lg font-semibold text-foreground mb-6">Feature Importance</h2>
        <p className="text-sm text-muted-foreground mb-6">
          How each factor contributed to the prediction
        </p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={featureImportance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
              <XAxis 
                type="number" 
                tick={{ fill: '#888', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fill: '#888', fontSize: 12 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(22, 22, 30, 0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  color: "#fff"
                }}
                formatter={(value) => [`${value}%`, "Importance"]}
              />
              <Bar 
                dataKey="value" 
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild variant="outline" className="border-border/50 hover:bg-secondary/50 px-8 py-6 rounded-xl">
          <Link href="/predict">
            <RotateCcw className="w-5 h-5 mr-2" />
            New Prediction
          </Link>
        </Button>
        <Button asChild className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-foreground px-8 py-6 rounded-xl shadow-lg shadow-purple-500/25">
          <Link href="/analytics">
            View Analytics
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      }>
        <ResultsContent />
      </Suspense>
    </DashboardLayout>
  )
}
