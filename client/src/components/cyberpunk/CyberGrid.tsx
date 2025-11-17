import { cn } from "@/lib/utils";

interface CyberGridProps {
  className?: string;
  color?: string;
  opacity?: number;
  size?: number;
  animated?: boolean;
}

export function CyberGrid({
  className,
  color = "hsl(var(--primary))",
  opacity = 0.1,
  size = 50,
  animated = true,
}: CyberGridProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0",
        animated && "cyber-grid-animated",
        className
      )}
      style={{
        backgroundImage: `
          linear-gradient(${color} 1px, transparent 1px),
          linear-gradient(90deg, ${color} 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
        opacity,
      }}
    >
      <style>{`
        @keyframes grid-move {
          0% {
            transform: perspective(500px) rotateX(60deg) translateY(0);
          }
          100% {
            transform: perspective(500px) rotateX(60deg) translateY(${size}px);
          }
        }
        .cyber-grid-animated {
          animation: grid-move 20s linear infinite;
          transform-origin: center bottom;
        }
      `}</style>
    </div>
  );
}
