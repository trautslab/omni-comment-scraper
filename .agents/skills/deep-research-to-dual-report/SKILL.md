---
name: deep-research-to-dual-report
description: >-
  Executes an end-to-end research, grounding, and dual-reporting pipeline from any technical incident,
  architecture URL, or security advisory. Employs the NotebookLM MCP grounding pattern to synthesize primary
  sources, then produces both a rigorous Technical Remediation Specification and an accessible, print-ready
  Executive Business Report with full coverage of happy path, edge cases, alternatives, and negative cases.
---

# 🔬 Deep Research to Dual Report: Pipeline de Investigación Grounded e Informes Duales

Este skill guía al agente a través del pipeline integral de análisis técnico profundo, fundamentación pericial mediante el patrón de **Google NotebookLM (MCP)** y generación de **doble entregable (Informe Técnico de Ingeniería + Informe Ejecutivo y Funcional print-ready)** a partir de cualquier enlace, noticia de ciberseguridad, incidente o diseño de arquitectura.

---

## 🎯 1. Principios Rectores y Estándares Inviolables

1. **Agnosticismo Editorial y Confidencialidad Absoluta:**
   - Los informes entregados a los interesados **NUNCA** deben mencionar herramientas internas, prompts, frameworks privados, scrapers o nombres de proyectos internos (como *TrautsLab*, pipelines de scraping o nombres de modelos de IA).
   - El resultado debe presentarse con la calidad y neutralidad de un informe pericial o de consultoría estratégica de primer nivel (estilo Mandiant, Gartner o McKinsey).

2. **Grounding y Verificación Formal (NotebookLM MCP Pattern):**
   - Ninguna afirmación técnica puede basarse en especulaciones o titulares sensacionalistas.
   - Cada hecho debe contrastarse con fuentes primarias: reportes de inteligencia de amenazas (Mandiant, CrowdStrike, CISA), especificaciones formales de ingeniería (**IETF RFCs**, **NIST SP 800-63B**, **NIST SP 800-207 Zero Trust**) y boletines oficiales de los fabricantes.

3. **Separación Estricta de Audiencias (Dual Delivery):**
   - **Informe Técnico (`.md`):** Riguroso, exhaustivo, con mapeo táctico (MITRE ATT&CK), análisis forense de causa raíz, esquemas de red, consultas de seguridad (SQL/CLI) y configuraciones de ingeniería reproducibles.
   - **Informe Ejecutivo (`.md` y `.html`):** Traducido al lenguaje de negocio mediante analogías cotidianas intuitivas, análisis de riesgo financiero/regulatorio (SEC, GDPR, seguros), hoja de ruta por fases (0-90 días) y formato web auto-contenido listo para exportar a PDF con un clic (`@media print`).

---

## 🧭 2. Pipeline de Trabajo en 5 Fases

```
   [URL de Noticia / Incidente / RFC]
                   │
                   ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ Fase 1: Ingestión, Limpieza y Extracción de Afirmaciones   │
  └──────────────────────────────┬──────────────────────────────┘
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ Fase 2: Deep Grounding & Pack NotebookLM (Patrón MCP)       │
  └──────────────────────────────┬──────────────────────────────┘
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ Fase 3: Informe Técnico de Ingeniería y Remediación         │
  └──────────────────────────────┬──────────────────────────────┘
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ Fase 4: Informe Ejecutivo y Funcional (Puente Analógico)    │
  └──────────────────────────────┬──────────────────────────────┘
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ Fase 5: Entrega Multi-Dispositivo (Markdown + HTML Print)   │
  └─────────────────────────────────────────────────────────────┘
```

---

## 📋 3. Especificación Detallada de Fases

### Fase 1: Ingestión, Limpieza y Extracción de Hechos
1. Lee el contenido original del artículo o enlace utilizando herramientas de lectura HTTP/Markdown o parsing de DOM.
2. Extrae las entidades clave:
   - Organizaciones afectadas y proveedores involucrados.
   - Magnitud del impacto (número de registros, volumen de datos en TB, costos de rescate).
   - Cronología de eventos (primer acceso, detección formal, anuncio público).
   - Actores de amenazas citados (ej. grupos APT, ciberdelincuentes) y herramientas nombradas.

### Fase 2: Deep Grounding & Pack NotebookLM (Patrón MCP)
Genera un artefacto estructurado `data/<tema>_notebooklm_pack.md` optimizado para Google NotebookLM y Obsidian Vault con:
- **Frontmatter YAML estándar:** `domain: "cybersecurity"`, `source: "notebooklm-mcp"`, `notebook_id: "<id>"`.
- **Audio Overview Synthesis:** Resumen ejecutivo de 3 párrafos de alta densidad.
- **Matriz de Evidencia Forense:** Cruce de vectores de ataque vs. controles faltantes.
- **Fuentes Primarias Citadas:** Enlaces y referencias formales (CISA, NIST, fabricantes).
- **Banco de Estudio y Flashcards:** 4-6 preguntas clave de comprensión técnica.

### Fase 3: Informe Técnico de Ingeniería y Remediación
Crea `data/informe_tecnico_remediacion_<tema>.md` conteniendo:
1. **Taxonomía del Vector de Ataque:** Mapeo formal contra **MITRE ATT&CK** (Initial Access, Persistence, Collection, Exfiltration).
2. **Análisis de Causa Raíz (RCA):** Identificación de fallas en el modelo de responsabilidad compartida, brechas en gestión de identidades y omisión de políticas de red.
3. **Arquitectura de Remediación Definitiva:**
   - Diagrama ASCII de arquitectura de acceso Zero Trust.
   - Políticas de autenticación mandatorias (ej. MFA FIDO2/WebAuthn phishing-resistant per NIST SP 800-63B AAL3).
   - Erradicación de contraseñas estáticas en cuentas de servicio (migración a pares de claves RSA 2048+ u OAuth 2.0).
   - Aislamiento perimetral con listas blancas de red y canales privados (PrivateLink).
   - Enmascaramiento dinámico de datos (Dynamic Data Masking) y monitoreo de infostealers en la Dark Web.
4. **Lista de Verificación (Hardening Checklist):** Checklist accionable para ingenieros de SecOps.

### Fase 4: Informe Ejecutivo y Funcional
Crea `data/informe_ejecutivo_<tema>.md` con las siguientes directrices:
1. **Cero tecnicismos sin traducción inmediata:** Toda mención a conceptos como `Infostealer`, `MFA`, `Zero Trust` o `Network Policy` debe acompañarse de una analogía del mundo real (ej. cerraduras bancarias, llaves maestras copiadas, puertas traseras olvidadas).
2. **Cuantificación del Riesgo de Negocio:**
   - Sanciones regulatorias (SEC Form 8-K, GDPR, leyes de privacidad).
   - Invalidación de pólizas de seguro cibernético por negligencia en controles mínimos.
   - Daño a la reputación de marca y pérdidas operativas directas.
3. **Hoja de Ruta Directiva en 3 Fases (0 - 90 Días):**
   - *Fase 1 (Días 0 - 7):* Contención urgente y remediación inmediata sin costo de capital.
   - *Fase 2 (Día 30):* Estandarización de accesos y cierre de puntos ciegos.
   - *Fase 3 (Día 90):* Madurez Zero Trust y vigilancia continua.
4. **Pregunta Clave de Auditoría:** Una pregunta concreta para que el Comité de Dirección interpele a sus líderes técnicos.

### Fase 5: Entrega Web y Exportación a PDF de 1 Clic
Crea `data/informe_ejecutivo_<tema>.html`:
- Archivo 100% auto-contenido (CSS integrado, tipografía web moderna con fallbacks de sistema).
- Diseño visual editorial: tarjetas métricas destacadas, tablas estilizadas, cajas de analogías y bloques de hoja de ruta.
- Barra superior flotante con botón **"Exportar a PDF / Imprimir"** (`window.print()`).
- Reglas `@media print` rigurosas: fondo blanco para ahorrar tinta, tipografía de alta legibilidad, ocultamiento de elementos interactivos y gestión de saltos de página (`page-break-inside: avoid`).

---

## 🔀 4. Tratamiento de Casos Especiales y Escenarios Operativos

### 🟢 Caso 1: Flujo Exitoso Estándar (Happy Path)
- **Condición:** El artículo de entrada es público, contiene datos técnicos consistentes, los reportes periciales de firmas reconocidas (Mandiant, CISA, etc.) están disponibles y confirman la causa raíz.
- **Acción:** Ejecución continua de las 5 fases sin bloqueos, generando los 4 artefactos (`notebooklm_pack.md`, `informe_tecnico.md`, `informe_ejecutivo.md`, `informe_ejecutivo.html`).

### 🟡 Caso 2: Casos Borde (Edge Cases)
1. **Fuentes con Paywall o Bloqueo Anti-Scraping:**
   - *Comportamiento:* Si la URL no puede ser leída directamente, recurre al motor de búsqueda web para recuperar la cobertura del incidente en múltiples medios técnicos independientes (SecurityWeek, BleepingComputer, KrebsOnSecurity). Sintetiza el consenso general e indícalo en las fuentes.
2. **Contradicción entre Proveedor y Peritos Forenses:**
   - *Ejemplo:* El proveedor de nube sostiene que su producto no fue vulnerado, mientras que los investigadores afirman que hubo compromiso de cuentas de soporte o credenciales heredadas.
   - *Comportamiento:* No tomes partido editorial. Explica el **Modelo de Responsabilidad Compartida**: documenta textualmente la postura del fabricante y contrástala de forma objetiva con los hallazgos forenses de las firmas de auditoría.
3. **Sistemas Heredados o Entornos Industriales (Legacy / OT):**
   - *Comportamiento:* Si la empresa opera tecnologías antiguas donde no es viable implementar FIDO2/WebAuthn de inmediato, documenta controles compensatorios (jump boxes con MFA en el perímetro, segmentación estricta de VLANs y micro-segmentación).

### 🔵 Caso 3: Vías Alternativas (Alternatives Paths)
1. **Ruta "Executive Briefing Express":**
   - *Activación:* El usuario solicita expresamente una nota rápida de 1 o 2 páginas para una reunión de emergencia.
   - *Acción:* Omite el informe técnico detallado de código SQL y genera únicamente el Pack de NotebookLM conciso y el Informe Ejecutivo HTML con las 3 decisiones críticas y la analogía principal.
2. **Ruta "Technical RFC & Architecture Decision Record (ADR)":**
   - *Activación:* El usuario es un equipo de ingeniería que busca incorporar las lecciones en su backlog o arquitectura interna.
   - *Acción:* Enfoca el informe técnico como un documento formal ADR/RFC (Contexto, Decisión, Consecuencias, Diagramas C4 y scripts de Terraform / CloudFormation para automatizar las políticas de seguridad).
3. **Ruta "Slide Deck Outline":**
   - *Activación:* El usuario requiere una presentación para la Junta Directiva.
   - *Acción:* Entrega una estructura de 8 a 10 diapositivas con notas para el orador y datos de impacto.

### 🔴 Caso 4: Casos Negativos y de Falla (Negative / Failure Cases)
1. **Afirmaciones No Verificadas o Titulares Sensacionalistas (Fake News):**
   - *Riesgo:* Artículos de prensa que afirman que "Snowflake fue hackeado mediante un Zero-Day" sin evidencia técnica.
   - *Acción Obligatoria:* **Detener la propagación del error.** Desmentir la afirmación citando los boletines oficiales y los análisis de firmas de forense digital (DFIR). Clasificar el hallazgo como *Desinformación / Falacia de Percepción*.
2. **Exposición Accidental de Credenciales o Información Sensible en la Fuente:**
   - *Riesgo:* El artículo o volcado de logs contiene contraseñas reales, tokens JWT, correos de víctimas o claves privadas.
   - *Acción Obligatoria:* **Redacción inmediata y total.** Reemplazar cualquier credencial por marcadores de posición (`<REDACTED_API_KEY>`, `****-****-****-1234`). Jamás incluir datos reales de PII o credenciales vivas en los reportes.
3. **Alucinación de Vulnerabilidades o CVEs Inexistentes:**
   - *Riesgo:* Asignar identificadores CVE ficticios a una mala práctica de configuración.
   - *Acción Obligatoria:* Si un vector de ataque se debe a falta de MFA o contraseñas débiles, clasifícalo como debilidad de gobernanza y control de acceso (CWE-308 / CWE-287), no inventes un número de CVE si no existe una falla de software registrada en el NVD.
4. **Recomendaciones Vagas o No Accionables:**
   - *Riesgo:* Entregar conclusiones vacías como "mejorar la cultura de seguridad" o "invertir más en firewalls".
   - *Acción Obligatoria:* **Rechazar generalidades.** Cada recomendación debe incluir: el control técnico específico, la métrica de éxito verificable y el impacto en la reducción del riesgo.

---

## 🛠️ 5. Lista de Verificación Pre-Entrega

Antes de finalizar cualquier ejecución bajo este skill, valida:
- [ ] ¿El Pack de NotebookLM contiene resumen, tabla de evidencia, citas formales y flashcards?
- [ ] ¿El Informe Técnico incluye mapeo MITRE ATT&CK, causa raíz y código/configuraciones de remediación?
- [ ] ¿El Informe Ejecutivo utiliza al menos dos analogías intuitivas y carece de jerga técnica sin explicar?
- [ ] ¿Se eliminó cualquier mención a herramientas internas, scrapers, prompts o nombres de modelos de IA?
- [ ] ¿El archivo HTML es auto-contenido y la vista de impresión (`@media print` / botón PDF) funciona limpiamente?
- [ ] ¿Se han cubierto los casos borde y verificado las afirmaciones contra fuentes oficiales?
