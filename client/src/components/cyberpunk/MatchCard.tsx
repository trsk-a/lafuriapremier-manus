import { cn } from "@/lib/utils";
import { NeonBorder } from "./NeonBorder";
import { GlitchText } from "./GlitchText";
import { Calendar, MapPin, Trophy } from "lucide-react";

interface MatchCardProps {
  homeTeam: {
    name: string;
    logo?: string;
    score?: number;
  };
  awayTeam: {
    name: string;
    logo?: string;
    score?: number;
  };
  date?: string;
  time?: string;
  venue?: string;
  competition?: string;
  status?: "upcoming" | "live" | "finished";
  featured?: boolean;
  className?: string;
  onClick?: () => void;
}

export function MatchCard({
  homeTeam,
  awayTeam,
  date,
  time,
  venue,
  competition,
  status = "upcoming",
  featured = false,
  className,
  onClick,
}: MatchCardProps) {
  const statusConfig = {
    upcoming: {
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      borderColor: "border-secondary",
      label: "Próximo",
    },
    live: {
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary",
      label: "EN VIVO",
    },
    finished: {
      color: "text-muted-foreground",
      bgColor: "bg-muted/10",
      borderColor: "border-muted",
      label: "Finalizado",
    },
  };

  const config = statusConfig[status];
  const isLive = status === "live";
  const hasScore = homeTeam.score !== undefined && awayTeam.score !== undefined;

  return (
    <div
      className={cn(
        "group relative cursor-pointer transition-all duration-300 hover:scale-[1.02]",
        className
      )}
      onClick={onClick}
    >
      <NeonBorder
        color={isLive ? "red" : "primary"}
        intensity={isLive ? "high" : featured ? "medium" : "low"}
        animated={isLive}
        corners={featured}
        className="h-full"
      >
        <div className="relative h-full bg-card p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            {/* Competition Badge */}
            {competition && (
              <div className="flex items-center gap-2 cyber-border-sm rounded px-3 py-1 bg-accent/10">
                <Trophy className="h-4 w-4 text-accent" />
                <span className="text-xs font-mono-cyber font-bold uppercase tracking-wider text-accent">
                  {competition}
                </span>
              </div>
            )}

            {/* Status Badge */}
            <div className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1 border",
              config.bgColor,
              config.borderColor
            )}>
              {isLive && (
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              )}
              <span className={cn(
                "text-xs font-mono-cyber font-bold uppercase tracking-wider",
                config.color
              )}>
                {config.label}
              </span>
            </div>
          </div>

          {/* Teams and Score */}
          <div className="space-y-4">
            {/* Home Team */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                {homeTeam.logo && (
                  <div className="w-12 h-12 rounded-lg cyber-border-sm p-2 bg-muted/30">
                    <img
                      src={homeTeam.logo}
                      alt={homeTeam.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <span className="font-heading text-lg font-bold text-foreground">
                  {homeTeam.name}
                </span>
              </div>
              
              {hasScore && (
                <div className="cyber-border rounded-lg px-4 py-2 bg-primary/10 min-w-[60px] text-center">
                  <span className="text-3xl font-mono-cyber font-bold text-foreground">
                    {homeTeam.score}
                  </span>
                </div>
              )}
            </div>

            {/* VS Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-primary/30" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-4 text-sm font-mono-cyber font-bold text-primary uppercase">
                  VS
                </span>
              </div>
            </div>

            {/* Away Team */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                {awayTeam.logo && (
                  <div className="w-12 h-12 rounded-lg cyber-border-sm p-2 bg-muted/30">
                    <img
                      src={awayTeam.logo}
                      alt={awayTeam.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <span className="font-heading text-lg font-bold text-foreground">
                  {awayTeam.name}
                </span>
              </div>
              
              {hasScore && (
                <div className="cyber-border rounded-lg px-4 py-2 bg-primary/10 min-w-[60px] text-center">
                  <span className="text-3xl font-mono-cyber font-bold text-foreground">
                    {awayTeam.score}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Match Info */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-primary/30 text-xs text-muted-foreground">
            {date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span className="font-mono-cyber">{date}</span>
                {time && <span className="font-mono-cyber">• {time}</span>}
              </div>
            )}
            {venue && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="font-mono-cyber">{venue}</span>
              </div>
            )}
          </div>

          {/* Hover Effect Indicator */}
          <div className="flex items-center gap-2 pt-2 text-primary opacity-0 transition-opacity group-hover:opacity-100">
            <span className="text-sm font-mono-cyber uppercase tracking-wider">
              Ver partido
            </span>
            <span className="text-lg">→</span>
          </div>

          {/* Background Grid */}
          <div className="pointer-events-none absolute inset-0 opacity-5">
            <div
              className="h-full w-full"
              style={{
                backgroundImage: `
                  linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                  linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
            />
          </div>

          {/* Live Pulse Effect */}
          {isLive && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
          )}
        </div>
      </NeonBorder>
    </div>
  );
}
