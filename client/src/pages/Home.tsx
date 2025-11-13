import { trpc } from "@/lib/trpc";
import { CyberHeader } from "@/components/cyber/CyberHeader";
import { CyberFooter } from "@/components/cyber/CyberFooter";
import { MatchHero } from "@/components/cyber/MatchHero";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, TrendingUp, Users, Target } from "lucide-react";

export default function Home() {
  const { data: todaysMatches, isLoading: matchLoading } = trpc.matches.todaysMatches.useQuery();
  const { data: articles, isLoading: articlesLoading } = trpc.articles.list.useQuery({
    limit: 6,
  });

  const locutores = [
    {
      id: "ruso",
      name: "EL RUSO",
      title: "Análisis Táctico",
      description: "Desglosa cada jugada con precisión quirúrgica",
      image: "/locutores/ruso.jpg",
      color: "from-primary to-primary/50",
      icon: Target,
    },
    {
      id: "inge",
      name: "EL INGE",
      title: "El xG y las Métricas",
      description: "Los números no mienten, descubre la verdad detrás del juego",
      image: "/locutores/inge.jpg",
      color: "from-secondary to-secondary/50",
      icon: TrendingUp,
    },
    {
      id: "mister",
      name: "EL MÍSTER",
      title: "Trucos y Estrategia",
      description: "Secretos del banquillo que cambian partidos",
      image: "/locutores/mister.jpg",
      color: "from-accent to-accent/50",
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <CyberHeader />

      <main className="flex-1">
        {/* Hero Section - Match */}
        <MatchHero matches={todaysMatches ?? null} isLoading={matchLoading} />

        {/* Locutores Section */}
        <section className="py-16 bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <h2 className="font-heading text-3xl md:text-4xl text-center mb-12 text-foreground">
              NUESTROS{" "}
              <span className="text-primary cyber-text-glow">LOCUTORES</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {locutores.map((locutor) => {
                const Icon = locutor.icon;
                return (
                  <Link key={locutor.id} href={`/locutor/${locutor.id}`}>
                    <a className="group">
                      <Card className="overflow-hidden border-border hover:border-primary transition-all duration-300 cyber-border h-full">
                        <div className={`h-2 bg-gradient-to-r ${locutor.color}`} />
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border group-hover:border-primary transition-colors">
                              <img
                                src={locutor.image}
                                alt={locutor.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-heading text-xl text-foreground mb-1">
                                {locutor.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {locutor.title}
                              </p>
                            </div>
                            <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            {locutor.description}
                          </p>
                          <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
                            <span className="text-sm font-heading tracking-wide">
                              VER CONTENIDO
                            </span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Latest News Section */}
        <section className="py-16 bg-background">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-3xl md:text-4xl text-foreground">
                ÚLTIMAS{" "}
                <span className="text-secondary cyber-text-glow">NOTICIAS</span>
              </h2>
              <Link href="/noticias">
                <a className="flex items-center gap-2 text-primary hover:text-secondary transition-colors">
                  <span className="font-heading text-sm tracking-wide">
                    VER TODAS
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Link>
            </div>

            {articlesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden animate-pulse">
                    <div className="h-48 bg-muted" />
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded mb-2" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : articles && articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <Link key={article.id} href={`/articulo/${article.slug}`}>
                    <a className="group">
                      <Card className="overflow-hidden border-border hover:border-secondary transition-all duration-300 cyber-border h-full">
                        {article.featuredImage && (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={article.featuredImage}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
                            {article.accessTier !== "FREE" && (
                              <div className="absolute top-2 right-2 px-3 py-1 bg-accent/90 backdrop-blur-sm rounded-full">
                                <span className="text-xs font-heading tracking-wide text-accent-foreground">
                                  {article.accessTier}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-heading tracking-wide text-primary">
                              {article.category.toUpperCase()}
                            </span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              {article.authorName || article.author}
                            </span>
                          </div>
                          <h3 className="font-heading text-lg text-foreground mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
                            {article.title}
                          </h3>
                          {article.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                              {article.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-secondary group-hover:gap-3 transition-all">
                            <span className="text-sm font-heading tracking-wide">
                              LEER MÁS
                            </span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No hay noticias disponibles en este momento
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-y border-border">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-heading text-3xl md:text-5xl text-foreground mb-4">
                SUSCRÍBETE A LA{" "}
                <span className="text-primary cyber-text-glow">NEWSLETTER</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Recibe análisis exclusivos, estadísticas avanzadas y contenido premium directamente en tu correo
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full sm:w-96 px-6 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
                <Button
                  size="lg"
                  className="w-full sm:w-auto cyber-glow-red font-heading tracking-wide"
                >
                  SUSCRIBIRME
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Contenido diferenciado según tu plan: FREE, PRO o PREMIUM
              </p>
            </div>
          </div>
        </section>
      </main>

      <CyberFooter />
    </div>
  );
}
