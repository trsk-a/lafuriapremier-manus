import { useRoute } from "wouter";
import { CyberHeader } from "@/components/cyber/CyberHeader";
import { CyberFooter } from "@/components/cyber/CyberFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, ExternalLink, Loader2, TrendingUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function RumorDetalle() {
  const [, params] = useRoute("/rumor/:id");
  const [, setLocation] = useLocation();
  const rumorId = params?.id;

  const { data: rumores, isLoading, error } = trpc.content.rumores.useQuery(
    { limit: 100, offset: 0 },
    { enabled: !!rumorId }
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

        {/* Article */}
        <article className="max-w-4xl mx-auto">
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
              {rumor.url && (
                <div className="mt-12 pt-8 border-t border-border">
                  <a 
                    href={rumor.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button 
                      variant="outline" 
                      className="cyber-border flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Ver fuente original
                    </Button>
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </article>
      </main>

      <CyberFooter />
    </div>
  );
}
