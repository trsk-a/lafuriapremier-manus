import { useState } from "react";
import { CyberHeader } from "@/components/cyber/CyberHeader";
import { CyberFooter } from "@/components/cyber/CyberFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Newspaper,
  Clock,
  User,
  ArrowRight,
  ExternalLink,
  Loader2,
  TrendingUp
} from "lucide-react";
import { trpc } from "@/lib/trpc";

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
              <Newspaper className="w-8 h-8 text-cyan-500" />
              <h1 className="text-5xl font-black">
                ÚLTIMAS <span className="text-cyan-500">NOTICIAS</span>
              </h1>
            </div>
            <p className="text-xl text-gray-400 max-w-3xl">
              Mantente al día con las últimas noticias de la Premier League. Análisis, entrevistas y cobertura en profundidad.
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gray-900/50 border-cyan-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Noticias Publicadas</p>
                  <p className="text-3xl font-bold text-cyan-500">{noticias.length}</p>
                </div>
                <Newspaper className="w-8 h-8 text-cyan-500/50" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-red-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Actualizadas Hoy</p>
                  <p className="text-3xl font-bold text-red-500">
                    {noticias.filter(n => {
                      if (!n.published) return false;
                      const diff = new Date().getTime() - new Date(n.published).getTime();
                      return diff < 24 * 60 * 60 * 1000;
                    }).length}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-red-500/50" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-900/50 border-orange-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Fuentes Oficiales</p>
                  <p className="text-3xl font-bold text-orange-500">
                    {noticias.filter(n => n.source?.toLowerCase().includes('oficial')).length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-500/50" />
              </div>
            </CardContent>
          </Card>
        </div>

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
                <Card 
                  key={noticia.id} 
                  className={`bg-gray-900/50 border-cyan-500/30 hover:border-cyan-500/60 transition-all group ${
                    isHighlight ? 'lg:col-span-2' : ''
                  }`}
                >
                  <CardContent className="p-0">
                    <div className={`flex ${isHighlight ? 'flex-col md:flex-row' : 'flex-col'}`}>
                      {/* Image */}
                      {noticia.img && (
                        <div className={`relative overflow-hidden ${
                          isHighlight ? 'md:w-1/2 h-64 md:h-auto' : 'h-48'
                        }`}>
                          <img 
                            src={noticia.img} 
                            alt={noticia.title || 'Noticia'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        </div>
                      )}

                      {/* Content */}
                      <div className={`p-6 ${isHighlight ? 'md:w-1/2' : ''}`}>
                        {/* Header */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {noticia.source && (
                            <Badge className={getSourceBadgeColor(noticia.source)}>
                              {noticia.source}
                            </Badge>
                          )}
                          <span className="text-gray-500 text-sm flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {noticia.published ? formatDate(noticia.published) : 'Sin fecha'}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className={`font-bold text-white group-hover:text-cyan-400 transition-colors mb-3 ${
                          isHighlight ? 'text-2xl' : 'text-xl'
                        }`}>
                          {noticia.title || 'Sin título'}
                        </h3>

                        {/* Summary */}
                        {noticia.summary && (
                          <p className={`text-gray-300 leading-relaxed mb-4 ${
                            isHighlight ? 'text-base' : 'text-sm'
                          }`}>
                            {noticia.summary}
                          </p>
                        )}

                        {/* Footer */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-800">
                          {noticia.autor && (
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <User className="w-4 h-4" />
                              <span>{noticia.autor}</span>
                            </div>
                          )}
                          
                          {noticia.url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-cyan-400 hover:text-cyan-300"
                              asChild
                            >
                              <a href={noticia.url} target="_blank" rel="noopener noreferrer">
                                Leer Más
                                <ExternalLink className="w-4 h-4 ml-2" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
