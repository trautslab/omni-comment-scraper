# 📋 Catálogo Maestro de Contratos de Tareas (.agents/tasks/)

Este registro mantiene la lista exhaustiva de todos los contratos de tareas agénticas desarrollados bajo el framework AI-SDLC.

---

## 🎯 Registro de Tareas

| ID de Tarea | Título de la Tarea | Dominio | Estado | Archivo de Contrato |
| :--- | :--- | :--- | :--- | :--- |
| `TASK-001` | Motor Central de Scraping Multiplataforma y Adaptadores | Scraper Core | `COMPLETED` | [`TASK-001-core-comment-scraper.md`](TASK-001-core-comment-scraper.md) |
| `TASK-002` | Bóveda Dinámica de Sesiones, Generador NotebookLM y Minería de Comentarios Expertos | Knowledge Lab | `COMPLETED` | [`TASK-002-dynamic-sessions-and-knowledge-lab.md`](TASK-002-dynamic-sessions-and-knowledge-lab.md) |

---

## 🔒 Regla de Invarianza de Correlativos
- Toda nueva tarea debe incrementar estrictamente el correlativo (`TASK-001`, `TASK-002`, `TASK-003`, etc.).
- La unicidad y consistencia se valida automáticamente mediante `npm run validate:tasks`.
