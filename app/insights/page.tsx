"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"
import { Brain, Cpu, Database, LineChart, Sparkles, Zap, Info, CheckCircle2 } from "lucide-react"

const featureImportanceData = [
  { feature: "Funding Amount", importance: 32, description: "Total capital raised by the startup" },
  { feature: "Team Size", importance: 24, description: "Number of employees" },
  { feature: "Milestones", importance: 18, description: "Key achievements completed" },
  { feature: "Industry", importance: 14, description: "Market sector classification" },
  { feature: "Years Active", importance: 12, description: "Time since founding" },
]

const radarData = [
  { factor: "Funding", A: 85, fullMark: 100 },
  { factor: "Team", A: 72, fullMark: 100 },
  { factor: "Market Fit", A: 68, fullMark: 100 },
  { factor: "Growth", A: 90, fullMark: 100 },
  { factor: "Innovation", A: 75, fullMark: 100 },
  { factor: "Timing", A: 62, fullMark: 100 },
]

const modelMetrics = [
  { name: "Accuracy", value: "94.7%", icon: CheckCircle2, color: "text-green-400" },
  { name: "Precision", value: "92.3%", icon: Zap, color: "text-purple-400" },
  { name: "Recall", value: "91.8%", icon: Brain, color: "text-blue-400" },
  { name: "F1 Score", value: "92.0%", icon: LineChart, color: "text-indigo-400" },
]

const modelArchitecture = [
  { layer: "Input Layer", nodes: "6 features", description: "Startup metrics input" },
  { layer: "Hidden Layer 1", nodes: "128 neurons", description: "Feature extraction" },
  { layer: "Hidden Layer 2", nodes: "64 neurons", description: "Pattern recognition" },
  { layer: "Hidden Layer 3", nodes: "32 neurons", description: "Abstract features" },
  { layer: "Output Layer", nodes: "1 neuron", description: "Success probability" },
]

export default function InsightsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Model Insights</h1>
          <p className="text-white/60">Understanding how our AI predicts startup success</p>
        </div>

        {/* Model Overview Card */}
        <div className="rounded-3xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-8 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/30">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-3">Deep Neural Network</h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Our prediction model uses a deep neural network trained on over 50,000 startup data points. 
                The model analyzes multiple factors including funding metrics, team composition, industry dynamics, 
                and growth indicators to generate accurate success probability predictions.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-white">50K+ Training Samples</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-white">5-Layer Architecture</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-white">Real-time Inference</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Model Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {modelMetrics.map((metric) => (
            <div key={metric.name} className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-6 text-center hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                <metric.icon className="w-6 h-6 text-cyan-400" />
              </div>
              <p className="text-2xl font-bold text-white mb-1">{metric.value}</p>
              <p className="text-sm text-white/60">{metric.name}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Feature Importance Chart */}
          <div className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-6 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">Feature Importance</h3>
            <p className="text-sm text-white/60 mb-6">How each input affects predictions</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureImportanceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                  <XAxis 
                    type="number"
                    tick={{ fill: '#e5e7eb', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis 
                    type="category"
                    dataKey="feature"
                    tick={{ fill: '#e5e7eb', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                    width={120}
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
                    dataKey="importance" 
                    fill="url(#importanceGradient)"
                    radius={[0, 6, 6, 0]}
                  />
                  <defs>
                    <linearGradient id="importanceGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model Performance Radar */}
          <div className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-6 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">Factor Analysis</h3>
            <p className="text-sm text-white/60 mb-6">Multi-dimensional success factors</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis 
                    dataKey="factor" 
                    tick={{ fill: '#e5e7eb', fontSize: 12 }}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]}
                    tick={{ fill: '#e5e7eb', fontSize: 10 }}
                  />
                  <Radar
                    name="Score"
                    dataKey="A"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(22, 22, 30, 0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff"
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Factors Affecting Success */}
        <div className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-6 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 shadow-2xl">
          <h3 className="text-lg font-semibold text-white mb-6">Key Success Factors</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureImportanceData.map((feature, index) => (
              <div 
                key={feature.feature}
                className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-cyan-400/30"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-cyan-400">#{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">{feature.feature}</h4>
                  <p className="text-sm text-white/60">{feature.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                        style={{ width: `${feature.importance * 3}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-white">{feature.importance}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Architecture */}
        <div className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-6 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 shadow-2xl">
          <h3 className="text-lg font-semibold text-white mb-2">Neural Network Architecture</h3>
          <p className="text-sm text-white/60 mb-6">How data flows through our model</p>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {modelArchitecture.map((layer, index) => (
              <div key={layer.layer} className="flex items-center gap-4">
                <div className="text-center p-4 rounded-xl bg-cyan-500/10 border border-cyan-400/30 min-w-[140px] hover:border-cyan-400/60 hover:bg-cyan-500/20 transition-all">
                  <p className="text-sm font-semibold text-white mb-1">{layer.layer}</p>
                  <p className="text-xs text-cyan-400 mb-2">{layer.nodes}</p>
                  <p className="text-xs text-white/60">{layer.description}</p>
                </div>
                {index < modelArchitecture.length - 1 && (
                  <div className="hidden md:block w-8 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Explanation */}
        <div className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-6 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 shadow-2xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">How Our Model Works</h3>
              <div className="text-white/70 space-y-3 leading-relaxed">
                <p>
                  Our startup success prediction model employs a deep learning approach using a multi-layer neural network. 
                  The model processes six key input features: funding amount, team size, industry classification, 
                  years of operation, number of funding rounds, and milestones achieved.
                </p>
                <p>
                  During training, the model learned patterns from over 50,000 historical startup outcomes, 
                  identifying complex relationships between these factors and eventual success. The architecture 
                  includes batch normalization and dropout layers to prevent overfitting and ensure generalization.
                </p>
                <p>
                  The output is a probability score between 0-100%, indicating the likelihood of startup success. 
                  This score is accompanied by risk assessment and growth potential indicators derived from 
                  the model confidence intervals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
