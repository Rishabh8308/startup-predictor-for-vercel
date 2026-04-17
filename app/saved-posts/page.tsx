"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { CommunityLeftSidebar } from "@/components/community/community-left-sidebar";
import { CommunityCenterFeed } from "@/components/community/community-center-feed";
import { Bookmark } from "lucide-react";

export default function SavedPostsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <CommunityLeftSidebar />
          </div>

          {/* Center Feed Area */}
          <div className="col-span-1 lg:col-span-3 space-y-6">
            <div className="flex items-center gap-3 mb-2 glass-card p-6 rounded-2xl border-purple-500/30">
               <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                 <Bookmark className="w-5 h-5 text-purple-400 fill-purple-400" />
               </div>
               <div>
                 <h1 className="text-2xl font-bold flex items-center gap-2 text-white">Your Saved Library</h1>
                 <p className="text-sm text-muted-foreground">Find all the pitches and discussions you bookmarked.</p>
               </div>
            </div>
            
            {/* Re-using the center feed for demonstration. In prod this would have a filter flag. */}
            <CommunityCenterFeed />
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
