# 🗺️ Índice Maestro de Documentación & Trazabilidad (Omni-Comment-Scraper)

Este índice actúa como la **matriz de navegación** para todo el catálogo de arquitectura, casos de uso y diagramas del repositorio `omni-comment-scraper` en `trautslab`.

---

## 🏛️ 1. Arquitectura Global
- [Modelo C4 (Contexto, Contenedores, Componentes)](architecture/c4-model.md)
- [Decisiones de Arquitectura (ADR-0001: Arquitectura Hexagonal con Registro de Adaptadores)](adr/ADR-0001-hexagonal-adapter-architecture.md)

---

## 🎯 2. Matriz de Trazabilidad: Casos de Uso vs Diagramas

| ID Caso de Uso | Título | Dominio | Diagrama Secuencia | Diagrama Actividad | Máquina Estados | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| [`UC-001`](use-cases/UC-001-scrape-post-comments.md) | Scraping Multiplataforma de Comentarios | Scraper Core | [`SEQ-001`](diagrams/sequences/SEQ-001-scraping-flow.md) | [`ACT-001`](diagrams/activities/ACT-001-adapter-resolution.md) | [`STM-001`](diagrams/state-machines/STM-001-scraping-lifecycle.md) | `APPROVED` |

---

## 📊 3. Catálogo de Diagramas por Tipo

### Diagramas de Secuencia (`docs/diagrams/sequences/`)
- [`SEQ-001`](diagrams/sequences/SEQ-001-scraping-flow.md) — Flujo de resolución de URL, extracción de metadatos SSR, invocación de comentarios y exportación.

### Diagramas de Actividad / Flujos (`docs/diagrams/activities/`)
- [`ACT-001`](diagrams/activities/ACT-001-adapter-resolution.md) — Lógica de detección de plataforma, fallback de autenticación y normalización.

### Máquinas de Estados (`docs/diagrams/state-machines/`)
- [`STM-001`](diagrams/state-machines/STM-001-scraping-lifecycle.md) — Ciclo de vida de una tarea de scraping (`PENDING`, `RESOLVING`, `SCRAPING_METADATA`, `SCRAPING_COMMENTS`, `EXPORTED`, `FAILED`).

### Modelo de Datos (`docs/diagrams/entity-relationship/`)
- [`ERD-001`](diagrams/entity-relationship/ERD-001-comment-data-model.md) — Modelo de entidades normalizadas (`Post`, `Author`, `Comment`, `Engagement`).

---

## 📝 4. Especificaciones Técnicas (RFCs)
- [`RFC-001`](specs/RFC-001-omni-comment-scraper.md) — Especificación técnica del motor de scraping omnicanal.
