"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { CommunityLeftSidebar } from "@/components/community/community-left-sidebar";
import { mockInvestors } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrustBadge } from "@/components/community/trust-badge";
import { ConnectActions } from "@/components/community/connect-actions";

export default function CommunityInvestorsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block lg:col-span-1">
            <CommunityLeftSidebar />
          </div>
          <div className="col-span-1 lg:col-span-3 space-y-6">
            <h1 className="text-2xl font-bold border-b border-border/40 pb-4">Investors</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockInvestors.map(inv => (
                <Card key={inv.id} className="glass-card overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-16 w-16 mb-4">
                        <AvatarImage src={inv.photoUrl} />
                        <AvatarFallback>{inv.name[0]}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold">{inv.name}</h3>
                      <p className="text-xs text-muted-foreground">{inv.title} @ {inv.firm}</p>
                      <div className="mt-2 text-xs text-foreground/80">Tickets: {inv.ticketSizeMin}–{inv.ticketSizeMax}</div>
                      <div className="mt-3 w-full"><ConnectActions type="investor" /></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
