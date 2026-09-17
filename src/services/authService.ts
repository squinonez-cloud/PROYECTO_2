// authService.ts
// Este archivo centraliza las llamadas al backend relacionadas con
// autenticación (login, registro, logout). Cuando el equipo de backend
// tenga la API lista, solo hay que ajustar BASE_URL y las rutas.
//
// Mientras backend no esté listo, puedes dejar USE_MOCK en true para
// que el login/registro "funcione" con datos falsos y así poder
// mostrar la pantalla funcionando en la entrega.

const BASE_URL = "http://localhost:4000/api"; // ajustar cuando backend confirme el puerto/URL
const USE_MOCK = true; // cambiar a false cuando el backend esté conectado

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  usuario?: {
    id: number;
    nombre: string;
    email: string;
  };
}

export async function login(data: LoginData): Promise<AuthResponse> {
  if (USE_MOCK) {
    // Simulación temporal mientras backend no tiene el endpoint listo
    await esperar(600);
    if (data.email && data.password) {
      return {
        success: true,
        usuario: { id: 1, nombre: "Usuario de prueba", email: data.email },
      };
    }
    return { success: false, message: "Credenciales inválidas" };
  }

  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function registrar(data: RegisterData): Promise<AuthResponse> {
  if (USE_MOCK) {
    await esperar(600);
    return {
      success: true,
      usuario: { id: 2, nombre: data.nombre, email: data.email },
    };
  }

  const response = await fetch(`${BASE_URL}/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function logout(): Promise<void> {
  if (USE_MOCK) {
    await esperar(300);
    return;
  }

  await fetch(`${BASE_URL}/logout`, { method: "POST" });
}

function esperar(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
