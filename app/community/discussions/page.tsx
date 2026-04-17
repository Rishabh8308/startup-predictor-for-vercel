"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { CommunityLeftSidebar } from "@/components/community/community-left-sidebar";
import { CommunityCenterFeed } from "@/components/community/community-center-feed";

// Discusions is just Center feed but normally filtered.
export default function CommunityDiscussionsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block lg:col-span-1">
            <CommunityLeftSidebar />
          </div>
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <h1 className="text-xl font-bold border-b border-border/40 pb-2">Active Discussions</h1>
            <CommunityCenterFeed />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
