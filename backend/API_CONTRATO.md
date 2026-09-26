# Contrato de API — Proyecto Vinilos

Este documento define el formato exacto que debe usar cada endpoint del backend, para que frontend y backend siempre coincidan en los nombres de campos y la forma de la respuesta. Cualquier endpoint nuevo debe agregarse aquí antes de programarse.

Base URL en desarrollo: `http://localhost:4000/api`

---

## POST /login

**Body que recibe:**
```json
{
  "email": "correo@ejemplo.com",
  "password": "texto plano (se valida contra el hash guardado)"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "usuario": { "id": 1, "nombre": "Nombre", "email": "correo@ejemplo.com", "rol": "usuario" },
  "idSesion": 1
}
```

**Respuesta de error (401):**
```json
{ "success": false, "message": "Credenciales inválidas" }
```

---

## POST /registro

**Body que recibe:**
```json
{
  "nombre": "Nombre completo",
  "email": "correo@ejemplo.com",
  "password": "mínimo 6 caracteres"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "usuario": { "id": 1, "nombre": "Nombre", "email": "correo@ejemplo.com" }
}
```

**Respuesta de error (400/409):**
```json
{ "success": false, "message": "Descripción del error" }
```

---

## POST /logout

**Body que recibe:**
```json
{ "idSesion": 1 }
```

**Respuesta exitosa (200):**
```json
{ "success": true }
```

---

## GET /sesiones

**No recibe body.**

**Respuesta exitosa (200) — arreglo directo, SIN envolver en objeto:**
```json
[
  {
    "id": 1,
    "usuario": "Nombre del usuario",
    "fechaEntrada": "2026-09-17 09:10",
    "fechaSalida": null
  }
]
```

`fechaSalida` es `null` cuando la sesión sigue activa.

---

## GET /productos

**No recibe body.**

**Respuesta exitosa (200) — arreglo directo:**
```json
[
  {
    "id": 1,
    "titulo": "string",
    "artista": "string",
    "precio": 24.99,
    "imagen": "string (URL)"
  }
]
```

---

## POST /ordenes

**Body que recibe:**
```json
{
  "idUsuario": 1,
  "items": [
    { "id": 3, "cantidad": 2 }
  ]
}
```

El precio de cada item se calcula del lado del servidor (consultando la tabla `vinilos`), nunca se recibe del cliente.

**Respuesta exitosa (200):**
```json
{ "success": true, "idOrden": 5, "subtotal": 100.00, "iva": 12.00, "total": 112.00 }
```

El IVA se calcula automáticamente al 12% del subtotal. El total
(que incluye IVA) es lo que se guarda en la tabla ordenes y lo que
se usa para el asiento contable (cargo a Caja).

**Respuesta de error (400):**
```json
{ "success": false, "message": "Descripción del error" }
```

Al crearse la orden, el backend genera automáticamente el asiento contable correspondiente (ver `services/contable.service.js`).

---

## GET /ordenes

**No recibe body.**

**Respuesta exitosa (200) — arreglo directo:**
```json
[
  {
    "id": 1,
    "usuario": "Nombre del usuario",
    "total": 112.00,
    "estado": "pendiente",
    "fecha": "2026-09-20 14:30"
  }
]
```

---

## GET /balance

**No recibe body.**

**Respuesta exitosa (200):**
```json
{
  "cuentas": [
    {
      "codigo": "1000",
      "cuenta": "Caja",
      "tipo": "activo",
      "totalCargos": 112.00,
      "totalAbonos": 0
    }
  ],
  "totalCargos": 112.00,
  "totalAbonos": 112.00,
  "cuadra": true
}
```

`cuadra` es `true` cuando el total de cargos es igual al total de abonos en todas las cuentas.

---

## Reglas generales para cualquier endpoint nuevo

- Un endpoint que devuelve un solo resultado (login, registro, crear una orden) responde con `{ success, ... }`.
- Un endpoint que devuelve una lista (`/sesiones`, `/productos`, `/ordenes`) responde con el arreglo directo, sin envolver en un objeto.
- `/balance` es la única excepción a la regla de lista directa, porque además del arreglo de cuentas necesita devolver los totales generales y si cuadra.
- Los códigos de error usan: `400` (datos faltantes o inválidos), `401` (credenciales incorrectas), `409` (ya existe), `429` (demasiados intentos), `500` (error del servidor).
- Los nombres de campos siempre en español y en `camelCase` (ej. `fechaEntrada`, no `fecha_entrada` ni `fecha entrada`).
- Ningún endpoint expone `password` ni `passwordHash` en sus respuestas.