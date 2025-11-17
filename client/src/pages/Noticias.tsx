import { useState } from "react";
import { CyberHeader } from "@/components/cyber/CyberHeader";
import { CyberFooter } from "@/components/cyber/CyberFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Newspaper,
  ArrowRight,
  Loader2,
  TrendingUp,
  Clock
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { NewsCard } from "@/components/cyberpunk/NewsCard";
import { StatsHUD } from "@/components/cyberpunk/StatsHUD";
import { GlitchText } from "@/components/cyberpunk/GlitchText";

export default function Noticias() {
  const [limit, setLimit] = useState(20);
  
  // Fetch noticias publicadas desde Supabase
  const { data: noticias = [], isLoading } = trpc.content.noticias.useQuery({
    limit,
    offset: 0,
  });

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Hace menos de 1 hora";
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    if (diffInHours < 48) return "Hace 1 día";
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getSourceBadgeColor = (source: string | null) => {
    if (!source) return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    const lowerSource = source.toLowerCase();
    if (lowerSource.includes('oficial')) return "bg-green-500/20 text-green-400 border-green-500/50";
    if (lowerSource.includes('exclusiva')) return "bg-red-500/20 text-red-400 border-red-500/50";
    return "bg-cyan-500/20 text-cyan-400 border-cyan-500/50";
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <CyberHeader />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-transparent to-cyan-500/20 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <Newspaper className="w-8 h-8 text-secondary" />
              <h1 className="text-5xl font-black">
                <GlitchText intensity="medium" trigger="hover">
                  ÚLTIMAS NOTICIAS
                </GlitchText>
              </h1>
            </div>
            <p className="text-xl text-gray-400 max-w-3xl">
              Mantente al día con las últimas noticias de la Premier League. Análisis, entrevistas y cobertura en profundidad.
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <StatsHUD
          title="Estadísticas de Noticias"
          stats={[
            {
              label: "Noticias Publicadas",
              value: noticias.length,
              icon: <Newspaper className="w-5 h-5" />,
              color: "secondary",
            },
            {
              label: "Actualizadas Hoy",
              value: noticias.filter(n => {
                if (!n.published) return false;
                const diff = new Date().getTime() - new Date(n.published).getTime();
                return diff < 24 * 60 * 60 * 1000;
              }).length,
              icon: <TrendingUp className="w-5 h-5" />,
              color: "primary",
            },
            {
              label: "Fuentes Oficiales",
              value: noticias.filter(n => n.source?.toLowerCase().includes('oficial')).length,
              icon: <Clock className="w-5 h-5" />,
              color: "accent",
            },
          ]}
          className="mb-8"
        />

        {/* Noticias List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
          </div>
        ) : noticias.length === 0 ? (
          <Card className="bg-gray-900/50 border-cyan-500/30">
            <CardContent className="p-12 text-center">
              <Newspaper className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">No hay noticias disponibles</h3>
              <p className="text-gray-500">Las noticias aparecerán aquí una vez sean aprobadas por moderación</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {noticias.map((noticia, index) => {
              const isHighlight = index === 0;
              
              return (
                <NewsCard
                  key={noticia.id}
                  title={noticia.title || 'Sin título'}
                  excerpt={noticia.summary || undefined}
                  imageUrl={noticia.img || undefined}
                  category={noticia.source || undefined}
                  date={noticia.published ? formatDate(noticia.published) : 'Sin fecha'}
                  featured={isHighlight}
                  onClick={() => {
                    if (noticia.url) {
                      window.open(noticia.url, '_blank', 'noopener,noreferrer');
                    }
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Load More */}
        {!isLoading && noticias.length > 0 && noticias.length >= limit && (
          <div className="mt-8 text-center">
            <Button
              onClick={() => setLimit(limit + 20)}
              className="bg-gradient-to-r from-red-500 to-cyan-500 hover:from-red-600 hover:to-cyan-600"
            >
              Cargar Más Noticias
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </main>

      <CyberFooter />
    </div>
  );
}
