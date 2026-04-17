// ─── Gemini Analysis Types ────────────────────────────────────────────────────

export interface SWOTAnalysis {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

export interface MarketSize {
  tam: string
  sam: string
  som: string
}

export interface Competitor {
  name: string
  description: string
  differentiator: string
}

export interface AnalysisResult {
  swot: SWOTAnalysis
  marketSize: MarketSize
  competitors: Competitor[]
  viabilityScore: number   // 1–10
  businessBrief: string
  recommendation: string
}

// ─── Input Types ──────────────────────────────────────────────────────────────

export interface AnalyzeRequest {
  ideaName: string
  idea: string
  industry: string
  targetMarket: string
}

// ─── Saved Idea (localStorage) ────────────────────────────────────────────────

export interface SavedIdea {
  id: string            // crypto.randomUUID()
  ideaName: string
  industry: string
  targetMarket: string
  ideaDescription: string
  createdAt: string     // ISO timestamp
  analysis: AnalysisResult
}

// ─── localStorage Keys ────────────────────────────────────────────────────────

export const LS_SAVED_IDEAS = "savedStartupIdeas"
export const LS_LAST_ANALYSIS = "lastStartupAnalysis"
export const LS_LAST_INPUT = "lastAnalysisInput"
