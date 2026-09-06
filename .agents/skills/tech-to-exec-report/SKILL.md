---
name: tech-to-exec-report
description: >-
  Transforms dense technical markdown, architecture designs, RFCs, postmortems, and engineering specs
  into executive, functional-friendly reports and print-ready PDFs. Keeps full technical rigor and verifiable
  standards while explaining concepts with intuitive real-world analogies, business impacts, and ROI frameworks
  for non-technical stakeholders.
---

# 📊 Tech-to-Exec Report: De Markdown Técnico a Informe Ejecutivo

Este skill guía al agente en la traducción sistemática de documentos técnicos densos (código, arquitecturas, RFCs, postmortems, transcripciones de ingeniería) a **informes ejecutivos y funcionales de alto impacto**, diseñados para directores, líderes de producto, analistas de negocio y comités de inversión.

---

## 🎯 1. Filosofía y Principios Inviolables

1. **Rigor Técnico Intacto (No Dumb Down):**
   - Nunca elimines la terminología técnica real (`Rate Limiting`, `API Gateway`, `HTTP 429`, `eBPF`, `FIDO2`, `Redis Sorted Sets`, `ACID`).
   - Todo término técnico debe acompañarse inmediatamente de su **analogía del mundo real** y su **impacto directo en el negocio / experiencia de usuario (UX)**.

2. **Cero Fugas de Herramientas Internas (Agnosticismo Total):**
   - El informe final NUNCA debe mencionar herramientas de scraping, prompts, modelos de IA, plataformas internas o artefactos temporales (ej. NotebookLM, scrapers, pipelines internos), a menos que el usuario lo solicite expresamente.
   - El documento debe leerse como un informe de consultoría estratégica o whitepaper editorial independiente (estilo Gartner, McKinsey o Stripe Engineering).

3. **Verificación Formal y Respaldo (Fact-Checking Grounding):**
   - Todas las afirmaciones técnicas deben contrastarse contra especificaciones de la industria (**IETF RFCs**, **NIST**, **W3C**, **ISO/IEC**, blogs oficiales de ingeniería como Cloudflare, Netflix, AWS).
   - Incluir una matriz de auditoría con veredictos claros (`VERIFICADO`, `PARCIALMENTE PRECISO`, `REQUIERE PRECAUCIÓN`).

4. **Entregable Dual Multi-Dispositivo:**
   - **Formato Markdown (`.md`)**: Optimizado para Notion, Obsidian, GitHub o Word.
   - **Formato HTML Autónomo para PDF (`.html`)**: Archivo único, sin dependencias externas, responsivo para celulares/tablets y con estilos `@media print` optimizados con botón de 1 clic para exportar a PDF en tamaño Carta / A4.

---

## 🧭 2. Metodología de Transformación en 5 Pasos

Cuando recibas un documento o transcripción técnica, sigue este pipeline estructurado:

```
  [Documento Técnico / RFC / Post]
                 │
                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ Paso 1: Ingestión & Desglose de Tesis de Ingeniería        │
  └──────────────────────────────┬──────────────────────────────┘
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ Paso 2: El Puente Funcional (Analogías + Impacto Negocio)   │
  └──────────────────────────────┬──────────────────────────────┘
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ Paso 3: Matriz de Auditoría y Verificación de Fuentes (RFCs)│
  └──────────────────────────────┬──────────────────────────────┘
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ Paso 4: Recomendaciones SOTA & Aportes de la Comunidad      │
  └──────────────────────────────┬──────────────────────────────┘
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ Paso 5: Generación Dual (.md + .html imprimible en PDF)     │
  └─────────────────────────────────────────────────────────────┘
```

---

### Paso 1: Ingestión & Desglose de Tesis de Ingeniería
- Identifica el **incidente o problema de negocio** de fondo (ej: caída en ventas, brecha de seguridad, lentitud en checkout).
- Extrae la arquitectura o solución técnica en componentes atómicos.
- Determina métricas clave (volumen de usuarios, latencia, costos, porcentaje de error).

### Paso 2: El Puente Funcional (Analogías + Impacto en Negocio)
Para cada componente técnico, construye una ficha con 4 cuadrantes:
- **Concepto Técnico**: El nombre de ingeniería exacto.
- **Analogía del Mundo Real**: Un ejemplo físico intuitivo (ej: *un torniquete con cronómetro*, *un observador de postura invisible*, *el dispensador de boletos de un banco*).
- **Cómo opera**: Explicación en 2-3 líneas sin jerga excesiva.
- **Impacto para el Negocio / UX**: Qué gana la empresa y qué siente el cliente.

### Paso 3: Matriz de Auditoría y Verificación de Fuentes
Construye una tabla con:
- Medida técnica propuesta.
- Veredicto de validez (`VERIFICADO`, `PARCIALMENTE PRECISO`, `REQUIERE PRECAUCIÓN`).
- Evaluación técnica pragmática (matices, limitaciones en producción).
- Citas a especificaciones formales (RFCs de IETF, guías NIST, papers W3C).

### Paso 4: Recomendaciones SOTA & Aportes de Expertos
- Identifica lo que los enfoques tradicionales omiten.
- Contrasta soluciones básicas con alternativas State-of-the-Art (ej: pasar de SMS a Passkeys biométricas; pasar de rate limits en gateway a filtros eBPF en tarjeta de red).
- Incorpora advertencias reales de producción (falsos positivos, costos ocultos, granjas de bots).

### Paso 5: Preguntas Frecuentes de Negocio (FAQ)
Responde en lenguaje comercial las 3 preguntas clásicas de un comité directivo:
1. *¿Esto perjudicará la experiencia del cliente o aumentará el tiempo de espera?*
2. *¿Debemos construir todo esto desde cero o comprar componentes existentes (Build vs Buy)?*
3. *¿Cuál es el retorno de inversión (ROI) y qué riesgos mitiga?*

---

## 📄 3. Plantilla Maestra del Informe Markdown (`.md`)

```markdown
# 📘 Guía Ejecutiva: [Título Orientado a Negocio y Solución]
### *[Subtítulo descriptivo del caso de estudio o problema analizado]*

---

## 🎯 1. Resumen Ejecutivo (Para Líderes de Negocio y Producto)
- **El Problema de Fondo:** [Explicación clara del dolor o riesgo de negocio]
- **La Causa Raíz:** [Por qué fallan las soluciones tradicionales]
- **La Solución Propuesta:** [Resumen de la estrategia en capas]

---

## 🛡️ 2. La Estrategia de Solución Explicada para Perfiles Funcionales

[Diagrama ASCII o Mermaid del flujo de alto nivel]

### Componente 1: [Nombre Funcional] ([Término Técnico])
* **Analogía en la Vida Real:** [Metáfora del mundo físico]
* **¿Cómo Funciona?** [Explicación funcional clara]
* **Impacto en el Negocio / UX:** [Beneficio directo]
* **Respaldo Formal:** [Norma o RFC de referencia]

[Repetir para cada componente]

---

## 🔬 3. Matriz de Auditoría y Verificación Técnica (Fact-Checking)

| Medida Propuesta | Calificación | Evaluación de Ingeniería | Fuentes Primarias / Estándares |
| :--- | :---: | :--- | :--- |
| **[Técnica 1]** | `VERIFICADO` | [Análisis objetivo] | • [Estándar / RFC](URL) |

---

## 🚀 4. Recomendaciones Avanzadas de la Industria (SOTA)
[Mejoras de vanguardia propuestas por expertos y arquitectos]

---

## ❓ 5. Preguntas Clave para Comités de Decisión (FAQ)
[Preguntas de presupuesto, tiempos, experiencia de usuario y ROI]

---
*Documento técnico-funcional elaborado para análisis de arquitectura, diseño de producto y evaluación de inversiones.*
```

---

## 🌐 4. Plantilla de Estilos del Archivo HTML Imprimible en PDF (`.html`)

El archivo HTML generado debe ser **autocontenido** y contar con:
1. Barra superior con botón `🖨️ Guardar o Imprimir como PDF` que invoca `window.print()`.
2. Tipografía legible (`-apple-system`, `Inter`, `Segoe UI`) con paleta de contrastes accesible.
3. Reglas CSS específicas para impresión:
   ```css
   @media print {
     body { background: #fff; padding: 0; }
     .action-bar { display: none !important; }
     .container { border: none; box-shadow: none; padding: 0; max-width: 100%; }
     .layer-card, .table-wrapper, .flow-diagram { break-inside: avoid; }
     h2, h3 { break-after: avoid; }
     a { color: #0f172a; text-decoration: underline; }
   }
   ```
4. Diagramas de flujo en cajas monoespaciadas con fondo oscuro suave o SVG para garantizar nitidez en papel y pantallas Retina.

---

## 🚫 5. Anti-Patrones a Evitar Estrictamente

| Anti-Patrón | Por qué es inaceptable | Corrección Requerida |
| :--- | :--- | :--- |
| **Dumbing down excesivo** | Si eliminas términos como `Rate Limiting` o `RFC 6585`, los ingenieros rechazarán el documento por superficial. | Conserva el término técnico exacto, pero explícalo con la analogía física. |
| **Jerga sin aterrizaje** | Entregar siglas técnicas (`eBPF`, `XDP`, `TTL`) sin explicar qué impacto tienen en el negocio aburre a los funcionales. | Acompaña cada sigla con su repercusión operativa (ahorro de CPU, protección antifraude). |
| **Fugas de Prompt o IA** | Dejar textos como *"Generado por NotebookLM"*, *"Scrapeado de Instagram"* o *"En este prompt"*. | Limpieza editorial absoluta. El informe es un activo profesional neutral. |
| **Citas ficticias** | Citar normas inexistentes o desactualizadas. | Usa estándares reales de **IETF**, **NIST**, **W3C**, **IEEE**, **OWASP** o fuentes de ingeniería verificadas. |
