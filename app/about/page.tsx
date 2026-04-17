"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Sparkles, Target, Brain, BarChart3, Shield, Zap, Github, Mail, Linkedin } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Brain,
    title: "Advanced AI Models",
    description: "Powered by deep neural networks trained on 50,000+ startup data points for accurate predictions."
  },
  {
    icon: BarChart3,
    title: "Comprehensive Analytics",
    description: "Detailed insights into industry trends, funding patterns, and success factors."
  },
  {
    icon: Shield,
    title: "Data Security",
    description: "Enterprise-grade security ensuring your startup data remains private and protected."
  },
  {
    icon: Zap,
    title: "Real-time Predictions",
    description: "Get instant success probability scores with our optimized inference engine."
  },
]

const team = [
  { name: "Alex Chen", role: "Founder & CEO", avatar: "AC" },
  { name: "Sarah Kim", role: "Head of AI", avatar: "SK" },
  { name: "Mike Johnson", role: "Lead Engineer", avatar: "MJ" },
]

export default function AboutPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 mb-6">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-white/70">About Us</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Predicting the Future of
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text"> Startups</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            StartupPredictor combines cutting-edge machine learning with deep industry expertise 
            to help entrepreneurs, investors, and analysts make data-driven decisions.
          </p>
        </div>

        {/* Mission Card */}
        <div className="rounded-3xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-8 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 shadow-2xl">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/30">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">Our Mission</h2>
              <p className="text-white/70 leading-relaxed">
                We believe that every startup deserves access to the same data-driven insights 
                that top venture capital firms use. Our mission is to democratize startup analytics, 
                making predictive intelligence accessible to founders, investors, and analysts worldwide. 
                By leveraging AI, we aim to reduce uncertainty in the startup ecosystem and help 
                great ideas reach their full potential.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div 
                key={feature.title}
                className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-6 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 shadow-xl"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member) => (
              <div 
                key={member.name}
                className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-6 text-center hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 shadow-2xl"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20">
                  <span className="text-xl font-bold text-white">{member.avatar}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-sm text-white/60">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6">
          <div className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-6 text-center hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 shadow-2xl">
            <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text mb-2">50K+</p>
            <p className="text-sm text-white/60">Startups Analyzed</p>
          </div>
          <div className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-6 text-center hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 shadow-2xl">
            <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text mb-2">94.7%</p>
            <p className="text-sm text-white/60">Model Accuracy</p>
          </div>
          <div className="rounded-2xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-6 text-center hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 shadow-2xl">
            <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text mb-2">10+</p>
            <p className="text-sm text-white/60">Industries Covered</p>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="rounded-3xl border border-cyan-400/30 bg-white/10 backdrop-blur-xl p-8 text-center hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all duration-300 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-4">Get in Touch</h2>
          <p className="text-white/70 mb-6 max-w-lg mx-auto">
            Have questions about our platform? Want to partner with us? 
            We would love to hear from you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild variant="outline" className="border-cyan-400/30 hover:bg-cyan-500/10 hover:border-cyan-400/60 hover:text-white text-white rounded-xl">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </a>
            </Button>
            <Button asChild variant="outline" className="border-cyan-400/30 hover:bg-cyan-500/10 hover:border-cyan-400/60 hover:text-white text-white rounded-xl">
              <a href="mailto:contact@example.com">
                <Mail className="w-5 h-5 mr-2" />
                Email Us
              </a>
            </Button>
            <Button asChild className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl shadow-lg shadow-cyan-500/25">
              <Link href="/predict">
                <Sparkles className="w-5 h-5 mr-2" />
                Try Predictor
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
