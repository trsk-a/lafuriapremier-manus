import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { CyberHeader } from "@/components/cyber/CyberHeader";
import { CyberFooter } from "@/components/cyber/CyberFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  MapPin, 
  Users, 
  TrendingUp, 
  Activity,
  Target,
  ArrowLeft,
  Zap
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function MatchDetail() {
  const [, params] = useRoute("/partido/:id");
  const matchId = params?.id ? parseInt(params.id) : null;

  const { data: match, isLoading, refetch } = trpc.matches.getMatch.useQuery(
    { matchId: matchId!.toString() },
    { enabled: !!matchId, refetchInterval: 30000 } // Refetch every 30s for live matches
  );

  const isLive = match && ['1H', '2H', 'HT', 'ET', 'P', 'LIVE'].includes(match.fixture.status.short);
  const isFinished = match?.fixture.status.short === 'FT';
  const isUpcoming = match?.fixture.status.short === 'NS';

  const getTeamLogo = (teamId: number) => {
    return `/clubes/${teamId}.png`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('es-ES', { 
        weekday: 'long',
        day: 'numeric', 
        month: 'long',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <CyberHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando partido...</p>
          </div>
        </main>
        <CyberFooter />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <CyberHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl text-muted-foreground mb-4">Partido no encontrado</p>
            <Link href="/jornadas">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Jornadas
              </Button>
            </Link>
          </div>
        </main>
        <CyberFooter />
      </div>
    );
  }

  const homeScore = match.goals.home ?? 0;
  const awayScore = match.goals.away ?? 0;
  const { date, time } = formatDate(match.fixture.date);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CyberHeader />

      <main className="flex-1">
        {/* Back Button */}
        <div className="container py-4">
          <Link href="/jornadas">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Jornadas
            </Button>
          </Link>
        </div>

        {/* Match Header */}
        <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 border-y border-primary/30">
          <div className="cyber-scan-lines absolute inset-0 opacity-20" />
          
          {/* Live Indicator */}
          {isLive && (
            <div className="container py-3 border-b border-primary-foreground/20">
              <div className="flex items-center justify-center gap-3">
                <div className="w-3 h-3 bg-secondary rounded-full animate-pulse" />
                <span className="font-heading text-sm tracking-wide text-primary-foreground">
                  PARTIDO EN VIVO
                </span>
                {match.fixture.status.elapsed && (
                  <span className="font-mono-cyber text-sm text-primary-foreground/80">
                    {match.fixture.status.elapsed}'
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="container py-12 relative z-10">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-8 items-center max-w-4xl mx-auto">
              {/* Home Team */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-background/20 backdrop-blur-sm rounded-full p-4 border-2 border-primary-foreground/20">
                  <img
                    src={getTeamLogo(match.teams.home.id)}
                    alt={match.teams.home.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = match.teams.home.logo;
                    }}
                  />
                </div>
                <h2 className="font-heading text-xl md:text-2xl text-primary-foreground text-center">
                  {match.teams.home.name}
                </h2>
              </div>

              {/* Score / Time */}
              <div className="flex flex-col items-center gap-4 min-w-[140px]">
                {isUpcoming ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Clock className="w-8 h-8 text-primary-foreground" />
                      <span className="font-mono-cyber text-4xl font-bold text-primary-foreground">
                        {time}
                      </span>
                    </div>
                    <span className="text-sm text-primary-foreground/70 text-center">
                      {date}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-6">
                      <span className="font-mono-cyber text-6xl md:text-7xl font-bold text-primary-foreground">
                        {homeScore}
                      </span>
                      <span className="font-mono-cyber text-4xl font-bold text-primary-foreground/60">
                        -
                      </span>
                      <span className="font-mono-cyber text-6xl md:text-7xl font-bold text-primary-foreground">
                        {awayScore}
                      </span>
                    </div>
                    {isFinished && (
                      <span className="font-heading text-sm text-primary-foreground/70 tracking-wide">
                        PARTIDO FINALIZADO
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Away Team */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-background/20 backdrop-blur-sm rounded-full p-4 border-2 border-primary-foreground/20">
                  <img
                    src={getTeamLogo(match.teams.away.id)}
                    alt={match.teams.away.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = match.teams.away.logo;
                    }}
                  />
                </div>
                <h2 className="font-heading text-xl md:text-2xl text-primary-foreground text-center">
                  {match.teams.away.name}
                </h2>
              </div>
            </div>

            {/* Match Info */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-primary-foreground/80">
              {match.fixture.venue.name && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">
                    {match.fixture.venue.name}
                    {match.fixture.venue.city && `, ${match.fixture.venue.city}`}
                  </span>
                </div>
              )}
              {(match.fixture as any).referee && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Árbitro: {(match.fixture as any).referee}</span>
                </div>
              )}
              {match.league.round && (
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm">{match.league.round}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Content */}
        <div className="container py-8">
          <Tabs defaultValue="resumen" className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-8">
              <TabsTrigger value="resumen" className="font-heading">
                <Activity className="w-4 h-4 mr-2" />
                RESUMEN
              </TabsTrigger>
              <TabsTrigger value="eventos" className="font-heading">
                <Zap className="w-4 h-4 mr-2" />
                EVENTOS
              </TabsTrigger>
              <TabsTrigger value="alineaciones" className="font-heading">
                <Users className="w-4 h-4 mr-2" />
                ALINEACIONES
              </TabsTrigger>
              <TabsTrigger value="estadisticas" className="font-heading">
                <TrendingUp className="w-4 h-4 mr-2" />
                ESTADÍSTICAS
              </TabsTrigger>
            </TabsList>

            {/* Resumen Tab */}
            <TabsContent value="resumen">
              <div className="max-w-4xl mx-auto">
                <Card className="cyber-border">
                  <CardContent className="p-8">
                    <h3 className="font-heading text-2xl mb-6 text-center">
                      INFORMACIÓN DEL PARTIDO
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                          <span className="text-muted-foreground">Competición</span>
                          <span className="font-heading">{match.league.name}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                          <span className="text-muted-foreground">Temporada</span>
                          <span className="font-heading">{match.league.season}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                          <span className="text-muted-foreground">Jornada</span>
                          <span className="font-heading">{match.league.round}</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                          <span className="text-muted-foreground">Estado</span>
                          <span className="font-heading">{match.fixture.status.long}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                          <span className="text-muted-foreground">Fecha</span>
                          <span className="font-heading">{date}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                          <span className="text-muted-foreground">Hora</span>
                          <span className="font-heading">{time}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Eventos Tab */}
            <TabsContent value="eventos">
              <div className="max-w-4xl mx-auto">
                <Card className="cyber-border">
                  <CardContent className="p-8">
                    {match.events && match.events.length > 0 ? (
                      <div className="space-y-4">
                        <h3 className="font-heading text-2xl mb-6 text-center">
                          EVENTOS DEL PARTIDO
                        </h3>
                        {match.events.map((event: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                          >
                            <div className="w-12 text-center">
                              <span className="font-mono-cyber text-lg font-bold text-primary">
                                {event.time.elapsed}'
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <span className="font-heading">{event.player.name}</span>
                                {event.assist.name && (
                                  <span className="text-sm text-muted-foreground">
                                    (Asist: {event.assist.name})
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {event.team.name} • {event.detail}
                              </div>
                            </div>
                            <div className="text-2xl">
                              {event.type === 'Goal' && '⚽'}
                              {event.type === 'Card' && event.detail.includes('Yellow') && '🟨'}
                              {event.type === 'Card' && event.detail.includes('Red') && '🟥'}
                              {event.type === 'subst' && '🔄'}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Zap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg text-muted-foreground">
                          No hay eventos registrados aún
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Alineaciones Tab */}
            <TabsContent value="alineaciones">
              <div className="max-w-6xl mx-auto">
                {(match as any).lineups && (match as any).lineups.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {(match as any).lineups.map((lineup: any, index: number) => (
                      <Card key={index} className="cyber-border">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border">
                            <div className="w-12 h-12 bg-muted rounded-full p-2">
                              <img
                                src={getTeamLogo(lineup.team.id)}
                                alt={lineup.team.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = lineup.team.logo;
                                }}
                              />
                            </div>
                            <div>
                              <h3 className="font-heading text-xl">{lineup.team.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Formación: {lineup.formation}
                              </p>
                            </div>
                          </div>

                          {/* Starting XI */}
                          <div className="mb-6">
                            <h4 className="font-heading text-sm text-muted-foreground mb-3">
                              TITULARES
                            </h4>
                            <div className="space-y-2">
                              {lineup.startXI.map((player: any) => (
                                <div
                                  key={player.player.id}
                                  className="flex items-center gap-3 p-2 bg-muted/50 rounded"
                                >
                                  <span className="font-mono-cyber text-sm w-8 text-center text-primary">
                                    {player.player.number}
                                  </span>
                                  <span className="text-sm">{player.player.name}</span>
                                  <span className="text-xs text-muted-foreground ml-auto">
                                    {player.player.pos}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Substitutes */}
                          {lineup.substitutes.length > 0 && (
                            <div>
                              <h4 className="font-heading text-sm text-muted-foreground mb-3">
                                SUPLENTES
                              </h4>
                              <div className="space-y-2">
                                {lineup.substitutes.map((player: any) => (
                                  <div
                                    key={player.player.id}
                                    className="flex items-center gap-3 p-2 bg-muted/30 rounded"
                                  >
                                    <span className="font-mono-cyber text-sm w-8 text-center text-muted-foreground">
                                      {player.player.number}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {player.player.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground ml-auto">
                                      {player.player.pos}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="cyber-border">
                    <CardContent className="p-12 text-center">
                      <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg text-muted-foreground">
                        Las alineaciones aún no están disponibles
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Estadísticas Tab */}
            <TabsContent value="estadisticas">
              <div className="max-w-4xl mx-auto">
                {(match as any).statistics && (match as any).statistics.length > 0 ? (
                  <Card className="cyber-border">
                    <CardContent className="p-8">
                      <h3 className="font-heading text-2xl mb-6 text-center">
                        ESTADÍSTICAS COMPARATIVAS
                      </h3>
                      <div className="space-y-6">
                        {(match as any).statistics[0]?.statistics.map((stat: any, index: number) => {
                          const homeStat = (match as any).statistics[0]?.statistics[index];
                          const awayStat = (match as any).statistics[1]?.statistics[index];
                          
                          const homeValue = typeof homeStat?.value === 'number' 
                            ? homeStat.value 
                            : parseInt(String(homeStat?.value || '0').replace('%', ''));
                          const awayValue = typeof awayStat?.value === 'number'
                            ? awayStat.value
                            : parseInt(String(awayStat?.value || '0').replace('%', ''));
                          
                          const total = homeValue + awayValue || 1;
                          const homePercent = (homeValue / total) * 100;
                          const awayPercent = (awayValue / total) * 100;

                          return (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="font-mono-cyber text-sm text-primary">
                                  {homeStat?.value ?? 0}
                                </span>
                                <span className="font-heading text-sm text-muted-foreground">
                                  {stat.type}
                                </span>
                                <span className="font-mono-cyber text-sm text-secondary">
                                  {awayStat?.value ?? 0}
                                </span>
                              </div>
                              <div className="flex gap-1 h-2">
                                <div
                                  className="bg-primary rounded-l transition-all"
                                  style={{ width: `${homePercent}%` }}
                                />
                                <div
                                  className="bg-secondary rounded-r transition-all"
                                  style={{ width: `${awayPercent}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="cyber-border">
                    <CardContent className="p-12 text-center">
                      <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg text-muted-foreground">
                        Las estadísticas aún no están disponibles
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <CyberFooter />
    </div>
  );
}
