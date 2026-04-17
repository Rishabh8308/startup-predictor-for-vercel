export interface InvestorProfile {
  id: string;
  name: string;
  photoUrl: string;
  title: string;
  firm: string;
  verified: boolean;
  investmentDomains: string[];
  preferredStage: string[];
  ticketSizeMin: string;
  ticketSizeMax: string;
  preferredMarket: string;
  preferredGeography: string;
  portfolioStartups: number;
  credibilityScore: number;
  responseRate: string;
  successfulInvestments: number;
}

export interface EntrepreneurProfile {
  id: string;
  name: string;
  photoUrl: string;
  startupName: string;
  startupStage: string;
  pitchSummary: string;
  industry: string;
  marketSize: string;
  tractionMetrics: string;
  teamSize: number;
  revenueStatus: string;
  monthlyGrowth: string;
  score: number;
  growthProbability: number;
  investmentReadiness: string;
  riskLevel: string;
  aiRecommendation: string;
  verifiedFounder: boolean;
}

export interface PostComment {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto: string;
  authorRole: "investor" | "founder";
  text: string;
  timestamp: string;
}

export interface SocialPost {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto: string;
  authorRole: "investor" | "founder";
  authorHeadline: string;
  content: string;
  postType: string;
  tags: string[];
  upvotes: number;
  comments: PostComment[];
  timestamp: string;
}

export interface StartupMatch {
  investorId: string;
  startupId: string;
  matchScore: number;
  matchReason: string;
}
