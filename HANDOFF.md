# Project State & Handoff (Omni-Platform Comment Scraper)

**Última Actualización:** 2026-09-05 18:00 (UTC-5)  
**Versión Actual:** `v0.1.0`  
**Rama Activa:** `main`  
**Repositorio GitHub:** `https://github.com/trautslab/omni-comment-scraper`  

---

## 📍 1. Estado de la Sesión (Dónde quedamos)
- [x] Scaffolding integral del framework AI-SDLC (Gobernanza, Contratos, Observabilidad).
- [x] Arquitectura Hexagonal con Registro Dinámico de Adaptadores (`src/core/registry.ts`).
- [x] Adaptadores funcionales implementados: Instagram, YouTube, TikTok, Telegram, Facebook.
- [x] Ensayo y validación real sobre el Reel de Instagram [https://www.instagram.com/reels/DVw27-9jGJe/](https://www.instagram.com/reels/DVw27-9jGJe/):
  - Extracción exitosa de metadatos SSR: Autor (`Arturo Velazquez`), Engagement (`47,000 likes`, `501 comentarios`), caption completo y advertencia estructurada de autenticación para comentarios.
- [x] Normalizador uniforme (`CommentNormalizer`) con limpieza de texto, detección de sentimiento, extracción de menciones y hashtags.
- [x] Exportadores probados para JSON y CSV.
- [x] Suite de 18 pruebas unitarias y de integración pasando al 100%.
- [x] Harness de evaluación `evals/harness.mjs --task task-001` con 10/10 checks superados.
- [x] Script `npm run demo:live` ejecutado con éxito y telemetría registrada.

---

## ⚠️ 2. Gotchas, Trampas & Bloqueadores
- **Instagram Comments Auth**: Instagram exige cookies de sesión activas (`sessionid`) para acceder al hilo de comentarios vía GraphQL. Los metadatos de alto nivel y métricas se extraen sin login utilizando el User-Agent de crawler (`facebookexternalhit/1.1`).
- **YouTube API Quotas**: La extracción pública básica funciona sin credenciales, pero para hilos extensos de miles de comentarios se recomienda configurar `YOUTUBE_API_KEY`.
- **Facebook Group/Private Posts**: Posts protegidos requieren cookies (`c_user`, `xs`) o token de página de Meta.

---

## 🧪 3. Comandos Rápidos de Verificación
```bash
# 1. Typecheck estricto
npm run typecheck

# 2. Pruebas unitarias e integración (18 tests)
npm test

# 3. Eval Harness AI-SDLC
npm run eval:task

# 4. Demostración en vivo
npm run demo:live

# 5. Dashboard de observabilidad
npm run dashboard
```

---

## 🎯 4. Próximos 3 Pasos Inmediatos
1. Agregar soporte para almacenamiento relacional/SQLite o DuckDB para persistencia local de comentarios analizados.
2. Añadir soporte para adaptadores de Reddit y X (Twitter).
3. Conectar pipelines de enriquecimiento con LLMs para clasificación avanzada de tópicos y respuestas sugeridas.
