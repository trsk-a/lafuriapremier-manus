import { Link } from "wouter";
import { Clock, Calendar } from "lucide-react";
import type { Match } from "@shared/types";

interface MatchHeroProps {
  match: Match | null;
  isLoading?: boolean;
}

export function MatchHero({ match, isLoading }: MatchHeroProps) {
  if (isLoading) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-card via-muted to-card border-y border-border">
        <div className="cyber-scan-lines absolute inset-0 opacity-30" />
        <div className="container py-12 relative z-10">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-muted-foreground font-heading text-xl">
              CARGANDO DATOS...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-card via-muted to-card border-y border-border">
        <div className="cyber-scan-lines absolute inset-0 opacity-30" />
        <div className="container py-12 relative z-10">
          <div className="text-center">
            <p className="text-muted-foreground font-heading text-lg">
              No hay partidos programados en este momento
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isLive = ['1H', '2H', 'HT', 'ET', 'P', 'LIVE'].includes(match.fixture.status.short);
  const isFinished = match.fixture.status.short === 'FT';
  const isUpcoming = match.fixture.status.short === 'NS';

  const homeScore = match.goals.home ?? 0;
  const awayScore = match.goals.away ?? 0;

  const matchDate = new Date(match.fixture.date);
  const formattedDate = matchDate.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  const formattedTime = matchDate.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const getTeamLogo = (teamId: number) => {
    return `/clubes/${teamId}.png`;
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-card via-muted to-card border-y border-border">
      {/* Scan lines effect */}
      <div className="cyber-scan-lines absolute inset-0 opacity-30" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
      
      <div className="container py-12 relative z-10">
        {/* Status Badge */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-4">
            {isLive && (
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary rounded-full">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="font-heading text-sm tracking-wide text-primary">
                  EN VIVO
                </span>
              </div>
            )}
            <div className="px-4 py-2 bg-muted/50 border border-border rounded-full">
              <span className="font-heading text-sm tracking-wide text-foreground">
                {match.league.name}
              </span>
            </div>
            {match.league.round && (
              <div className="px-4 py-2 bg-muted/50 border border-border rounded-full">
                <span className="font-heading text-sm tracking-wide text-muted-foreground">
                  {match.league.round}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Match Info */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-[1fr_auto_1fr] gap-8 items-center">
            {/* Home Team */}
            <div className="flex flex-col items-end gap-4">
              <img
                src={getTeamLogo(match.teams.home.id)}
                alt={match.teams.home.name}
                className="w-24 h-24 md:w-32 md:h-32 object-contain"
                onError={(e) => {
                  e.currentTarget.src = match.teams.home.logo;
                }}
              />
              <h2 className="font-heading text-2xl md:text-4xl text-foreground text-right">
                {match.teams.home.name}
              </h2>
            </div>

            {/* Score / Time */}
            <div className="flex flex-col items-center gap-4">
              {isUpcoming ? (
                <div className="text-center">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm">{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <Clock className="w-6 h-6" />
                    <span className="font-mono-cyber text-3xl font-bold">
                      {formattedTime}
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-6">
                    <div className="font-mono-cyber text-6xl md:text-8xl font-bold text-foreground cyber-text-glow">
                      {homeScore}
                    </div>
                    <div className="font-mono-cyber text-4xl md:text-6xl font-bold text-muted-foreground">
                      -
                    </div>
                    <div className="font-mono-cyber text-6xl md:text-8xl font-bold text-foreground cyber-text-glow">
                      {awayScore}
                    </div>
                  </div>
                  {isLive && match.fixture.status.elapsed && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-secondary/20 border border-secondary rounded-full">
                      <Clock className="w-4 h-4 text-secondary" />
                      <span className="font-mono-cyber text-lg font-bold text-secondary">
                        {match.fixture.status.elapsed}'
                      </span>
                    </div>
                  )}
                  {isFinished && (
                    <div className="px-4 py-2 bg-muted border border-border rounded-full">
                      <span className="font-heading text-sm tracking-wide text-muted-foreground">
                        FINALIZADO
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-start gap-4">
              <img
                src={getTeamLogo(match.teams.away.id)}
                alt={match.teams.away.name}
                className="w-24 h-24 md:w-32 md:h-32 object-contain"
                onError={(e) => {
                  e.currentTarget.src = match.teams.away.logo;
                }}
              />
              <h2 className="font-heading text-2xl md:text-4xl text-foreground text-left">
                {match.teams.away.name}
              </h2>
            </div>
          </div>

          {/* CTA */}
          {!isUpcoming && (
            <div className="flex justify-center mt-8">
              <Link href={`/partido/${match.fixture.id}`}>
                <a className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-heading tracking-wide rounded-lg transition-all cyber-glow-red">
                  VER DETALLES DEL PARTIDO
                  <span className="text-xl">→</span>
                </a>
              </Link>
            </div>
          )}
        </div>

        {/* Venue Info */}
        {match.fixture.venue.name && (
          <div className="text-center mt-8 text-sm text-muted-foreground">
            <span>{match.fixture.venue.name}</span>
            {match.fixture.venue.city && (
              <span> • {match.fixture.venue.city}</span>
            )}
          </div>
        )}
      </div>

      {/* Bottom decorative line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
    </div>
  );
}
