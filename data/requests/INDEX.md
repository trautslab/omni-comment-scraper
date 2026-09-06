# 🗂️ Catálogo Maestro de Peticiones y Análisis de Ciberseguridad & Arquitectura

Este directorio centraliza las investigaciones técnicas y los informes duales (Técnicos de Ingeniería y Ejecutivos de Negocio) generados mediante el skill **`deep-research-to-dual-report`** y el patrón de grounding **NotebookLM MCP**.

---

## 📑 Índice de Peticiones Registradas

| Petición ID | Tema / Caso de Estudio | Tipo de Origen | Entregable Técnico | Entregable Ejecutivo (HTML/PDF) | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`REQ-001`** | **Arquitectura de Alta Concurrencia y Mitigación de Bots** (Ticketmaster 2022 - 14M solicitudes concurrentes) | Instagram Reel (`@arturo_velazquez_java`) | [Informe Técnico](REQ-001-ticketmaster-alta-concurrencia-y-bots/informe_tecnico_alta_concurrencia_y_bots.md) | [Informe Ejecutivo](REQ-001-ticketmaster-alta-concurrencia-y-bots/informe_ejecutivo_concurrencia_y_bots.html) | `COMPLETADO` |
| **`REQ-002`** | **Brecha de Ciberseguridad en Snowflake** (Ticketmaster 560M registros & Banco Santander 30M registros) | Artículo de Investigación (WIRED / Mandiant) | [Informe Técnico](REQ-002-snowflake-brecha-ciberseguridad-cloud/informe_tecnico_remediacion_snowflake.md) | [Informe Ejecutivo](REQ-002-snowflake-brecha-ciberseguridad-cloud/informe_ejecutivo_vulnerabilidad_cloud.html) | `COMPLETADO` |

---

## 📂 Estructura Estándar por Petición (`REQ-xxx`)

Cada carpeta de petición sigue de forma estricta la estructura:

```text
REQ-xxx-[tema]/
├── source_metadata.json                                # Metadatos de la fuente, autor, engagement y contexto
├── notebooklm_source_pack.md                           # Pack de investigación grounded para Google NotebookLM
├── informe_tecnico_[tema].md                           # Especificación técnica, diagramas y configuraciones
├── informe_ejecutivo_[tema].md                         # Documento de negocio con analogías y hoja de ruta
└── informe_ejecutivo_[tema].html                       # Vista web interactiva print-ready (PDF en 1 clic)
```

---

## 🎯 Acceso Rápido a Informes

### REQ-001: Mitigación de Bots y Alta Concurrencia
- 📦 **NotebookLM Pack:** [notebooklm_source_pack.md](file:///Users/jlorenzor/Documents/omni-comment-scraper/data/requests/REQ-001-ticketmaster-alta-concurrencia-y-bots/notebooklm_source_pack.md)
- ⚡ **Informe Técnico:** [informe_tecnico_alta_concurrencia_y_bots.md](file:///Users/jlorenzor/Documents/omni-comment-scraper/data/requests/REQ-001-ticketmaster-alta-concurrencia-y-bots/informe_tecnico_alta_concurrencia_y_bots.md)
- 🏛️ **Informe Ejecutivo (.md):** [informe_ejecutivo_concurrencia_y_bots.md](file:///Users/jlorenzor/Documents/omni-comment-scraper/data/requests/REQ-001-ticketmaster-alta-concurrencia-y-bots/informe_ejecutivo_concurrencia_y_bots.md)
- 🖨️ **Informe Ejecutivo Print/PDF (.html):** [informe_ejecutivo_concurrencia_y_bots.html](file:///Users/jlorenzor/Documents/omni-comment-scraper/data/requests/REQ-001-ticketmaster-alta-concurrencia-y-bots/informe_ejecutivo_concurrencia_y_bots.html)

### REQ-002: Brecha Snowflake, Ticketmaster y Santander
- 📦 **NotebookLM Pack:** [notebooklm_source_pack.md](file:///Users/jlorenzor/Documents/omni-comment-scraper/data/requests/REQ-002-snowflake-brecha-ciberseguridad-cloud/notebooklm_source_pack.md)
- 🛡️ **Informe Técnico:** [informe_tecnico_remediacion_snowflake.md](file:///Users/jlorenzor/Documents/omni-comment-scraper/data/requests/REQ-002-snowflake-brecha-ciberseguridad-cloud/informe_tecnico_remediacion_snowflake.md)
- 🏛️ **Informe Ejecutivo (.md):** [informe_ejecutivo_vulnerabilidad_cloud.md](file:///Users/jlorenzor/Documents/omni-comment-scraper/data/requests/REQ-002-snowflake-brecha-ciberseguridad-cloud/informe_ejecutivo_vulnerabilidad_cloud.md)
- 🖨️ **Informe Ejecutivo Print/PDF (.html):** [informe_ejecutivo_vulnerabilidad_cloud.html](file:///Users/jlorenzor/Documents/omni-comment-scraper/data/requests/REQ-002-snowflake-brecha-ciberseguridad-cloud/informe_ejecutivo_vulnerabilidad_cloud.html)
