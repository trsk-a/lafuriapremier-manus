import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  FileText,
  TrendingUp,
  Trophy,
  Users,
  Mail,
  Eye,
  TrendingDown,
  Activity,
} from "lucide-react";

export default function AdminDashboard() {
  // Fetch stats from backend
  const { data: articles } = trpc.articles.list.useQuery({});
  const { data: subscribers } = trpc.newsletter.subscribers.useQuery();

  const stats = [
    {
      name: "Total Artículos",
      value: articles?.length || 0,
      icon: FileText,
      change: "+12%",
      changeType: "positive" as const,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      name: "Suscriptores Newsletter",
      value: subscribers?.length || 0,
      icon: Mail,
      change: "+23%",
      changeType: "positive" as const,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      name: "Rumores Activos",
      value: 15,
      icon: TrendingUp,
      change: "+8%",
      changeType: "positive" as const,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      name: "Fichajes Confirmados",
      value: 8,
      icon: Trophy,
      change: "-2%",
      changeType: "negative" as const,
      color: "text-foreground",
      bgColor: "bg-muted",
    },
  ];

  const recentActivity = [
    {
      type: "article",
      title: "Nuevo artículo publicado",
      description: "Análisis táctico del Manchester City",
      time: "Hace 2 horas",
      icon: FileText,
    },
    {
      type: "subscriber",
      title: "Nuevo suscriptor",
      description: "usuario@email.com se suscribió a la newsletter",
      time: "Hace 3 horas",
      icon: Mail,
    },
    {
      type: "rumor",
      title: "Rumor actualizado",
      description: "Mbappé al Real Madrid - Nivel de confianza: Alto",
      time: "Hace 5 horas",
      icon: TrendingUp,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl text-foreground mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Resumen general de La Furia Premier
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.name} className="cyber-border-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        stat.changeType === "positive"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {stat.change}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {stat.name}
                    </p>
                    <p className="font-mono-cyber text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <Card className="cyber-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground mb-1">
                          {activity.title}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="cyber-border">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <button className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-left">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium text-foreground">
                      Crear Artículo
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Publica nuevo contenido
                    </div>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-4 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors text-left">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                  <div>
                    <div className="font-medium text-foreground">
                      Agregar Rumor
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Nuevo rumor de fichaje
                    </div>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-4 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors text-left">
                  <Mail className="w-5 h-5 text-accent" />
                  <div>
                    <div className="font-medium text-foreground">
                      Enviar Newsletter
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Campaña a suscriptores
                    </div>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suscriptores por Tier */}
        <Card className="cyber-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Distribución de Suscriptores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-6 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 border border-border">
                <div className="text-sm text-muted-foreground mb-2">FREE</div>
                <div className="font-mono-cyber text-3xl font-bold text-foreground mb-1">
                  {subscribers?.filter((s: any) => s.tier === "FREE").length || 0}
                </div>
                <div className="text-xs text-muted-foreground">
                  {subscribers?.length
                    ? (
                        (subscribers.filter((s: any) => s.tier === "FREE").length /
                          subscribers.length) *
                        100
                      ).toFixed(1)
                    : 0}
                  % del total
                </div>
              </div>
              <div className="p-6 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/10 border border-secondary/30">
                <div className="text-sm text-secondary-foreground mb-2">
                  PRO
                </div>
                <div className="font-mono-cyber text-3xl font-bold text-foreground mb-1">
                  {subscribers?.filter((s: any) => s.tier === "PRO").length || 0}
                </div>
                <div className="text-xs text-muted-foreground">
                  {subscribers?.length
                    ? (
                        (subscribers.filter((s: any) => s.tier === "PRO").length /
                          subscribers.length) *
                        100
                      ).toFixed(1)
                    : 0}
                  % del total
                </div>
              </div>
              <div className="p-6 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30">
                <div className="text-sm text-primary-foreground mb-2">
                  PREMIUM
                </div>
                <div className="font-mono-cyber text-3xl font-bold text-foreground mb-1">
                  {subscribers?.filter((s: any) => s.tier === "PREMIUM").length || 0}
                </div>
                <div className="text-xs text-muted-foreground">
                  {subscribers?.length
                    ? (
                        (subscribers.filter((s: any) => s.tier === "PREMIUM")
                          .length /
                          subscribers.length) *
                        100
                      ).toFixed(1)
                    : 0}
                  % del total
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
