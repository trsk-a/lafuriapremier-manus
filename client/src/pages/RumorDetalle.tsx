import { useRoute } from "wouter";
import { CyberHeader } from "@/components/cyber/CyberHeader";
import { CyberFooter } from "@/components/cyber/CyberFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, ExternalLink, Loader2, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function RumorDetalle() {
  const [, params] = useRoute("/rumor/:id");
  const [, setLocation] = useLocation();
  const rumorId = params?.id ? parseInt(params.id) : null;

  // Cargar el rumor específico
  const { data: rumores, isLoading, error } = trpc.content.rumores.useQuery(
    { limit: 100, offset: 0 },
    { enabled: true }
  );

  // Cargar otros rumores para el sidebar
  const { data: otrosRumores } = trpc.content.rumores.useQuery(
    { limit: 5, offset: 0 },
    { enabled: true }
  );

  const rumor = rumores?.find((r: any) => r.id === rumorId);

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Sin fecha";
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <CyberHeader />
        <div className="container py-20 flex justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
        <CyberFooter />
      </div>
    );
  }

  if (error || !rumor) {
    return (
      <div className="min-h-screen bg-background">
        <CyberHeader />
        <div className="container py-20">
          <Card>
            <CardContent className="p-12 text-center">
              <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-muted-foreground mb-2">
                Rumor no encontrado
              </h2>
              <p className="text-muted-foreground mb-6">
                El rumor que buscas no existe o ha sido eliminado
              </p>
              <Button onClick={() => setLocation("/rumores")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Rumores
              </Button>
            </CardContent>
          </Card>
        </div>
        <CyberFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CyberHeader />
      
      <main className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/rumores")}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Rumores
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <article>
              <Card className="overflow-hidden cyber-border">
                <CardContent className="p-8 md:p-12">
                  {/* Title */}
                  <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                    {rumor.titulo}
                  </h1>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(rumor.publicado_en)}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      <span>{rumor.fuente}</span>
                    </div>
                  </div>

                  {/* Summary */}
                  {rumor.extracto && (
                    <div className="text-xl text-muted-foreground leading-relaxed mb-8 p-6 bg-card/50 rounded-lg border-l-4 border-primary">
                      {rumor.extracto}
                    </div>
                  )}

                  {/* Content */}
                  <div className="prose prose-invert max-w-none">
                    {rumor.cuerpo ? (
                      <div 
                        className="text-foreground leading-relaxed space-y-4"
                        dangerouslySetInnerHTML={{ __html: rumor.cuerpo.replace(/\n/g, '<br />') }}
                      />
                    ) : (
                      <p className="text-muted-foreground italic">
                        Contenido no disponible
                      </p>
                    )}
                  </div>

                  {/* Source Link */}
                  {rumor.fuente && (
                    <div className="mt-12 pt-8 border-t border-border">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ExternalLink className="w-4 h-4" />
                        <span>Fuente: {rumor.fuente}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </article>
          </div>

          {/* Sidebar - Otros Rumores */}
          <aside className="lg:col-span-1">
            <Card className="cyber-border sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Otros Rumores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {otrosRumores && otrosRumores.length > 0 ? (
                  otrosRumores
                    .filter((r: any) => r.id !== rumorId)
                    .slice(0, 4)
                    .map((r: any) => (
                      <button
                        key={r.id}
                        onClick={() => setLocation(`/rumor/${r.id}`)}
                        className="w-full text-left p-4 rounded-lg bg-card/50 hover:bg-card transition-colors border border-border hover:border-primary group"
                      >
                        <h3 className="font-bold text-sm mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {r.titulo}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(r.publicado_en)}</span>
                        </div>
                      </button>
                    ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No hay más rumores disponibles
                  </p>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full cyber-border"
                  onClick={() => setLocation("/rumores")}
                >
                  Ver todos los rumores
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      <CyberFooter />
    </div>
  );
}
