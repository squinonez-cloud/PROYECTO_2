import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CatalogoPage from "./pages/CatalogoPage";
import HistorialPage from "./pages/HistorialPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/catalogo" element={<CatalogoPage />} />
          <Route path="/historial" element={<HistorialPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;