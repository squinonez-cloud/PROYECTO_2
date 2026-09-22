import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HistorialPage from "./pages/HistorialPage";
import CarritoPage from "./pages/CarritoPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/historial" element={<HistorialPage />} />
        <Route path="/carrito" element={<CarritoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;