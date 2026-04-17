"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { mockEntrepreneurs, mockInvestors } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConnectActions } from "@/components/community/connect-actions";
import { TrustBadge } from "@/components/community/trust-badge";
import { Users, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NetworkPage() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end border-b border-border/40 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Your Network</h1>
            <p className="text-muted-foreground mt-1">Manage your connections and discover new opportunities.</p>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-purple-500" />
            Investors Who Match Your Profile
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockInvestors.map(inv => (
              <Card key={inv.id} className="glass-card overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 mb-4 border-4 border-background shadow-md">
                      <AvatarImage src={inv.photoUrl} />
                      <AvatarFallback>{inv.name[0]}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg">{inv.name}</h3>
                    <p className="text-sm text-muted-foreground">{inv.title} @ {inv.firm}</p>
                    
                    <div className="mt-3">
                      <TrustBadge type="verified-investor" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full mt-6 text-sm">
                      <div className="bg-muted/50 p-2 rounded-lg">
                        <div className="text-xs text-muted-foreground">Checks</div>
                        <div className="font-semibold">{inv.ticketSizeMax}</div>
                      </div>
                      <div className="bg-muted/50 p-2 rounded-lg">
                        <div className="text-xs text-muted-foreground">Portfolio</div>
                        <div className="font-semibold">{inv.portfolioStartups} Startups</div>
                      </div>
                    </div>
                    
                    <div className="w-full mt-2">
                       <ConnectActions type="investor" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="pt-8">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-500" />
            Startups Similar to Yours
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockEntrepreneurs.map(ent => (
               <Card key={ent.id} className="glass-card hover:bg-muted/10 transition-colors">
                 <CardContent className="p-6 flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={ent.photoUrl} />
                      <AvatarFallback>{ent.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{ent.startupName} <span className="text-sm font-normal text-muted-foreground ml-2">by {ent.name}</span></h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ent.pitchSummary}</p>
                      <div className="flex gap-2 mt-3">
                        <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded font-medium">{ent.industry}</span>
                        <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded font-medium">{ent.startupStage}</span>
                      </div>
                    </div>
               </CardContent>
             </Card>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
