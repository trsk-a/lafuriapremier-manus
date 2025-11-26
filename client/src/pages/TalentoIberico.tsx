import { CyberHeader } from "@/components/cyber/CyberHeader";
import { CyberFooter } from "@/components/cyber/CyberFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Lock,
  TrendingUp,
  Target,
  Zap,
  ArrowRight,
  Crown,
  Star
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

interface Player {
  id: string;
  name: string;
  team: string;
  position: string;
  nationality: 'España' | 'Portugal';
  age: number;
  rating: number;
  goals: number;
  assists: number;
  matches: number;
  potential: number;
  marketValue: string;
}

export default function TalentoIberico() {
  const { user, isAuthenticated } = useAuth();
  const userTier = user?.subscriptionTier || 'FREE';
  const isAdmin = user?.role === 'admin';
  const hasAccess = isAdmin || userTier === 'PRO' || userTier === 'PREMIUM';

  // Mock data para demostración
  const mockPlayers: Player[] = [
    {
      id: '1',
      name: 'Rodri',
      team: 'Manchester City',
      position: 'MCD',
      nationality: 'España',
      age: 27,
      rating: 8.8,
      goals: 5,
      assists: 7,
      matches: 25,
      potential: 89,
      marketValue: '110M€',
    },
    {
      id: '2',
      name: 'Bruno Fernandes',
      team: 'Manchester United',
      position: 'MC',
      nationality: 'Portugal',
      age: 29,
      rating: 8.3,
      goals: 10,
      assists: 12,
      matches: 26,
      potential: 88,
      marketValue: '85M€',
    },
    {
      id: '3',
      name: 'Pedro Neto',
      team: 'Wolverhampton',
      position: 'ED',
      nationality: 'Portugal',
      age: 23,
      rating: 7.6,
      goals: 6,
      assists: 9,
      matches: 22,
      potential: 87,
      marketValue: '55M€',
    },
    {
      id: '4',
      name: 'Dani Olmo',
      team: 'RB Leipzig',
      position: 'MCO',
      nationality: 'España',
      age: 25,
      rating: 8.0,
      goals: 8,
      assists: 6,
      matches: 20,
      potential: 88,
      marketValue: '70M€',
    },
  ];

  const getRatingColor = (rating: number) => {
    if (rating >= 8.5) return 'text-primary';
    if (rating >= 8) return 'text-secondary';
    if (rating >= 7.5) return 'text-accent';
    return 'text-muted-foreground';
  };

  const getPotentialColor = (potential: number) => {
    if (potential >= 89) return 'text-primary';
    if (potential >= 87) return 'text-secondary';
    return 'text-accent';
  };

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <CyberHeader />

        <main className="flex-1">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-secondary via-secondary/90 to-secondary/80 border-b border-secondary/30 relative overflow-hidden">
            <div className="cyber-scan-lines absolute inset-0 opacity-20" />
            <div className="container py-16 relative z-10">
              <div className="max-w-4xl">
                <Badge className="mb-4 bg-secondary-foreground/20 text-secondary-foreground border-secondary-foreground/30">
                  <Crown className="w-3 h-3 mr-1" />
                  CONTENIDO PREMIUM
                </Badge>
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-secondary-foreground mb-4">
                  TALENTO <span className="text-primary">IBÉRICO</span>
                </h1>
                <p className="text-lg text-secondary-foreground/80 max-w-2xl">
                  Análisis exclusivo de los mejores jugadores españoles y portugueses de la Premier League
                </p>
              </div>
            </div>
          </div>

          {/* Locked Content */}
          <div className="container py-16">
            <Card className="cyber-border max-w-2xl mx-auto">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Lock className="w-10 h-10 text-secondary" />
                </div>
                
                <h2 className="font-heading text-3xl mb-4">
                  Contenido Exclusivo <span className="text-secondary">PRO</span>
                </h2>
                
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Talento Ibérico es contenido premium exclusivo para suscriptores PRO y PREMIUM. 
                  Accede a análisis profundo, comparativas, scouting detallado y valoraciones de mercado.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <Target className="w-6 h-6 text-secondary mx-auto mb-2" />
                    <div className="text-sm font-medium">Scouting Pro</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-secondary mx-auto mb-2" />
                    <div className="text-sm font-medium">Comparativas</div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <Zap className="w-6 h-6 text-secondary mx-auto mb-2" />
                    <div className="text-sm font-medium">Valoración</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {!isAuthenticated ? (
                    <Button
                      size="lg"
                      onClick={() => window.location.href = getLoginUrl()}
                      className="cyber-glow-red font-heading"
                    >
                      INICIAR SESIÓN
                    </Button>
                  ) : (
                    <Link href="/planes">
                      <Button
                        size="lg"
                        className="cyber-glow-red font-heading"
                      >
                        <Crown className="w-5 h-5 mr-2" />
                        MEJORAR A PRO
                      </Button>
                    </Link>
                  )}
                </div>

                <p className="text-xs text-muted-foreground mt-6">
                  Desde solo 4.99€/mes • Cancela cuando quieras
                </p>
              </CardContent>
            </Card>
          </div>
        </main>

        <CyberFooter />
      </div>
    );
  }

  // Content for PRO/PREMIUM users
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CyberHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-secondary via-secondary/90 to-secondary/80 border-b border-secondary/30 relative overflow-hidden">
          <div className="cyber-scan-lines absolute inset-0 opacity-20" />
          <div className="container py-16 relative z-10">
            <div className="max-w-4xl">
              <Badge className="mb-4 bg-secondary-foreground/20 text-secondary-foreground border-secondary-foreground/30">
                <Crown className="w-3 h-3 mr-1" />
                CONTENIDO PREMIUM
              </Badge>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-secondary-foreground mb-4">
                TALENTO <span className="text-primary">IBÉRICO</span>
              </h1>
              <p className="text-lg text-secondary-foreground/80 max-w-2xl">
                Análisis exclusivo de los mejores jugadores españoles y portugueses de la Premier League
              </p>
            </div>
          </div>
        </div>

        {/* Players Grid */}
        <div className="container py-12">
          <div className="mb-8">
            <h2 className="font-heading text-2xl mb-2">
              Jugadores Destacados
            </h2>
            <p className="text-muted-foreground">
              El talento ibérico más destacado de la temporada
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {mockPlayers.map((player) => (
              <Card 
                key={player.id}
                className="cyber-border group hover:border-secondary/50 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Left: Player Info */}
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-heading text-2xl text-foreground mb-1">
                            {player.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {player.team}
                          </p>
                        </div>
                        <Badge variant="outline" className="cyber-border-sm font-mono-cyber">
                          {player.position}
                        </Badge>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-3 mb-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">País:</span>
                          <span className="font-medium">{player.nationality}</span>
                        </div>
                        <div className="text-muted-foreground">•</div>
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">Edad:</span>
                          <span className="font-medium">{player.age}</span>
                        </div>
                      </div>

                      {/* Performance */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="p-3 bg-muted/30 rounded-lg text-center">
                          <div className="font-mono-cyber text-2xl font-bold text-primary">
                            {player.goals}
                          </div>
                          <div className="text-xs text-muted-foreground">Goles</div>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-lg text-center">
                          <div className="font-mono-cyber text-2xl font-bold text-secondary">
                            {player.assists}
                          </div>
                          <div className="text-xs text-muted-foreground">Asist.</div>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-lg text-center">
                          <div className="font-mono-cyber text-2xl font-bold text-accent">
                            {player.matches}
                          </div>
                          <div className="text-xs text-muted-foreground">PJ</div>
                        </div>
                      </div>

                      {/* CTA */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full group/btn"
                      >
                        <span className="font-heading text-xs">VER ANÁLISIS COMPLETO</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>

                    {/* Right: Stats Panel */}
                    <div className="w-32 flex flex-col gap-4">
                      {/* Rating */}
                      <div className="p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg text-center border border-border">
                        <Star className="w-5 h-5 text-accent mx-auto mb-2" />
                        <div className={`font-mono-cyber text-3xl font-bold ${getRatingColor(player.rating)}`}>
                          {player.rating.toFixed(1)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Rating</div>
                      </div>

                      {/* Potential */}
                      <div className="p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg text-center border border-border">
                        <Zap className="w-5 h-5 text-secondary mx-auto mb-2" />
                        <div className={`font-mono-cyber text-3xl font-bold ${getPotentialColor(player.potential)}`}>
                          {player.potential}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Potencial</div>
                      </div>

                      {/* Market Value */}
                      <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg text-center border border-primary/20">
                        <div className="font-mono-cyber text-lg font-bold text-primary">
                          {player.marketValue}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">Valor</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <CyberFooter />
    </div>
  );
}
