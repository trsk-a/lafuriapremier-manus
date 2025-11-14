# TODO - La Furia Premier v2

## Fase 1: Configuración Inicial y Diseño Base
- [x] Configurar paleta de colores cyberpunk en index.css
- [x] Configurar tipografías (Oswald, Roboto, Roboto Mono)
- [x] Crear componentes base de diseño cyberpunk
- [x] Implementar layout principal con header cyberpunk
- [x] Crear footer con diseño futurista

## Fase 2: Sistema de Autenticación y Suscripciones
- [x] Extender schema de usuarios con campos de suscripción
- [x] Crear tabla de suscripciones (FREE/PRO/PREMIUM)
- [x] Implementar middleware de protección de rutas por tier
- [ ] Crear página de planes y precios
- [ ] Implementar sistema de upgrade/downgrade

## Fase 3: Integración API-Football
- [x] Configurar variables de entorno para API-Football
- [x] Crear helpers de API en server/lib/apiFootball.ts
- [x] Implementar endpoint para próximo partido
- [x] Implementar endpoint para partido en vivo (con stats y lineups)
- [x] Implementar endpoint para jornadas
- [x] Crear sistema de cache inteligente

## Fase 4: Páginas Principales
- [x] Homepage con hero de partido en vivo
- [x] Sección de locutores (Ruso, Inge, Míster)
- [x] Feed de noticias con diseño cyberpunk
- [ ] Página de partido en vivo con tabs (eventos/lineups/stats)
- [ ] Página de jornadas con calendario
- [ ] Página de rumores
- [ ] Página de fichajes

## Fase 5: Contenido Premium
- [ ] Página de Radar Latino (PRO+)
- [ ] Página de Talento Ibérico (PRO+)
- [ ] Página de detalle de jugador con stats avanzadas (PRO+)
- [ ] Sección de análisis táctico premium (PRO+)
- [ ] Contenido exclusivo PREMIUM

## Fase 6: Sistema de Newsletter
- [ ] Crear tabla de suscriptores de newsletter
- [ ] Implementar formulario de suscripción
- [ ] Crear templates de email por tier (FREE/PRO/PREMIUM)
- [ ] Integrar con n8n para envío automatizado
- [ ] Implementar segmentación por nivel de suscripción
- [ ] Crear panel de gestión de newsletters (admin)

## Fase 7: Componentes Visuales Cyberpunk
- [ ] Componente de tarjeta de noticia con estilo Greg Capullo
- [ ] Componente de estadísticas HUD style
- [ ] Componente de player card cyberpunk
- [ ] Componente de match header con efectos neón
- [ ] Animaciones y efectos (glitch, glow, scan lines)
- [ ] Componente de timeline de eventos

## Fase 8: Funcionalidades Adicionales
- [ ] Sistema de búsqueda de jugadores
- [ ] Filtros y ordenamiento de noticias
- [ ] Sistema de favoritos (equipos/jugadores)
- [ ] Notificaciones en tiempo real para partidos
- [ ] Modo oscuro/claro (opcional)

## Fase 9: Optimización y Testing
- [ ] Optimizar carga de imágenes
- [ ] Implementar lazy loading
- [ ] Optimizar bundle size
- [ ] Testing de componentes críticos
- [ ] Testing de endpoints de API
- [ ] Verificar accesibilidad (WCAG AA)

## Fase 10: Deployment
- [ ] Configurar variables de entorno en Vercel
- [ ] Crear repositorio en GitHub
- [ ] Configurar CI/CD
- [ ] Deploy a producción
- [ ] Configurar dominio personalizado
- [ ] Monitoreo y analytics

## Bugs Corregidos del Proyecto Original
- [x] Estadísticas de partidos no se cargan (endpoint implementado)
- [x] Alineaciones de partidos no se cargan (endpoint implementado)
- [x] Sistema de suscripciones funcional (backend listo, falta UI)
- [ ] Newsletter implementada y funcional

## Ajustes de Diseño Solicitados
- [x] Cambiar paleta de colores: quitar fucsia/magenta, agregar anaranjado
- [x] Mantener azul cyan actual (no usar azul dato del manual)
- [x] Actualizar todos los componentes con la nueva paleta

## Mejoras de UI Solicitadas
- [x] Rediseñar MatchHero como banner rojo compacto (estilo card)
- [x] Implementar carrusel cuando haya múltiples partidos
- [x] Mantener diseño horizontal con logos, marcador y fecha

## Desarrollo de Página de Jornadas
- [x] Crear página de jornadas con selector de jornada
- [x] Mostrar todos los partidos de la jornada seleccionada
- [x] Diseño de tarjetas de partido con estado (próximo/en vivo/finalizado)
- [x] Navegación entre jornadas (anterior/siguiente)
- [x] Indicador visual de jornada actual

## Desarrollo de Página de Detalle de Partido
- [x] Crear página de partido individual (/partido/[id])
- [x] Implementar tabs de navegación (Resumen/Eventos/Alineaciones/Estadísticas)
- [x] Tab Resumen: marcador, estado, venue, árbitro
- [x] Tab Eventos: timeline de goles, tarjetas, sustituciones en tiempo real
- [x] Tab Alineaciones: formación visual con posiciones de jugadores
- [x] Tab Estadísticas: gráficos comparativos HUD (posesión, tiros, pases, etc.)
- [x] Diseño cyberpunk con efectos visuales
- [x] Actualización automática para partidos en vivo
