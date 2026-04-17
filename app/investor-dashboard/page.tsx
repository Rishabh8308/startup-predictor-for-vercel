"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { mockEntrepreneurs } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrustBadge } from "@/components/community/trust-badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";

const mockTrendData = [
  { month: "Jan", aiScoreAvg: 65, activeDeals: 4 },
  { month: "Feb", aiScoreAvg: 68, activeDeals: 5 },
  { month: "Mar", aiScoreAvg: 74, activeDeals: 7 },
  { month: "Apr", aiScoreAvg: 72, activeDeals: 6 },
  { month: "May", aiScoreAvg: 81, activeDeals: 9 },
  { month: "Jun", aiScoreAvg: 85, activeDeals: 12 },
];

export default function InvestorDashboardPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/40 pb-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">Investor Hub</h1>
            <p className="text-muted-foreground mt-1">Your AI-driven deal flow and risk analytics.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-background/50">Export Report</Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">Deal Settings</Button>
          </div>
        </div>

        {/* Top Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardDescription>Shortlisted Startups</CardDescription>
              <CardTitle className="text-4xl text-purple-400">12</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm flex items-center text-emerald-400 gap-1">
                <TrendingUp className="w-4 h-4" /> +3 this week
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardDescription>Avg. AI Viability Score</CardDescription>
              <CardTitle className="text-4xl text-blue-400">78.5</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm flex items-center text-emerald-400 gap-1">
                <TrendingUp className="w-4 h-4" /> +2.5% from last month
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardDescription>High Risk Deals</CardDescription>
              <CardTitle className="text-4xl text-amber-500">2</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm flex items-center text-amber-500 gap-1">
                <AlertTriangle className="w-4 h-4" /> Requires review
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>AI Score Trends (Your Pipeline)</CardTitle>
              <CardDescription>Average viability score of shortlisted deals over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#ffffff50" fontSize={12} />
                  <YAxis stroke="#ffffff50" fontSize={12} domain={[0, 100]} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Line type="monotone" dataKey="aiScoreAvg" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: "#a855f7" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Active Deals by Month</CardTitle>
              <CardDescription>Volume of startups in active due diligence</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="month" stroke="#ffffff50" fontSize={12} />
                  <YAxis stroke="#ffffff50" fontSize={12} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
                    cursor={{ fill: "hsl(var(--muted)/0.3)" }}
                  />
                  <Bar dataKey="activeDeals" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top AI Scored Startups */}
        <div>
          <h2 className="text-xl font-bold mb-4">Top AI-Scored Startups in Pipeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockEntrepreneurs.map((ent) => (
               <Card key={ent.id} className="glass-card border-l-4 border-l-purple-500">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                       <Avatar className="h-12 w-12">
                         <AvatarImage src={ent.photoUrl} />
                         <AvatarFallback>{ent.startupName[0]}</AvatarFallback>
                       </Avatar>
                       <div>
                         <h3 className="font-bold">{ent.startupName}</h3>
                         <p className="text-sm text-muted-foreground">{ent.industry} • {ent.startupStage}</p>
                         <div className="mt-2 flex gap-2">
                           <TrustBadge type="ai-recommended" />
                         </div>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-blue-400">
                         {ent.score}
                       </div>
                       <div className="text-xs text-muted-foreground uppercase tracking-widest">Score</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border/40 grid grid-cols-3 gap-2 text-center">
                     <div>
                       <div className="text-xs text-muted-foreground">Market Size</div>
                       <div className="text-sm font-semibold">{ent.marketSize}</div>
                     </div>
                     <div className="border-l border-r border-border/40">
                       <div className="text-xs text-muted-foreground">Traction</div>
                       <div className="text-sm font-semibold">{ent.tractionMetrics}</div>
                     </div>
                     <div>
                       <div className="text-xs text-muted-foreground">Risk</div>
                       <div className={`text-sm font-semibold ${ent.riskLevel === 'High' ? 'text-amber-500' : 'text-emerald-500'}`}>
                         {ent.riskLevel}
                       </div>
                     </div>
                  </div>

                  <Link href={`/profile/startup/${ent.id}`} className="block mt-4">
                     <Button variant="ghost" className="w-full justify-between hover:bg-purple-500/10 hover:text-purple-400">
                       Review Analysis
                       <ArrowRight className="w-4 h-4 ml-2" />
                     </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
