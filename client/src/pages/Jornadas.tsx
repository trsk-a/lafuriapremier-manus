import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { CyberHeader } from "@/components/cyber/CyberHeader";
import { CyberFooter } from "@/components/cyber/CyberFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar, Clock, Trophy } from "lucide-react";
import { Link } from "wouter";
import type { Match } from "@shared/types";

export default function Jornadas() {
  const { data: rounds, isLoading: roundsLoading } = trpc.matches.getRounds.useQuery();
  const [selectedRound, setSelectedRound] = useState<string | null>(null);

  // Set initial round when data loads
  useEffect(() => {
    if (rounds && rounds.length > 0 && !selectedRound) {
      // Try to find current round or default to first
      const currentRound = rounds.find(r => r.includes("Current")) || rounds[0];
      setSelectedRound(currentRound);
    }
  }, [rounds, selectedRound]);

  const { data: matches, isLoading: matchesLoading } = trpc.matches.getMatchesByRound.useQuery(
    { round: selectedRound || "" },
    { enabled: !!selectedRound }
  );

  const currentRoundIndex = rounds?.indexOf(selectedRound || "") ?? -1;
  const canGoPrev = currentRoundIndex > 0;
  const canGoNext = currentRoundIndex < (rounds?.length || 0) - 1;

  const goToPrevRound = () => {
    if (canGoPrev && rounds) {
      setSelectedRound(rounds[currentRoundIndex - 1]);
    }
  };

  const goToNextRound = () => {
    if (canGoNext && rounds) {
      setSelectedRound(rounds[currentRoundIndex + 1]);
    }
  };

  const getMatchStatus = (match: Match) => {
    const status = match.fixture.status.short;
    if (['1H', '2H', 'HT', 'ET', 'P', 'LIVE'].includes(status)) {
      return { label: 'EN VIVO', color: 'text-secondary', bg: 'bg-secondary/20', border: 'border-secondary' };
    }
    if (status === 'FT') {
      return { label: 'FINALIZADO', color: 'text-muted-foreground', bg: 'bg-muted/20', border: 'border-muted' };
    }
    return { label: 'PRÓXIMO', color: 'text-accent', bg: 'bg-accent/20', border: 'border-accent' };
  };

  const formatMatchDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
      time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const getTeamLogo = (teamId: number) => {
    return `/clubes/${teamId}.png`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CyberHeader />

      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b border-border">
          <div className="container py-12">
            <div className="flex items-center gap-4 mb-4">
              <Trophy className="w-10 h-10 text-primary" />
              <h1 className="font-heading text-4xl md:text-5xl text-foreground">
                JORNADAS
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explora todas las jornadas de la Premier League. Resultados, partidos en vivo y próximos encuentros.
            </p>
          </div>
        </div>

        {/* Round Selector */}
        <div className="bg-card border-b border-border sticky top-16 z-40">
          <div className="container py-4">
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevRound}
                disabled={!canGoPrev || roundsLoading}
                className="cyber-border"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>

              <div className="flex-1 text-center">
                {roundsLoading ? (
                  <div className="h-8 bg-muted animate-pulse rounded w-48 mx-auto" />
                ) : (
                  <h2 className="font-heading text-xl md:text-2xl text-foreground">
                    {selectedRound || "Selecciona una jornada"}
                  </h2>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextRound}
                disabled={!canGoNext || roundsLoading}
                className="cyber-border"
              >
                Siguiente
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Round Pills */}
            {rounds && rounds.length > 0 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {rounds.map((round) => (
                  <button
                    key={round}
                    onClick={() => setSelectedRound(round)}
                    className={`px-4 py-2 rounded-full font-heading text-sm tracking-wide whitespace-nowrap transition-all ${
                      selectedRound === round
                        ? 'bg-primary text-primary-foreground cyber-glow-red'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {round.replace('Regular Season - ', 'J')}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Matches Grid */}
        <div className="container py-12">
          {matchesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="h-4 bg-muted" />
                  <CardContent className="p-6">
                    <div className="h-32 bg-muted rounded mb-4" />
                    <div className="h-4 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : matches && matches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match) => {
                const status = getMatchStatus(match);
                const { date, time } = formatMatchDate(match.fixture.date);
                const isUpcoming = match.fixture.status.short === 'NS';
                const homeScore = match.goals.home ?? 0;
                const awayScore = match.goals.away ?? 0;

                return (
                  <Link key={match.fixture.id} href={`/partido/${match.fixture.id}`}>
                    <a>
                      <Card className="overflow-hidden border-border hover:border-primary transition-all duration-300 cyber-border h-full group">
                        {/* Status Bar */}
                        <div className={`h-1 bg-gradient-to-r ${
                          status.label === 'EN VIVO' 
                            ? 'from-secondary via-secondary to-secondary/50' 
                            : status.label === 'FINALIZADO'
                            ? 'from-muted via-muted to-muted/50'
                            : 'from-accent via-accent to-accent/50'
                        }`} />

                        <CardContent className="p-6">
                          {/* Status Badge */}
                          <div className="flex items-center justify-between mb-4">
                            <div className={`flex items-center gap-2 px-3 py-1 ${status.bg} border ${status.border} rounded-full`}>
                              {status.label === 'EN VIVO' && (
                                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                              )}
                              <span className={`text-xs font-heading tracking-wide ${status.color}`}>
                                {status.label}
                              </span>
                            </div>
                            {match.fixture.status.short === 'NS' && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                <span className="text-xs">{date}</span>
                              </div>
                            )}
                          </div>

                          {/* Teams */}
                          <div className="space-y-4">
                            {/* Home Team */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <div className="w-10 h-10 bg-muted rounded-full p-2 flex-shrink-0">
                                  <img
                                    src={getTeamLogo(match.teams.home.id)}
                                    alt={match.teams.home.name}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      e.currentTarget.src = match.teams.home.logo;
                                    }}
                                  />
                                </div>
                                <span className="font-heading text-sm text-foreground group-hover:text-primary transition-colors">
                                  {match.teams.home.name}
                                </span>
                              </div>
                              {!isUpcoming && (
                                <span className="font-mono-cyber text-2xl font-bold text-foreground ml-3">
                                  {homeScore}
                                </span>
                              )}
                            </div>

                            {/* Away Team */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <div className="w-10 h-10 bg-muted rounded-full p-2 flex-shrink-0">
                                  <img
                                    src={getTeamLogo(match.teams.away.id)}
                                    alt={match.teams.away.name}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      e.currentTarget.src = match.teams.away.logo;
                                    }}
                                  />
                                </div>
                                <span className="font-heading text-sm text-foreground group-hover:text-primary transition-colors">
                                  {match.teams.away.name}
                                </span>
                              </div>
                              {!isUpcoming && (
                                <span className="font-mono-cyber text-2xl font-bold text-foreground ml-3">
                                  {awayScore}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Match Info */}
                          <div className="mt-4 pt-4 border-t border-border">
                            {isUpcoming ? (
                              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm font-mono-cyber">{time}</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                {match.fixture.venue.name && (
                                  <span className="truncate">{match.fixture.venue.name}</span>
                                )}
                                {status.label === 'EN VIVO' && match.fixture.status.elapsed && (
                                  <span className="font-mono-cyber text-secondary ml-auto">
                                    {match.fixture.status.elapsed}'
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                No hay partidos disponibles para esta jornada
              </p>
            </div>
          )}
        </div>
      </main>

      <CyberFooter />
    </div>
  );
}
