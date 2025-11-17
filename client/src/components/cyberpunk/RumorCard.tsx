import { cn } from "@/lib/utils";
import { NeonBorder } from "./NeonBorder";
import { GlitchText } from "./GlitchText";
import { TrendingUp, AlertCircle, CheckCircle, Clock } from "lucide-react";

interface RumorCardProps {
  title: string;
  playerName?: string;
  fromTeam?: string;
  toTeam?: string;
  reliability?: "low" | "medium" | "high" | "confirmed";
  date?: string;
  source?: string;
  className?: string;
  onClick?: () => void;
}

export function RumorCard({
  title,
  playerName,
  fromTeam,
  toTeam,
  reliability = "medium",
  date,
  source,
  className,
  onClick,
}: RumorCardProps) {
  const reliabilityConfig = {
    low: {
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500",
      label: "Baja confianza",
      icon: AlertCircle,
    },
    medium: {
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent",
      label: "Confianza media",
      icon: TrendingUp,
    },
    high: {
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      borderColor: "border-secondary",
      label: "Alta confianza",
      icon: TrendingUp,
    },
    confirmed: {
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500",
      label: "Confirmado",
      icon: CheckCircle,
    },
  };

  const config = reliabilityConfig[reliability];
  const ReliabilityIcon = config.icon;

  return (
    <div
      className={cn(
        "group relative cursor-pointer transition-all duration-300 hover:scale-[1.02]",
        className
      )}
      onClick={onClick}
    >
      <NeonBorder
        color={reliability === "confirmed" ? "accent" : "secondary"}
        intensity="medium"
        animated={reliability === "confirmed"}
        className="h-full"
      >
        <div className="relative h-full bg-card p-6 space-y-4">
          {/* Reliability Badge */}
          <div className="flex items-center justify-between">
            <div className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1 border",
              config.bgColor,
              config.borderColor
            )}>
              <ReliabilityIcon className={cn("h-4 w-4", config.color)} />
              <span className={cn(
                "text-xs font-mono-cyber font-bold uppercase tracking-wider",
                config.color
              )}>
                {config.label}
              </span>
            </div>

            {date && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span className="font-mono-cyber">{date}</span>
              </div>
            )}
          </div>

          {/* Transfer Arrow Visualization */}
          {fromTeam && toTeam && (
            <div className="flex items-center gap-3 py-4">
              <div className="flex-1 text-center">
                <div className="cyber-border-sm rounded-lg p-3 bg-muted/30">
                  <p className="text-sm font-bold text-foreground">{fromTeam}</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="flex items-center gap-1 text-primary">
                  <span className="text-2xl">→</span>
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
              </div>

              <div className="flex-1 text-center">
                <div className="cyber-border-sm rounded-lg p-3 bg-primary/10">
                  <p className="text-sm font-bold text-foreground">{toTeam}</p>
                </div>
              </div>
            </div>
          )}

          {/* Player Name */}
          {playerName && (
            <div className="text-center py-2">
              <GlitchText
                intensity="low"
                trigger="hover"
                className="text-2xl font-heading font-bold text-foreground"
              >
                {playerName}
              </GlitchText>
            </div>
          )}

          {/* Title/Description */}
          <div className="space-y-2">
            <h3 className="font-heading text-lg font-bold leading-tight text-foreground line-clamp-2">
              {title}
            </h3>

            {/* Source */}
            {source && (
              <p className="text-xs text-muted-foreground font-mono-cyber">
                Fuente: {source}
              </p>
            )}
          </div>

          {/* Hover Effect Indicator */}
          <div className="flex items-center gap-2 pt-2 text-secondary opacity-0 transition-opacity group-hover:opacity-100">
            <span className="text-sm font-mono-cyber uppercase tracking-wider">
              Ver detalles
            </span>
            <span className="text-lg">→</span>
          </div>

          {/* Background Pattern */}
          <div className="pointer-events-none absolute inset-0 opacity-5">
            <div
              className="h-full w-full"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  hsl(var(--secondary)) 0,
                  hsl(var(--secondary)) 1px,
                  transparent 1px,
                  transparent 10px
                )`,
              }}
            />
          </div>

          {/* Pulsing Corner for Confirmed */}
          {reliability === "confirmed" && (
            <div className="absolute top-2 right-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </div>
          )}
        </div>
      </NeonBorder>
    </div>
  );
}
