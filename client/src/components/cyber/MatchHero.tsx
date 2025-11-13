import { Link } from "wouter";
import { Clock, Calendar, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import type { Match } from "@shared/types";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface MatchHeroProps {
  matches?: Match[] | null;
  isLoading?: boolean;
}

export function MatchHero({ matches, isLoading }: MatchHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const matchList = Array.isArray(matches) ? matches : matches ? [matches] : [];
  const hasMultipleMatches = matchList.length > 1;

  // Auto-advance carousel
  useEffect(() => {
    if (!autoplay || !hasMultipleMatches) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % matchList.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay, hasMultipleMatches, matchList.length]);

  const nextMatch = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev + 1) % matchList.length);
  };

  const prevMatch = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev - 1 + matchList.length) % matchList.length);
  };

  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="max-w-5xl mx-auto">
          <div className="h-48 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl animate-pulse border border-primary/20" />
        </div>
      </div>
    );
  }

  if (matchList.length === 0) {
    return (
      <div className="container py-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-2xl border border-primary/30 shadow-2xl">
            <div className="cyber-scan-lines absolute inset-0 opacity-20" />
            <div className="relative z-10 p-12 text-center">
              <h3 className="font-heading text-2xl text-primary-foreground mb-2">
                NO HAY PARTIDOS PROGRAMADOS
              </h3>
              <p className="text-primary-foreground/80">
                Vuelve pronto para ver los próximos encuentros de la Premier League
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentMatch = matchList[currentIndex];
  const isLive = ['1H', '2H', 'HT', 'ET', 'P', 'LIVE'].includes(currentMatch.fixture.status.short);
  const isFinished = currentMatch.fixture.status.short === 'FT';
  const isUpcoming = currentMatch.fixture.status.short === 'NS';

  const homeScore = currentMatch.goals.home ?? 0;
  const awayScore = currentMatch.goals.away ?? 0;

  const matchDate = new Date(currentMatch.fixture.date);
  const formattedDate = matchDate.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'short',
  });
  const formattedTime = matchDate.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const getTeamLogo = (teamId: number) => {
    return `/clubes/${teamId}.png`;
  };

  return (
    <div className="container py-6">
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-2xl border border-primary/30 shadow-2xl">
          {/* Scan lines effect */}
          <div className="cyber-scan-lines absolute inset-0 opacity-20" />
          
          {/* Live indicator */}
          {isLive && (
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 bg-background/90 backdrop-blur-sm rounded-full border border-secondary">
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              <span className="font-heading text-sm tracking-wide text-secondary">
                EN VIVO
              </span>
            </div>
          )}

          {/* Carousel controls */}
          {hasMultipleMatches && (
            <>
              <button
                onClick={prevMatch}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-full border border-border hover:border-primary transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={nextMatch}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-full border border-border hover:border-primary transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            </>
          )}

          {/* Match content */}
          <div className="relative z-10 p-8">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-8 items-center">
              {/* Home Team */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-background/20 backdrop-blur-sm rounded-full p-3 border border-primary-foreground/20">
                  <img
                    src={getTeamLogo(currentMatch.teams.home.id)}
                    alt={currentMatch.teams.home.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = currentMatch.teams.home.logo;
                    }}
                  />
                </div>
                <h3 className="font-heading text-lg md:text-xl text-primary-foreground text-center">
                  {currentMatch.teams.home.name}
                </h3>
              </div>

              {/* Score / Time */}
              <div className="flex flex-col items-center gap-3 min-w-[120px]">
                {isUpcoming ? (
                  <>
                    <div className="flex items-center gap-2 text-primary-foreground/90">
                      <Calendar className="w-5 h-5" />
                      <span className="font-heading text-sm">{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-6 h-6 text-primary-foreground" />
                      <span className="font-mono-cyber text-3xl font-bold text-primary-foreground">
                        {formattedTime}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <span className="font-mono-cyber text-5xl md:text-6xl font-bold text-primary-foreground">
                        {homeScore}
                      </span>
                      <span className="font-mono-cyber text-3xl font-bold text-primary-foreground/60">
                        -
                      </span>
                      <span className="font-mono-cyber text-5xl md:text-6xl font-bold text-primary-foreground">
                        {awayScore}
                      </span>
                    </div>
                    {isLive && currentMatch.fixture.status.elapsed && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-secondary/20 backdrop-blur-sm border border-secondary rounded-full">
                        <Clock className="w-4 h-4 text-secondary" />
                        <span className="font-mono-cyber text-sm font-bold text-secondary">
                          {currentMatch.fixture.status.elapsed}'
                        </span>
                      </div>
                    )}
                    {isFinished && (
                      <span className="font-heading text-sm text-primary-foreground/70 tracking-wide">
                        FINALIZADO
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Away Team */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-background/20 backdrop-blur-sm rounded-full p-3 border border-primary-foreground/20">
                  <img
                    src={getTeamLogo(currentMatch.teams.away.id)}
                    alt={currentMatch.teams.away.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = currentMatch.teams.away.logo;
                    }}
                  />
                </div>
                <h3 className="font-heading text-lg md:text-xl text-primary-foreground text-center">
                  {currentMatch.teams.away.name}
                </h3>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center mt-6">
              <Link href={`/partido/${currentMatch.fixture.id}`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-background/90 backdrop-blur-sm border-primary-foreground/30 hover:bg-background hover:border-primary-foreground text-foreground font-heading tracking-wide"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  VER DETALLES DEL PARTIDO
                </Button>
              </Link>
            </div>

            {/* Match info */}
            {currentMatch.fixture.venue.name && (
              <div className="text-center mt-4 text-sm text-primary-foreground/70">
                <span>{currentMatch.fixture.venue.name}</span>
                {currentMatch.fixture.venue.city && (
                  <span> • {currentMatch.fixture.venue.city}</span>
                )}
              </div>
            )}
          </div>

          {/* Carousel indicators */}
          {hasMultipleMatches && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {matchList.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setAutoplay(false);
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-primary-foreground w-6'
                      : 'bg-primary-foreground/40 hover:bg-primary-foreground/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
