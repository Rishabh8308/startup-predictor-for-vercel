"use client";

import { use } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Navigation } from "lucide-react";
import Link from "next/link";

export default function MatchDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12 pt-6">
        <div className="mb-6">
           <Link href="/network">
             <Button variant="ghost" size="sm" className="mb-2 text-muted-foreground hover:text-foreground">
               &larr; Back to Network
             </Button>
           </Link>
           <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
             Match Details
           </h1>
        </div>

        <Card className="glass-card border-purple-500/20">
          <CardHeader className="border-b border-border/40 bg-background/30">
             <CardTitle className="text-2xl flex items-center justify-between">
               AI Compatibility Report
               <span className="text-3xl font-black text-purple-400">92%</span>
             </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
             <div>
               <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
                 <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Why matched?
               </h3>
               <p className="text-foreground/80 leading-relaxed bg-muted/30 p-4 rounded-xl border border-border/20">
                 The ML analysis demonstrates a critical alignment between the investor's historical ticket size preferences ($500k-$1M) and the startup's current funding readiness score. The industry domain (AI/SaaS) maps precisely to 80% of the investor's successful exits over the past 5 years.
               </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <h4 className="font-semibold mb-3">Startup Score Relevance</h4>
                   <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex justify-between border-b border-border/20 py-2"><span>Growth Probability</span> <span className="font-medium text-foreground">88%</span></li>
                      <li className="flex justify-between border-b border-border/20 py-2"><span>Risk Assessment</span> <span className="font-medium text-emerald-400">Low (Stable)</span></li>
                      <li className="flex justify-between border-b border-border/20 py-2"><span>Traction Metric</span> <span className="font-medium text-foreground">Top 15%</span></li>
                   </ul>
                </div>
                <div>
                   <h4 className="font-semibold mb-3">Investor Preference Mapping</h4>
                   <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex justify-between border-b border-border/20 py-2"><span>Target Stage Alignment</span> <span className="font-medium text-emerald-400">Exact Match</span></li>
                      <li className="flex justify-between border-b border-border/20 py-2"><span>Market Fit</span> <span className="font-medium text-foreground">Global/B2B</span></li>
                      <li className="flex justify-between border-b border-border/20 py-2"><span>Historical ROI in Sector</span> <span className="font-medium text-purple-400">3.2x</span></li>
                   </ul>
                </div>
             </div>

             <div className="pt-6 flex gap-4">
                <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                   <Navigation className="w-4 h-4 mr-2" /> Connect Immediately
                </Button>
                <Link href={`/profile/investor/${resolvedParams.id}`} className="w-full sm:w-auto">
                   <Button variant="outline" className="w-full">View Full Profile</Button>
                </Link>
             </div>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}
