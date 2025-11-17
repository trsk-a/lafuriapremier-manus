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

## Ajustes de Panel de Admin
- [x] Agregar link visible al panel de admin en el header para usuarios admin
- [x] Verificar que el owner tenga automáticamente role='admin'

## FASE 11: Migración a Supabase y Sistema de Moderación

### Configuración de Supabase
- [x] Solicitar credenciales de Supabase al usuario (SUPABASE_URL, SUPABASE_ANON_KEY, DATABASE_URL)
- [x] Configurar variables de entorno de Supabase en el proyecto
- [ ] Actualizar configuración de Drizzle para PostgreSQL
- [ ] Documentar proceso de migración de schema a Supabase

### Sistema de Estados de Publicación
- [ ] Agregar campo `status` (enum: draft/pending/published) a tabla articles
- [ ] Agregar campo `status` a tabla rumores
- [ ] Agregar campo `status` a tabla fichajes
- [ ] Agregar campo `status` a tabla tacticalAnalysis
- [ ] Agregar campo `moderatedBy` (userId) y `moderatedAt` (timestamp) a todas las tablas de contenido
- [ ] Migrar schema actualizado a Supabase

### Routers y Lógica de Negocio
- [ ] Actualizar router de articles para filtrar solo status='published' en queries públicas
- [ ] Actualizar router de rumores para filtrar solo status='published' en queries públicas
- [ ] Actualizar router de fichajes para filtrar solo status='published' en queries públicas
- [ ] Crear procedimientos admin para listar contenido pendiente de moderación
- [ ] Crear procedimientos admin para aprobar/rechazar/editar contenido

### Panel de Administración - Moderación
- [ ] Crear página /admin/moderation con tabs para cada tipo de contenido
- [ ] Implementar tabla de artículos pendientes con filtros por status
- [ ] Implementar tabla de rumores pendientes con filtros por status
- [ ] Implementar tabla de fichajes pendientes con filtros por status
- [ ] Implementar tabla de análisis tácticos pendientes con filtros por status
- [ ] Agregar badges visuales de estado (draft=gris, pending=amarillo, published=verde)
- [ ] Agregar acciones rápidas: Aprobar, Rechazar, Editar

### Panel de Administración - CRUD de Artículos
- [ ] Crear página /admin/articles con listado completo
- [ ] Implementar formulario de creación de artículo
- [ ] Implementar formulario de edición de artículo
- [ ] Agregar editor markdown con preview en tiempo real
- [ ] Implementar subida de imagen destacada a S3
- [ ] Agregar sistema de tags/categorías
- [ ] Implementar selector de tier (FREE/PRO/PREMIUM)
- [ ] Agregar campo de autor y fecha de publicación
- [ ] Implementar eliminación de artículos con confirmación

### Panel de Administración - CRUD de Rumores
- [ ] Crear página /admin/rumores con listado completo
- [ ] Implementar formulario de creación de rumor
- [ ] Implementar formulario de edición de rumor
- [ ] Agregar selector de categoría (fichaje/renovación/salida)
- [ ] Agregar selector de confiabilidad (1-5 estrellas)
- [ ] Agregar selector de "heat level" (frío/tibio/caliente)
- [ ] Implementar eliminación de rumores con confirmación

### Panel de Administración - CRUD de Fichajes
- [ ] Crear página /admin/fichajes con listado completo
- [ ] Implementar formulario de creación de fichaje
- [ ] Implementar formulario de edición de fichaje
- [ ] Agregar campos: jugador, equipoOrigen, equipoDestino, monto, tipo
- [ ] Agregar selector de estado (rumor/confirmado/oficial)
- [ ] Implementar eliminación de fichajes con confirmación

### Actualización de Páginas Públicas
- [ ] Actualizar página Home para mostrar solo artículos published
- [ ] Actualizar página Rumores para mostrar solo rumores published
- [ ] Actualizar página Fichajes para mostrar solo fichajes published
- [ ] Actualizar página Análisis Táctico para mostrar solo análisis published
- [ ] Agregar mensaje informativo cuando no hay contenido publicado

### Testing y Documentación
- [ ] Probar flujo completo: contenido automático → moderación → publicación
- [ ] Verificar que contenido draft/pending no sea visible públicamente
- [ ] Documentar proceso de conexión de automatizaciones a Supabase
- [ ] Crear guía de uso del panel de moderación


## PROGRESO FASE 11 - Completado

### ✅ Tareas Completadas
- [x] Conexión exitosa con Supabase a través de MCP
- [x] Creado enum `content_status` (draft/pending/published) en Supabase
- [x] Agregado campo `status` a tabla `noticias` con default 'pending'
- [x] Agregado campo `status` a tabla `rumores` con default 'pending'
- [x] Agregados campos `moderated_by` y `moderated_at` para tracking
- [x] Creados índices para optimizar consultas por status
- [x] Creado helper `supabase-db.ts` con funciones CRUD para noticias y rumores
- [x] Implementados routers tRPC de moderación (solo admin)
- [x] Implementados routers tRPC públicos (solo contenido published)
- [x] Creada página `/admin/moderacion` con tabs para Noticias y Rumores
- [x] Implementada tabla de contenido pendiente con acciones
- [x] Implementados modales de edición y visualización
- [x] Implementadas acciones: Aprobar, Rechazar, Editar, Eliminar
- [x] Agregadas estadísticas de moderación en dashboard
- [x] Agregada ruta en App.tsx

### 📝 Notas Importantes
- El contenido insertado automáticamente en Supabase tendrá `status='pending'` por default
- Solo el contenido con `status='published'` se mostrará en las páginas públicas
- Los administradores pueden editar el contenido antes de aprobarlo
- El sistema registra quién y cuándo moderó cada pieza de contenido


## FASE 7 EN DESARROLLO: Componentes Visuales Cyberpunk

### Componentes Base y Efectos Visuales
- [x] Crear componente GlitchText con efecto de glitch animado
- [x] Crear componente NeonBorder con efectos de neón pulsante
- [x] Crear componente ScanLines para overlay de líneas de escaneo
- [x] Crear componente CyberGrid con grid futurista de fondo
- [ ] Agregar utilidades CSS para efectos cyberpunk reutilizables

### Animaciones y Efectos Neón
- [x] Implementar animación de glitch en títulos principales
- [x] Crear efecto de neón pulsante en bordes de tarjetas
- [x] Implementar efecto de "data stream" en fondos
- [x] Crear animación de "hologram flicker" para imágenes
- [x] Agregar efecto de "scan line" en secciones importantes

### Tarjetas Estilo Greg Capullo
- [x] Crear PlayerCard con diseño dramático y sombras intensas
- [x] Crear NewsCard con composición dinámica y contraste alto
- [x] Crear RumorCard con efectos de urgencia visual
- [x] Crear MatchCard con diseño épico y energético
- [x] Implementar sistema de badges y etiquetas visuales

### Componentes HUD y Estadísticas
- [x] Crear StatsHUD con visualización tipo interfaz de videojuego
- [ ] Crear ProgressBar con efectos neón y animaciones
- [ ] Crear RadarChart cyberpunk para estadísticas de jugadores
- [ ] Crear Timeline con diseño futurista para eventos de partido
- [ ] Crear MetricDisplay con números animados y efectos

### Integración en Páginas
- [ ] Actualizar Home con nuevos componentes visuales
- [ ] Actualizar página de Partido con componentes HUD
- [ ] Actualizar página de Jugador con PlayerCard mejorada
- [ ] Actualizar página de Rumores con efectos visuales
- [ ] Actualizar página de Jornadas con diseño mejorado


## FASE 8 EN DESARROLLO: Funcionalidades Adicionales

### Sistema de Búsqueda Global
- [ ] Crear componente SearchBar con input y botón de búsqueda
- [ ] Implementar autocompletado con sugerencias mientras se escribe
- [ ] Crear endpoint tRPC para búsqueda en noticias, rumores y jugadores
- [ ] Implementar página de resultados de búsqueda con tabs
- [ ] Agregar historial de búsquedas recientes (localStorage)
- [ ] Implementar búsqueda por voz (opcional)

### Filtros Avanzados
- [ ] Crear componente FilterPanel con múltiples criterios
- [ ] Implementar filtro por categoría/tipo de contenido
- [ ] Implementar filtro por equipo (select con logos)
- [ ] Implementar filtro por jugador (autocomplete)
- [ ] Implementar filtro por rango de fechas (date picker)
- [ ] Implementar filtro por nivel de fiabilidad (rumores)
- [ ] Agregar botón "Limpiar filtros" y contador de filtros activos
- [ ] Persistir filtros seleccionados en URL (query params)

### Sistema de Favoritos
- [ ] Crear tabla favorites en Supabase (user_id, content_type, content_id)
- [ ] Implementar endpoints tRPC para agregar/quitar favoritos
- [ ] Crear componente FavoriteButton con animación
- [ ] Agregar indicador de favorito en tarjetas de contenido
- [ ] Crear página /favoritos con contenido guardado
- [ ] Implementar tabs en favoritos (Noticias, Rumores, Jugadores)
- [ ] Agregar contador de favoritos en perfil de usuario

### Notificaciones en Tiempo Real
- [ ] Configurar sistema de notificaciones push (opcional)
- [ ] Crear componente NotificationBell con badge de contador
- [ ] Implementar dropdown de notificaciones recientes
- [ ] Crear endpoints para marcar notificaciones como leídas
- [ ] Agregar notificaciones para: nuevo contenido, rumores calientes, fichajes confirmados
- [ ] Implementar preferencias de notificaciones en configuración de usuario
- [ ] Agregar sonido/vibración para notificaciones importantes (opcional)

### Integración y Optimización
- [ ] Integrar SearchBar en CyberHeader
- [ ] Integrar FilterPanel en páginas de Noticias y Rumores
- [ ] Integrar FavoriteButton en todas las tarjetas de contenido
- [ ] Integrar NotificationBell en CyberHeader
- [ ] Optimizar queries de búsqueda y filtros (índices en DB)
- [ ] Implementar debounce en búsqueda para reducir requests
- [ ] Agregar loading states y skeleton loaders
- [ ] Testing de funcionalidades en diferentes dispositivos
