"use client";

import { use } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { mockInvestors } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrustBadge } from "@/components/community/trust-badge";
import { ConnectActions } from "@/components/community/connect-actions";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building, MapPin, Target, Wallet } from "lucide-react";

export default function InvestorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  // Using dummy data
  const profile = mockInvestors.find(e => e.id === resolvedParams.id) || mockInvestors[0];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        
        {/* Header Profile Section */}
        <div className="relative rounded-2xl overflow-hidden glass-card border border-blue-500/20">
          <div className="h-32 bg-gradient-to-r from-slate-800 to-blue-900 w-full" />
          <div className="px-8 pb-8 pt-0 relative">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 mb-4">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage src={profile.photoUrl} alt={profile.name} />
                <AvatarFallback>{profile.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 pb-2">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  {profile.name}
                </h1>
                <p className="text-lg text-muted-foreground">{profile.title} at {profile.firm}</p>
              </div>
              <div className="pb-2 flex gap-3 w-full md:w-auto">
                 <ConnectActions type="investor" />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-6">
               {profile.verified && <TrustBadge type="verified-investor" />}
               <div className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-bold border border-blue-500/20">
                 {profile.credibilityScore} Credibility Score
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info Column */}
          <div className="col-span-1 lg:col-span-2 space-y-8">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xl">Investment Thesis & Domains</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h4 className="text-sm text-muted-foreground uppercase tracking-wider mb-3">Industries</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.investmentDomains.map(domain => (
                      <Badge key={domain} className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border-0">{domain}</Badge>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm text-muted-foreground uppercase tracking-wider mb-3">Target Stages</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.preferredStage.map(stage => (
                      <Badge key={stage} variant="outline" className="border-border/60 bg-background">{stage}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xl">Track Record</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-background/50 border border-border/50 p-4 rounded-xl">
                      <div className="text-2xl font-bold">{profile.portfolioStartups}</div>
                      <div className="text-xs text-muted-foreground mt-1">Portfolio Cos.</div>
                    </div>
                    <div className="bg-background/50 border border-border/50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-emerald-400">{profile.successfulInvestments}</div>
                      <div className="text-xs text-muted-foreground mt-1">Exits / Markups</div>
                    </div>
                    <div className="bg-background/50 border border-border/50 p-4 rounded-xl col-span-2 md:col-span-2 flex flex-col justify-center">
                      <div className="text-sm font-semibold">{profile.responseRate} Response Rate</div>
                      <div className="text-xs text-muted-foreground mt-1">Replies generally within 2 days</div>
                    </div>
                 </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info Column */}
          <div className="col-span-1 space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Criteria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-start gap-3">
                  <Wallet className="w-5 h-5 text-purple-400 shrink-0" />
                  <div>
                    <div className="text-sm font-medium">Ticket Size</div>
                    <div className="text-sm text-muted-foreground">{profile.ticketSizeMin} – {profile.ticketSizeMax}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-purple-400 shrink-0" />
                  <div>
                    <div className="text-sm font-medium">Market Preference</div>
                    <div className="text-sm text-muted-foreground">{profile.preferredMarket}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-purple-400 shrink-0" />
                  <div>
                    <div className="text-sm font-medium">Geography</div>
                    <div className="text-sm text-muted-foreground">{profile.preferredGeography}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-purple-400 shrink-0" />
                  <div>
                    <div className="text-sm font-medium">Entity Type</div>
                    <div className="text-sm text-muted-foreground">{profile.title} ({profile.firm})</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
