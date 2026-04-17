import { mockEntrepreneurs, mockInvestors } from "@/lib/mock-data";
import { MatchingCard } from "./matching-card";

export function CommunityRightSidebar() {
  // We'll just grab the top investor and founder as recommended matches
  const recommendedInvestor = mockInvestors[0];
  const recommendedStartup = mockEntrepreneurs[0];

  return (
    <div className="space-y-8 sticky top-24">
      <div>
        <h3 className="font-semibold text-sm mb-4 text-foreground flex items-center justify-between">
          Recommended Matches
          <span className="text-xs text-purple-500 bg-purple-500/10 px-2 py-1 rounded-full">New</span>
        </h3>
        
        <div className="space-y-4">
          <MatchingCard 
            type="investor" 
            data={recommendedInvestor} 
            matchScore={92}
            matchReason="Looking for AI/SaaS Seed startups. Matches your domain."
          />
          <MatchingCard 
            type="startup" 
            data={recommendedStartup} 
            matchScore={87}
            matchReason="High AI viability score. Matches your ticket size preferrence."
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-4 text-foreground">Top Startups This Week</h3>
        <div className="space-y-3 glass-card p-4 rounded-xl border border-border/50">
          {[
            { name: "NexusAI", score: 87, movement: "+2" },
            { name: "FinFlow", score: 82, movement: "+5" },
            { name: "HealthSync", score: 79, movement: "-1" }
          ].map((s, i) => (
             <div key={i} className="flex justify-between items-center text-sm">
                <span className="font-medium">{s.name}</span>
                <div className="flex gap-2">
                  <span className="text-emerald-500 text-xs">{s.movement}</span>
                  <span className="text-right font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 w-6">
                    {s.score}
                  </span>
                </div>
             </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-center text-muted-foreground pt-4 border-t border-border/40">
        StartupPredictor Community &copy; 2026<br/>
        User Agreement • Privacy Policy
      </div>
    </div>
  );
}
