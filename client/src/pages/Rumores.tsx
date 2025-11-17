import { useState } from "react";
import { CyberHeader } from "@/components/cyber/CyberHeader";
import { CyberFooter } from "@/components/cyber/CyberFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Flame,
  Clock,
  ArrowRight,
  Filter
} from "lucide-react";
import { trpc } from "@/lib/trpc";

type RumorCategory = 'fichajes' | 'renovaciones' | 'salidas' | 'todos';
type ReliabilityLevel = 1 | 2 | 3 | 4 | 5;

interface Rumor {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  reliability: ReliabilityLevel;
  heatLevel: number; // 1-5
  team: string;
  player: string;
  position?: string;
  publishedAt: Date;
  author: string;
  slug: string;
}

export default function Rumores() {
  const [selectedCategory, setSelectedCategory] = useState<RumorCategory>('todos');
  
  // En producción, esto vendría de la API
  const { data: articles, isLoading } = trpc.articles.list.useQuery({
    category: 'rumores',
    limit: 20,
  });

  // Mock data para demostración del diseño
  const mockRumors: Rumor[] = [
    {
      id: '1',
      title: 'Manchester United prepara oferta millonaria por joven promesa española',
      excerpt: 'Los Red Devils estarían dispuestos a pagar 80M€ por el mediocampista del Barcelona',
      category: 'fichajes',
      reliability: 4,
      heatLevel: 5,
      team: 'Manchester United',
      player: 'Gavi',
      position: 'MC',
      publishedAt: new Date('2025-01-15'),
      author: 'ruso',
      slug: 'man-utd-gavi-80m',
    },
    {
      id: '2',
      title: 'Arsenal busca reforzar la defensa con central argentino',
      excerpt: 'Los Gunners habrían iniciado conversaciones con el entorno del jugador',
      category: 'fichajes',
      reliability: 3,
      heatLevel: 3,
      team: 'Arsenal',
      player: 'Lisandro Martínez',
      position: 'DC',
      publishedAt: new Date('2025-01-14'),
      author: 'inge',
      slug: 'arsenal-lisandro-martinez',
    },
    {
      id: '3',
      title: 'Liverpool ofrece renovación récord a su estrella egipcia',
      excerpt: 'El club prepara un contrato de 5 años con salario de 400K semanales',
      category: 'renovaciones',
      reliability: 5,
      heatLevel: 4,
      team: 'Liverpool',
      player: 'Mohamed Salah',
      position: 'ED',
      publishedAt: new Date('2025-01-13'),
      author: 'mister',
      slug: 'liverpool-salah-renovacion',
    },
  ];

  const categories = [
    { value: 'todos' as RumorCategory, label: 'TODOS' },
    { value: 'fichajes' as RumorCategory, label: 'FICHAJES' },
    { value: 'renovaciones' as RumorCategory, label: 'RENOVACIONES' },
    { value: 'salidas' as RumorCategory, label: 'SALIDAS' },
  ];

  const getReliabilityLabel = (level: ReliabilityLevel) => {
    const labels = {
      1: 'Muy Bajo',
      2: 'Bajo',
      3: 'Medio',
      4: 'Alto',
      5: 'Muy Alto',
    };
    return labels[level];
  };

  const getReliabilityColor = (level: ReliabilityLevel) => {
    if (level >= 4) return 'text-secondary';
    if (level === 3) return 'text-accent';
    return 'text-muted-foreground';
  };

  const getHeatColor = (level: number) => {
    if (level >= 4) return 'text-primary';
    if (level === 3) return 'text-accent';
    return 'text-secondary';
  };

  const filteredRumors = selectedCategory === 'todos' 
    ? mockRumors 
    : mockRumors.filter(r => r.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CyberHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 border-b border-primary/30 relative overflow-hidden">
          <div className="cyber-scan-lines absolute inset-0 opacity-20" />
          <div className="container py-16 relative z-10">
            <div className="max-w-4xl">
              <Badge className="mb-4 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
                <Flame className="w-3 h-3 mr-1" />
                RUMORES Y FICHAJES
              </Badge>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-4">
                MERCADO DE <span className="text-secondary">FICHAJES</span>
              </h1>
              <p className="text-lg text-primary-foreground/80 max-w-2xl">
                Las últimas noticias, rumores y movimientos del mercado de transferencias de la Premier League
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="border-b border-border bg-card/50 sticky top-16 z-40 backdrop-blur-sm">
          <div className="container py-4">
            <div className="flex items-center gap-4 overflow-x-auto">
              <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
                <Filter className="w-4 h-4" />
                <span className="font-heading">FILTRAR:</span>
              </div>
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat.value}
                    variant={selectedCategory === cat.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.value)}
                    className="font-heading text-xs whitespace-nowrap"
                  >
                    {cat.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rumors Grid */}
        <div className="container py-12">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-muted-foreground">Cargando rumores...</p>
            </div>
          ) : (
            <div className="grid gap-6 max-w-4xl mx-auto">
              {filteredRumors.length === 0 ? (
                <Card className="cyber-border">
                  <CardContent className="p-12 text-center">
                    <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No hay rumores en esta categoría
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredRumors.map((rumor) => (
                  <Card 
                    key={rumor.id}
                    className="cyber-border group hover:border-primary/50 transition-all duration-300 overflow-hidden"
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Heat Indicator */}
                        <div className="md:w-20 bg-gradient-to-br from-primary/20 to-primary/10 flex flex-row md:flex-col items-center justify-center gap-2 p-4 border-b md:border-b-0 md:border-r border-border">
                          <Flame className={`w-6 h-6 ${getHeatColor(rumor.heatLevel)}`} />
                          <div className="text-center">
                            <div className="font-mono-cyber text-2xl font-bold">
                              {rumor.heatLevel}
                            </div>
                            <div className="text-xs text-muted-foreground uppercase">
                              Heat
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6">
                          {/* Meta */}
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <Badge variant="outline" className="cyber-border-sm">
                              {rumor.category.toUpperCase()}
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {new Date(rumor.publishedAt).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-medium ${getReliabilityColor(rumor.reliability)}`}>
                              <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-1 h-3 ${
                                      i < rumor.reliability ? 'bg-current' : 'bg-muted'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span>{getReliabilityLabel(rumor.reliability)}</span>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="font-heading text-xl md:text-2xl text-foreground mb-2 group-hover:text-primary transition-colors">
                            {rumor.title}
                          </h3>

                          {/* Excerpt */}
                          <p className="text-muted-foreground text-sm mb-4">
                            {rumor.excerpt}
                          </p>

                          {/* Player Info */}
                          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Jugador:</span>
                              <span className="ml-2 font-medium text-foreground">{rumor.player}</span>
                            </div>
                            {rumor.position && (
                              <div>
                                <span className="text-muted-foreground">Posición:</span>
                                <span className="ml-2 font-mono-cyber text-secondary">{rumor.position}</span>
                              </div>
                            )}
                            <div>
                              <span className="text-muted-foreground">Equipo:</span>
                              <span className="ml-2 font-medium text-foreground">{rumor.team}</span>
                            </div>
                          </div>

                          {/* CTA */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="group/btn"
                            onClick={() => window.location.href = `/articulo/${rumor.slug}`}
                          >
                            <span className="font-heading text-xs">LEER MÁS</span>
                            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Load More */}
          {filteredRumors.length > 0 && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                size="lg"
                className="cyber-border font-heading"
              >
                CARGAR MÁS RUMORES
              </Button>
            </div>
          )}
        </div>
      </main>

      <CyberFooter />
    </div>
  );
}
