import { Link } from "wouter";
import { APP_LOGO } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export function CyberHeader() {
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      window.location.href = "/";
    },
  });

  const navItems = [
    { label: "PORTADA", href: "/" },
    { label: "JORNADAS", href: "/jornadas" },
    { label: "JUGADORES", href: "/jugadores" },
    { label: "RUMORES", href: "/rumores" },
    { label: "FICHAJES", href: "/fichajes" },
    { label: "PLANES", href: "/planes" },
  ];

  const premiumNavItems = [
    { label: "RADAR LATINO", href: "/radar-latino", tier: "PRO" },
    { label: "TALENTO IBÉRICO", href: "/talento-iberico", tier: "PRO" },
  ];

  const userTier = user?.subscriptionTier || "FREE";
  const canAccessPremium = userTier === "PRO" || userTier === "PREMIUM";

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      {/* Top decorative line */}
      <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
      
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-3 group">
              <img 
                src={APP_LOGO} 
                alt="La Furia Premier" 
                className="h-10 w-auto transition-transform group-hover:scale-105"
              />
              <div className="hidden md:flex flex-col">
                <span className="font-heading text-lg leading-none text-foreground">
                  LA FURIA
                </span>
                <span className="font-heading text-sm leading-none text-primary">
                  PREMIER
                </span>
              </div>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a className="relative px-4 py-2 font-heading text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors group">
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </a>
              </Link>
            ))}
            
            {canAccessPremium && (
              <>
                <div className="w-px h-6 bg-border mx-2" />
                {premiumNavItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <a className="relative px-4 py-2 font-heading text-sm tracking-wide text-accent hover:text-secondary transition-colors group">
                      {item.label}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
                    </a>
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* User Menu */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-foreground">
                    {user?.name || "Usuario"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {userTier}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => logoutMutation.mutate()}
                  className="cyber-border"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => window.location.href = getLoginUrl()}
                className="cyber-glow-red font-heading tracking-wide"
              >
                <User className="w-4 h-4 mr-2" />
                ACCEDER
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a 
                    className="block px-4 py-2 font-heading text-sm tracking-wide text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
              
              {canAccessPremium && (
                <>
                  <div className="h-px bg-border my-2" />
                  {premiumNavItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <a 
                        className="block px-4 py-2 font-heading text-sm tracking-wide text-accent hover:text-secondary hover:bg-muted/50 rounded transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </a>
                    </Link>
                  ))}
                </>
              )}
              
              <div className="h-px bg-border my-2" />
              
              {isAuthenticated ? (
                <div className="px-4 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {user?.name || "Usuario"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Plan: {userTier}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      logoutMutation.mutate();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <div className="px-4 py-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      window.location.href = getLoginUrl();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    <User className="w-4 h-4 mr-2" />
                    ACCEDER
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
      
      {/* Bottom decorative line */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </header>
  );
}
