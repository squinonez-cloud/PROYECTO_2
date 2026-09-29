import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CatalogoPage } from "./pages/CatalogoPage";
import HistorialPage from "./pages/HistorialPage";
import CarritoPage from "./pages/CarritoPage";
import AdminPage from "./pages/AdminPage";
import { useAuth } from "./context/AuthContext";
import { CarritoProvider } from "./context/CarritoContext";
import FacturaPage from "./pages/FacturaPage";


function RutaAdmin({ children }: { children: React.ReactNode }) {
  const { usuario } = useAuth();
  if (!usuario || usuario.rol !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <CarritoProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/catalogo" element={<CatalogoPage />} />
            <Route path="/historial" element={<RutaAdmin><HistorialPage /></RutaAdmin>} />
            <Route path="/carrito" element={<CarritoPage />} />
            <Route path="/admin" element={<RutaAdmin><AdminPage /></RutaAdmin>} />
            <Route path="/factura" element={<FacturaPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </CarritoProvider>
  );
}

export default App;