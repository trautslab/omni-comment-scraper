# UC-001: Scraping Multiplataforma de Comentarios y Metadatos

- **ID:** `UC-001`
- **Nombre:** Scraping y Normalización de Comentarios
- **Actor Primario:** Usuario / Sistema Automatizado / Agente IA
- **Precondiciones:** URL de publicación válida proporcionada por el usuario.

---

## 1. Flujo Principal (Éxito)
1. El usuario invoca el scraper pasando una URL objetivo (`node src/cli/index.ts --url <URL> --format json`).
2. El sistema consulta a `AdapterRegistry` para resolver el adaptador correspondiente.
3. El adaptador extrae los metadatos de la publicación (autor, likes, comentarios registrados, título/descripción y URLs multimedia).
4. Si la plataforma permite acceso a comentarios (con o sin autenticación), el adaptador descarga y pagine los hilos de comentarios.
5. El sistema procesa cada comentario a través de `CommentNormalizer`, extrayendo menciones (`@`), hashtags (`#`) y puntuando el sentimiento.
6. El exportador seleccionado (`JsonExporter` o `CsvExporter`) serializa la respuesta.
7. Se emite un evento de observabilidad al bus de telemetría y se presenta el resultado.

## 2. Flujos Alternativos y Excepcionales
- **2a. Plataforma exige sesión (ej. Instagram sin cookies):**
  - El sistema extrae exitosamente los metadatos públicos y devuelve el estado `requiresAuthForComments: true` junto con el mensaje explicativo `authNotice` sin fallar.
- **2b. URL no soportada:**
  - El sistema detecta que ningún adaptador puede manejar la URL y emite un error con la lista de plataformas admitidas.
