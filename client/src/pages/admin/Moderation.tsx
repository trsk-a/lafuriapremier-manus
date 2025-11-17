import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Edit, Trash2, Eye } from "lucide-react";

type ContentStatus = "draft" | "pending" | "published";

interface Noticia {
  id: number;
  title: string | null;
  summary: string | null;
  content: string | null;
  autor: string | null;
  img: string | null;
  published: Date | null;
  status: ContentStatus;
  moderated_at: Date | null;
}

interface Rumor {
  id: string;
  titulo: string;
  extracto: string;
  cuerpo: string | null;
  fuente: string;
  publicado_en: Date;
  status: ContentStatus;
  moderated_at: Date | null;
}

export default function Moderation() {
  const [activeTab, setActiveTab] = useState("noticias");
  const [selectedNoticia, setSelectedNoticia] = useState<Noticia | null>(null);
  const [selectedRumor, setSelectedRumor] = useState<Rumor | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const utils = trpc.useUtils();

  // Queries
  const { data: stats } = trpc.moderation.stats.useQuery();
  const { data: noticias = [] } = trpc.moderation.noticias.list.useQuery({
    status: "pending",
    limit: 100,
  });
  const { data: rumores = [] } = trpc.moderation.rumores.list.useQuery({
    status: "pending",
    limit: 100,
  });

  // Mutations
  const updateNoticiaStatus = trpc.moderation.noticias.updateStatus.useMutation({
    onSuccess: () => {
      utils.moderation.noticias.list.invalidate();
      utils.moderation.stats.invalidate();
      toast.success("Estado actualizado correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateNoticia = trpc.moderation.noticias.update.useMutation({
    onSuccess: () => {
      utils.moderation.noticias.list.invalidate();
      setEditDialogOpen(false);
      toast.success("Noticia actualizada correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteNoticia = trpc.moderation.noticias.delete.useMutation({
    onSuccess: () => {
      utils.moderation.noticias.list.invalidate();
      utils.moderation.stats.invalidate();
      toast.success("Noticia eliminada correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateRumorStatus = trpc.moderation.rumores.updateStatus.useMutation({
    onSuccess: () => {
      utils.moderation.rumores.list.invalidate();
      utils.moderation.stats.invalidate();
      toast.success("Estado actualizado correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateRumor = trpc.moderation.rumores.update.useMutation({
    onSuccess: () => {
      utils.moderation.rumores.list.invalidate();
      setEditDialogOpen(false);
      toast.success("Rumor actualizado correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteRumor = trpc.moderation.rumores.delete.useMutation({
    onSuccess: () => {
      utils.moderation.rumores.list.invalidate();
      utils.moderation.stats.invalidate();
      toast.success("Rumor eliminado correctamente");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleApproveNoticia = (id: number) => {
    updateNoticiaStatus.mutate({ id, status: "published" });
  };

  const handleRejectNoticia = (id: number) => {
    updateNoticiaStatus.mutate({ id, status: "draft" });
  };

  const handleDeleteNoticia = (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta noticia?")) {
      deleteNoticia.mutate({ id });
    }
  };

  const handleApproveRumor = (id: string) => {
    updateRumorStatus.mutate({ id, status: "published" });
  };

  const handleRejectRumor = (id: string) => {
    updateRumorStatus.mutate({ id, status: "draft" });
  };

  const handleDeleteRumor = (id: string) => {
    if (confirm("¿Estás seguro de eliminar este rumor?")) {
      deleteRumor.mutate({ id });
    }
  };

  const handleEditNoticia = (noticia: Noticia) => {
    setSelectedNoticia(noticia);
    setEditDialogOpen(true);
  };

  const handleEditRumor = (rumor: Rumor) => {
    setSelectedRumor(rumor);
    setEditDialogOpen(true);
  };

  const handleViewNoticia = (noticia: Noticia) => {
    setSelectedNoticia(noticia);
    setViewDialogOpen(true);
  };

  const handleViewRumor = (rumor: Rumor) => {
    setSelectedRumor(rumor);
    setViewDialogOpen(true);
  };

  const handleSaveNoticia = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedNoticia) return;

    const formData = new FormData(e.currentTarget);
    updateNoticia.mutate({
      id: selectedNoticia.id,
      title: formData.get("title") as string,
      summary: formData.get("summary") as string,
      content: formData.get("content") as string,
      autor: formData.get("autor") as string,
      img: formData.get("img") as string,
    });
  };

  const handleSaveRumor = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedRumor) return;

    const formData = new FormData(e.currentTarget);
    updateRumor.mutate({
      id: selectedRumor.id,
      titulo: formData.get("titulo") as string,
      extracto: formData.get("extracto") as string,
      cuerpo: formData.get("cuerpo") as string,
      fuente: formData.get("fuente") as string,
    });
  };

  const getStatusBadge = (status: ContentStatus) => {
    const variants: Record<ContentStatus, { label: string; className: string }> = {
      draft: { label: "Borrador", className: "bg-gray-500" },
      pending: { label: "Pendiente", className: "bg-yellow-500" },
      published: { label: "Publicado", className: "bg-green-500" },
    };

    const { label, className } = variants[status];
    return <Badge className={className}>{label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-red-500">Moderación de Contenido</h1>
        <p className="text-gray-400 mb-8">
          Revisa y aprueba contenido antes de publicarlo en el sitio
        </p>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-900 border border-cyan-500/30 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-400">Noticias Pendientes</h3>
              <p className="text-3xl font-bold text-cyan-400 mt-2">{stats.noticias?.pending || 0}</p>
            </div>
            <div className="bg-gray-900 border border-cyan-500/30 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-400">Rumores Pendientes</h3>
              <p className="text-3xl font-bold text-cyan-400 mt-2">{stats.rumores?.pending || 0}</p>
            </div>
            <div className="bg-gray-900 border border-cyan-500/30 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-400">Total Publicado</h3>
              <p className="text-3xl font-bold text-green-400 mt-2">
                {(stats.noticias?.published || 0) + (stats.rumores?.published || 0)}
              </p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-900 border border-cyan-500/30">
            <TabsTrigger value="noticias" className="data-[state=active]:bg-cyan-500">
              Noticias ({noticias.length})
            </TabsTrigger>
            <TabsTrigger value="rumores" className="data-[state=active]:bg-cyan-500">
              Rumores ({rumores.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="noticias" className="mt-6">
            <div className="bg-gray-900 border border-cyan-500/30 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-cyan-500/30">
                    <TableHead className="text-cyan-400">Título</TableHead>
                    <TableHead className="text-cyan-400">Autor</TableHead>
                    <TableHead className="text-cyan-400">Fecha</TableHead>
                    <TableHead className="text-cyan-400">Estado</TableHead>
                    <TableHead className="text-cyan-400 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {noticias.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                        No hay noticias pendientes de moderación
                      </TableCell>
                    </TableRow>
                  ) : (
                    noticias.map((noticia) => (
                      <TableRow key={noticia.id} className="border-b border-gray-800">
                        <TableCell className="font-medium">
                          {noticia.title || "Sin título"}
                        </TableCell>
                        <TableCell>{noticia.autor || "Desconocido"}</TableCell>
                        <TableCell>
                          {noticia.published
                            ? new Date(noticia.published).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell>{getStatusBadge(noticia.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewNoticia(noticia)}
                              className="text-cyan-400 hover:text-cyan-300"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditNoticia(noticia)}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleApproveNoticia(noticia.id)}
                              className="text-green-400 hover:text-green-300"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRejectNoticia(noticia.id)}
                              className="text-yellow-400 hover:text-yellow-300"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteNoticia(noticia.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="rumores" className="mt-6">
            <div className="bg-gray-900 border border-cyan-500/30 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-cyan-500/30">
                    <TableHead className="text-cyan-400">Título</TableHead>
                    <TableHead className="text-cyan-400">Fuente</TableHead>
                    <TableHead className="text-cyan-400">Fecha</TableHead>
                    <TableHead className="text-cyan-400">Estado</TableHead>
                    <TableHead className="text-cyan-400 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rumores.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-400 py-8">
                        No hay rumores pendientes de moderación
                      </TableCell>
                    </TableRow>
                  ) : (
                    rumores.map((rumor) => (
                      <TableRow key={rumor.id} className="border-b border-gray-800">
                        <TableCell className="font-medium">{rumor.titulo}</TableCell>
                        <TableCell>{rumor.fuente}</TableCell>
                        <TableCell>
                          {new Date(rumor.publicado_en).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(rumor.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewRumor(rumor)}
                              className="text-cyan-400 hover:text-cyan-300"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditRumor(rumor)}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleApproveRumor(rumor.id)}
                              className="text-green-400 hover:text-green-300"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRejectRumor(rumor.id)}
                              className="text-yellow-400 hover:text-yellow-300"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteRumor(rumor.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog - Noticias */}
        {selectedNoticia && (
          <Dialog open={editDialogOpen && !!selectedNoticia} onOpenChange={setEditDialogOpen}>
            <DialogContent className="bg-gray-900 text-white border-cyan-500/30 max-w-2xl">
              <DialogHeader>
                <DialogTitle>Editar Noticia</DialogTitle>
                <DialogDescription>
                  Modifica los campos necesarios antes de publicar
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveNoticia}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      name="title"
                      defaultValue={selectedNoticia.title || ""}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="autor">Autor</Label>
                    <Input
                      id="autor"
                      name="autor"
                      defaultValue={selectedNoticia.autor || ""}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="summary">Resumen</Label>
                    <Textarea
                      id="summary"
                      name="summary"
                      defaultValue={selectedNoticia.summary || ""}
                      rows={3}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Contenido</Label>
                    <Textarea
                      id="content"
                      name="content"
                      defaultValue={selectedNoticia.content || ""}
                      rows={6}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="img">URL de Imagen</Label>
                    <Input
                      id="img"
                      name="img"
                      defaultValue={selectedNoticia.img || ""}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600">
                    Guardar Cambios
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Dialog - Rumores */}
        {selectedRumor && (
          <Dialog open={editDialogOpen && !!selectedRumor} onOpenChange={setEditDialogOpen}>
            <DialogContent className="bg-gray-900 text-white border-cyan-500/30 max-w-2xl">
              <DialogHeader>
                <DialogTitle>Editar Rumor</DialogTitle>
                <DialogDescription>
                  Modifica los campos necesarios antes de publicar
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveRumor}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="titulo">Título</Label>
                    <Input
                      id="titulo"
                      name="titulo"
                      defaultValue={selectedRumor.titulo}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fuente">Fuente</Label>
                    <Input
                      id="fuente"
                      name="fuente"
                      defaultValue={selectedRumor.fuente}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="extracto">Extracto</Label>
                    <Textarea
                      id="extracto"
                      name="extracto"
                      defaultValue={selectedRumor.extracto}
                      rows={3}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cuerpo">Cuerpo</Label>
                    <Textarea
                      id="cuerpo"
                      name="cuerpo"
                      defaultValue={selectedRumor.cuerpo || ""}
                      rows={6}
                      className="bg-gray-800 border-gray-700"
                    />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600">
                    Guardar Cambios
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* View Dialog - Noticias */}
        {selectedNoticia && (
          <Dialog open={viewDialogOpen && !!selectedNoticia} onOpenChange={setViewDialogOpen}>
            <DialogContent className="bg-gray-900 text-white border-cyan-500/30 max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedNoticia.title}</DialogTitle>
                <div className="flex gap-2 items-center text-sm text-gray-400">
                  <span>Por {selectedNoticia.autor || "Desconocido"}</span>
                  <span>•</span>
                  <span>
                    {selectedNoticia.published
                      ? new Date(selectedNoticia.published).toLocaleDateString()
                      : "Sin fecha"}
                  </span>
                </div>
              </DialogHeader>
              <div className="space-y-4">
                {selectedNoticia.img && (
                  <img
                    src={selectedNoticia.img}
                    alt={selectedNoticia.title || ""}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h4 className="font-semibold text-cyan-400 mb-2">Resumen</h4>
                  <p className="text-gray-300">{selectedNoticia.summary}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-cyan-400 mb-2">Contenido</h4>
                  <div className="text-gray-300 whitespace-pre-wrap">
                    {selectedNoticia.content}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setViewDialogOpen(false)}>Cerrar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* View Dialog - Rumores */}
        {selectedRumor && (
          <Dialog open={viewDialogOpen && !!selectedRumor} onOpenChange={setViewDialogOpen}>
            <DialogContent className="bg-gray-900 text-white border-cyan-500/30 max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedRumor.titulo}</DialogTitle>
                <div className="flex gap-2 items-center text-sm text-gray-400">
                  <span>Fuente: {selectedRumor.fuente}</span>
                  <span>•</span>
                  <span>{new Date(selectedRumor.publicado_en).toLocaleDateString()}</span>
                </div>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-cyan-400 mb-2">Extracto</h4>
                  <p className="text-gray-300">{selectedRumor.extracto}</p>
                </div>
                {selectedRumor.cuerpo && (
                  <div>
                    <h4 className="font-semibold text-cyan-400 mb-2">Cuerpo</h4>
                    <div className="text-gray-300 whitespace-pre-wrap">
                      {selectedRumor.cuerpo}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={() => setViewDialogOpen(false)}>Cerrar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
