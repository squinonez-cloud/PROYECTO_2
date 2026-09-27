import React, { createContext, useContext, useState } from 'react';
import type { Usuario, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });
  const [idSesion, setIdSesion] = useState<number | null>(() => {
    const guardado = localStorage.getItem('idSesion');
    return guardado ? Number(guardado) : null;
  });

  const login = (usuarioData: Usuario, sesionId: number) => {
    setUsuario(usuarioData);
    setIdSesion(sesionId);
    localStorage.setItem('usuario', JSON.stringify(usuarioData));
    localStorage.setItem('idSesion', String(sesionId));
  };

  const logout = () => {
    setUsuario(null);
    setIdSesion(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('idSesion');
  };

  return (
    <AuthContext.Provider value={{ usuario, idSesion, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};