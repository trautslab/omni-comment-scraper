# ADR-0001: Arquitectura Hexagonal con Registro de Adaptadores para Scraping Multiplataforma

- **Estado:** ACEPTADO
- **Fecha:** 2026-09-05
- **Autor:** Principal Software Engineer (TrautsLab)
- **Alcance:** Arquitectura central de ingestión de redes sociales.

---

## 1. Contexto y Problema
El sistema debe recolectar comentarios y metadatos desde plataformas heterogéneas (Instagram, YouTube, TikTok, Telegram, Facebook y nuevas plataformas en el futuro). Cada red social impone protocolos, modelos de datos, estructuras de URL y mecanismos de autenticación radicalmente distintos (OpenGraph, GraphQL, APIs REST, cookies de sesión, tokens de bot).

Un enfoque monolítico con sentencias condicionales acopladas violaría el principio Open/Closed y dificultaría el mantenimiento y las pruebas automatizadas.

## 2. Decisión Tomada
Se adopta una **Arquitectura Hexagonal (Ports & Adapters)** con un **AdapterRegistry**:
1. **Dominio Núcleo**: Define los tipos `Comment`, `PostMetadata`, `Author` y el puerto `PlatformAdapter`.
2. **Registro Dinámico**: Permite registrar adaptadores sin acoplamiento. La resolución de URLs se delega al método `canHandle(url: string)` de cada adaptador.
3. **Normalización Unificada**: `CommentNormalizer` estandariza texto, cálculo de timestamps ISO 8601, hashtags, menciones y análisis de sentimiento.
4. **Resiliencia de Conexión**: La clase abstracta `BaseAdapter` encapsula timeout determinista y headers de crawler para sortear renderizados SPA vacíos.

## 3. Consecuencias
- **Positivas:**
  - Agregar una nueva red social (e.g. Reddit, X/Twitter, LinkedIn) requiere únicamente crear un nuevo archivo `src/adapters/<platform>.adapter.ts` e inscribirlo en el registro.
  - Pruebas unitarias e integración aisladas por plataforma con mocks rápidos.
  - Cero dependencias cruzadas entre adaptadores.
- **Compensaciones:**
  - Requiere mantener contratos de interfaz consistentes y esquemas de datos extensibles (`raw?: Record<string, unknown>`).
