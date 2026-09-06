# UC-003: Síntesis de Conocimiento y Generador de NotebookLM Pack

- **ID:** `UC-003`
- **Nombre:** Síntesis de Conocimiento, Fact-Checking y Exportación NotebookLM
- **Actor Primario:** Usuario / Sistema Automatizado / Agente IA
- **Precondiciones:** Post extraído exitosamente con metadatos y caption.

---

## 1. Flujo Principal
1. Tras completar la ingestión de un post en el **Explorador**, el usuario presiona *"Enviar a Knowledge Lab"*.
2. El backend invoca a `KnowledgeSynthesizer.synthesize(metadata)`.
3. El motor detecta el dominio técnico y extrae las afirmaciones y tesis centrales del autor.
4. Contrasta cada afirmación contra especificaciones oficiales e IETF RFCs (ej. RFC 6585, Cloudflare, Redis, NIST SP 800-63B), asignando un veredicto (`VERIFIED`, `PARTIALLY_ACCURATE`, `NEEDS_CAVEAT`).
5. Genera propuestas de mejora de arquitectura State-of-the-Art (eBPF, Passkeys, PoW).
6. Construye un set de flashcards / preguntas de comprensión de ingeniería.
7. La UI renderiza la tabla interactiva de verificación y las mejoras.
8. El usuario presiona *"Descargar Pack NotebookLM (.md)"* y obtiene un archivo listo para subir a Google NotebookLM.
