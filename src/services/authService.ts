const BASE_URL = "http://localhost:4000/api";

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
    rol: string;
  };
  idSesion?: number;
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function registrar(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function logout(idSesion: number): Promise<void> {
  await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idSesion }),
  });
}