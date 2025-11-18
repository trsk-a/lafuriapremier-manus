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
  ExternalLink,
  Loader2
} from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Rumores() {
  const [limit, setLimit] = useState(20);
  
  // Fetch rumores publicados desde Supabase
  const { data: rumores = [], isLoading } = trpc.content.rumores.useQuery({
    limit,
    offset: 0,
  });

  const getHeatLevelColor = (level: number) => {
    if (level >= 4) return "text-red-500";
    if (level >= 3) return "text-orange-500";
    return "text-yellow-500";
  };

  const getReliabilityBadge = (level: number) => {
    if (level >= 4) return { label: "Alta Fiabilidad", className: "bg-green-500/20 text-green-400 border-green-500/50" };
    if (level >= 3) return { label: "Media Fiabilidad", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" };
    return { label: "Baja Fiabilidad", className: "bg-gray-500/20 text-gray-400 border-gray-500/50" };
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Hace menos de 1 hora";
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    if (diffInHours < 48) return "Hace 1 día";
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CyberHeader />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-transparent to-cyan-500/20 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <Flame className="w-8 h-8 text-red-500" />
              <h1 className="text-5xl font-black">
                <span className="text-red-500">RUMORES</span> DE FICHAJES
              </h1>
            </div>
            <p className="text-xl text-gray-400 max-w-3xl">
              Los rumores más calientes del mercado de transferencias. Información actualizada de las fuentes más confiables.
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gray-900/50 border-red-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Rumores Activos</p>
                  <p className="text-3xl font-bold text-red-500">{rumores.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-red-500/50" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-cyan-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Alta Fiabilidad</p>
                  <p className="text-3xl font-bold text-cyan-500">
                    {rumores.filter(r => r.fuente.toLowerCase().includes('tier 1')).length}
                  </p>
                </div>
                <Flame className="w-8 h-8 text-cyan-500/50" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-orange-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Actualizados Hoy</p>
                  <p className="text-3xl font-bold text-orange-500">
                    {rumores.filter(r => {
                      const diff = new Date().getTime() - new Date(r.publicado_en).getTime();
                      return diff < 24 * 60 * 60 * 1000;
                    }).length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-500/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rumores List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          </div>
        ) : rumores.length === 0 ? (
          <Card className="bg-gray-900/50 border-cyan-500/30">
            <CardContent className="p-12 text-center">
              <Flame className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">No hay rumores disponibles</h3>
              <p className="text-gray-500">Los rumores aparecerán aquí una vez sean aprobados por moderación</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {rumores.map((rumor) => (
              <Card 
                key={rumor.id} 
                className="bg-gray-900/50 border-cyan-500/30 hover:border-cyan-500/60 transition-all group"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Heat Indicator */}
                    <div className="flex md:flex-col items-center md:items-start gap-2 md:gap-1">
                      <div className="flex md:flex-col gap-1">
                        {[...Array(3)].map((_, i) => (
                          <Flame 
                            key={i} 
                            className={`w-5 h-5 ${i < 2 ? 'text-red-500' : 'text-gray-700'}`}
                            fill="currentColor"
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 md:mt-2">Nivel de Calor</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-2">
                            {rumor.titulo}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                              {rumor.fuente}
                            </Badge>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(rumor.publicado_en)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Excerpt */}
                      <p className="text-gray-300 leading-relaxed">
                        {rumor.extracto}
                      </p>

                      {/* Footer */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gray-800">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Temporada</span>
                          <Badge variant="outline" className="text-xs">
                            {rumor.temporada || '2024/25'}
                          </Badge>
                        </div>
                        
                        {rumor.url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-cyan-400 hover:text-cyan-300"
                            asChild
                          >
                            <a href={rumor.url} target="_blank" rel="noopener noreferrer">
                              Ver Fuente
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More */}
        {!isLoading && rumores.length > 0 && rumores.length >= limit && (
          <div className="mt-8 text-center">
            <Button
              onClick={() => setLimit(limit + 20)}
              className="bg-gradient-to-r from-red-500 to-cyan-500 hover:from-red-600 hover:to-cyan-600"
            >
              Cargar Más Rumores
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </main>

      <CyberFooter />
    </div>
  );
}
