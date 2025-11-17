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
  Users
} from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "wouter";

interface Player {
  id: string;
  name: string;
  team: string;
  position: string;
  nationality: string;
  age: number;
  rating: number;
  goals: number;
  assists: number;
  matches: number;
  marketValue: string;
  image?: string;
}

// Mock data - En producción esto vendría de API-Football
const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'Erling Haaland',
    team: 'Manchester City',
    position: 'DC',
    nationality: 'Noruega',
    age: 23,
    rating: 9.2,
    goals: 27,
    assists: 5,
    matches: 28,
    marketValue: '180M€',
  },
  {
    id: '2',
    name: 'Mohamed Salah',
    team: 'Liverpool',
    position: 'ED',
    nationality: 'Egipto',
    age: 31,
    rating: 8.7,
    goals: 18,
    assists: 12,
    matches: 29,
    marketValue: '65M€',
  },
  {
    id: '3',
    name: 'Kevin De Bruyne',
    team: 'Manchester City',
    position: 'MC',
    nationality: 'Bélgica',
    age: 32,
    rating: 8.9,
    goals: 6,
    assists: 16,
    matches: 24,
    marketValue: '70M€',
  },
  {
    id: '4',
    name: 'Bukayo Saka',
    team: 'Arsenal',
    position: 'ED',
    nationality: 'Inglaterra',
    age: 22,
    rating: 8.4,
    goals: 14,
    assists: 11,
    matches: 30,
    marketValue: '120M€',
  },
  {
    id: '5',
    name: 'Rodri',
    team: 'Manchester City',
    position: 'MCD',
    nationality: 'España',
    age: 27,
    rating: 8.8,
    goals: 5,
    assists: 7,
    matches: 30,
    marketValue: '110M€',
  },
  {
    id: '6',
    name: 'Bruno Fernandes',
    team: 'Manchester United',
    position: 'MC',
    nationality: 'Portugal',
    age: 29,
    rating: 8.3,
    goals: 10,
    assists: 12,
    matches: 30,
    marketValue: '85M€',
  },
  {
    id: '7',
    name: 'Heung-Min Son',
    team: 'Tottenham',
    position: 'EI',
    nationality: 'Corea del Sur',
    age: 31,
    rating: 8.1,
    goals: 15,
    assists: 9,
    matches: 28,
    marketValue: '60M€',
  },
  {
    id: '8',
    name: 'Virgil van Dijk',
    team: 'Liverpool',
    position: 'DFC',
    nationality: 'Países Bajos',
    age: 32,
    rating: 8.5,
    goals: 3,
    assists: 2,
    matches: 29,
    marketValue: '45M€',
  },
];

const teams = ['Todos', ...Array.from(new Set(mockPlayers.map(p => p.team)))];
const positions = ['Todas', 'DC', 'ED', 'EI', 'MC', 'MCD', 'MCO', 'DFC', 'LI', 'LD', 'POR'];
const nationalities = ['Todas', ...Array.from(new Set(mockPlayers.map(p => p.nationality)))];

export default function Jugadores() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("Todos");
  const [selectedPosition, setSelectedPosition] = useState("Todas");
  const [selectedNationality, setSelectedNationality] = useState("Todas");
  const [sortBy, setSortBy] = useState<'rating' | 'goals' | 'assists' | 'name'>('rating');

  const filteredPlayers = useMemo(() => {
    let filtered = mockPlayers;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(player =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Team filter
    if (selectedTeam !== "Todos") {
      filtered = filtered.filter(player => player.team === selectedTeam);
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
          return b.rating - a.rating;
        case 'goals':
          return b.goals - a.goals;
        case 'assists':
          return b.assists - a.assists;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedTeam, selectedPosition, selectedNationality, sortBy]);

  const getRatingColor = (rating: number) => {
    if (rating >= 9) return 'text-primary';
    if (rating >= 8.5) return 'text-secondary';
    if (rating >= 8) return 'text-accent';
    return 'text-muted-foreground';
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
                    <SelectItem key={team} value={team}>{team}</SelectItem>
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
                    <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={(val) => setSortBy(val as any)}>
                <SelectTrigger className="cyber-border-sm">
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="goals">Goles</SelectItem>
                  <SelectItem value="assists">Asistencias</SelectItem>
                  <SelectItem value="name">Nombre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results count */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-mono-cyber text-primary">{filteredPlayers.length}</span> jugadores encontrados
              </p>
              {(searchQuery || selectedTeam !== "Todos" || selectedPosition !== "Todas" || selectedNationality !== "Todas") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTeam("Todos");
                    setSelectedPosition("Todas");
                    setSelectedNationality("Todas");
                  }}
                  className="text-xs"
                >
                  <Filter className="w-3 h-3 mr-1" />
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Players Grid */}
        <div className="container py-12">
          {filteredPlayers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlayers.map((player) => (
                <Card
                  key={player.id}
                  className="cyber-border group hover:border-primary/50 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-heading text-xl text-foreground mb-1">
                          {player.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {player.team}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="cyber-border-sm font-mono-cyber text-xs">
                            {player.position}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {player.nationality}, {player.age} años
                          </span>
                        </div>
                      </div>
                      
                      {/* Rating Badge */}
                      <div className="flex flex-col items-center gap-1 px-4 py-3 bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg border border-border">
                        <Award className="w-5 h-5 text-accent" />
                        <div className={`font-mono-cyber text-2xl font-bold ${getRatingColor(player.rating)}`}>
                          {player.rating.toFixed(1)}
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="p-3 bg-muted/30 rounded-lg text-center">
                        <div className="font-mono-cyber text-xl font-bold text-primary">
                          {player.goals}
                        </div>
                        <div className="text-xs text-muted-foreground">Goles</div>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg text-center">
                        <div className="font-mono-cyber text-xl font-bold text-secondary">
                          {player.assists}
                        </div>
                        <div className="text-xs text-muted-foreground">Asist.</div>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg text-center">
                        <div className="font-mono-cyber text-xl font-bold text-accent">
                          {player.matches}
                        </div>
                        <div className="text-xs text-muted-foreground">PJ</div>
                      </div>
                    </div>

                    {/* Market Value */}
                    <div className="p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg mb-4 text-center border border-primary/20">
                      <div className="text-xs text-muted-foreground mb-1">Valor de Mercado</div>
                      <div className="font-mono-cyber text-lg font-bold text-primary">
                        {player.marketValue}
                      </div>
                    </div>

                    {/* CTA */}
                    <Link href={`/jugador/${player.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full group/btn"
                      >
                        <span className="font-heading text-xs">VER PERFIL COMPLETO</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="font-heading text-xl text-foreground mb-2">
                No se encontraron jugadores
              </h3>
              <p className="text-muted-foreground mb-6">
                Intenta ajustar los filtros de búsqueda
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTeam("Todos");
                  setSelectedPosition("Todas");
                  setSelectedNationality("Todas");
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </main>

      <CyberFooter />
    </div>
  );
}
