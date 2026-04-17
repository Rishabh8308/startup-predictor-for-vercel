"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles, LayoutDashboard, Target, BarChart3, Brain, Info, User, Menu, X, Scale, Lightbulb, BookOpen, Users, Globe, Briefcase, History } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Analyze Idea", href: "/analyze", icon: Lightbulb },
  { name: "Ideas Library", href: "/ideas", icon: BookOpen },
  { name: "Predict Startup", href: "/predict", icon: Target },
  { name: "History", href: "/history", icon: History },
  { name: "Compare Startups", href: "/compare", icon: Scale },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Model Insights", href: "/insights", icon: Brain },
  { name: "Community", href: "/community", icon: Users },
  { name: "Network", href: "/network", icon: Globe },
  { name: "Investor Hub", href: "/investor-dashboard", icon: Briefcase },
  { name: "About", href: "/about", icon: Info },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 bg-sidebar border-r border-sidebar-border">
        <div className="p-6 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-6 h-6 text-foreground" />
            </div>
            <span className="font-semibold text-lg text-sidebar-foreground">StartupPredictor</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground border border-purple-500/30 shadow-sm"
                    : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive && "text-purple-400")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-sidebar-border">
          <div className="glass-card rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-2">Need help?</p>
            <p className="text-sm text-sidebar-foreground">Check our documentation for guidance on using the predictor.</p>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl glass border border-border/50"
      >
        {mobileMenuOpen ? (
          <X className="w-6 h-6 text-foreground" />
        ) : (
          <Menu className="w-6 h-6 text-foreground" />
        )}
      </button>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative w-64 h-full bg-sidebar border-r border-sidebar-border">
            <div className="p-6 border-b border-sidebar-border mt-12">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-foreground" />
                </div>
                <span className="font-semibold text-lg text-sidebar-foreground">StartupPredictor</span>
              </Link>
            </div>
            
            <nav className="p-4 space-y-1">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground border border-purple-500/30"
                        : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", isActive && "text-purple-400")} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 bg-background/80 backdrop-blur-lg border-b border-border/50">
          <div className="lg:hidden w-10" /> {/* Spacer for mobile menu button */}
          <h1 className="text-lg font-semibold text-foreground lg:ml-0 ml-4">
            {sidebarItems.find(item => item.href === pathname)?.name ||
              (pathname.startsWith("/analyze/results") ? "Analysis Results" :
               pathname.startsWith("/analyze") ? "Analyze Idea" : "Dashboard")}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-border/50 hover:border-purple-500/30 transition-colors cursor-pointer">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
