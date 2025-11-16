import { useState } from "react";
import { CyberHeader } from "@/components/cyber/CyberHeader";
import { CyberFooter } from "@/components/cyber/CyberFooter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Zap, 
  Crown, 
  Shield,
  TrendingUp,
  Users,
  BarChart3,
  Lock
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getLoginUrl } from "@/const";

type SubscriptionTier = 'FREE' | 'PRO' | 'PREMIUM';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  tier: SubscriptionTier;
  name: string;
  price: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: PlanFeature[];
  popular?: boolean;
}

const plans: Plan[] = [
  {
    tier: 'FREE',
    name: 'Free',
    price: 'Gratis',
    description: 'Acceso básico a contenido de La Furia Premier',
    icon: <Shield className="w-8 h-8" />,
    color: 'text-muted-foreground',
    features: [
      { text: 'Partidos en vivo con marcadores', included: true },
      { text: 'Calendario de jornadas', included: true },
      { text: 'Noticias y rumores básicos', included: true },
      { text: 'Acceso a locutores', included: true },
      { text: 'Estadísticas detalladas', included: false },
      { text: 'Alineaciones y formaciones', included: false },
      { text: 'Análisis táctico premium', included: false },
      { text: 'Radar Latino y Talento Ibérico', included: false },
      { text: 'Newsletter semanal', included: false },
    ],
  },
  {
    tier: 'PRO',
    name: 'Pro',
    price: '4.99€/mes',
    description: 'Análisis profundo y contenido exclusivo',
    icon: <Zap className="w-8 h-8" />,
    color: 'text-secondary',
    popular: true,
    features: [
      { text: 'Todo lo de Free', included: true },
      { text: 'Estadísticas detalladas de partidos', included: true },
      { text: 'Alineaciones y formaciones', included: true },
      { text: 'Eventos en tiempo real', included: true },
      { text: 'Newsletter semanal personalizada', included: true },
      { text: 'Acceso a Radar Latino', included: true },
      { text: 'Análisis táctico premium', included: false },
      { text: 'Talento Ibérico completo', included: false },
      { text: 'Contenido exclusivo de locutores', included: false },
    ],
  },
  {
    tier: 'PREMIUM',
    name: 'Premium',
    price: '9.99€/mes',
    description: 'Experiencia completa sin límites',
    icon: <Crown className="w-8 h-8" />,
    color: 'text-accent',
    features: [
      { text: 'Todo lo de Pro', included: true },
      { text: 'Análisis táctico premium completo', included: true },
      { text: 'Talento Ibérico con datos avanzados', included: true },
      { text: 'Contenido exclusivo de locutores', included: true },
      { text: 'Newsletter diaria personalizada', included: true },
      { text: 'Acceso anticipado a nuevas features', included: true },
      { text: 'Sin publicidad', included: true },
      { text: 'Soporte prioritario', included: true },
      { text: 'Badge exclusivo en la comunidad', included: true },
    ],
  },
];

export default function Planes() {
  const { user, isAuthenticated } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const utils = trpc.useUtils();
  
  const upgradeMutation = trpc.subscription.upgrade.useMutation({
    onSuccess: () => {
      toast.success('¡Plan actualizado correctamente!');
      setShowConfirmDialog(false);
      utils.auth.me.invalidate();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar el plan');
    },
  });

  const downgradeMutation = trpc.subscription.downgrade.useMutation({
    onSuccess: () => {
      toast.success('Plan actualizado correctamente');
      setShowConfirmDialog(false);
      utils.auth.me.invalidate();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al cambiar el plan');
    },
  });

  const handleSelectPlan = (tier: SubscriptionTier) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    if (user?.subscriptionTier === tier) {
      toast.info('Ya tienes este plan activo');
      return;
    }

    setSelectedPlan(tier);
    setShowConfirmDialog(true);
  };

  const handleConfirmChange = () => {
    if (!selectedPlan) return;

    const currentTier = user?.subscriptionTier || 'FREE';
    const tierOrder: Record<SubscriptionTier, number> = { FREE: 0, PRO: 1, PREMIUM: 2 };

    if (tierOrder[selectedPlan] > tierOrder[currentTier as SubscriptionTier]) {
      // Upgrade
      upgradeMutation.mutate({ newTier: selectedPlan });
    } else {
      // Downgrade
      downgradeMutation.mutate({ newTier: selectedPlan });
    }
  };

  const getSelectedPlanDetails = () => {
    return plans.find(p => p.tier === selectedPlan);
  };

  const isCurrentPlan = (tier: SubscriptionTier) => {
    return user?.subscriptionTier === tier;
  };

  const isUpgrade = (tier: SubscriptionTier) => {
    const currentTier = user?.subscriptionTier || 'FREE';
    const tierOrder: Record<SubscriptionTier, number> = { FREE: 0, PRO: 1, PREMIUM: 2 };
    return tierOrder[tier] > tierOrder[currentTier as SubscriptionTier];
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CyberHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 border-b border-primary/30">
          <div className="cyber-scan-lines absolute inset-0 opacity-20" />
          <div className="container py-16 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="mb-4 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
                PLANES Y PRECIOS
              </Badge>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-4">
                ELIGE TU <span className="text-secondary">PLAN</span>
              </h1>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Accede a análisis exclusivos, estadísticas avanzadas y contenido premium de La Furia Premier
              </p>
              {isAuthenticated && user && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-background/20 backdrop-blur-sm rounded-lg border border-primary-foreground/20">
                  <Users className="w-4 h-4 text-primary-foreground" />
                  <span className="text-sm text-primary-foreground">
                    Plan actual: <span className="font-heading">{user.subscriptionTier}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="container py-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const isCurrent = isCurrentPlan(plan.tier);
              const isUpgradePlan = isUpgrade(plan.tier);

              return (
                <Card 
                  key={plan.tier}
                  className={`cyber-border relative ${
                    plan.popular ? 'border-secondary shadow-lg shadow-secondary/20' : ''
                  } ${isCurrent ? 'ring-2 ring-primary' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-secondary text-secondary-foreground border-secondary">
                        MÁS POPULAR
                      </Badge>
                    </div>
                  )}
                  
                  {isCurrent && (
                    <div className="absolute -top-4 right-4">
                      <Badge className="bg-primary text-primary-foreground">
                        PLAN ACTUAL
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-8">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center ${plan.color}`}>
                      {plan.icon}
                    </div>
                    <CardTitle className="font-heading text-2xl mb-2">
                      {plan.name}
                    </CardTitle>
                    <div className="font-mono-cyber text-4xl font-bold mb-2">
                      {plan.price}
                    </div>
                    <CardDescription className="text-sm">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Features List */}
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div 
                          key={index}
                          className={`flex items-start gap-3 ${
                            !feature.included ? 'opacity-40' : ''
                          }`}
                        >
                          {feature.included ? (
                            <Check className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                          ) : (
                            <Lock className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                          )}
                          <span className="text-sm">{feature.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Button
                      className="w-full font-heading"
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                      onClick={() => handleSelectPlan(plan.tier)}
                      disabled={isCurrent || upgradeMutation.isPending || downgradeMutation.isPending}
                    >
                      {!isAuthenticated && 'Iniciar Sesión'}
                      {isAuthenticated && isCurrent && 'Plan Actual'}
                      {isAuthenticated && !isCurrent && isUpgradePlan && 'Mejorar Plan'}
                      {isAuthenticated && !isCurrent && !isUpgradePlan && 'Cambiar Plan'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Additional Info */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="cyber-border">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-secondary mx-auto mb-3" />
                  <h3 className="font-heading text-lg mb-2">Actualiza cuando quieras</h3>
                  <p className="text-sm text-muted-foreground">
                    Cambia de plan en cualquier momento sin penalizaciones
                  </p>
                </CardContent>
              </Card>

              <Card className="cyber-border">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="w-8 h-8 text-secondary mx-auto mb-3" />
                  <h3 className="font-heading text-lg mb-2">Datos en tiempo real</h3>
                  <p className="text-sm text-muted-foreground">
                    Estadísticas actualizadas al instante durante los partidos
                  </p>
                </CardContent>
              </Card>

              <Card className="cyber-border">
                <CardContent className="p-6 text-center">
                  <Shield className="w-8 h-8 text-secondary mx-auto mb-3" />
                  <h3 className="font-heading text-lg mb-2">Pago seguro</h3>
                  <p className="text-sm text-muted-foreground">
                    Transacciones protegidas y datos encriptados
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">
              Confirmar cambio de plan
            </DialogTitle>
            <DialogDescription>
              {selectedPlan && getSelectedPlanDetails() && (
                <div className="space-y-4 mt-4">
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                    <div className={`w-12 h-12 rounded-full bg-background flex items-center justify-center ${getSelectedPlanDetails()?.color}`}>
                      {getSelectedPlanDetails()?.icon}
                    </div>
                    <div>
                      <div className="font-heading text-lg text-foreground">
                        Plan {getSelectedPlanDetails()?.name}
                      </div>
                      <div className="font-mono-cyber text-sm text-muted-foreground">
                        {getSelectedPlanDetails()?.price}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {isUpgrade(selectedPlan) 
                      ? 'Vas a mejorar tu plan. Tendrás acceso inmediato a todas las funcionalidades premium.'
                      : 'Vas a cambiar a un plan inferior. Perderás acceso a algunas funcionalidades premium.'}
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={upgradeMutation.isPending || downgradeMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmChange}
              disabled={upgradeMutation.isPending || downgradeMutation.isPending}
            >
              {upgradeMutation.isPending || downgradeMutation.isPending ? 'Procesando...' : 'Confirmar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CyberFooter />
    </div>
  );
}
