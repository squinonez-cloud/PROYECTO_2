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

## Reglas generales para cualquier endpoint nuevo

- Todo endpoint que devuelva un solo resultado (login, registro) responde con `{ success, ... }`.
- El único endpoint que devuelve una lista (`/sesiones`) responde con el arreglo directo, sin envolver — así lo espera ya el frontend.
- Los códigos de error usan: `400` (datos faltantes o inválidos), `401` (credenciales incorrectas), `409` (ya existe), `500` (error del servidor).
- Los nombres de campos siempre en español y en `camelCase` (ej. `fechaEntrada`, no `fecha_entrada` ni `fecha entrada`).

---

## GET /productos

**No recibe body.**

**Respuesta: un arreglo directo (NO envuelto en un objeto):**
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