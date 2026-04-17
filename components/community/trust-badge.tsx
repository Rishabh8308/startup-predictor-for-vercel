import { ShieldCheck, Star, Award, Zap, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type TrustBadgeType = "verified-investor" | "verified-founder" | "top-rated" | "high-traction" | "ai-recommended";

interface TrustBadgeProps {
  type: TrustBadgeType;
  className?: string;
}

export function TrustBadge({ type, className }: TrustBadgeProps) {
  const badgeConfig = {
    "verified-investor": {
      label: "Verified Investor",
      icon: ShieldCheck,
      colorClass: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
    "verified-founder": {
      label: "Verified Founder",
      icon: CheckCircle2,
      colorClass: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
    "top-rated": {
      label: "Top Rated Startup",
      icon: Star,
      colorClass: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    },
    "high-traction": {
      label: "High Traction",
      icon: Zap,
      colorClass: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    },
    "ai-recommended": {
      label: "AI Recommended",
      icon: Award,
      colorClass: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    },
  };

  const config = badgeConfig[type];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn("flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-md rounded-full shadow-sm", config.colorClass, className)}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </Badge>
  );
}
