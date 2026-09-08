# 🛠️ Informe Técnico de Ingeniería: Arquitectura de Smart Ticketing, QR Dinámico Offline y Transferencias P2P

**Clasificación:** Documento de Arquitectura de Software, Criptografía de Acceso y Sistemas Embebidos  
**Estándares de Referencia:** IETF RFC 6238 (TOTP) | IETF RFC 4226 (HOTP) | W3C Web Cryptography API | NIST SP 800-63B | ISO/IEC 18004 (QR Code)  
**Plataforma de Referencia:** Quentro (`https://www.quentro.com/`)  
**Aplicabilidad Directa:** Bounded Context `checkin`, Casos de Uso `UC-009` y `SEQ-005` en plataformas de ticketing modernas (TiketYA)  
**Estado:** Especificación de Ingeniería y Arquitectura de Referencia  

---

## 1. Resumen Ejecutivo Técnico

Las plataformas de venta de entradas tradicionales continúan sufriendo pérdidas millonarias y crisis de acceso público debido al uso de códigos QR estáticos (impresos o en formato PDF). Este modelo permite la duplicación trivial mediante capturas de pantalla, la clonación digital y la reventa descontrolada en mercados informales.

**Quentro** ha establecido un estándar de referencia en la industria de eventos en vivo al desacoplar la validación de acceso de la conectividad a Internet mediante dos principios fundamentales:
1. **Generación de QR Dinámico Local (TOTP RFC 6238):** La entrada se renderiza en la pantalla del dispositivo móvil calculando un código visual que cambia cada 15 segundos ($\Delta t = 15s$) utilizando una semilla criptográfica aprovisionada localmente y el reloj interno del dispositivo. **No requiere datos móviles ni Wi-Fi para rotar.**
2. **Validación Offline First en Torniquetes y Puertas:** Los escáneres en puerta validan la autenticidad matemática del código en menos de 80 milisegundos de forma autónoma, sin emitir peticiones a una base de datos central en la nube.

Este documento desglosa la ingeniería inversa de Quentro, formula las especificaciones criptográficas reproducibles y establece una hoja de ruta técnica para implementar esta capacidad en arquitecturas de ticketing empresariales.

---

## 2. Diagrama de Flujo: Ciclo de Vida del Smart Ticket

```
                              CICLO CRIPTOGRÁFICO DE SMART TICKET (QUENTRO MODEL)
                              
  [ 1. Aprovisionamiento en Compra ]
     Servidor Backend emite: `ticket_id`, `device_id` y genera una semilla criptográfica:
     `qr_seed = HMAC-SHA256(master_event_key, ticket_id + buyer_secret)`
     La semilla viaja cifrada por TLS hacia la App Móvil (almacenada en Android Keystore / iOS Keychain).
                                │
                                ▼
  [ 2. Generación Local del QR (Modo Avión / Sin Internet) ]
     Cada 15 segundos, la App Móvil ejecuta:
     - `counter = floor(unix_timestamp / 15)`
     - `hash = HMAC-SHA256(qr_seed, counter)`
     - `totp_code = Truncate(hash, 64_bits)`
     - `qr_payload = "<ticket_id>:<counter>:<totp_code>"`
     Renderizado en pantalla como código QR con barra de tiempo visual (15s).
     *Captura de pantalla: BLOQUEADA por FLAG_SECURE en Android o detectada en iOS.*
                                │
                                ▼
  [ 3. Escaneo en Puerta (Estadio sin señal 4G/5G) ]
     El asistente presenta el teléfono frente al escáner de torniquete.
     El escáner óptico decodifica el payload: `<ticket_id>:<counter>:<totp_code>`.
                                │
                                ▼
  [ 4. Validación Matemática Offline en el Escáner ]
     El escáner NO llama a la API central en la nube.
     Recupera de su caché SQLite local el `qr_seed` asociado a `ticket_id` (pre-sincronizado).
     Calcula:
     - Comprueba si `abs(current_counter - counter) <= 1` (tolerancia de deriva: ±15s).
     - Comprueba que el ticket no figure con estado `USED` en su base de datos local.
     - Verifica: `expected_totp == totp_code`.
                                │
                                ├─────────────────────────┐
                                ▼ Válido                  ▼ Inválido / Captura expirada
                     [ LUZ VERDE / TICKET INGRESA ]    [ LUZ ROJA / ACCESO DENEGADO ]
                     Marca `USED` en SQLite local.      Feedback sonoro de error.
                     Broadcast UDP a la red local.
```

---

## 3. Especificación Criptográfica y Algorítmica

### 3.1. Formato del Payload del QR Rotativo
Para que el lector de cámara enfoque y decodifique instantáneamente (en menos de 50ms), el tamaño del código QR debe mantenerse en una versión baja (**Versión 3 o 4, corrección de errores nivel M**).

Estructura binaria comprimida:
```text
Payload = base64url(ticket_uuid_bytes[16] + counter_uint32[4] + hmac_truncated[8])
Longitud total: ~38 caracteres ASCII.
```

### 3.2. Implementación del Generador en Cliente (TypeScript / React Native / PWA)

```typescript
// DynamicQrGenerator.ts
// Basado en RFC 6238 (TOTP) con ventana de 15 segundos
import crypto from 'node:crypto';

export interface DynamicQrState {
  qrPayload: string;
  secondsRemaining: number;
}

export class DynamicQrGenerator {
  private static readonly TIME_STEP_SECONDS = 15;

  /**
   * Genera el payload dinámico del QR en el dispositivo móvil
   * @param ticketId UUID v4 del ticket
   * @param qrSeed Clave secreta compartida en formato Hex (32 bytes)
   * @param overrideTimestamp Timestamp opcional para pruebas unitarias
   */
  public static generate(ticketId: string, qrSeed: string, overrideTimestamp?: number): DynamicQrState {
    const nowMs = overrideTimestamp || Date.now();
    const nowSeconds = Math.floor(nowMs / 1000);
    
    // 1. Calcular el intervalo de 15 segundos
    const counter = Math.floor(nowSeconds / this.TIME_STEP_SECONDS);
    const secondsRemaining = this.TIME_STEP_SECONDS - (nowSeconds % this.TIME_STEP_SECONDS);

    // 2. Buffer del contador en formato Big-Endian (8 bytes por estándar RFC 4226)
    const counterBuffer = Buffer.alloc(8);
    counterBuffer.writeBigUInt64BE(BigInt(counter));

    // 3. Generar HMAC-SHA256
    const seedBuffer = Buffer.from(qrSeed, 'hex');
    const hmac = crypto.createHmac('sha256', seedBuffer);
    hmac.update(counterBuffer);
    const digest = hmac.digest();

    // 4. Truncamiento dinámico (extraer 8 bytes de alta entropía)
    const offset = digest[digest.length - 1] & 0x0f;
    const truncatedHash = digest.subarray(offset, offset + 8).toString('hex');

    // 5. Payload ensamblado: <ticketId>.<counterHex>.<truncatedHash>
    const qrPayload = `${ticketId}.${counter.toString(16)}.${truncatedHash}`;

    return {
      qrPayload,
      secondsRemaining
    };
  }
}
```

### 3.3. Motor de Validación Offline en Escáner (Torniquete)

El escáner del staff de puerta ejecuta la validación matemática contra una base de datos local SQLite pre-cargada con los tickets del evento:

```typescript
// OfflineTurnstileValidator.ts
import crypto from 'node:crypto';

export interface ScanResult {
  allowed: boolean;
  ticketId?: string;
  statusCode: 'APPROVED' | 'EXPIRED_CODE' | 'CLOCK_DRIFT_EXCEEDED' | 'ALREADY_USED' | 'INVALID_SIGNATURE' | 'TICKET_NOT_FOUND';
  message: string;
}

export class OfflineTurnstileValidator {
  private static readonly TIME_STEP_SECONDS = 15;
  private static readonly ALLOWED_DRIFT_STEPS = 1; // Permite ±1 paso (tolerancia de 30 segundos)

  /**
   * Valida un QR escaneado completamente fuera de línea
   */
  public static validateScan(
    scannedPayload: string,
    localDbQuery: (ticketId: string) => { qrSeed: string; status: 'VALID' | 'USED'; usedAt?: string } | null,
    markTicketUsed: (ticketId: string, timestamp: number) => void
  ): ScanResult {
    const parts = scannedPayload.split('.');
    if (parts.length !== 3) {
      return { allowed: false, statusCode: 'TICKET_NOT_FOUND', message: 'Formato de código inválido' };
    }

    const [ticketId, counterHex, providedHash] = parts;
    const clientCounter = parseInt(counterHex, 16);

    // 1. Consultar base de datos local pre-sincronizada
    const ticketRecord = localDbQuery(ticketId);
    if (!ticketRecord) {
      return { allowed: false, statusCode: 'TICKET_NOT_FOUND', message: 'Entrada no registrada para este evento' };
    }

    // 2. Comprobar si ya fue usada
    if (ticketRecord.status === 'USED') {
      return { 
        allowed: false, 
        ticketId, 
        statusCode: 'ALREADY_USED', 
        message: `Entrada ya ingresada previamente a las ${ticketRecord.usedAt}` 
      };
    }

    // 3. Comprobar deriva de tiempo (Time Drift)
    const currentSeconds = Math.floor(Date.now() / 1000);
    const serverCounter = Math.floor(currentSeconds / this.TIME_STEP_SECONDS);
    const drift = Math.abs(serverCounter - clientCounter);

    if (drift > this.ALLOWED_DRIFT_STEPS) {
      return { 
        allowed: false, 
        ticketId, 
        statusCode: 'EXPIRED_CODE', 
        message: 'Código expirado. Asegúrese de mostrar el código en vivo en la aplicación.' 
      };
    }

    // 4. Verificar HMAC contra la clave almacenada
    const counterBuffer = Buffer.alloc(8);
    counterBuffer.writeBigUInt64BE(BigInt(clientCounter));

    const seedBuffer = Buffer.from(ticketRecord.qrSeed, 'hex');
    const hmac = crypto.createHmac('sha256', seedBuffer);
    hmac.update(counterBuffer);
    const digest = hmac.digest();

    const offset = digest[digest.length - 1] & 0x0f;
    const expectedHash = digest.subarray(offset, offset + 8).toString('hex');

    if (!crypto.timingSafeEqual(Buffer.from(providedHash), Buffer.from(expectedHash))) {
      return { allowed: false, ticketId, statusCode: 'INVALID_SIGNATURE', message: 'Firma criptográfica inválida (posible copia/falsificación)' };
    }

    // 5. Entrada válida: Registrar ingreso local de inmediato
    markTicketUsed(ticketId, Date.now());

    return {
      allowed: true,
      ticketId,
      statusCode: 'APPROVED',
      message: 'Acceso Permitido'
    };
  }
}
```

---

## 4. Arquitectura de Sincronización Local entre Torniquetes (Local Mesh)

Para evitar que una misma persona intente ingresar por la Puerta A y la Puerta B en simultáneo cuando no hay conexión a Internet en el estadio:

```
  +---------------------------------------------------------------------------------------------+
  |               RED DE ÁREA LOCAL EN EL RECINTO (WI-FI AISLADO / LAN PRIVADA)                 |
  +---------------------------------------------------------------------------------------------+
         ▲                                           ▲                                   ▲
         │ UDP Multicast / WebSocket                 │ UDP Multicast                     │ UDP Multicast
         ▼                                           ▼                                   ▼
  +─────────────────────+                     +─────────────────────+             +─────────────────────+
  | Escáner Puerta A     |                     | Escáner Puerta B     |             | Servidor Edge Local |
  | (Tablet Staff)      |                     | (Torniquete Físico) |             | (Raspberry Pi / NUC)|
  | • BD SQLite local   |                     | • BD SQLite local   |             | • Hub de sincronía  |
  +─────────────────────+                     +─────────────────────+             +─────────────────────+
         │                                                                               │
         └─────────────────── Ticket "TKT-9821" ingresado en Puerta A ──────────────────>┘
                             El servidor Edge propaga inmediatamente a Puerta B.
                             Si Puerta B escanea "TKT-9821", lo rechaza como ALREADY_USED.
```

- **Protocolo de Sincronización:** Cada escáner emite un paquete ligero por **UDP Multicast (puerto 5353/7400)** en la subred del estadio con el payload `{"ticketId": "...", "usedAt": 1725500000, "door": "PUERTA_A"}`.
- **Resiliencia:** Si la red local del estadio falla completamente, cada escáner sigue operando de forma autónoma. Cuando la red se restablece, los escáneres ejecutan un protocolo de reconciliación basado en marcas de tiempo Unix.

---

## 5. Gobernanza de Transferencias Persona a Persona (P2P)

A diferencia del envío de un PDF o una captura que deja copias en ambas partes, Quentro implementa un patrón de **Reasignación Atómica de Semilla Criptográfica**:

1. **Solicitud de Transferencia:** El Comprador A ingresa el email del Comprador B en la aplicación.
2. **Revocación Inmediata:** El backend marca la semilla anterior de A como `REVOKED` en la base de datos central.
3. **Generación de Nueva Semilla:** El backend genera un nuevo `qr_seed` único asociado exclusivamente al dispositivo de B.
4. **Invalidación en el Teléfono Emisor:** Mediante una notificación silenciosa (*Push Notification* o WebSocket), el teléfono de A purga la entrada de su almacenamiento local seguro.
5. **Reglas de Negocio Anti-Especulación:**
   - Límite de transferencias por ticket (ej: máximo 1 transferencia permitida).
   - *Transfer Blackout Window:* Las transferencias se bloquean automáticamente 4 horas antes del inicio del evento.

---

## 6. Comparativa Arquitectónica: Quentro vs. TiketYA Actual (`SEQ-005`)

| Dimensión | Enfoque Actual de TiketYA (`SEQ-005`) | Enfoque Smart Ticketing (Modelo Quentro) | Recomendación de Evolución para TiketYA |
| :--- | :--- | :--- | :--- |
| **Generación del QR** | QR rotativo con `<ticketId>.<code>` basado en `qr_seed`. | QR dinámico TOTP RFC 6238 en cliente (15s). | **Mantener algoritmo TOTP:** Asegurar que el front web (`apps/web`) calcule el código sin llamadas HTTP continuas. |
| **Validación en Puerta** | Llamada online síncrona: `POST .../checkin/scan` con `SELECT FOR UPDATE` en PostgreSQL. | **100% Offline:** Validación matemática local en escáner con pre-carga de eventos. | **Implementar Modo Híbrido en `qr-scanner`:** Si hay conexión, valida con API; si se cae la red (modo estadio), conmuta automáticamente a validación SQLite local. |
| **Prevención de Clonación** | Depende de la velocidad de actualización en DB central. | Imposible clonar por fotos o capturas (expira a los 15s). | Agregar `FLAG_SECURE` en apps móviles o detección de captura de pantalla en la PWA. |
| **Fricción de Usuario** | Web App / PWA en navegador. | Obliga a descargar una app nativa pesada de Google Play / App Store. | **VENTAJA PARA TIKETYA:** Mantener la experiencia web móvil / PWA o emitir **Apple Wallet / Google Wallet Passes**, evitando obligar al usuario a instalar apps de terceros. |

---

## 7. Hoja de Ruta de Implementación para TiketYA

1. **Sprint 1 (Criptografía y Web Crypto):** Adaptar el componente de visualización de ticket en `apps/web` para calcular el QR dinámico mediante Web Cryptography API en IndexedDB, rotando cada 15 segundos con contador decreciente.
2. **Sprint 2 (Pre-carga en `qr-scanner`):** Añadir botón en la aplicación de staff para "Descargar entradas para escaneo offline" antes de que comience el show, almacenando los `qr_seeds` en IndexedDB/SQLite local.
3. **Sprint 3 (Motor de Reconciliación):** Implementar la sincronización en segundo plano (*Background Sync*) que envíe los registros de `usedAt` a `apps/api` cuando el escáner recupere la conexión a Internet.
