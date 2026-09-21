export interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

export interface AuthContextType {
  usuario: Usuario | null;
  idSesion: number | null;
  login: (usuario: Usuario, idSesion: number) => void;
  logout: () => void;
}