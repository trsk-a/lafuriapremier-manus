import { useState } from "react";
import { CyberHeader } from "@/components/cyber/CyberHeader";
import { CyberFooter } from "@/components/cyber/CyberFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  Calendar,
  DollarSign,
  Filter
} from "lucide-react";

type TransferType = 'entrada' | 'salida' | 'prestamo' | 'todos';
type TransferStatus = 'confirmado' | 'rumor' | 'negociacion';

interface Transfer {
  id: string;
  playerName: string;
  position: string;
  fromTeam: string;
  toTeam: string;
  type: Exclude<TransferType, 'todos'>;
  status: TransferStatus;
  fee?: string;
  date: Date;
  contractLength?: string;
}

export default function Fichajes() {
  const [selectedType, setSelectedType] = useState<TransferType>('todos');
  const [selectedStatus, setSelectedStatus] = useState<TransferStatus | 'todos'>('todos');

  // Mock data para demostración
  const mockTransfers: Transfer[] = [
    {
      id: '1',
      playerName: 'Enzo Fernández',
      position: 'MC',
      fromTeam: 'Benfica',
      toTeam: 'Chelsea',
      type: 'entrada',
      status: 'confirmado',
      fee: '121M€',
      date: new Date('2025-01-15'),
      contractLength: '8 años',
    },
    {
      id: '2',
      playerName: 'Jude Bellingham',
      position: 'MC',
      fromTeam: 'Borussia Dortmund',
      toTeam: 'Real Madrid',
      type: 'salida',
      status: 'confirmado',
      fee: '103M€',
      date: new Date('2025-01-10'),
      contractLength: '6 años',
    },
    {
      id: '3',
      playerName: 'Mason Mount',
      position: 'MC',
      fromTeam: 'Chelsea',
      toTeam: 'Manchester United',
      type: 'entrada',
      status: 'negociacion',
      fee: '60M€',
      date: new Date('2025-01-12'),
    },
    {
      id: '4',
      playerName: 'Matheus Nunes',
      position: 'MC',
      fromTeam: 'Wolverhampton',
      toTeam: 'Manchester City',
      type: 'prestamo',
      status: 'confirmado',
      fee: 'Préstamo',
      date: new Date('2025-01-08'),
      contractLength: '6 meses',
    },
  ];

  const typeFilters = [
    { value: 'todos' as TransferType, label: 'TODOS', icon: ArrowRightLeft },
    { value: 'entrada' as TransferType, label: 'ENTRADAS', icon: TrendingUp },
    { value: 'salida' as TransferType, label: 'SALIDAS', icon: TrendingDown },
    { value: 'prestamo' as TransferType, label: 'PRÉSTAMOS', icon: ArrowRightLeft },
  ];

  const statusFilters = [
    { value: 'todos' as const, label: 'TODOS' },
    { value: 'confirmado' as TransferStatus, label: 'CONFIRMADOS' },
    { value: 'negociacion' as TransferStatus, label: 'EN NEGOCIACIÓN' },
    { value: 'rumor' as TransferStatus, label: 'RUMORES' },
  ];

  const getStatusColor = (status: TransferStatus) => {
    switch (status) {
      case 'confirmado':
        return 'bg-secondary/20 text-secondary border-secondary/30';
      case 'negociacion':
        return 'bg-accent/20 text-accent border-accent/30';
      case 'rumor':
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusLabel = (status: TransferStatus) => {
    switch (status) {
      case 'confirmado':
        return 'CONFIRMADO';
      case 'negociacion':
        return 'EN NEGOCIACIÓN';
      case 'rumor':
        return 'RUMOR';
    }
  };

  const getTypeIcon = (type: Exclude<TransferType, 'todos'>) => {
    switch (type) {
      case 'entrada':
        return <TrendingUp className="w-5 h-5 text-secondary" />;
      case 'salida':
        return <TrendingDown className="w-5 h-5 text-primary" />;
      case 'prestamo':
        return <ArrowRightLeft className="w-5 h-5 text-accent" />;
    }
  };

  const filteredTransfers = mockTransfers.filter(transfer => {
    const typeMatch = selectedType === 'todos' || transfer.type === selectedType;
    const statusMatch = selectedStatus === 'todos' || transfer.status === selectedStatus;
    return typeMatch && statusMatch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CyberHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-secondary via-secondary/90 to-secondary/80 border-b border-secondary/30 relative overflow-hidden">
          <div className="cyber-scan-lines absolute inset-0 opacity-20" />
          <div className="container py-16 relative z-10">
            <div className="max-w-4xl">
              <Badge className="mb-4 bg-secondary-foreground/20 text-secondary-foreground border-secondary-foreground/30">
                <ArrowRightLeft className="w-3 h-3 mr-1" />
                FICHAJES Y TRANSFERENCIAS
              </Badge>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-secondary-foreground mb-4">
                MERCADO DE <span className="text-primary">FICHAJES</span>
              </h1>
              <p className="text-lg text-secondary-foreground/80 max-w-2xl">
                Todos los movimientos confirmados y rumores del mercado de transferencias de la Premier League
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="border-b border-border bg-card/50 sticky top-16 z-40 backdrop-blur-sm">
          <div className="container py-4 space-y-4">
            {/* Type Filters */}
            <div className="flex items-center gap-4 overflow-x-auto">
              <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
                <Filter className="w-4 h-4" />
                <span className="font-heading">TIPO:</span>
              </div>
              <div className="flex gap-2">
                {typeFilters.map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <Button
                      key={filter.value}
                      variant={selectedType === filter.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(filter.value)}
                      className="font-heading text-xs whitespace-nowrap"
                    >
                      <Icon className="w-3 h-3 mr-1" />
                      {filter.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Status Filters */}
            <div className="flex items-center gap-4 overflow-x-auto">
              <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
                <span className="font-heading">ESTADO:</span>
              </div>
              <div className="flex gap-2">
                {statusFilters.map((filter) => (
                  <Button
                    key={filter.value}
                    variant={selectedStatus === filter.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus(filter.value)}
                    className="font-heading text-xs whitespace-nowrap"
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Transfers List */}
        <div className="container py-12">
          <div className="grid gap-4 max-w-5xl mx-auto">
            {filteredTransfers.length === 0 ? (
              <Card className="cyber-border">
                <CardContent className="p-12 text-center">
                  <ArrowRightLeft className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No hay fichajes en esta categoría
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredTransfers.map((transfer) => (
                <Card 
                  key={transfer.id}
                  className="cyber-border group hover:border-secondary/50 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      {/* Type Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                          {getTypeIcon(transfer.type)}
                        </div>
                      </div>

                      {/* Player Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-heading text-2xl text-foreground">
                            {transfer.playerName}
                          </h3>
                          <Badge variant="outline" className="cyber-border-sm font-mono-cyber">
                            {transfer.position}
                          </Badge>
                          <Badge className={getStatusColor(transfer.status)}>
                            {getStatusLabel(transfer.status)}
                          </Badge>
                        </div>

                        {/* Transfer Route */}
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          <span className="font-medium text-foreground">{transfer.fromTeam}</span>
                          <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-secondary">{transfer.toTeam}</span>
                        </div>

                        {/* Details */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          {transfer.fee && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              <span className="font-mono-cyber text-foreground font-medium">
                                {transfer.fee}
                              </span>
                            </div>
                          )}
                          {transfer.contractLength && (
                            <div>
                              Contrato: <span className="text-foreground">{transfer.contractLength}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(transfer.date).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Load More */}
          {filteredTransfers.length > 0 && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                size="lg"
                className="cyber-border font-heading"
              >
                CARGAR MÁS FICHAJES
              </Button>
            </div>
          )}
        </div>
      </main>

      <CyberFooter />
    </div>
  );
}
