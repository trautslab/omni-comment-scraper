# [TASK-001] Motor Central de Scraping Multiplataforma y Adaptadores de Redes Sociales

**ID:** `TASK-001`  
**Prioridad:** `CRITICAL`  
**Caso de Uso / RFC Asociado:** [`docs/specs/RFC-001-omni-comment-scraper.md`](../../docs/specs/RFC-001-omni-comment-scraper.md)  
**Asignado a:** Antigravity / Principal Software Engineer  
**Branch:** `main`  

---

## 🎯 1. Objetivo & Contexto
Construir la arquitectura base y los adaptadores de scraping para comentarios y metadatos de múltiples plataformas sociales (Instagram, Facebook, YouTube, TikTok, Telegram y extensible a otras), soportando extracción con o sin autenticación, normalización uniforme de comentarios y exportación en formatos JSON/CSV con gobernanza AI-SDLC.

## 🚫 2. Fuera de Alcance (Non-Goals)
- Almacenamiento distribuido en cluster Kafka / Redshift (fase posterior).
- Bypass forzado o vulneración de firewalls de Meta mediante cracking o proxies ilegales (se utiliza gestión legítima de sesiones).

## 🛡️ 3. Invariantes Específicos de la Tarea
- Cumplir estrictamente con [`.agents/rules/invariants.md`](../rules/invariants.md).
- Cero credenciales hardcodeadas (uso exclusivo de variables de entorno tipadas).
- Cobertura de tests del 100% sobre los módulos de dominio y resolución de plataformas.
- Emisión de telemetría para observabilidad en tiempo real.

## ✅ 4. Criterios de Aceptación (Definición de Terminado)
- [x] Implementar contratos y puertos en `src/core/ports.ts` y `src/core/types.ts`.
- [x] Implementar registro dinámico de adaptadores en `src/core/registry.ts`.
- [x] Implementar `InstagramAdapter` con validación real sobre el Reel `https://www.instagram.com/reels/DVw27-9jGJe/`.
- [x] Implementar adaptadores para YouTube, TikTok, Telegram y Facebook.
- [x] Implementar normalizador con detección de sentimiento, menciones y hashtags.
- [x] Implementar exportadores JSON y CSV.
- [x] Implementar CLI interactivo con soporte de opciones (`--url`, `--limit`, `--format`, `--output`).
- [x] Pasar suite de tests `npm test` al 100%.
- [x] Pasar Eval Harness `node evals/harness.mjs --task task-001` con 10/10 checks.

## 🧪 5. Comando de Evaluación (Eval Harness)
```bash
node evals/harness.mjs --task task-001
```
