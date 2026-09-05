# RFC-001: Especificación Técnica del Motor Omni-Platform Comment Scraper

- **Autor:** Principal Software Engineer (TrautsLab)
- **Fecha:** 2026-09-05
- **Estado:** APPROVED
- **Implementación:** `TASK-001`

---

## 1. Resumen Ejecutivo
Diseño y especificación de un motor unificado y extensible en TypeScript (Node.js) para la recolección, normalización y exportación de comentarios desde redes sociales líderes (**Instagram, YouTube, TikTok, Telegram, Facebook** y plataformas adicionales mediante plugins).

## 2. Requerimientos Funcionales (FR)
- **FR-1:** Resolución automática de la red social a partir del patrón de URL (Reel, Post, Short, Video, Canal).
- **FR-2:** Extracción de metadatos de alto nivel (autor, métricas de engagement, fecha, descripción, miniaturas) sin exigir inicio de sesión siempre que la plataforma ofrezca renderizado OpenGraph / SSR.
- **FR-3:** Soporte dual para comentarios:
  - Modo público: descarga de comentarios para plataformas abiertas (YouTube, Telegram web preview, TikTok).
  - Modo sesión: inyección segura de cookies (`sessionid` en Instagram, `c_user`/`xs` en Facebook) para consultar GraphQL sin bloqueos.
- **FR-4:** Normalización determinista:
  - Formateo de fechas a ISO 8601.
  - Limpieza de saltos de línea y espacios en blanco redundantes.
  - Extracción automática de menciones (`@usuario`) y hashtags (`#etiqueta`).
  - Detección heurística de sentimiento (`positive`, `neutral`, `negative`).
- **FR-5:** Exportación a JSON y CSV compatible con herramientas de análisis de datos (Pandas, DuckDB, Excel).

## 3. Requerimientos No Funcionales (NFR)
- **NFR-1 (Seguridad):** Invariante estricto: cero secretos en el repositorio. Todo token proviene de `.env` o flags de línea de comandos.
- **NFR-2 (Resiliencia):** Timeouts controlados (default 10 segundos) y manejo de cancelaciones mediante `AbortController`.
- **NFR-3 (Observabilidad):** Emisión de telemetría agéntica a `.agents/telemetry/events.jsonl` con visualización en `http://localhost:3333`.
- **NFR-4 (Calidad de Código):** 100% de tipos tipados estrictamente (`noImplicitAny`, `strictNullChecks`), suite de tests ejecutables y 100% en el harness de evaluación.
