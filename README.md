# 💬 Omni-Platform Social Comment Scraper (`trautslab`)

Motor unificado, resiliente y extensible en **TypeScript** (Node.js) para la recolección, normalización y análisis de comentarios y metadatos en múltiples plataformas sociales (**Instagram, YouTube, TikTok, Telegram, Facebook y otras**), desarrollado bajo los estándares de arquitectura agéntica y calidad de [**AI-SDLC Framework**](https://github.com/trautslab/ai-sdlc-framework).

---

## 🚀 Características Principales

- **Arquitectura Hexagonal (Ports & Adapters):** Sistema de plugins desacoplado con registro dinámico de adaptadores.
- **Resolución Inteligente de URLs:** Detección instantánea de plataforma a partir de enlaces de Reels, Posts, Shorts, Videos o Canales.
- **Extracción de Metadatos SSR:** Lectura de métricas reales de engagement (Likes, comentarios totales, autor, caption completo) sin autenticación mediante renderizado OpenGraph para crawlers.
- **Manejo Dual de Autenticación:**
  - **Zero-Auth:** Extracción de metadatos y comentarios públicos en plataformas abiertas (YouTube, Telegram, TikTok).
  - **Session-Enabled:** Inyección segura de cookies (`INSTAGRAM_SESSION_ID`) para paginación profunda de hilos de comentarios vía GraphQL.
- **Normalización Integral (`CommentNormalizer`):**
  - Limpieza y sanitización de texto.
  - Extracción automática de menciones (`@usuario`) y hashtags (`#tema`).
  - Detección determinista de sentimiento (`positive`, `neutral`, `negative`).
  - Estandarización de fechas a ISO 8601.
- **Formatos de Exportación:** Salida directa a JSON estructurado y CSV tabular.
- **Observabilidad en Tiempo Real (Mission Control):** Registro de eventos en `.agents/telemetry/events.jsonl` y dashboard visual interactivo en `http://localhost:3333`.

---

## 📦 Instalación Rápida

```bash
# Clonar repositorio
git clone https://github.com/trautslab/omni-comment-scraper.git
cd omni-comment-scraper

# Instalar dependencias
npm install

# Copiar plantilla de variables de entorno
cp .env.example .env
```

---

## 💻 Uso de la Línea de Comandos (CLI)

```bash
# Scraping del post de prueba de Instagram (Ticketmaster Reel)
npm run scrape -- --url https://www.instagram.com/reels/DVw27-9jGJe/ --output ./data/instagram_reel.json

# Scraping de video de YouTube con exportación a CSV
npm run scrape -- --url https://www.youtube.com/watch?v=dQw4w9WgXcQ --format csv --output ./data/youtube.csv

# Scraping de canal de Telegram
npm run scrape -- --url https://t.me/durov/123 --format json
```

---

## 🧪 Pruebas y Evaluación Agéntica

El proyecto incluye una suite completa de pruebas unitarias, verificación de tipos estricta y el arnés de evaluación de **AI-SDLC**:

```bash
# Ejecutar verificación estricta de tipos
npm run typecheck

# Ejecutar suite de pruebas unitarias e integración (18 tests)
npm test

# Ejecutar Eval Harness automatizado (10/10 checks)
npm run eval:task

# Ejecutar demostración en vivo con emisión de telemetría
npm run demo:live

# Levantar panel visual de observabilidad (Mission Control)
npm run dashboard
```

---

## 🏛️ Matriz de Gobernanza AI-SDLC

| Documento | Ubicación | Descripción |
| :--- | :--- | :--- |
| **Índice Maestro** | [`docs/INDEX.md`](docs/INDEX.md) | Matriz completa de trazabilidad y casos de uso. |
| **Modelo C4** | [`docs/architecture/c4-model.md`](docs/architecture/c4-model.md) | Contexto, contenedores y componentes del sistema. |
| **ADR-0001** | [`docs/adr/ADR-0001-hexagonal-adapter-architecture.md`](docs/adr/ADR-0001-hexagonal-adapter-architecture.md) | Decisión de arquitectura hexagonal y adaptadores. |
| **Caso de Uso** | [`docs/use-cases/UC-001-scrape-post-comments.md`](docs/use-cases/UC-001-scrape-post-comments.md) | Especificación formal del flujo de scraping. |
| **Diagramas Mermaid** | [`docs/diagrams/`](docs/diagrams/) | Secuencias, actividades, máquinas de estado y modelo ER. |
| **Contrato de Tarea** | [`.agents/tasks/TASK-001-core-comment-scraper.md`](.agents/tasks/TASK-001-core-comment-scraper.md) | Contrato de implementación y aceptación. |

---

## 📄 Licencia
Distribuido bajo la Licencia MIT. Desarrollado con ❤️ por **TrautsLab**.
