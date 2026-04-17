"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { CommunityLeftSidebar } from "@/components/community/community-left-sidebar";
import { mockEntrepreneurs } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConnectActions } from "@/components/community/connect-actions";

export default function CommunityEntrepreneursPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block lg:col-span-1">
            <CommunityLeftSidebar />
          </div>
          <div className="col-span-1 lg:col-span-3 space-y-6">
            <h1 className="text-2xl font-bold border-b border-border/40 pb-4">Entrepreneurs</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockEntrepreneurs.map(ent => (
                <Card key={ent.id} className="glass-card overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Avatar className="h-12 w-12 shrink-0">
                        <AvatarImage src={ent.photoUrl} />
                        <AvatarFallback>{ent.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold leading-none">{ent.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">Founder @ {ent.startupName}</p>
                        <div className="text-xs mt-2 text-foreground/80 border bg-muted/50 rounded inline-block px-1.5 py-0.5">
                           Score: {ent.score}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4"><ConnectActions type="founder" /></div>
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
