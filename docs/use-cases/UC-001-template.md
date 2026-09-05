# 🎯 [UC-001] Nombre del Caso de Uso

**Identificador:** `UC-001`  
**Módulo / Dominio:** [e.g. Autenticación / Facturación / Perfiles]  
**Estado:** [DRAFT | IN REVIEW | APPROVED | IMPLEMENTED]  
**Prioridad:** [ALTA | MEDIA | BAJA]  
**RFC Relacionado:** [`RFC-001`](../specs/RFC-001-template.md)  
**Diagrama de Secuencia:** [`SEQ-001`](../diagrams/sequences/SEQ-001-template.md)  

---

## 1. Descripción
[Descripción concisa de la interacción entre el actor y el sistema para lograr un objetivo de negocio.]

## 2. Actores
- **Actor Principal:** [e.g. Usuario Registrado / Administrador / API Client]
- **Actores Secundarios / Sistemas Externos:** [e.g. Pasarela de Pagos Stripe / Proveedor OAuth]

## 3. Precondiciones
1. El usuario debe poseer una sesión válida.
2. El recurso solicitado debe encontrarse en estado `ACTIVO`.

## 4. Flujo Principal (Happy Path)
1. El **Actor** inicia la acción solicitando `X`.
2. El **Sistema** valida los permisos y la integridad de los parámetros.
3. El **Sistema** procesa la regla de negocio `Y`.
4. El **Sistema** persiste la transacción en el almacenamiento.
5. El **Sistema** retorna confirmación con código `200 OK` / `201 Created` y los datos del recurso.

## 5. Flujos Alternativos y Excepciones
- **5.a Parámetros Inválidos:**
  - El sistema detecta datos ausentes o formato incorrecto.
  - Responde con HTTP `422 Unprocessable Entity` y lista de campos erróneos.
- **5.b Recurso No Encontrado o Inactivo:**
  - Responde con HTTP `404 Not Found`.
- **5.c Falla en Servicio Externo:**
  - El sistema activa reintentos controlados con exponential backoff.
  - Si persiste el error, retorna `503 Service Unavailable` sin degradar el resto de la app.

## 6. Postcondiciones
- **Éxito:** Registro creado en BD, evento de auditoría emitido a la cola.
- **Fallo:** Estado del sistema inalterado (Rollback transaccional).

## 7. Criterios de Aceptación (Gherkin BDD)
```gherkin
Escenario: Ejecución exitosa del caso de uso
  Dado que el usuario tiene credenciales válidas
  Cuando envía los datos requeridos
  Entonces el sistema confirma la operación con código 200
  Y se emite el evento de auditoría correspondiente.
```
