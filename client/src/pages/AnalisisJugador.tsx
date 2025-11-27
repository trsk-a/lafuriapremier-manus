import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { CyberHeader } from "@/components/cyber/CyberHeader";
import { CyberFooter } from "@/components/cyber/CyberFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Zap,
  Shield,
  Award,
  BarChart3,
  Calendar,
  Clock,
  MapPin,
  Users,
  Footprints,
  Eye,
  Heart,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

// Mock data - en producción vendría de la API
const mockPlayerData = {
  id: "1",
  name: "Alexis Mac Allister",
  team: "Liverpool",
  position: "Centrocampista",
  nationality: "Argentina",
  flag: "🇦🇷",
  age: 25,
  height: "1.76m",
  foot: "Derecha",
  number: 10,
  rating: 8.2,
  potential: 88,
  marketValue: "70M€",
  contract: "2028",
  image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=400&fit=crop",
  
  // Estadísticas temporada
  stats: {
    matches: 22,
    starts: 20,
    minutes: 1845,
    goals: 4,
    assists: 6,
    yellowCards: 3,
    redCards: 0,
  },
  
  // Métricas avanzadas
  advanced: {
    xG: 3.2,
    xA: 5.8,
    passAccuracy: 88.5,
    keyPasses: 2.1,
    dribbles: 1.8,
    tackles: 2.4,
    interceptions: 1.2,
    aerialWins: 1.5,
    shotsPerGame: 1.3,
    chancesCreated: 2.3,
  },
  
  // Rendimiento por jornada (últimas 10)
  performance: [
    { gameweek: 20, opponent: "Man City", rating: 8.5, goals: 1, assists: 1, minutes: 90 },
    { gameweek: 19, opponent: "Chelsea", rating: 7.8, goals: 0, assists: 1, minutes: 90 },
    { gameweek: 18, opponent: "Arsenal", rating: 8.2, goals: 1, assists: 0, minutes: 85 },
    { gameweek: 17, opponent: "Newcastle", rating: 7.5, goals: 0, assists: 1, minutes: 90 },
    { gameweek: 16, opponent: "Brighton", rating: 8.0, goals: 0, assists: 2, minutes: 90 },
    { gameweek: 15, opponent: "Aston Villa", rating: 7.3, goals: 0, assists: 0, minutes: 78 },
    { gameweek: 14, opponent: "Wolves", rating: 8.3, goals: 1, assists: 1, minutes: 90 },
    { gameweek: 13, opponent: "Fulham", rating: 7.6, goals: 0, assists: 0, minutes: 90 },
    { gameweek: 12, opponent: "Everton", rating: 8.1, goals: 1, assists: 0, minutes: 90 },
    { gameweek: 11, opponent: "Tottenham", rating: 7.9, goals: 0, assists: 0, minutes: 82 },
  ],
  
  // Fortalezas y debilidades
  strengths: [
    "Visión de juego excepcional",
    "Precisión en pases largos",
    "Capacidad para llegar al área",
    "Versatilidad táctica"
  ],
  weaknesses: [
    "Velocidad limitada",
    "Puede mejorar en duelos aéreos",
    "Tendencia a tarjetas amarillas"
  ],
  
  // Análisis táctico
  tactical: {
    role: "Mediocentro organizador con llegada",
    heatmap: "Centro del campo con proyección hacia área rival",
    style: "Juego asociativo, pases entre líneas, llegada al área",
    fit: "Ideal para sistemas que requieren un 8 con visión y llegada"
  }
};

export default function AnalisisJugador() {
  const params = useParams();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const userTier = user?.subscriptionTier || 'FREE';
  const hasAccess = isAdmin || userTier === 'PRO' || userTier === 'PREMIUM';
  
  const [activeTab, setActiveTab] = useState("overview");
  
  // En producción, cargaríamos los datos del jugador según params.id
  const player = mockPlayerData;
  
  const avgRating = player.performance.reduce((acc, p) => acc + p.rating, 0) / player.performance.length;
  const recentForm = player.performance.slice(0, 5);
  const recentAvg = recentForm.reduce((acc, p) => acc + p.rating, 0) / recentForm.length;
  
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-green-400";
    if (rating >= 7) return "text-cyan-400";
    if (rating >= 6) return "text-yellow-400";
    return "text-red-400";
  };

  if (!hasAccess) {
    navigate("/planes");
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CyberHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        {/* Player Header */}
        <Card className="cyber-border mb-8 bg-gradient-to-r from-primary/10 via-transparent to-cyan-500/10">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Player Image */}
              <div className="relative">
                <div className="w-32 h-32 rounded-lg bg-muted overflow-hidden border-2 border-primary/50">
                  <img 
                    src={player.image} 
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
                  #{player.number}
                </Badge>
              </div>

              {/* Player Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{player.flag}</span>
                  <div>
                    <h1 className="text-4xl font-black">{player.name}</h1>
                    <p className="text-xl text-muted-foreground">{player.team} • {player.position}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Edad</p>
                    <p className="text-lg font-bold">{player.age} años</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Altura</p>
                    <p className="text-lg font-bold">{player.height}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pierna</p>
                    <p className="text-lg font-bold">{player.foot}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contrato</p>
                    <p className="text-lg font-bold">{player.contract}</p>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-lg border border-green-500/50">
                    <Award className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-xs text-muted-foreground">Rating</p>
                      <p className="text-2xl font-black text-green-400">{player.rating}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 rounded-lg border border-cyan-500/50">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-xs text-muted-foreground">Potencial</p>
                      <p className="text-2xl font-black text-cyan-400">{player.potential}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-lg border border-primary/50">
                    <Target className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Valor</p>
                      <p className="text-2xl font-black text-primary">{player.marketValue}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="stats">Estadísticas</TabsTrigger>
            <TabsTrigger value="performance">Rendimiento</TabsTrigger>
            <TabsTrigger value="tactical">Análisis Táctico</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stats Card */}
              <Card className="cyber-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Estadísticas Temporada
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <p className="text-3xl font-black text-primary">{player.stats.goals}</p>
                      <p className="text-sm text-muted-foreground">Goles</p>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <p className="text-3xl font-black text-cyan-400">{player.stats.assists}</p>
                      <p className="text-sm text-muted-foreground">Asistencias</p>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <p className="text-3xl font-black text-green-400">{player.stats.matches}</p>
                      <p className="text-sm text-muted-foreground">Partidos</p>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <p className="text-3xl font-black text-yellow-400">{player.stats.minutes}</p>
                      <p className="text-sm text-muted-foreground">Minutos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Form Card */}
              <Card className="cyber-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Forma Reciente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Rating Promedio (Total)</span>
                    <span className={`text-2xl font-black ${getRatingColor(avgRating)}`}>
                      {avgRating.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Rating Promedio (Últimos 5)</span>
                    <span className={`text-2xl font-black ${getRatingColor(recentAvg)}`}>
                      {recentAvg.toFixed(1)}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">Últimos 5 partidos</p>
                    <div className="flex gap-2">
                      {recentForm.map((game, idx) => (
                        <div 
                          key={idx}
                          className={`flex-1 text-center p-2 rounded ${
                            game.rating >= 8 ? 'bg-green-500/20' :
                            game.rating >= 7 ? 'bg-cyan-500/20' :
                            game.rating >= 6 ? 'bg-yellow-500/20' :
                            'bg-red-500/20'
                          }`}
                        >
                          <p className="text-xs text-muted-foreground">{game.opponent}</p>
                          <p className="font-bold">{game.rating}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="cyber-border bg-gradient-to-br from-green-500/10 to-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Fortalezas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {player.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="cyber-border bg-gradient-to-br from-yellow-500/10 to-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    Áreas de Mejora
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {player.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">!</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <Card className="cyber-border">
              <CardHeader>
                <CardTitle>Métricas Avanzadas (Por 90 minutos)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">xG</p>
                    <p className="text-2xl font-black text-primary">{player.advanced.xG}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">xA</p>
                    <p className="text-2xl font-black text-cyan-400">{player.advanced.xA}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Precisión Pases</p>
                    <p className="text-2xl font-black text-green-400">{player.advanced.passAccuracy}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pases Clave</p>
                    <p className="text-2xl font-black text-yellow-400">{player.advanced.keyPasses}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Regates</p>
                    <p className="text-2xl font-black">{player.advanced.dribbles}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Entradas</p>
                    <p className="text-2xl font-black">{player.advanced.tackles}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Intercepciones</p>
                    <p className="text-2xl font-black">{player.advanced.interceptions}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Duelos Aéreos</p>
                    <p className="text-2xl font-black">{player.advanced.aerialWins}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tiros/Partido</p>
                    <p className="text-2xl font-black">{player.advanced.shotsPerGame}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Ocasiones Creadas</p>
                    <p className="text-2xl font-black">{player.advanced.chancesCreated}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card className="cyber-border">
              <CardHeader>
                <CardTitle>Rendimiento por Jornada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {player.performance.map((game, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="w-12 text-center">
                          GW{game.gameweek}
                        </Badge>
                        <span className="font-medium">{game.opponent}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Rating</p>
                          <p className={`text-lg font-black ${getRatingColor(game.rating)}`}>
                            {game.rating}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">G</p>
                          <p className="text-lg font-bold text-primary">{game.goals}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">A</p>
                          <p className="text-lg font-bold text-cyan-400">{game.assists}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Min</p>
                          <p className="text-lg font-bold">{game.minutes}'</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tactical Tab */}
          <TabsContent value="tactical" className="space-y-6">
            <Card className="cyber-border">
              <CardHeader>
                <CardTitle>Análisis Táctico</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Rol en el Equipo
                  </h3>
                  <p className="text-muted-foreground">{player.tactical.role}</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Mapa de Calor
                  </h3>
                  <p className="text-muted-foreground">{player.tactical.heatmap}</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <Footprints className="w-5 h-5 text-primary" />
                    Estilo de Juego
                  </h3>
                  <p className="text-muted-foreground">{player.tactical.style}</p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Encaje Táctico
                  </h3>
                  <p className="text-muted-foreground">{player.tactical.fit}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <CyberFooter />
    </div>
  );
}
