# ADR-0002: Bóveda Dinámica de Sesiones y Motor de Síntesis para NotebookLM

- **Estado:** ACEPTADO
- **Fecha:** 2026-09-05
- **Autor:** Principal Software Engineer (TrautsLab)
- **Alcance:** Gestión de autenticación interactiva y generación de conocimiento.

---

## 1. Contexto y Problema
Las redes sociales contemporáneas imponen barreras estrictas de inicio de sesión para la lectura de comentarios y algoritmos anti-scraping sofisticados. Además, recopilar únicamente texto plano resulta insuficiente para investigadores que buscan contrastar la veracidad técnica de los posts y aprovechar debates entre ingenieros experimentados en la sección de comentarios.

## 2. Decisión Tomada
1. **Session Vault Local y Desacoplado**: Se establece una bóveda (`SessionVault`) en `.sessions/vault.json` con soporte para verificación de salud contra las APIs oficiales de cada red social y apertura interactiva de navegador.
2. **Motor de Fact-Checking y Grounding**: `KnowledgeSynthesizer` evalúa las afirmaciones técnicas de cada post contra especificaciones formales (RFC 6585, Cloudflare, NIST, Redis) y genera fuentes con formato nativo para Google NotebookLM.
3. **Minería de Comentarios Expertos**: `ExpertCommentMiner` filtra el ruido superficial y extrae herramientas y casos límite de producción compartidos por la comunidad, cerrando el bucle de retroalimentación de la investigación.

## 3. Consecuencias
- **Positivas:**
  - El usuario puede investigar cualquier post y generar material educativo riguroso en segundos sin salir de la UI.
  - Las credenciales nunca se transmiten a servidores externos ni se versionan en Git.
  - El contenido de la comunidad enriquece sustancialmente el post original.
