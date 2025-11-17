import { Link } from "wouter";
import { APP_LOGO } from "@/const";

export function CyberFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    contenido: [
      { label: "Noticias", href: "/noticias" },
      { label: "Rumores", href: "/rumores" },
      { label: "Fichajes", href: "/fichajes" },
      { label: "Jornadas", href: "/jornadas" },
    ],
    premium: [
      { label: "Radar Latino", href: "/radar-latino" },
      { label: "Talento Ibérico", href: "/talento-iberico" },
      { label: "Análisis Táctico", href: "/analisis-tactico" },
      { label: "Planes", href: "/planes" },
    ],
    locutor: [
      { label: "El Ruso", href: "/locutor/ruso" },
      { label: "El Inge", href: "/locutor/inge" },
      { label: "El Míster", href: "/locutor/mister" },
    ],
    legal: [
      { label: "Política de Privacidad", href: "/privacidad" },
      { label: "Términos de Uso", href: "/terminos" },
      { label: "Contacto", href: "/contacto" },
    ],
  };

  return (
    <footer className="bg-card border-t border-border mt-20">
      {/* Top decorative line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/">
              <a className="inline-block mb-4">
                <img 
                  src={APP_LOGO} 
                  alt="La Furia Premier" 
                  className="h-12 w-auto"
                />
              </a>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Tu fuente definitiva de análisis, datos y cobertura de la Premier League.
            </p>
            <div className="flex gap-3">
              {/* Social icons placeholder */}
              <a 
                href="https://twitter.com/lafuriapremier" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-muted hover:bg-primary transition-colors flex items-center justify-center"
              >
                <span className="text-xs font-bold">X</span>
              </a>
              <a 
                href="https://instagram.com/lafuriapremier" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-muted hover:bg-primary transition-colors flex items-center justify-center"
              >
                <span className="text-xs font-bold">IG</span>
              </a>
              <a 
                href="https://youtube.com/@lafuriapremier" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-muted hover:bg-primary transition-colors flex items-center justify-center"
              >
                <span className="text-xs font-bold">YT</span>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-heading text-sm tracking-wide text-foreground mb-4">
              CONTENIDO
            </h3>
            <ul className="space-y-2">
              {footerLinks.contenido.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm tracking-wide text-foreground mb-4">
              PREMIUM
            </h3>
            <ul className="space-y-2">
              {footerLinks.premium.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-sm text-muted-foreground hover:text-accent transition-colors">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm tracking-wide text-foreground mb-4">
              LOCUTORES
            </h3>
            <ul className="space-y-2">
              {footerLinks.locutor.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-sm text-muted-foreground hover:text-secondary transition-colors">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm tracking-wide text-foreground mb-4">
              LEGAL
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} La Furia Premier. Todos los derechos reservados.
            </p>
            <p className="text-xs text-muted-foreground">
              Diseñado con{" "}
              <span className="text-primary">⚡</span>
              {" "}para los fanáticos de la Premier League
            </p>
          </div>
        </div>
      </div>

      {/* Bottom decorative line */}          <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent" />  </footer>
  );
}
