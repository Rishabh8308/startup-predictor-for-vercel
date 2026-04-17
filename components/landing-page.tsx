"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Target,
  Brain,
  Lightbulb,
  BarChart3,
  Scale,
  FileText,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const steps = [
  {
    step: "01",
    icon: Lightbulb,
    title: "Describe Your Idea",
    description:
      "Enter your startup name, industry, target market, and describe your concept in plain English. No technical knowledge required.",
    color: "from-purple-500 to-indigo-500",
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
  },
  {
    step: "02",
    icon: Brain,
    title: "Gemini AI Analyzes",
    description:
      "Google Gemini performs a deep-dive analysis — SWOT framework, TAM/SAM/SOM market sizing, real competitor mapping, and viability scoring.",
    color: "from-indigo-500 to-blue-500",
    border: "border-indigo-500/30",
    bg: "bg-indigo-500/10",
  },
  {
    step: "03",
    icon: FileText,
    title: "Get Your Report",
    description:
      "Receive a comprehensive business brief, investor recommendation, and a downloadable PDF report — ready to share with your team.",
    color: "from-blue-500 to-cyan-500",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
  },
];

const features = [
  {
    icon: Sparkles,
    title: "Gemini AI Idea Analysis",
    description:
      "Describe your startup in plain English and get a complete SWOT analysis, market sizing (TAM/SAM/SOM), competitor landscape, and viability score — all powered by Google Gemini.",
    badge: "⭐ Most Popular",
    href: "/analyze",
    color: "text-purple-400",
    borderHover: "hover:border-purple-500/60 hover:bg-purple-500/10",
  },
  {
    icon: Target,
    title: "ML Success Predictor",
    description:
      "Enter funding, team size, market size, and founder experience into our trained Random Forest model to get an instant success probability score with breakdown analysis.",
    badge: "🤖 ML Powered",
    href: "/predict",
    color: "text-cyan-400",
    borderHover: "hover:border-cyan-500/60 hover:bg-cyan-500/10",
  },
  {
    icon: Scale,
    title: "Side-by-Side Comparison",
    description:
      "Compare two startup ideas head-to-head using saved AI analyses, or compare numeric metrics directly. See who wins and why.",
    badge: "⚖️ Compare",
    href: "/compare",
    color: "text-indigo-400",
    borderHover: "hover:border-indigo-500/60 hover:bg-indigo-500/10",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Explore industry success rates, funding stage performance, team size impact, and startup survival rate trends through interactive charts.",
    badge: "📊 Analytics",
    href: "/analytics",
    color: "text-blue-400",
    borderHover: "hover:border-blue-500/60 hover:bg-blue-500/10",
  },
  {
    icon: TrendingUp,
    title: "Real-Time Simulator",
    description:
      "Drag sliders for funding, team size, market size, and experience and watch the success probability update live with every change.",
    badge: "🎮 Interactive",
    href: "/simulator",
    color: "text-emerald-400",
    borderHover: "hover:border-emerald-500/60 hover:bg-emerald-500/10",
  },
  {
    icon: FileText,
    title: "Ideas Library",
    description:
      "Save any Gemini analysis to your personal library. Organize, rename, and compare your saved ideas. Your portfolio of startup analyses in one place.",
    badge: "📚 Library",
    href: "/ideas",
    color: "text-amber-400",
    borderHover: "hover:border-amber-500/60 hover:bg-amber-500/10",
  },
];

const deliverables = [
  "SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats)",
  "Market Size Estimation (TAM / SAM / SOM)",
  "Top 3 Real Competitor Mapping",
  "Viability Score (1–10)",
  "Executive Business Brief",
  "Full Investor Recommendation",
  "Downloadable PDF Report",
];

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* NAVBAR */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-5xl"
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4 flex items-center justify-between shadow-2xl">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base text-white group-hover:text-purple-300 transition-colors">
              StartupPredictor
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/analyze"
              className="text-purple-300 hover:text-white transition-colors text-sm font-semibold flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Analyze Idea
            </Link>
            <Link
              href="/dashboard"
              className="text-white/70 hover:text-white transition-colors text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/predict"
              className="text-white/70 hover:text-white transition-colors text-sm font-medium"
            >
              Predict
            </Link>
            <Link
              href="/analytics"
              className="text-white/70 hover:text-white transition-colors text-sm font-medium"
            >
              Analytics
            </Link>
          </div>

          <Button
            asChild
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-0 shadow-lg shadow-purple-500/25"
          >
            <Link href="/analyze" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Try Gemini AI
            </Link>
          </Button>
        </div>
      </motion.nav>

      {/* HERO */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 -z-20">
          <Image
            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&h=900&fit=crop"
            alt="AI Technology Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Dark overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-900/75 to-purple-950/80 -z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent -z-10" />

        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-indigo-600/20 to-transparent rounded-full blur-3xl -z-10" />

        <motion.div
          className="max-w-5xl mx-auto text-center relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-400/50 bg-purple-500/20 backdrop-blur-md mb-8 text-sm text-purple-200 shadow-lg"
          >
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            Powered by Google Gemini AI
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-7xl font-black leading-tight mb-6 text-white drop-shadow-2xl"
          >
            Turn Your Idea Into
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
              an Investor Report
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-8 leading-relaxed drop-shadow-lg font-light"
          >
            Describe your startup idea in plain English. Gemini AI instantly
            delivers a complete SWOT analysis, market sizing, competitor mapping,
            viability score, and investor-grade recommendation.
          </motion.p>

          {/* Deliverables pills */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {["SWOT Analysis", "TAM/SAM/SOM", "Competitor Map", "Viability Score", "PDF Report"].map(
              (item) => (
                <span
                  key={item}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 backdrop-blur"
                >
                  ✓ {item}
                </span>
              )
            )}
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500 px-10 py-7 text-lg rounded-xl shadow-2xl hover:shadow-purple-500/50 transition-all text-white font-bold border border-purple-500/30 backdrop-blur"
              >
                <Link href="/analyze" className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  Analyze With Gemini AI
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                className="px-10 py-7 text-lg rounded-xl border-2 border-white/40 hover:border-white/60 bg-white/10 hover:bg-white/20 transition-all text-white font-bold backdrop-blur-lg shadow-lg hover:shadow-xl"
              >
                <Link href="/predict" className="flex items-center gap-3">
                  ML Predictor
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-24 px-6 relative bg-gradient-to-b from-slate-950 to-slate-950/95"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-400/40 bg-purple-500/10 mb-5 text-sm text-purple-300">
              <Sparkles className="w-3.5 h-3.5" />
              Gemini AI Analysis
            </div>
            <h2 className="text-5xl font-bold mb-4 text-white">
              How It Works
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              From idea to investor-ready analysis in under 30 seconds
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`relative rounded-2xl border ${step.border} ${step.bg} backdrop-blur-xl p-8 shadow-2xl`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-5 shadow-lg`}
                >
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <div className="absolute top-6 right-6 text-4xl font-black text-white/10">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-white/70 leading-relaxed text-sm">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* What you get */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent p-8 md:p-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                What You Get in Every Analysis
              </h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {deliverables.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-white/80 text-sm">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-8 py-5 text-base rounded-xl shadow-lg shadow-purple-500/25 text-white font-bold border border-purple-500/30"
                >
                  <Link href="/analyze" className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Try It Free — No Sign Up Required
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* DASHBOARD PREVIEW */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-32 px-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 -z-20">
          <Image
            src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1600&h=900&fit=crop"
            alt="Dashboard Background"
            fill
            className="object-cover opacity-20"
          />
        </div>
        
        {/* Animated Glows & Particles */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/90 -z-10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDelay: '1000ms' }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-white tracking-tight drop-shadow-2xl">
              A <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">Powerful Dashboard</span>
            </h2>
            <p className="text-white/70 text-xl max-w-3xl mx-auto font-light">
              All the tools you need to evaluate startup potential in one
              intuitive, real-time interface.
            </p>
          </motion.div>

          <div className="relative flex justify-center perspective-1000">
            <motion.div
              initial={{ opacity: 0, y: 80, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -10 }}
              className="w-full max-w-5xl"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-[0_0_50px_-12px_rgba(168,85,247,0.4)] hover:shadow-[0_0_80px_-12px_rgba(168,85,247,0.6)] transition-all duration-500 border border-purple-500/30">
                <Image
                  src="/dashboard.png"
                  width={1400}
                  height={800}
                  alt="Startup Predictor Dashboard"
                  className="w-full h-auto rounded-2xl backdrop-blur-xl"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-cyan-500/10 rounded-2xl pointer-events-none" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ALL FEATURES */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-24 px-6 relative"
      >
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1600&h=900&fit=crop"
            alt="Features Background"
            fill
            className="object-cover opacity-25"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 to-slate-950/90 -z-10" />

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold mb-4 text-white">
              Everything You Need
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Six powerful tools to research, predict, analyze, and compare —
              all in one platform
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                onHoverStart={() => setHoveredFeature(idx)}
                onHoverEnd={() => setHoveredFeature(null)}
                whileHover={{ y: -6 }}
              >
                <Link
                  href={feature.href}
                  className={`group block rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-7 ${feature.borderHover} transition-all duration-300 shadow-xl h-full`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0`}
                    >
                      <feature.icon className={`w-5 h-5 ${feature.color}`} />
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/20 text-white/70 font-medium mt-0.5">
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                  <div className="flex items-center gap-1.5 mt-5 text-xs text-white/50 group-hover:text-white/80 transition-colors">
                    <span>Try it now</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-24 px-6 relative"
      >
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&h=900&fit=crop"
            alt="CTA Background"
            fill
            className="object-cover opacity-40"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/75 to-purple-950/80 -z-10" />

        <motion.div className="max-w-3xl mx-auto text-center border border-purple-500/40 rounded-2xl p-12 bg-white/10 hover:bg-white/15 backdrop-blur-xl shadow-2xl hover:shadow-purple-500/30 transition-all">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
            <Sparkles className="w-8 h-8 text-white" />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4 text-white"
          >
            Ready to Analyze Your Idea?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-white/80 mb-10 text-lg leading-relaxed"
          >
            No sign-up required. Describe your startup idea and Gemini AI will
            produce a complete investor-grade analysis in under 30 seconds.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-10 py-6 text-base rounded-xl shadow-2xl hover:shadow-purple-500/50 transition-all text-white font-bold border border-purple-500/30"
              >
                <Link href="/analyze" className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Analyze with Gemini AI
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                className="px-10 py-6 text-base rounded-xl border-2 border-white/30 bg-white/10 hover:bg-white/20 transition-all text-white font-semibold backdrop-blur-lg"
              >
                <Link href="/predict">ML Success Predictor</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* FOOTER */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        className="border-t border-white/10 py-16 px-6 bg-gradient-to-b from-slate-950 to-slate-900"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-base text-white group-hover:text-purple-300 transition-colors">
              StartupPredictor
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-8 text-white/70 text-sm">
            <Link href="/analyze" className="hover:text-white transition-colors font-medium text-purple-300">
              Analyze Idea
            </Link>
            <Link href="/predict" className="hover:text-white transition-colors font-medium">
              Predict
            </Link>
            <Link href="/dashboard" className="hover:text-white transition-colors font-medium">
              Dashboard
            </Link>
            <Link href="/compare" className="hover:text-white transition-colors font-medium">
              Compare
            </Link>
            <Link href="/about" className="hover:text-white transition-colors font-medium">
              About
            </Link>
          </div>
        </div>
        <div className="text-center text-sm text-white/50 pt-8 border-t border-white/10">
          © 2026 StartupPredictor. All rights reserved. | Powered by Google Gemini AI + ML
        </div>
      </motion.footer>
    </div>
  );
}