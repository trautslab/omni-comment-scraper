---
title: "NotebookLM Source Pack: Arquitectura de Mitigación de Bots y Alta Concurrencia (Ticketmaster Case Study)"
domain: "cloud-architecture"
source: "notebooklm-mcp"
notebook_id: "global-concurrency-and-scalability"
created_at: "2026-09-05T20:36:00.000Z"
updated_at: "2026-09-05T20:36:00.000Z"
tags: ["high-concurrency", "bot-mitigation", "redis-zset", "ebpf", "rate-limiting", "passkeys", "ticketmaster", "grounding"]
summary: "Pack de investigación estructurado y fundamentado sobre arquitecturas distribuidas de alta concurrencia, mitigación de bots a gran escala y salas de espera virtuales, derivado del análisis del caso Ticketmaster (14 millones de peticiones concurrentes)."
---

# 📚 NotebookLM Source Pack: Mitigación de Bots y Alta Concurrencia

> **Propósito:** Consolidar el conocimiento pericial, especificaciones formales de ingeniería (IETF RFCs, NIST, CNCF) y análisis de fallos en producción para alimentar cuadernos de investigación en Google NotebookLM y agentes de arquitectura de software.

---

## 1. Resumen de Síntesis (Audio Overview Synthesis)

Durante eventos masivos de venta de entradas con demanda extrema (como la preventa de *The Eras Tour* en noviembre de 2022, donde Ticketmaster enfrentó una avalancha repentina de más de **14 millones de usuarios y bots concurrentes**), los sistemas de comercio electrónico tradicionales colapsan si no desacoplan la llegada masiva del tráfico respecto a la capacidad de procesamiento de la base de datos transaccional. La causa raíz técnica del colapso no fue una falla de hardware aislado, sino un desbordamiento volumétrico sobre los endpoints transaccionales (`/comprar`), agravado por millones de peticiones automatizadas generadas por redes de revendedores (*scalpers*) que rotaron direcciones IP residenciales y perfiles de navegador para burlar las defensas perimetrales básicas.

La publicación técnica analizada de Arturo Velázquez sintetiza una arquitectura defensiva en cinco capas para absorber este impacto: **Rate Limiting** a nivel de API Gateway, análisis heurístico pasivo con **reCAPTCHA v3**, colas virtuales ordenadas mediante **Redis Sorted Sets (ZSET)**, identificación de hardware mediante **Device Fingerprinting**, y verificación humana out-of-band con **OTP**. 

No obstante, la investigación profunda pericial revela que en entornos de producción a hiperescala (SOTA), estas cinco capas deben complementarse con tecnologías más resilientes: **descarte de paquetes en kernel con eBPF/XDP** para mitigar ataques volumétricos sin agotar threads en el Gateway; reemplazo de reCAPTCHA por **desafíos criptográficos en el cliente (como Cloudflare Turnstile o Proof-of-Work)** para evitar fricción en navegadores orientados a la privacidad; y sustitución del vulnerable SMS OTP por **Passkeys criptográficas (FIDO2 / WebAuthn)** para neutralizar de raíz las granjas de números virtuales (VoIP) y el robo de tokens.

---

## 2. Ficha del Caso y Transcripción Original Analizada

- **Fuente:** [Instagram Reel — Arturo Velazquez (@arturo_velazquez_java)](https://www.instagram.com/reel/DVw27-9jGJe/)
- **Métricas:** 47,000 Likes • 501 Comentarios técnicos • +1.2M Reproducciones
- **Caso Histórico:** Colapso de Ticketmaster frente a 14 millones de solicitudes simultáneas en 2022.

```text
En 2022, Ticketmaster colapsó en tiempo real frente a 14 millones de personas. Esto es lo que falló técnicamente. 💀

¿Por qué ocurrió esto?
➡ Miles de requests simultáneos al endpoint /comprar
➡ Cada bot usaba una IP y tarjeta diferente
➡ El servidor no tenía forma de distinguir humano de máquina
➡ Sin límite de compras por identidad, un bot podía comprar más de 1,000 boletos

Rate Limiting — primera línea de defensa
➡ Máximo 1 compra por usuario cada 30 segundos
➡ Request número 2 antes de ese tiempo → HTTP 429 automático
➡ Implementado a nivel API Gateway, no en la aplicación

Google reCAPTCHA v3 — detecta bots sin interrumpir al usuario
➡ Analiza comportamiento en segundo plano — movimiento del mouse, velocidad de clicks, patrones de navegación
➡ Genera un score de 0.0 a 1.0 por sesión
➡ Score menor a 0.5 → sesión sospechosa → bloqueo automático
➡ El usuario humano nunca ve un CAPTCHA — el bot nunca pasa

Cola virtual con Redis Sorted Sets — controla el acceso
➡ Nadie llega directo al endpoint /comprar
➡ Redis asigna posición en la fila usando timestamp de entrada como score
➡ Token único con TTL de 10 minutos — expira si no completas la compra
➡ Cloudflare Waiting Room es la solución más usada hoy

Device Fingerprinting — identifica el dispositivo real
➡ FingerprintJS analiza browser, resolución, timezone, plugins instalados
➡ Aunque el bot cambie de IP, el dispositivo es el mismo
➡ Un dispositivo sospechoso → bloqueado permanentemente sin importar la IP

Verificación por OTP — confirma que es humano real
➡ Máximo 2 boletos por número de teléfono verificado
➡ Sin OTP validado → sin acceso al checkout
➡ Elimina bots aunque hayan pasado todas las capas anteriores

Solución completa:
1️⃣ Rate Limiting → frena el volumen
2️⃣ reCAPTCHA v3 → detecta bots en segundo plano
3️⃣ Redis Sorted Sets → controla la cola de acceso
4️⃣ Device Fingerprinting → identifica el dispositivo
5️⃣ OTP → confirma humano real
```

---

## 3. Matriz de Auditoría y Verificación Formal (Fact-Checking Grounding)

| # | Afirmación de la Fuente | Veredicto Pericial | Evaluación Técnica de Ingeniería | Estándar / Fuente Primaria |
| :- | :--- | :--- | :--- | :--- |
| 1 | **Rate Limiting en el Gateway frena el volumen antes de tocar la app (HTTP 429).** | `VERIFIED` | La delegación del control de tasa al Gateway (Kong, Envoy) evita que la capa de aplicación gaste sockets y memoria en peticiones descartadas. Algoritmos recomendados: *Token Bucket* y *Sliding Window Log*. | **IETF RFC 6585 (Sec. 4)**: *Additional HTTP Status Codes - 429 Too Many Requests*.<br>**CNCF Envoy Proxy**: *Global Rate Limiting Architecture*. |
| 2 | **reCAPTCHA v3 detecta bots sin fricción con score 0.0 a 1.0.** | `VERIFIED WITH CAVEAT` | Excelente para bots genéricos, pero navegadores orientados a la privacidad (Brave, Tor, Firefox con `privacy.resistFingerprinting`) o usuarios detrás de VPNs corporativas reciben scores bajos artificialmente (falsos positivos). | **Google Developers**: *reCAPTCHA v3 Thresholds & Score Interpretation*.<br>**Cloudflare Research**: *Why CAPTCHAs are ineffective and alternatives*. |
| 3 | **Redis Sorted Sets (ZSET) son la base óptima para colas virtuales con TTL.** | `VERIFIED` | La complejidad temporal de inserción y consulta en ZSET es $\mathcal{O}(\log N)$, soportando millones de elementos ordenados por timestamp. Al vincular el turno a un token con *lease* temporal, se garantiza rotación justa. | **Cloudflare Engineering Blog**: *How we built Waiting Room with zero-code at edge scale*.<br>**Redis Documentation**: *Sorted Set Commands (`ZADD`, `ZRANGEBYSCORE`)*. |
| 4 | **Device Fingerprinting bloquea bots aunque cambien de IP.** | `PARTIALLY ACCURATE` | Funciona contra scripts básicos, pero bots avanzados de reventa usan navegadores *headless* avanzados (Puppeteer Stealth, Undetected Chromedriver) que aleatorizan las variables de hardware (Canvas, WebGL, fuentes) en cada ejecución. | **W3C TAG**: *Client Identification and Privacy Entropy Analysis*.<br>**Electronic Frontier Foundation (EFF)**: *Panopticlick / Cover Your Tracks Research*. |
| 5 | **Verificación OTP por teléfono confirma humano real.** | `NEEDS WARNING` | El SMS OTP mitiga ataques aficionados, pero el crimen organizado arrienda granjas de SIMs y números virtuales VoIP (Twilio, TextNow). Además, NIST desaconseja SMS por vulnerabilidad ante *SIM Swapping* e intercepción SS7. | **NIST Special Publication 800-63B**: *Digital Identity Guidelines (Section 5.1.3: Out-of-Band Verifiers - SMS Deprecation Advisory)*. |

---

## 4. Mejoras Arquitectónicas State-of-the-Art (SOTA)

Para construir un sistema verdaderamente invulnerable a 14 millones de peticiones concurrentes:

1. **Filtrado en Kernel con eBPF / XDP (eXpress Data Path):**
   - *Problema en el Gateway:* Procesar 14 millones de handshakes TLS/TCP en el API Gateway satura los CPUs de los proxies.
   - *Solución SOTA:* Descartar paquetes de bots conocidos directamente en el driver de red del kernel de Linux con eBPF, logrando millones de descartes por segundo sin consumir memoria de usuario.
2. **Desafíos Criptográficos en Cliente (Proof-of-Work / Turnstile):**
   - *Problema:* reCAPTCHA v3 recopila datos de navegación y genera fricción en navegadores privados.
   - *Solución SOTA:* Exigir que el navegador del cliente resuelva un acertijo criptográfico leve (Sha-256 PoW de 50ms de CPU). Para un humano es imperceptible; para una granja de 500,000 bots, el costo computacional destruye su rentabilidad económica.
3. **Migración de SMS OTP a Passkeys Biométricas (FIDO2 / WebAuthn):**
   - *Problema:* Granjas de SIMs y bypass de SMS.
   - *Solución SOTA:* Autenticación criptográfica enlazada al hardware del smartphone (TouchID, FaceID, Windows Hello). Cada cuenta solo puede inscribir una credencial FIDO2 respaldada por Secure Enclave.
4. **Patrón de Idempotencia y Locks Distribuidos (Redlock):**
   - *Problema:* Múltiples clics simultáneos pueden provocar doble descuento de inventario o condiciones de carrera (*race conditions*).
   - *Solución SOTA:* Encabezado HTTP `Idempotency-Key` (IETF draft) y transacciones atómicas en Redis con scripts Lua antes de persistir en PostgreSQL.

---

## 5. Preguntas de Comprensión y Flashcards (Study Pack)

### Pregunta 1: ¿Por qué el Rate Limiting tradicional por dirección IP falla ante botnets modernas?
**Respuesta:** Porque las botnets modernas no provienen de un único centro de datos; utilizan redes de proxies residenciales y móviles (móviles 4G/5G con direcciones IP dinámicas y compartidas mediante CGNAT). Un bot puede enviar 100,000 peticiones utilizando 100,000 direcciones IP residenciales distintas, de modo que cada IP individual solo emite 1 petición, pasando completamente desapercibida para un rate limiter basado en IP.

### Pregunta 2: ¿Cómo funciona matemáticamente una cola virtual con Redis Sorted Sets?
**Respuesta:** En Redis Sorted Sets (`ZSET`), cada elemento se almacena como un miembro único (el identificador de sesión del usuario) asociado a un puntaje numérico (*score*), que corresponde a la marca de tiempo Unix (`timestamp`) exacta de su llegada. Con la operación `ZADD fila_espera <timestamp> <session_id>`, Redis indexa los turnos en un árbol ordenado (*Skip List*) con complejidad $\mathcal{O}(\log N)$. Para otorgar el pase al checkout, el sistema ejecuta `ZRANGEBYSCORE fila_espera -inf +inf LIMIT 0 100`, permitiendo el acceso por lotes estrictamente ordenados en milisegundos.

### Pregunta 3: ¿Por qué la especificación NIST SP 800-63B califica al SMS como un canal restringido para autenticación?
**Respuesta:** NIST desaconseja el SMS como segundo factor porque no está cifrado de extremo a extremo, es vulnerable a ataques de intercambio de tarjeta SIM (*SIM Swapping* mediante ingeniería social a operadoras telefónicas), ataques a la señalización de red telecom (**SS7 / Diameter**), y porque los atacantes pueden adquirir fácilmente miles de números virtuales (VoIP) para recibir códigos de forma masiva sin un dispositivo físico real.

### Pregunta 4: ¿Qué ventaja ofrece el filtrado eBPF/XDP sobre el API Gateway ante un ataque masivo de bots?
**Respuesta:** Un API Gateway (como Envoy o NGINX) opera en el espacio de usuario y requiere completar el protocolo de enlace TCP (*TCP 3-way handshake*) y la negociación TLS antes de poder evaluar la petición HTTP. Esto consume memoria y ciclos de CPU significativos. Por el contrario, **eBPF con XDP (eXpress Data Path)** ejecuta programas de inspección en el nivel más bajo del kernel de Linux, directamente en la tarjeta de interfaz de red (NIC). Si el paquete proviene de un bot bloqueado, se descarta (`XDP_DROP`) en nanosegundos, sin asignar memoria en el sistema operativo.
