# UC-004: Minería de Inteligencia Comunitaria y Comentarios Expertos

- **ID:** `UC-004`
- **Nombre:** Detección de Señal y Extracción de Comentarios Expertos
- **Actor Primario:** Usuario / Investigador de Arquitectura
- **Precondiciones:** Colección de comentarios de una publicación disponible.

---

## 1. Flujo Principal
1. El sistema o usuario envía un conjunto de comentarios a `POST /api/comments/mine`.
2. `ExpertCommentMiner` filtra los comentarios de bajo valor (emojis aislados, elogios genéricos).
3. Evalúa la profundidad técnica de cada comentario analizando terminología de ingeniería, complejidad sintáctica y longitud.
4. Identifica herramientas y tecnologías citadas por la comunidad (Envoy, eBPF, Redis, FIDO2, etc.).
5. Clasifica los comentarios en categorías: `TOOL_RECOMMENDATION`, `EDGE_CASE_WARNING`, `ALTERNATIVE_ARCHITECTURE`, `COMMUNITY_DEBATE`.
6. Genera un reporte de inteligencia comunitaria con temas de estudio sugeridos y apéndice en Markdown.
7. Los hallazgos se integran automáticamente al paquete de estudio del post.
