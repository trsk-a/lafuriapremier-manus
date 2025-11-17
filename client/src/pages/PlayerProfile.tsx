import { CyberHeader } from "@/components/cyber/CyberHeader";
import { CyberFooter } from "@/components/cyber/CyberFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  TrendingUp,
  Target,
  Activity,
  Users,
  Calendar,
  MapPin,
  Ruler,
  Weight,
  Footprints,
  ArrowLeft,
  BarChart3,
  Trophy,
  Clock
} from "lucide-react";
import { useRoute, Link } from "wouter";

// Mock data - En producción vendría de API-Football
const mockPlayerData = {
  id: '1',
  name: 'Erling Haaland',
  team: 'Manchester City',
  teamLogo: '/clubs/manchester-city.svg',
  position: 'Delantero Centro',
  nationality: 'Noruega',
  age: 23,
  height: '194 cm',
  weight: '88 kg',
  preferredFoot: 'Izquierdo',
  rating: 9.2,
  marketValue: '180M€',
  
  // Estadísticas generales
  stats: {
    matches: 28,
    goals: 27,
    assists: 5,
    minutes: 2340,
    yellowCards: 2,
    redCards: 0,
    shotsOnTarget: 68,
    shotsTotal: 92,
    passAccuracy: 78,
    dribblesSuccess: 15,
    dribblesAttempts: 25,
    duelsWon: 145,
    duelsTotal: 280,
  },
  
  // Rendimiento por jornada (últimas 10)
  performance: [
    { matchday: 21, rating: 9.5, goals: 2, assists: 1 },
    { matchday: 22, rating: 8.8, goals: 1, assists: 0 },
    { matchday: 23, rating: 9.2, goals: 3, assists: 0 },
    { matchday: 24, rating: 8.5, goals: 1, assists: 1 },
    { matchday: 25, rating: 9.0, goals: 2, assists: 0 },
    { matchday: 26, rating: 8.3, goals: 0, assists: 1 },
    { matchday: 27, rating: 9.7, goals: 4, assists: 0 },
    { matchday: 28, rating: 8.9, goals: 1, assists: 2 },
    { matchday: 29, rating: 9.1, goals: 2, assists: 0 },
    { matchday: 30, rating: 9.3, goals: 3, assists: 1 },
  ],
  
  // Últimos partidos
  recentMatches: [
    { date: '2025-01-15', opponent: 'Liverpool', result: 'V 3-1', goals: 2, assists: 0, rating: 9.3, minutes: 90 },
    { date: '2025-01-12', opponent: 'Chelsea', result: 'V 2-0', goals: 1, assists: 1, rating: 8.9, minutes: 85 },
    { date: '2025-01-08', opponent: 'Arsenal', result: 'E 2-2', goals: 1, assists: 0, rating: 8.5, minutes: 90 },
    { date: '2025-01-05', opponent: 'Tottenham', result: 'V 4-1', goals: 3, assists: 0, rating: 9.7, minutes: 90 },
    { date: '2025-01-01', opponent: 'Newcastle', result: 'V 2-1', goals: 1, assists: 1, rating: 8.8, minutes: 78 },
  ],
};

export default function PlayerProfile() {
  const [, params] = useRoute("/jugador/:id");
  const playerId = params?.id;

  const getRatingColor = (rating: number) => {
    if (rating >= 9) return 'text-primary';
    if (rating >= 8.5) return 'text-secondary';
    if (rating >= 8) return 'text-accent';
    return 'text-muted-foreground';
  };

  const maxRating = Math.max(...mockPlayerData.performance.map(p => p.rating));
  const avgRating = (mockPlayerData.performance.reduce((acc, p) => acc + p.rating, 0) / mockPlayerData.performance.length).toFixed(1);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CyberHeader />

      <main className="flex-1">
        {/* Back Button */}
        <div className="container py-4">
          <Link href="/jugadores">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Jugadores
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 border-y border-primary/30 relative overflow-hidden">
          <div className="cyber-scan-lines absolute inset-0 opacity-20" />
          <div className="container py-12 relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              {/* Player Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className="cyber-border-sm font-mono-cyber text-xs border-primary-foreground/30 text-primary-foreground">
                    {mockPlayerData.position}
                  </Badge>
                  <Badge variant="outline" className="cyber-border-sm font-mono-cyber text-xs border-primary-foreground/30 text-primary-foreground">
                    #{playerId}
                  </Badge>
                </div>
                
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-2">
                  {mockPlayerData.name}
                </h1>
                
                <div className="flex items-center gap-4 text-primary-foreground/80 mb-6">
                  <div className="flex items-center gap-2">
                    <img 
                      src={mockPlayerData.teamLogo} 
                      alt={mockPlayerData.team}
                      className="w-6 h-6"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span className="font-medium">{mockPlayerData.team}</span>
                  </div>
                  <span>•</span>
                  <span>{mockPlayerData.nationality}</span>
                  <span>•</span>
                  <span>{mockPlayerData.age} años</span>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-primary-foreground/10 backdrop-blur-sm rounded-lg border border-primary-foreground/20">
                    <div className={`font-mono-cyber text-3xl font-bold ${getRatingColor(mockPlayerData.rating)}`}>
                      {mockPlayerData.rating}
                    </div>
                    <div className="text-xs text-primary-foreground/70">Rating</div>
                  </div>
                  <div className="p-4 bg-primary-foreground/10 backdrop-blur-sm rounded-lg border border-primary-foreground/20">
                    <div className="font-mono-cyber text-3xl font-bold text-primary-foreground">
                      {mockPlayerData.stats.goals}
                    </div>
                    <div className="text-xs text-primary-foreground/70">Goles</div>
                  </div>
                  <div className="p-4 bg-primary-foreground/10 backdrop-blur-sm rounded-lg border border-primary-foreground/20">
                    <div className="font-mono-cyber text-3xl font-bold text-primary-foreground">
                      {mockPlayerData.stats.assists}
                    </div>
                    <div className="text-xs text-primary-foreground/70">Asistencias</div>
                  </div>
                  <div className="p-4 bg-primary-foreground/10 backdrop-blur-sm rounded-lg border border-primary-foreground/20">
                    <div className="font-mono-cyber text-3xl font-bold text-primary-foreground">
                      {mockPlayerData.stats.matches}
                    </div>
                    <div className="text-xs text-primary-foreground/70">Partidos</div>
                  </div>
                </div>
              </div>

              {/* Market Value Card */}
              <div className="p-6 bg-primary-foreground/10 backdrop-blur-sm rounded-lg border border-primary-foreground/20 min-w-[200px]">
                <div className="text-sm text-primary-foreground/70 mb-2">Valor de Mercado</div>
                <div className="font-mono-cyber text-4xl font-bold text-primary-foreground mb-1">
                  {mockPlayerData.marketValue}
                </div>
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>+15M en 6 meses</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="container py-12">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="cyber-border-sm">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="stats">Estadísticas</TabsTrigger>
              <TabsTrigger value="performance">Rendimiento</TabsTrigger>
              <TabsTrigger value="matches">Partidos</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Personal Info */}
                <Card className="cyber-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Información Personal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Edad</span>
                      </div>
                      <span className="font-mono-cyber">{mockPlayerData.age} años</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>Nacionalidad</span>
                      </div>
                      <span className="font-mono-cyber">{mockPlayerData.nationality}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Ruler className="w-4 h-4" />
                        <span>Altura</span>
                      </div>
                      <span className="font-mono-cyber">{mockPlayerData.height}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Weight className="w-4 h-4" />
                        <span>Peso</span>
                      </div>
                      <span className="font-mono-cyber">{mockPlayerData.weight}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Footprints className="w-4 h-4" />
                        <span>Pie Preferido</span>
                      </div>
                      <span className="font-mono-cyber">{mockPlayerData.preferredFoot}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Season Stats */}
                <Card className="cyber-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-primary" />
                      Estadísticas Temporada 2024/25
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/30 rounded-lg text-center">
                        <div className="font-mono-cyber text-2xl font-bold text-primary">
                          {mockPlayerData.stats.goals}
                        </div>
                        <div className="text-xs text-muted-foreground">Goles</div>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg text-center">
                        <div className="font-mono-cyber text-2xl font-bold text-secondary">
                          {mockPlayerData.stats.assists}
                        </div>
                        <div className="text-xs text-muted-foreground">Asistencias</div>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg text-center">
                        <div className="font-mono-cyber text-2xl font-bold text-accent">
                          {mockPlayerData.stats.matches}
                        </div>
                        <div className="text-xs text-muted-foreground">Partidos</div>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg text-center">
                        <div className="font-mono-cyber text-2xl font-bold text-foreground">
                          {mockPlayerData.stats.minutes}
                        </div>
                        <div className="text-xs text-muted-foreground">Minutos</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Stats Tab */}
            <TabsContent value="stats" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Shooting Stats */}
                <Card className="cyber-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Tiros
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Tiros a puerta</span>
                        <span className="font-mono-cyber text-sm">{mockPlayerData.stats.shotsOnTarget}/{mockPlayerData.stats.shotsTotal}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-secondary"
                          style={{ width: `${(mockPlayerData.stats.shotsOnTarget / mockPlayerData.stats.shotsTotal) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {((mockPlayerData.stats.shotsOnTarget / mockPlayerData.stats.shotsTotal) * 100).toFixed(1)}% precisión
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Passing Stats */}
                <Card className="cyber-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-secondary" />
                      Pases
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Precisión de pase</span>
                        <span className="font-mono-cyber text-sm">{mockPlayerData.stats.passAccuracy}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-secondary to-accent"
                          style={{ width: `${mockPlayerData.stats.passAccuracy}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Dribbling Stats */}
                <Card className="cyber-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-accent" />
                      Regates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Regates exitosos</span>
                        <span className="font-mono-cyber text-sm">{mockPlayerData.stats.dribblesSuccess}/{mockPlayerData.stats.dribblesAttempts}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-accent to-primary"
                          style={{ width: `${(mockPlayerData.stats.dribblesSuccess / mockPlayerData.stats.dribblesAttempts) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {((mockPlayerData.stats.dribblesSuccess / mockPlayerData.stats.dribblesAttempts) * 100).toFixed(1)}% éxito
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Duels Stats */}
                <Card className="cyber-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-foreground" />
                      Duelos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Duelos ganados</span>
                        <span className="font-mono-cyber text-sm">{mockPlayerData.stats.duelsWon}/{mockPlayerData.stats.duelsTotal}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-accent"
                          style={{ width: `${(mockPlayerData.stats.duelsWon / mockPlayerData.stats.duelsTotal) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {((mockPlayerData.stats.duelsWon / mockPlayerData.stats.duelsTotal) * 100).toFixed(1)}% éxito
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <Card className="cyber-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Evolución del Rating (Últimas 10 jornadas)
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    Promedio: <span className="font-mono-cyber text-primary">{avgRating}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockPlayerData.performance.map((perf) => (
                      <div key={perf.matchday} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Jornada {perf.matchday}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-muted-foreground">
                              {perf.goals}G {perf.assists}A
                            </span>
                            <span className={`font-mono-cyber font-bold ${getRatingColor(perf.rating)}`}>
                              {perf.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              perf.rating >= 9 
                                ? 'bg-gradient-to-r from-primary to-primary/80' 
                                : perf.rating >= 8.5 
                                ? 'bg-gradient-to-r from-secondary to-secondary/80'
                                : 'bg-gradient-to-r from-accent to-accent/80'
                            }`}
                            style={{ width: `${(perf.rating / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Matches Tab */}
            <TabsContent value="matches" className="space-y-6">
              <Card className="cyber-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Últimos Partidos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockPlayerData.recentMatches.map((match, index) => (
                      <div 
                        key={index}
                        className="p-4 bg-muted/30 rounded-lg cyber-border-sm hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="font-heading text-sm text-muted-foreground mb-1">
                              {new Date(match.date).toLocaleDateString('es-ES', { 
                                day: 'numeric', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </div>
                            <div className="font-heading text-lg">
                              vs {match.opponent}
                            </div>
                          </div>
                          <Badge 
                            variant={match.result.startsWith('V') ? 'default' : match.result.startsWith('E') ? 'secondary' : 'destructive'}
                            className="font-mono-cyber"
                          >
                            {match.result}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2">
                          <div className="text-center p-2 bg-background/50 rounded">
                            <div className="font-mono-cyber text-lg font-bold text-primary">
                              {match.goals}
                            </div>
                            <div className="text-xs text-muted-foreground">Goles</div>
                          </div>
                          <div className="text-center p-2 bg-background/50 rounded">
                            <div className="font-mono-cyber text-lg font-bold text-secondary">
                              {match.assists}
                            </div>
                            <div className="text-xs text-muted-foreground">Asist.</div>
                          </div>
                          <div className="text-center p-2 bg-background/50 rounded">
                            <div className={`font-mono-cyber text-lg font-bold ${getRatingColor(match.rating)}`}>
                              {match.rating}
                            </div>
                            <div className="text-xs text-muted-foreground">Rating</div>
                          </div>
                          <div className="text-center p-2 bg-background/50 rounded">
                            <div className="font-mono-cyber text-lg font-bold text-accent">
                              {match.minutes}'
                            </div>
                            <div className="text-xs text-muted-foreground">Mins</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <CyberFooter />
    </div>
  );
}
