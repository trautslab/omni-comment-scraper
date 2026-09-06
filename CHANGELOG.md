# Changelog

Todas las modificaciones notables a este proyecto se documentarán en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

### Added
- **TASK-002: Bóveda Dinámica de Sesiones (`SessionVault`)**:
  - Almacenamiento seguro local en `.sessions/vault.json` para Instagram, TikTok, Facebook y YouTube.
  - Parseo automático de strings de cookies, verificación de salud en tiempo real contra APIs oficiales y lanzamiento de navegador interactivo.
  - Integración transparente en `InstagramAdapter` para extracción profunda de comentarios sin intervención manual.
- **TASK-002: Motor de Síntesis y Fact-Checking NotebookLM (`KnowledgeSynthesizer`)**:
  - Auditoría técnica de afirmaciones de posts contra especificaciones IETF (RFC 6585), Cloudflare Waiting Room, Redis y NIST.
  - Generación de propuestas de arquitectura SOTA (eBPF/XDP, Passkeys WebAuthn/FIDO2).
  - Creación de paquetes de estudio `.md` con flashcards listos para Google NotebookLM.
- **TASK-002: Minería de Comentarios Expertos e Inteligencia Comunitaria (`ExpertCommentMiner`)**:
  - Filtro de ruido y scoring de profundidad técnica (0-100).
  - Detección de herramientas citadas por la comunidad (Envoy, eBPF, Redis, FIDO2, Kafka) y casos límite de producción.
  - Apéndice automático integrado en la fuente de estudio.
- **TASK-002: Dashboard y Servidor Visual Renovado (`observability/index.html` & `scripts/serve-dashboard.ts`)**:
  - 5 pestañas interactivas: Explorador & Scraping en Vivo, Session Vault, Knowledge Lab, Minería de Comentarios y Telemetría SSE.
  - API REST local con endpoints para sesiones, scraping, síntesis y minería.
- **TASK-001: Motor Central de Scraping Multiplataforma y Adaptadores**:
  - Scaffolding completo AI-SDLC para la organización `trautslab`.
  - Arquitectura Hexagonal con adaptadores para Instagram, YouTube, TikTok, Telegram y Facebook.
  - Normalizador de comentarios, exportadores JSON/CSV, CLI, y suite de tests.
