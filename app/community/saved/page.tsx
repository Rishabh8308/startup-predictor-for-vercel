"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { CommunityLeftSidebar } from "@/components/community/community-left-sidebar";

export default function CommunitySavedPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block lg:col-span-1">
            <CommunityLeftSidebar />
          </div>
          <div className="col-span-1 lg:col-span-3 space-y-6">
            <h1 className="text-xl font-bold border-b border-border/40 pb-2">Saved Posts</h1>
            <div className="py-20 text-center text-muted-foreground glass-card rounded-xl border border-border/40">
               No saved posts yet.
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
