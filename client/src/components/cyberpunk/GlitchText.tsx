import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface GlitchTextProps {
  children: string;
  className?: string;
  intensity?: "low" | "medium" | "high";
  trigger?: "hover" | "always" | "once";
}

export function GlitchText({ 
  children, 
  className, 
  intensity = "medium",
  trigger = "hover" 
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(trigger === "always");

  useEffect(() => {
    if (trigger === "once") {
      setIsGlitching(true);
      const timeout = setTimeout(() => setIsGlitching(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [trigger]);

  const intensityClasses = {
    low: "glitch-text-low",
    medium: "glitch-text-medium",
    high: "glitch-text-high",
  };

  return (
    <span
      className={cn(
        "relative inline-block",
        isGlitching && intensityClasses[intensity],
        trigger === "hover" && "hover-glitch",
        className
      )}
      onMouseEnter={() => trigger === "hover" && setIsGlitching(true)}
      onMouseLeave={() => trigger === "hover" && setIsGlitching(false)}
      data-text={children}
    >
      {children}
      <style>{`
        .glitch-text-low,
        .glitch-text-medium,
        .glitch-text-high {
          position: relative;
        }

        .glitch-text-low::before,
        .glitch-text-low::after,
        .glitch-text-medium::before,
        .glitch-text-medium::after,
        .glitch-text-high::before,
        .glitch-text-high::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .glitch-text-low::before {
          left: 2px;
          text-shadow: -1px 0 hsl(var(--primary));
          animation: glitch-anim-1 0.3s infinite linear alternate-reverse;
        }

        .glitch-text-low::after {
          left: -2px;
          text-shadow: -1px 0 hsl(var(--secondary));
          animation: glitch-anim-2 0.3s infinite linear alternate-reverse;
        }

        .glitch-text-medium::before {
          left: 3px;
          text-shadow: -2px 0 hsl(var(--primary));
          animation: glitch-anim-1 0.5s infinite linear alternate-reverse;
        }

        .glitch-text-medium::after {
          left: -3px;
          text-shadow: -2px 0 hsl(var(--secondary));
          animation: glitch-anim-2 0.5s infinite linear alternate-reverse;
        }

        .glitch-text-high::before {
          left: 4px;
          text-shadow: -3px 0 hsl(var(--primary));
          animation: glitch-anim-1 0.7s infinite linear alternate-reverse;
        }

        .glitch-text-high::after {
          left: -4px;
          text-shadow: -3px 0 hsl(var(--secondary));
          animation: glitch-anim-2 0.7s infinite linear alternate-reverse;
        }

        .hover-glitch:hover::before,
        .hover-glitch:hover::after {
          animation-play-state: running;
        }

        @keyframes glitch-anim-1 {
          0% {
            clip-path: inset(40% 0 61% 0);
          }
          20% {
            clip-path: inset(92% 0 1% 0);
          }
          40% {
            clip-path: inset(43% 0 1% 0);
          }
          60% {
            clip-path: inset(25% 0 58% 0);
          }
          80% {
            clip-path: inset(54% 0 7% 0);
          }
          100% {
            clip-path: inset(58% 0 43% 0);
          }
        }

        @keyframes glitch-anim-2 {
          0% {
            clip-path: inset(25% 0 58% 0);
          }
          20% {
            clip-path: inset(54% 0 7% 0);
          }
          40% {
            clip-path: inset(58% 0 43% 0);
          }
          60% {
            clip-path: inset(40% 0 61% 0);
          }
          80% {
            clip-path: inset(92% 0 1% 0);
          }
          100% {
            clip-path: inset(43% 0 1% 0);
          }
        }
      `}</style>
    </span>
  );
}
