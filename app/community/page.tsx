"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { CommunityLeftSidebar } from "@/components/community/community-left-sidebar";
import { CommunityCenterFeed } from "@/components/community/community-center-feed";
import { CommunityRightSidebar } from "@/components/community/community-right-sidebar";

export default function CommunityPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar - Hidden on small screens */}
          <div className="hidden lg:block lg:col-span-1">
            <CommunityLeftSidebar />
          </div>

          {/* Center Feed */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <CommunityCenterFeed />
          </div>

          {/* Right Sidebar - Hidden on medium/small screens */}
          <div className="hidden xl:block xl:col-span-1 border-l border-border/40 pl-8">
            <CommunityRightSidebar />
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
