import { cn } from "@/lib/utils";
import { NeonBorder } from "./NeonBorder";
import { GlitchText } from "./GlitchText";
import { Calendar, Eye } from "lucide-react";

interface NewsCardProps {
  title: string;
  excerpt?: string;
  imageUrl?: string;
  category?: string;
  date?: string;
  views?: number;
  featured?: boolean;
  className?: string;
  onClick?: () => void;
}

export function NewsCard({
  title,
  excerpt,
  imageUrl,
  category,
  date,
  views,
  featured = false,
  className,
  onClick,
}: NewsCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer",
        featured && "md:col-span-2",
        className
      )}
      onClick={onClick}
    >
      <NeonBorder
        color={featured ? "red" : "primary"}
        intensity={featured ? "high" : "medium"}
        animated={featured}
        corners={featured}
        className="h-full"
      >
        <div className="relative h-full bg-card">
          {/* Image Section */}
          {imageUrl && (
            <div className={cn(
              "relative overflow-hidden",
              featured ? "h-64" : "h-48"
            )}>
              <img
                src={imageUrl}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 hologram"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              
              {/* Category Badge */}
              {category && (
                <div className="absolute top-4 left-4">
                  <div className="cyber-border-sm rounded px-3 py-1 bg-primary/90 backdrop-blur-sm">
                    <span className="text-xs font-mono-cyber font-bold uppercase tracking-wider text-primary-foreground">
                      {category}
                    </span>
                  </div>
                </div>
              )}

              {/* Scan Line Effect */}
              <div className="scan-line" />
            </div>
          )}

          {/* Content Section */}
          <div className={cn(
            "relative p-6 space-y-3"
          )}>
            {/* Title */}
            <h3 className={cn(
              "font-heading font-bold leading-tight text-foreground line-clamp-2",
              featured ? "text-2xl md:text-3xl" : "text-xl"
            )}>
              <GlitchText intensity="low" trigger="hover">
                {title}
              </GlitchText>
            </h3>

            {/* Excerpt */}
            {excerpt && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {excerpt}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
              {date && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span className="font-mono-cyber">{date}</span>
                </div>
              )}
              {views !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span className="font-mono-cyber">{views}</span>
                </div>
              )}
            </div>

            {/* Read More Indicator */}
            <div className="flex items-center gap-2 pt-2 text-primary opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-sm font-mono-cyber uppercase tracking-wider">
                Leer más
              </span>
              <span className="text-lg">→</span>
            </div>
          </div>

          {/* Corner Accent for Featured */}
          {featured && (
            <>
              <div className="absolute top-0 left-0 w-16 h-16">
                <div className="absolute top-2 left-2 w-12 h-12 border-t-2 border-l-2 border-primary animate-pulse" />
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16">
                <div className="absolute bottom-2 right-2 w-12 h-12 border-b-2 border-r-2 border-secondary animate-pulse" />
              </div>
            </>
          )}
        </div>
      </NeonBorder>
    </div>
  );
}
