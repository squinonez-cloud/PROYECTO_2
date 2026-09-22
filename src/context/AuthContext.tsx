import React, { createContext, useContext, useState } from 'react';
import { Usuario, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [idSesion, setIdSesion] = useState<number | null>(null);

  const login = (usuarioData: Usuario, sesionId: number) => {
    setUsuario(usuarioData);
    setIdSesion(sesionId);
  };

  const logout = () => {
    setUsuario(null);
    setIdSesion(null);
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