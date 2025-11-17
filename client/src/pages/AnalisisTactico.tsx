import { useAuth } from "@/_core/hooks/useAuth";
import { CyberFooter } from "@/components/cyber/CyberFooter";
import { CyberHeader } from "@/components/cyber/CyberHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  Shield,
  Target,
  TrendingUp,
  Users,
  Lock,
  Crown,
  ArrowRight,
  Filter,
  Calendar,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function AnalisisTactico() {
  const { user, isAuthenticated } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [selectedJornada, setSelectedJornada] = useState<string>("all");

  // Check if user has access (PRO or PREMIUM)
  const hasAccess =
    isAuthenticated &&
    user &&
    (user.subscriptionTier === "PRO" || user.subscriptionTier === "PREMIUM");

  // Mock data - replace with real tRPC query
  const analisisList = [
    {
      id: 1,
      title: "Manchester City vs Arsenal: Dominio Posicional",
      team1: "Manchester City",
      team2: "Arsenal",
      jornada: 15,
      date: "2024-12-20",
      preview:
        "Análisis profundo del sistema 4-3-3 del City contra el 4-4-2 defensivo del Arsenal",
      tags: ["Posesión", "Presión Alta", "Transiciones"],
      isPremium: false,
    },
    {
      id: 2,
      title: "Liverpool: La Máquina de Klopp en Acción",
      team1: "Liverpool",
      team2: "Chelsea",
      jornada: 15,
      date: "2024-12-19",
      preview:
        "Cómo el gegenpressing del Liverpool desmanteló la defensa del Chelsea",
      tags: ["Gegenpressing", "Transiciones", "Amplitud"],
      isPremium: true,
    },
    {
      id: 3,
      title: "Newcastle: Solidez Defensiva y Contraataque Letal",
      team1: "Newcastle",
      team2: "Tottenham",
      jornada: 14,
      date: "2024-12-15",
      preview:
        "Análisis del bloque bajo del Newcastle y sus transiciones rápidas",
      tags: ["Defensa", "Contraataque", "Transiciones"],
      isPremium: true,
    },
  ];

  const teams = [
    "all",
    "Manchester City",
    "Arsenal",
    "Liverpool",
    "Chelsea",
    "Newcastle",
    "Tottenham",
  ];

  const filteredAnalisis = analisisList.filter((analisis) => {
    const matchesTeam =
      selectedTeam === "all" ||
      analisis.team1 === selectedTeam ||
      analisis.team2 === selectedTeam;
    const matchesJornada =
      selectedJornada === "all" ||
      analisis.jornada.toString() === selectedJornada;
    return matchesTeam && matchesJornada;
  });

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <CyberHeader />
        <main className="flex-1 container py-12">
          <div className="max-w-4xl mx-auto">
            {/* Premium Lock Screen */}
            <div className="text-center space-y-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/30 cyber-glow-primary">
                <Lock className="w-12 h-12 text-primary" />
              </div>

              <div className="space-y-4">
                <h1 className="font-heading text-4xl md:text-5xl text-foreground">
                  ANÁLISIS{" "}
                  <span className="text-primary cyber-text-glow">TÁCTICO</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Contenido exclusivo para suscriptores PRO y PREMIUM
                </p>
              </div>

              <Card className="cyber-border max-w-2xl mx-auto">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <Crown className="w-6 h-6" />
                    <span className="font-heading text-xl">
                      CONTENIDO PREMIUM
                    </span>
                  </div>

                  <div className="grid gap-4 text-left">
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-foreground mb-1">
                          Análisis Táctico Profundo
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Desglose detallado de sistemas, formaciones y patrones
                          de juego
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-foreground mb-1">
                          Mapas de Calor y Visualizaciones
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Gráficos interactivos de posicionamiento y movimientos
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-foreground mb-1">
                          Comparativas Entre Equipos
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Análisis comparativo de estilos y estrategias
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-foreground mb-1">
                          Análisis de Tendencias
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Evolución táctica a lo largo de la temporada
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    {isAuthenticated ? (
                      <Link href="/planes">
                        <Button
                          size="lg"
                          className="w-full cyber-button-primary"
                        >
                          <Crown className="w-5 h-5 mr-2" />
                          Mejorar a PRO o PREMIUM
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </Link>
                    ) : (
                      <a href={getLoginUrl()}>
                        <Button
                          size="lg"
                          className="w-full cyber-button-primary"
                        >
                          Iniciar Sesión
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <CyberFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CyberHeader />
      <main className="flex-1 container py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 cyber-glow-primary">
              <Crown className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">
                CONTENIDO PREMIUM
              </span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl text-foreground">
              ANÁLISIS{" "}
              <span className="text-primary cyber-text-glow">TÁCTICO</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Análisis profundo de sistemas, formaciones y patrones de juego de
              la Premier League
            </p>
          </div>

          {/* Filters */}
          <Card className="cyber-border-sm">
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Filter className="w-4 h-4 text-primary" />
                    Equipo
                  </label>
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">Todos los equipos</option>
                    {teams.slice(1).map((team) => (
                      <option key={team} value={team}>
                        {team}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-secondary" />
                    Jornada
                  </label>
                  <select
                    value={selectedJornada}
                    onChange={(e) => setSelectedJornada(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    <option value="all">Todas las jornadas</option>
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((j) => (
                      <option key={j} value={j.toString()}>
                        Jornada {j}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Análisis List */}
          <div className="grid gap-6">
            {filteredAnalisis.map((analisis) => (
              <Card key={analisis.id} className="cyber-border group">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Left: Match Info */}
                    <div className="md:w-1/3 space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-xs font-medium">
                        <Calendar className="w-3 h-3" />
                        Jornada {analisis.jornada}
                      </div>
                      <div className="space-y-2">
                        <div className="font-heading text-xl text-foreground">
                          {analisis.team1}
                        </div>
                        <div className="text-sm text-muted-foreground">vs</div>
                        <div className="font-heading text-xl text-foreground">
                          {analisis.team2}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(analisis.date).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>

                    {/* Right: Content */}
                    <div className="md:w-2/3 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-heading text-2xl text-foreground group-hover:text-primary transition-colors">
                          {analisis.title}
                        </h3>
                        {analisis.isPremium && (
                          <div className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/10 border border-primary/30">
                            <Crown className="w-3 h-3 text-primary" />
                            <span className="text-xs font-medium text-primary">
                              PREMIUM
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-muted-foreground">{analisis.preview}</p>

                      <div className="flex flex-wrap gap-2">
                        {analisis.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-xs font-medium text-secondary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <Button className="cyber-button-primary group-hover:scale-105 transition-transform">
                        Ver Análisis Completo
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAnalisis.length === 0 && (
            <Card className="cyber-border">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">
                  No hay análisis disponibles con los filtros seleccionados
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <CyberFooter />
    </div>
  );
}
