# Changelog

Todas las modificaciones notables a este proyecto se documentarán en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

### Added
- Scaffolding completo del proyecto bajo el estándar **AI-SDLC Framework** para la organización `trautslab`.
- Arquitectura Hexagonal con puertos (`PlatformAdapter`, `CommentExporter`) y registro dinámico de adaptadores (`AdapterRegistry`).
- Adaptador para **Instagram** (`InstagramAdapter`) con soporte de extracción SSR para Reels/Posts y GraphQL para hilos con sesión.
- Adaptadores iniciales para **YouTube**, **TikTok**, **Telegram** y **Facebook**.
- Módulo de normalización unificado (`CommentNormalizer`) con sanitización, extracción de hashtags, menciones, timestamps ISO 8601 y análisis de sentimiento.
- Exportadores estructurados para formatos JSON (`JsonExporter`) y CSV tabular (`CsvExporter`).
- Interfaz de línea de comandos (`src/cli/index.ts`) con soporte de flags `--url`, `--limit`, `--format`, `--output` y `--session`.
- Demostración en vivo (`scripts/demo-live.ts`) probada con el Reel objetivo `https://www.instagram.com/reels/DVw27-9jGJe/`.
- Harness de evaluación automatizada (`evals/harness.mjs --task task-001`) con 10 checks deterministas al 100%.
- Suite de 18 pruebas unitarias y de integración (`npm test`) pasando al 100%.
- Matriz completa de documentación C4, ADRs, Casos de Uso, Diagramas Mermaid y RFC en `docs/`.
