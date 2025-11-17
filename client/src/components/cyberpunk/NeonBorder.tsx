import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface NeonBorderProps {
  children: ReactNode;
  className?: string;
  color?: "primary" | "secondary" | "accent" | "red";
  intensity?: "low" | "medium" | "high";
  animated?: boolean;
  corners?: boolean;
}

export function NeonBorder({
  children,
  className,
  color = "primary",
  intensity = "medium",
  animated = true,
  corners = true,
}: NeonBorderProps) {
  const colorMap = {
    primary: "hsl(var(--primary))",
    secondary: "hsl(var(--secondary))",
    accent: "hsl(var(--accent))",
    red: "#dc2626",
  };

  const intensityMap = {
    low: "2px",
    medium: "4px",
    high: "8px",
  };

  const shadowColor = colorMap[color];
  const blurSize = intensityMap[intensity];

  return (
    <div
      className={cn("relative", className)}
      style={{
        border: `1px solid ${shadowColor}`,
        boxShadow: `0 0 ${blurSize} ${shadowColor}, inset 0 0 ${blurSize} ${shadowColor}`,
      }}
    >
      {corners && (
        <>
          {/* Top-left corner */}
          <div
            className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2"
            style={{
              borderColor: shadowColor,
              boxShadow: `0 0 ${blurSize} ${shadowColor}`,
            }}
          />
          {/* Top-right corner */}
          <div
            className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2"
            style={{
              borderColor: shadowColor,
              boxShadow: `0 0 ${blurSize} ${shadowColor}`,
            }}
          />
          {/* Bottom-left corner */}
          <div
            className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2"
            style={{
              borderColor: shadowColor,
              boxShadow: `0 0 ${blurSize} ${shadowColor}`,
            }}
          />
          {/* Bottom-right corner */}
          <div
            className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2"
            style={{
              borderColor: shadowColor,
              boxShadow: `0 0 ${blurSize} ${shadowColor}`,
            }}
          />
        </>
      )}
      {children}
      {animated && (
        <style>{`
          @keyframes neon-pulse {
            0%, 100% {
              box-shadow: 0 0 ${blurSize} ${shadowColor}, inset 0 0 ${blurSize} ${shadowColor};
            }
            50% {
              box-shadow: 0 0 calc(${blurSize} * 1.5) ${shadowColor}, inset 0 0 calc(${blurSize} * 1.5) ${shadowColor};
            }
          }
          .neon-animated {
            animation: neon-pulse 2s ease-in-out infinite;
          }
        `}</style>
      )}
    </div>
  );
}
