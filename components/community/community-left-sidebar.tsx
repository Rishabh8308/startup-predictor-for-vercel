import { Home, Users, Briefcase, MessageSquare, TrendingUp, Bell, Bookmark } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function CommunityLeftSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Home Feed", icon: Home, href: "/community" },
    { name: "Investors", icon: Briefcase, href: "/community/investors" },
    { name: "Entrepreneurs", icon: Users, href: "/community/entrepreneurs" },
    { name: "Discussions", icon: MessageSquare, href: "/community/discussions" },
    { name: "Funding", icon: TrendingUp, href: "/community/funding" },
  ];

  const personalLinks = [
    { name: "Messages", icon: MessageSquare, badge: 3, href: "/messages" },
    { name: "Notifications", icon: Bell, badge: 12, href: "/notifications" },
    { name: "Saved Posts", icon: Bookmark, badge: 0, href: "/saved-posts" },
  ];

  return (
    <div className="space-y-8 sticky top-24">
      <div>
        <h3 className="font-semibold text-sm text-muted-foreground mb-4 px-2 uppercase tracking-wider">Network</h3>
        <nav className="space-y-1">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname === link.href ? "bg-purple-500/10 text-purple-400" : "text-foreground hover:bg-muted/50"
              )}
            >
              <link.icon className="w-5 h-5" />
              {link.name}
            </Link>
          ))}
        </nav>
      </div>

      <div>
        <h3 className="font-semibold text-sm text-muted-foreground mb-4 px-2 uppercase tracking-wider">Personal</h3>
        <nav className="space-y-1">
          {personalLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-muted/50",
                pathname === link.href ? "bg-purple-500/10 text-purple-400" : "text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <link.icon className="w-5 h-5" />
                {link.name}
              </div>
              {link.badge > 0 && (
                <span className="bg-purple-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-[pulse_2s_ease-in-out_infinite]">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div>
        <h3 className="font-semibold text-sm text-muted-foreground mb-4 px-2 uppercase tracking-wider">Industry Groups</h3>
        <div className="space-y-2 px-2">
          {["SaaS", "FinTech", "AI", "HealthTech", "D2C", "EdTech"].map(group => (
            <div key={group} className="flex items-center gap-2 cursor-pointer group">
              <span className="text-muted-foreground group-hover:text-purple-400 transition-colors">#</span>
              <span className="text-sm font-medium hover:underline">{group}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
