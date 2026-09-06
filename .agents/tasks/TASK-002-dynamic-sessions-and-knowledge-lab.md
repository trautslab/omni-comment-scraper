# [TASK-002] Bóveda Dinámica de Sesiones, Generador NotebookLM y Minería de Comentarios Expertos

**ID:** `TASK-002`  
**Prioridad:** `CRITICAL`  
**Caso de Uso / RFC Asociado:** [`docs/specs/RFC-002-knowledge-lab-and-session-vault.md`](../../docs/specs/RFC-002-knowledge-lab-and-session-vault.md)  
**Asignado a:** Antigravity / Principal Software Engineer  
**Branch:** `main`  

---

## 🎯 1. Objetivo & Contexto
Transformar el motor de scraping en un laboratorio interactivo de conocimiento que resuelva la captura dinámica de sesiones para Instagram, TikTok y Facebook desde una UI moderna, genere paquetes de estudio verificados estilo NotebookLM (con fact-checking de RFCs y mejoras SOTA) y extraiga inteligencia de comentarios técnicos de expertos.

## 🚫 2. Fuera de Alcance (Non-Goals)
- Almacenamiento en nube de contraseñas en texto plano (las cookies se guardan localmente en `.sessions/vault.json`).
- Cracking de firewalls o bypass de biometría.

## 🛡️ 3. Invariantes Específicos de la Tarea
- Cumplir estrictamente con [`.agents/rules/invariants.md`](../rules/invariants.md).
- Cero credenciales hardcodeadas en git.
- 100% de aserciones pasando en el arnés de evaluación `node evals/harness.mjs --task task-002`.

## ✅ 4. Criterios de Aceptación (Definición de Terminado)
- [x] Implementar `SessionVault` con persistencia en disco, parseo de cookies y health check contra APIs.
- [x] Implementar `KnowledgeSynthesizer` con auditoría de afirmaciones contra RFCs (RFC 6585, Cloudflare, Redis, NIST), mejoras SOTA (eBPF, Passkeys) y flashcards.
- [x] Implementar `ExpertCommentMiner` con filtro de ruido, puntuación de profundidad técnica y catálogo de tecnologías.
- [x] Implementar API REST en `scripts/serve-dashboard.ts` (`/api/sessions`, `/api/knowledge/synthesize`, `/api/comments/mine`, `/api/scrape`).
- [x] Diseñar UI visual en `observability/index.html` con 5 pestañas: Scraping, Session Vault, Knowledge Lab, Comentarios Expertos y Telemetría.
- [x] Suite de 22 tests unitarios pasando al 100%.
- [x] Eval Harness `task-002.json` completado con 8/8 checks superados.

## 🧪 5. Comando de Evaluación (Eval Harness)
```bash
node evals/harness.mjs --task task-002
```
