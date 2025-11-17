import { CyberHeader } from "@/components/cyber/CyberHeader";
import { CyberFooter } from "@/components/cyber/CyberFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search,
  Filter,
  TrendingUp,
  Target,
  Award,
  ArrowRight,
  Users,
  Loader2
} from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Jugadores() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("Todos");
  const [selectedPosition, setSelectedPosition] = useState("Todas");
  const [selectedNationality, setSelectedNationality] = useState("Todas");
  const [sortBy, setSortBy] = useState<'rating' | 'goals' | 'assists' | 'name'>('rating');

  // Fetch players from Supabase
  const { data: players = [], isLoading } = trpc.players.list.useQuery({
    limit: 100,
    offset: 0,
    search: searchQuery || undefined,
  });

  // Extract unique values for filters
  const teams = useMemo(() => {
    const uniqueTeams = new Set(players.map(p => p.team_name).filter(Boolean));
    return ["Todos", ...Array.from(uniqueTeams).sort()];
  }, [players]);

  const positions = useMemo(() => {
    const uniquePositions = new Set(players.map(p => p.position).filter(Boolean));
    return ["Todas", ...Array.from(uniquePositions).sort()];
  }, [players]);

  const nationalities = useMemo(() => {
    const uniqueNationalities = new Set(players.map(p => p.nationality).filter(Boolean));
    return ["Todas", ...Array.from(uniqueNationalities).sort()];
  }, [players]);

  const filteredPlayers = useMemo(() => {
    let filtered = [...players];

    // Team filter
    if (selectedTeam !== "Todos") {
      filtered = filtered.filter(player => player.team_name === selectedTeam);
    }

    // Position filter
    if (selectedPosition !== "Todas") {
      filtered = filtered.filter(player => player.position === selectedPosition);
    }

    // Nationality filter
    if (selectedNationality !== "Todas") {
      filtered = filtered.filter(player => player.nationality === selectedNationality);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          // Sort by goals as fallback since rating doesn't exist
          return (b.goals || 0) - (a.goals || 0);
        case 'goals':
          return (b.goals || 0) - (a.goals || 0);
        case 'assists':
          return (b.assists || 0) - (a.assists || 0);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [players, selectedTeam, selectedPosition, selectedNationality, sortBy]);



  const getPositionBadge = (position: string | null) => {
    if (!position) return 'bg-gray-500/20 text-gray-400';
    const pos = position.toUpperCase();
    if (pos.includes('FORWARD') || pos.includes('ATTACKER')) return 'bg-red-500/20 text-red-400';
    if (pos.includes('MID')) return 'bg-cyan-500/20 text-cyan-400';
    if (pos.includes('DEF')) return 'bg-green-500/20 text-green-400';
    if (pos.includes('GOAL')) return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CyberHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 border-b border-primary/30 relative overflow-hidden">
          <div className="cyber-scan-lines absolute inset-0 opacity-20" />
          <div className="container py-16 relative z-10">
            <div className="max-w-4xl">
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-4">
                BASE DE <span className="text-secondary">JUGADORES</span>
              </h1>
              <p className="text-lg text-primary-foreground/80 max-w-2xl">
                Explora estadísticas, análisis y perfiles completos de todos los jugadores de la Premier League
              </p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="sticky top-16 z-20 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="container py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar jugador..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 cyber-border-sm"
                  />
                </div>
              </div>

              {/* Team Filter */}
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="cyber-border-sm">
                  <SelectValue placeholder="Equipo" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team} value={team || ''}>{team}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Position Filter */}
              <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                <SelectTrigger className="cyber-border-sm">
                  <SelectValue placeholder="Posición" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map(pos => (
                    <SelectItem key={pos} value={pos || ''}>{pos}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Nationality Filter */}
              <Select value={selectedNationality} onValueChange={setSelectedNationality}>
                <SelectTrigger className="cyber-border-sm">
                  <SelectValue placeholder="Nacionalidad" />
                </SelectTrigger>
                <SelectContent>
                  {nationalities.map(nat => (
                    <SelectItem key={nat} value={nat || ''}>{nat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">Ordenar por:</span>
              <div className="flex gap-2">
                <Button
                  variant={sortBy === 'rating' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('rating')}
                  className="cyber-border-sm"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Rating
                </Button>
                <Button
                  variant={sortBy === 'goals' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('goals')}
                  className="cyber-border-sm"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Goles
                </Button>
                <Button
                  variant={sortBy === 'assists' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('assists')}
                  className="cyber-border-sm"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Asistencias
                </Button>
                <Button
                  variant={sortBy === 'name' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('name')}
                  className="cyber-border-sm"
                >
                  Nombre
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Players Grid */}
        <div className="container py-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
          ) : filteredPlayers.length === 0 ? (
            <Card className="bg-card/50 border-border">
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">No se encontraron jugadores</h3>
                <p className="text-muted-foreground mb-4">
                  Intenta ajustar los filtros de búsqueda
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTeam("Todos");
                    setSelectedPosition("Todas");
                    setSelectedNationality("Todas");
                  }}
                  variant="outline"
                >
                  Limpiar Filtros
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  Mostrando {filteredPlayers.length} jugadores
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPlayers.map((player) => (
                  <Link key={player.id} href={`/jugador/${player.id}`}>
                    <Card className="cyber-border group hover:border-primary/50 transition-all cursor-pointer h-full">
                      <CardContent className="p-6">
                        {/* Player Photo */}
                        <div className="relative mb-4">
                          <div className="aspect-square rounded-lg bg-muted overflow-hidden">
                            {player.photo ? (
                              <img
                                src={player.photo}
                                alt={player.name || 'Jugador'}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Users className="w-16 h-16 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          {player.goals !== null && player.goals > 0 && (
                            <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1 border border-border">
                              <span className="text-lg font-bold text-primary">
                                {player.goals}G
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Player Info */}
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                              {player.name || 'Sin nombre'}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {player.team_name || 'Sin equipo'}
                            </p>
                          </div>

                          {/* Badges */}
                          <div className="flex flex-wrap gap-2">
                            {player.position && (
                              <Badge variant="outline" className={`${getPositionBadge(player.position)} border-current text-xs`}>
                                {player.position}
                              </Badge>
                            )}
                            {player.nationality && (
                              <Badge variant="outline" className="border-border text-xs">
                                {player.nationality}
                              </Badge>
                            )}
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">Goles</p>
                              <p className="text-lg font-bold text-primary">{player.goals || 0}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">Asist.</p>
                              <p className="text-lg font-bold text-secondary">{player.assists || 0}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">PJ</p>
                              <p className="text-lg font-bold text-accent">{player.appearances || 0}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <CyberFooter />
    </div>
  );
}
