import { cn } from "@/lib/utils";

interface ScanLinesProps {
  opacity?: number;
  animated?: boolean;
  className?: string;
}

export function ScanLines({ 
  opacity = 0.05, 
  animated = true,
  className 
}: ScanLinesProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-10",
        animated && "scan-lines-animated",
        className
      )}
      style={{
        backgroundImage: `repeating-linear-gradient(
          0deg,
          rgba(0, 0, 0, ${opacity}) 0px,
          transparent 1px,
          transparent 2px,
          rgba(0, 0, 0, ${opacity}) 3px
        )`,
      }}
    >
      <style>{`
        @keyframes scan {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 100%;
          }
        }
        .scan-lines-animated {
          animation: scan 8s linear infinite;
          background-size: 100% 4px;
        }
      `}</style>
    </div>
  );
}
