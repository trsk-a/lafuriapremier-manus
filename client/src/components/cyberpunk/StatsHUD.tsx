import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatItem {
  label: string;
  value: string | number;
  icon?: ReactNode;
  color?: "primary" | "secondary" | "accent" | "success" | "warning";
  trend?: "up" | "down" | "neutral";
}

interface StatsHUDProps {
  title?: string;
  stats: StatItem[];
  className?: string;
  layout?: "grid" | "horizontal" | "vertical";
}

export function StatsHUD({
  title,
  stats,
  className,
  layout = "grid",
}: StatsHUDProps) {
  const colorMap = {
    primary: "text-primary border-primary",
    secondary: "text-secondary border-secondary",
    accent: "text-accent border-accent",
    success: "text-green-500 border-green-500",
    warning: "text-yellow-500 border-yellow-500",
  };

  const trendIcons = {
    up: "▲",
    down: "▼",
    neutral: "●",
  };

  const layoutClasses = {
    grid: "grid grid-cols-2 md:grid-cols-4 gap-4",
    horizontal: "flex flex-wrap gap-4",
    vertical: "flex flex-col gap-4",
  };

  return (
    <div className={cn("relative", className)}>
      {title && (
        <div className="mb-4 flex items-center gap-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-primary">
            {title}
          </h3>
          <div className="h-px flex-1 bg-gradient-to-r from-primary via-transparent to-transparent" />
        </div>
      )}

      <div className={layoutClasses[layout]}>
        {stats.map((stat, index) => (
          <div
            key={index}
            className={cn(
              "relative overflow-hidden rounded-lg border bg-card/50 p-4 backdrop-blur-sm transition-all hover:bg-card/70",
              colorMap[stat.color || "primary"]
            )}
          >
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{
              borderColor: "currentColor",
            }} />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{
              borderColor: "currentColor",
            }} />

            {/* Content */}
            <div className="relative z-10 space-y-2">
              {stat.icon && (
                <div className="flex items-center justify-between">
                  <div className="text-current opacity-70">{stat.icon}</div>
                  {stat.trend && (
                    <span className="text-xs font-mono-cyber">
                      {trendIcons[stat.trend]}
                    </span>
                  )}
                </div>
              )}
              
              <div className="font-mono-cyber text-3xl font-bold leading-none">
                {stat.value}
              </div>
              
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </div>
            </div>

            {/* Scan Line Effect */}
            <div
              className="absolute left-0 right-0 h-px bg-current opacity-30"
              style={{
                top: `${(index * 17 + 30) % 100}%`,
              }}
            />
          </div>
        ))}
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
    </div>
  );
}
