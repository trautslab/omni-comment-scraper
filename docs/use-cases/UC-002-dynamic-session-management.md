# UC-002: Gestión Dinámica de Sesiones y Credenciales (Session Vault)

- **ID:** `UC-002`
- **Nombre:** Gestión Dinámica de Sesiones desde UI
- **Actor Primario:** Usuario / Investigador de Datos
- **Precondiciones:** Acceso local a la interfaz visual en `http://localhost:3333`.

---

## 1. Flujo Principal (Captura de Sesión)
1. El usuario navega a la pestaña **Session Vault** en el Dashboard.
2. Observa las tarjetas de cada plataforma social con su estado actual (`active`, `expired`, `missing`).
3. Para una plataforma desconectada (ej. Instagram), presiona *"Login Navegador"*.
4. El backend lanza una ventana del navegador dirigida a la página oficial de autenticación de la plataforma.
5. El usuario completa el login (incluyendo 2FA si aplica).
6. El usuario pega o importa las cookies en el Session Vault mediante *"Pegar Cookies"* o el bridge.
7. Presiona *"Probar"* (`verifySession`). El backend realiza una petición de health check a la API de la red social.
8. La sesión se valida como `200 OK`, se persiste en `.sessions/vault.json` y el indicador pasa a 🟢 `active`.

## 2. Flujo Alternativo (Sesión Expirada)
- Si una sesión almacenada es invalidada por la plataforma, el health check reporta `status: expired`.
- El sistema alerta al usuario visualmente en el Dashboard para que renueve sus cookies antes de lanzar extracciones en bloque.
