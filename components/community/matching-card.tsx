import { InvestorProfile, EntrepreneurProfile } from "@/types/community";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrustBadge } from "./trust-badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface MatchingCardProps {
  type: "investor" | "startup";
  data: any; // We'll type this dynamically based on 'type'
  matchReason: string;
  matchScore: number;
}

export function MatchingCard({ type, data, matchReason, matchScore }: MatchingCardProps) {
  const isInvestor = type === "investor";
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (matchScore / 100) * circumference;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      <Card className="glass-card overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 border-purple-500/20">
        <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
              <AvatarImage src={data.photoUrl} alt={data.name} />
              <AvatarFallback>{data.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                {data.name}
              </h4>
              <p className="text-xs text-muted-foreground font-medium">
                {isInvestor ? `${data.title} @ ${data.firm}` : `Founder @ ${data.startupName}`}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center group-hover:scale-110 transition-transform">
            <div className="relative w-12 h-12 flex items-center justify-center shadow-lg rounded-full bg-background border border-border/50">
              <svg className="w-12 h-12 transform -rotate-90 absolute">
                <circle
                  cx="24"
                  cy="24"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  className="text-purple-500/20"
                />
                <motion.circle
                  cx="24"
                  cy="24"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  whileInView={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                  strokeLinecap="round"
                  className={matchScore > 80 ? "text-emerald-400" : "text-purple-400"}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className={`text-[11px] font-extrabold leading-none ${matchScore > 80 ? 'text-emerald-400' : 'text-purple-400'}`}>
                  {matchScore}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {isInvestor ? (
            <TrustBadge type="verified-investor" />
          ) : (
            <div className="flex gap-2 flex-wrap">
              <TrustBadge type="verified-founder" />
              {data.score > 80 && <TrustBadge type="ai-recommended" />}
            </div>
          )}
          
          <p className="text-sm text-foreground/80 line-clamp-2">
            <span className="font-semibold text-purple-400">Why matched: </span>
            {matchReason}
          </p>
        </div>

        <Link href={isInvestor ? `/profile/investor/${data.id}` : `/profile/startup/${data.id}`}>
          <Button variant="outline" className="w-full justify-between group hover:bg-purple-500/5 border-purple-500/20">
            View Profile
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
    </motion.div>
  );
}
