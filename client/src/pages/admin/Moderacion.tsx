import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Check, X, Eye, Loader2, FileText, Flame } from "lucide-react";
import { toast } from "sonner";

export default function Moderacion() {
  const [activeTab, setActiveTab] = useState<"noticias" | "rumores">("noticias");
  const utils = trpc.useUtils();

  // Fetch pending noticias
  const { data: noticias = [], isLoading: loadingNoticias } = trpc.moderation.noticias.list.useQuery({
    limit: 100,
    offset: 0,
    status: "pending",
  });

  // Fetch pending rumores
  const { data: rumores = [], isLoading: loadingRumores } = trpc.moderation.rumores.list.useQuery({
    limit: 100,
    offset: 0,
    status: "pending",
  });

  // Mutation para aprobar noticia
  const approveNoticiaMutation = trpc.moderation.noticias.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Noticia aprobada correctamente");
      utils.moderation.noticias.list.invalidate();
    },
    onError: (error: any) => {
      toast.error(`Error al aprobar: ${error.message}`);
    },
  });

  // Mutation para rechazar noticia
  const rejectNoticiaMutation = trpc.moderation.noticias.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Noticia rechazada");
      utils.moderation.noticias.list.invalidate();
    },
    onError: (error: any) => {
      toast.error(`Error al rechazar: ${error.message}`);
    },
  });

  // Mutation para aprobar rumor
  const approveRumorMutation = trpc.moderation.rumores.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Rumor aprobado correctamente");
      utils.moderation.rumores.list.invalidate();
    },
    onError: (error: any) => {
      toast.error(`Error al aprobar: ${error.message}`);
    },
  });

  // Mutation para rechazar rumor
  const rejectRumorMutation = trpc.moderation.rumores.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Rumor rechazado");
      utils.moderation.rumores.list.invalidate();
    },
    onError: (error: any) => {
      toast.error(`Error al rechazar: ${error.message}`);
    },
  });

  const formatDate = (date: Date | string | null) => {
    if (!date) return "Sin fecha";
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Moderación de Contenido</h1>
          <p className="text-muted-foreground mt-2">
            Aprueba o rechaza noticias y rumores pendientes de publicación
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "noticias" | "rumores")}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="noticias" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Noticias ({noticias.length})
            </TabsTrigger>
            <TabsTrigger value="rumores" className="flex items-center gap-2">
              <Flame className="w-4 h-4" />
              Rumores ({rumores.length})
            </TabsTrigger>
          </TabsList>

          {/* Noticias Tab */}
          <TabsContent value="noticias" className="space-y-4 mt-6">
            {loadingNoticias ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : noticias.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-muted-foreground mb-2">
                    No hay noticias pendientes
                  </h3>
                  <p className="text-muted-foreground">
                    Todas las noticias han sido moderadas
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {noticias.map((noticia) => (
                  <Card key={noticia.id} className="overflow-hidden">
                    <CardHeader className="bg-card/50">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{noticia.title}</CardTitle>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="text-primary font-medium">{noticia.autor || "Sin autor"}</span>
                            <span>•</span>
                            <span>{noticia.source || "Sin fuente"}</span>
                            <span>•</span>
                            <span>{formatDate(noticia.published)}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/50">
                          Pendiente
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {noticia.summary || "Sin resumen disponible"}
                      </p>
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => approveNoticiaMutation.mutate({ id: noticia.id, status: 'published' })}
                          disabled={approveNoticiaMutation.isPending}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Aprobar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectNoticiaMutation.mutate({ id: noticia.id, status: 'draft' })}
                          disabled={rejectNoticiaMutation.isPending}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Rechazar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/noticia/${noticia.id}`, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Vista Previa
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Rumores Tab */}
          <TabsContent value="rumores" className="space-y-4 mt-6">
            {loadingRumores ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : rumores.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Flame className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-muted-foreground mb-2">
                    No hay rumores pendientes
                  </h3>
                  <p className="text-muted-foreground">
                    Todos los rumores han sido moderados
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {rumores.map((rumor) => (
                  <Card key={rumor.id} className="overflow-hidden">
                    <CardHeader className="bg-card/50">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{rumor.titulo}</CardTitle>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="text-primary font-medium">Rumor</span>
                            <span>•</span>
                            <span>{rumor.fuente || "Sin fuente"}</span>
                            <span>•</span>
                            <span>{formatDate(rumor.creado_en)}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/50">
                          Pendiente
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {rumor.extracto || "Sin resumen disponible"}
                      </p>
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => approveRumorMutation.mutate({ id: rumor.id, status: 'published' })}
                          disabled={approveRumorMutation.isPending}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Aprobar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectRumorMutation.mutate({ id: rumor.id, status: 'draft' })}
                          disabled={rejectRumorMutation.isPending}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Rechazar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/rumor/${rumor.id}`, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Vista Previa
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
