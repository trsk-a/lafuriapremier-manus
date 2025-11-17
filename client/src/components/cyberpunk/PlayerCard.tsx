import { cn } from "@/lib/utils";
import { NeonBorder } from "./NeonBorder";
import { GlitchText } from "./GlitchText";

interface PlayerCardProps {
  name: string;
  position: string;
  team: string;
  imageUrl?: string;
  stats?: {
    goals?: number;
    assists?: number;
    rating?: number;
  };
  className?: string;
  featured?: boolean;
}

export function PlayerCard({
  name,
  position,
  team,
  imageUrl,
  stats,
  className,
  featured = false,
}: PlayerCardProps) {
  return (
    <NeonBorder
      color={featured ? "red" : "primary"}
      intensity={featured ? "high" : "medium"}
      animated={featured}
      className={cn(
        "relative overflow-hidden bg-card p-6 transition-all duration-300 hover:scale-105",
        "cyber-clip-corner",
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            hsl(var(--primary)) 0,
            hsl(var(--primary)) 1px,
            transparent 1px,
            transparent 10px
          )`
        }} />
      </div>

      {/* Player Image */}
      {imageUrl && (
        <div className="relative mb-4 h-48 overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover hologram"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        </div>
      )}

      {/* Player Info */}
      <div className="relative z-10 space-y-3">
        <div>
          <GlitchText
            intensity="low"
            trigger="hover"
            className="text-2xl font-heading font-bold text-foreground"
          >
            {name}
          </GlitchText>
          <p className="text-sm text-primary font-mono-cyber uppercase tracking-wider">
            {position}
          </p>
          <p className="text-xs text-muted-foreground">{team}</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-primary/30">
            {stats.goals !== undefined && (
              <div className="text-center">
                <div className="text-xl font-mono-cyber font-bold text-primary">
                  {stats.goals}
                </div>
                <div className="text-xs text-muted-foreground uppercase">Goles</div>
              </div>
            )}
            {stats.assists !== undefined && (
              <div className="text-center">
                <div className="text-xl font-mono-cyber font-bold text-secondary">
                  {stats.assists}
                </div>
                <div className="text-xs text-muted-foreground uppercase">Asist.</div>
              </div>
            )}
            {stats.rating !== undefined && (
              <div className="text-center">
                <div className="text-xl font-mono-cyber font-bold text-accent">
                  {stats.rating.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground uppercase">Rating</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Corner Accent */}
      {featured && (
        <div className="absolute top-0 right-0 w-16 h-16">
          <div className="absolute top-2 right-2 w-12 h-12 border-t-2 border-r-2 border-primary animate-pulse" />
        </div>
      )}
    </NeonBorder>
  );
}
