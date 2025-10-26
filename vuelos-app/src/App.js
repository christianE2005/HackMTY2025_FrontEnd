import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import MenuIA from './pages/MenuIA';
import SimularML from './pages/SimularML';
import Inventory from './pages/Inventory';
import PredictionResults from './pages/PredictionResults';
import KPIsMejorados from './pages/KPIsMejorados';
import './App.css';

function MenuIARouteWrapper() {
  const location = useLocation();
  const vuelo = location.state?.vuelo || null;
  const navigate = useNavigate();
  return <MenuIA vueloSeleccionado={vuelo} onBack={() => navigate('/')} />;
}

function SimularMLRouteWrapper() {
  const location = useLocation();
  const vuelo = location.state?.vuelo || null;
  const navigate = useNavigate();
  return <SimularML vueloSeleccionado={vuelo} onBack={() => navigate('/')} />;
}

function KPIsMejoradosRouteWrapper() {
  const location = useLocation();
  const vuelo = location.state?.vuelo || null;
  const navigate = useNavigate();
  return <KPIsMejorados vueloSeleccionado={vuelo} onBack={() => navigate('/')} />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu-ia" element={<MenuIARouteWrapper />} />
        <Route path="/simular-ml" element={<SimularMLRouteWrapper />} />
        <Route path="/KPIsMejorados" element={<KPIsMejoradosRouteWrapper />} />
        <Route path="/kpi-mejorados" element={<KPIsMejoradosRouteWrapper />} />
        <Route path="/inventario" element={<Inventory />} />
        <Route path="/prediction-results" element={<PredictionResults />} />
      </Routes>
    </Router>
  );
}

export default App;