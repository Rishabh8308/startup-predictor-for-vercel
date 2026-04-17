"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { CommunityLeftSidebar } from "@/components/community/community-left-sidebar";
import { mockPosts } from "@/lib/mock-data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function CommunityFundingPage() {
  const fundingPosts = mockPosts.filter(p => p.postType === "Funding Opportunity" || p.postType === "Pitch Request");
  
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block lg:col-span-1">
            <CommunityLeftSidebar />
          </div>
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <h1 className="text-xl font-bold border-b border-border/40 pb-2 text-emerald-500">Funding Opportunities</h1>
            {fundingPosts.map(post => (
               <Card key={post.id} className="glass-card border-emerald-500/20">
                <CardHeader className="p-5 pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.authorPhoto} />
                        <AvatarFallback>{post.authorName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-sm">{post.authorName}</h4>
                        <p className="text-xs text-muted-foreground">{post.authorHeadline}</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-500">{post.postType}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-5 py-3">
                  <p className="text-sm">{post.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
