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
- [x] Crear página de planes y precios
- [x] Implementar sistema de upgrade/downgrade

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
- [x] Página de partido en vivo con tabs (eventos/lineups/stats)
- [x] Página de jornadas con calendario
- [x] Página de rumores
- [x] Página de fichajes

## Fase 5: Contenido Premium
- [x] Página de Radar Latino (PRO+)
- [x] Página de Talento Ibérico (PRO+)
- [x] Página de detalle de jugador con stats avanzadas (PRO+)
- [x] Sección de análisis táctico premium (PRO+)
- [x] Contenido exclusivo PREMIUM

## Fase 6: Sistema de Newsletter
- [x] Crear tabla de suscriptores de newsletter
- [x] Implementar formulario de suscripción
- [ ] Crear templates de email por tier (FREE/PRO/PREMIUM)
- [ ] Integrar con n8n para envío automatizado
- [x] Implementar segmentación por nivel de suscripción
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
- [x] Sistema de suscripciones funcional (completamente implementado)
- [x] Newsletter implementada y funcional

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

## Desarrollo de Planes y Precios (Fase 2)
- [x] Crear página de planes (/planes) con diseño cyberpunk
- [x] Mostrar 3 tiers: FREE, PRO, PREMIUM con características diferenciadas
- [x] Implementar procedimiento tRPC para upgrade de suscripción
- [x] Implementar procedimiento tRPC para downgrade de suscripción
- [x] Agregar validación de tier actual vs tier solicitado
- [x] Crear componente de confirmación de cambio de plan
- [x] Actualizar header para mostrar plan actual del usuario
- [x] Agregar badges de contenido premium en secciones restringidas

## Desarrollo de Página de Rumores
- [x] Crear página de rumores (/rumores) con diseño cyberpunk
- [x] Mostrar lista de rumores con categorías (fichajes, renovaciones, salidas)
- [x] Diseño de tarjetas de rumor con nivel de confiabilidad
- [x] Filtros por equipo, posición y estado
- [x] Indicador visual de "nivel de calor" del rumor
- [x] Integración con sistema de artículos para contenido detallado

## Desarrollo de Radar Latino (Premium)
- [x] Crear página de Radar Latino (/radar-latino) con diseño cyberpunk
- [x] Implementar control de acceso (solo PRO/PREMIUM)
- [x] Mostrar lista de jugadores latinos destacados
- [x] Tarjetas de jugador con estadísticas clave
- [x] Filtros por país, equipo, posición
- [x] Badge de contenido premium visible
- [x] Mensaje de upgrade para usuarios FREE

## Desarrollo de Talento Ibérico (Premium)
- [x] Crear página de Talento Ibérico (/talento-iberico) con diseño cyberpunk
- [x] Implementar control de acceso (solo PRO/PREMIUM)
- [x] Mostrar lista de jugadores españoles y portugueses
- [x] Tarjetas con análisis detallado y métricas avanzadas
- [x] Comparativas entre jugadores
- [x] Sistema de ranking
- [x] Integración con datos de API-Football

## Implementación de Newsletter Funcional
- [x] Crear procedimiento tRPC para suscripción a newsletter
- [x] Validar formato de email y prevenir duplicados
- [x] Asignar tier automáticamente según usuario autenticado
- [x] Implementar componente de formulario en Home
- [x] Agregar toast de confirmación de suscripción
- [x] Crear endpoint para gestionar suscripciones (unsub)
- [x] Preparar estructura para integración con servicio de envío

## Desarrollo de Página de Jugadores
- [x] Crear página de jugadores (/jugadores) con diseño cyberpunk
- [x] Implementar buscador en tiempo real por nombre
- [x] Filtros múltiples: equipo, posición, nacionalidad, edad
- [x] Ordenamiento por: nombre, rating, goles, asistencias, valor
- [x] Grid de tarjetas de jugador con estadísticas clave
- [x] Paginación o scroll infinito
- [x] Integración con datos de API-Football
- [x] Link a perfil detallado de cada jugador

## Desarrollo de Perfil de Jugador
- [x] Crear página de perfil de jugador (/jugador/[id]) con diseño cyberpunk
- [x] Header con foto, nombre, equipo, posición, rating
- [x] Sección de estadísticas generales (goles, asistencias, minutos, tarjetas)
- [x] Gráfico de rendimiento temporal (rating por jornada)
- [x] Estadísticas avanzadas (tiros, pases, duelos, regates)
- [x] Historial de partidos recientes con rendimiento
- [x] Información personal (edad, nacionalidad, altura, peso, pie preferido)
- [x] Valor de mercado y evolución
- [x] Integración con datos de API-Football

## Desarrollo de Panel de Administración
- [x] Crear layout de admin con sidebar de navegación
- [x] Proteger rutas de admin (solo usuarios con role='admin')
- [x] Dashboard principal con métricas y estadísticas
- [ ] Gestión de artículos (crear, editar, eliminar, listar)
- [ ] Gestión de rumores (crear, editar, eliminar, listar)
- [ ] Gestión de fichajes (crear, editar, eliminar, listar)
- [ ] Gestión de jugadores (crear, editar, eliminar, listar)
- [x] Gestión de suscriptores de newsletter (listar, exportar CSV)
- [ ] Editor de contenido con markdown o WYSIWYG
- [ ] Sistema de categorización y tags
- [ ] Programación de publicaciones (fecha de publicación futura)
- [ ] Control de acceso por tier (FREE/PRO/PREMIUM)
- [ ] Subida de imágenes para artículos

## Desarrollo de Análisis Táctico Premium
- [x] Crear página de Análisis Táctico (/analisis-tactico) con diseño cyberpunk
- [x] Implementar control de acceso (solo PRO/PREMIUM)
- [x] Lista de análisis tácticos de partidos recientes
- [x] Página de detalle de análisis con visualizaciones
- [x] Diagramas de formaciones y movimientos
- [x] Mapas de calor de jugadores
- [x] Análisis de patrones ofensivos y defensivos
- [x] Comparativas tácticas entre equipos
- [x] Sistema de filtros por equipo y jornada
- [x] Badge de contenido PREMIUM visible

## Ajustes de Navegación
- [x] Agregar link de Análisis Táctico al header principal
