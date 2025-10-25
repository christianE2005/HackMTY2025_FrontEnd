import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import MenuIA from './MenuIA';
import SimularML from './SimularML';
import Inventory from './Inventory';
import './App.css';

// Ícono de avión SVG
const PlaneIcon = () => (
  <svg 
    width="32" 
    height="32" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="#1D2C66" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
  </svg>
);

// Ícono de búsqueda SVG
const SearchIcon = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="#9ca3af" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('24-10-2025');
  const [tipoVuelo, setTipoVuelo] = useState('nacionales');
  const [vueloSeleccionado, setVueloSeleccionado] = useState(null);
  const [vuelos] = useState([
    {
      id: 1,
      vuelo: 'AM 401',
      aerolinea: 'Aeroméxico',
      origen: 'MTY',
      destino: 'MEX',
      horarioInicial: '08:30',
      horarioDestino: '10:45',
      estatus: 'A tiempo'
    },
    {
      id: 2,
      vuelo: 'Y4 523',
      aerolinea: 'Volaris',
      origen: 'MTY',
      destino: 'GDL',
      horarioInicial: '12:15',
      horarioDestino: '14:20',
      estatus: 'Retrasado'
    },
    {
      id: 3,
      vuelo: 'VB 341',
      aerolinea: 'VivaAerobus',
      origen: 'MTY',
      destino: 'CUN',
      horarioInicial: '15:00',
      horarioDestino: '17:30',
      estatus: 'A tiempo'
    }
  ]);

  const handleFilter = () => {
    console.log('Filtrando vuelos...', { searchTerm, startDate, tipoVuelo });
  };

  const navigate = useNavigate();
  const handleGenerarMenuIA = (vuelo) => {
    setVueloSeleccionado(vuelo);
    // navigate to menu-ia route and pass vuelo in location.state
    navigate('/menu-ia', { state: { vuelo } });
  };
  const handleSimularML = (vuelo) => {
    setVueloSeleccionado(vuelo);
    setVistaActual('ml');
  };
  if (vistaActual === 'menui-a') {
    return <MenuIA vueloSeleccionado={vueloSeleccionado} onBack={() => setVistaActual('vuelos')} />;
  }else  if (vistaActual === 'ml') {
    return <SimularML vueloSeleccionado={vueloSeleccionado} onBack={() => setVistaActual('vuelos')} />;
  }
  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-bold">gate</span>
            <span className="logo-light">group</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="title-section">
          <PlaneIcon />
          <h1 className="title">Vuelos programados</h1>
        </div>

        {/* Filter Section */}
        <div className="filter-container">
          <div className="filter-row">
            {/* Search Field */}
            <div className="search-field">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ID del vuelo"
                className="search-input"
              />
              <div className="search-icon">
                <SearchIcon />
              </div>
            </div>

            {/* Date Field */}
            <div className="date-field">
              <span className="date-label">Fecha de inicio:</span>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="date-input"
              />
            </div>

            {/* Toggle Slider */}
            <div className="toggle-slider">
              <button
                onClick={() => setTipoVuelo('nacionales')}
                className={`toggle-button ${tipoVuelo === 'nacionales' ? 'active' : ''}`}
              >
                Vuelos Nacionales
              </button>
              <button
                onClick={() => setTipoVuelo('internacionales')}
                className={`toggle-button ${tipoVuelo === 'internacionales' ? 'active' : ''}`}
              >
                Vuelos Internacionales
              </button>
            </div>

            {/* Filter Button */}
            <button onClick={handleFilter} className="filter-button">
              Filtrar
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className="table-header">
          <div className="table-header-row">
            <div>VUELO</div>
            <div>AEROLÍNEA</div>
            <div>ORIGEN-DESTINO</div>
            <div>HORARIO INICIAL</div>
            <div>HORARIO DESTINO</div>
            <div>ESTATUS</div>
            <div>ACCIÓN 1</div>
            <div>ACCIÓN 2</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="table-body">
          {vuelos.map((vuelo) => (
            <div key={vuelo.id} className="table-row">
              <div className="flight-number">{vuelo.vuelo}</div>
              <div className="airline">{vuelo.aerolinea}</div>
              <div className="route">{vuelo.origen} - {vuelo.destino}</div>
              <div className="time">{vuelo.horarioInicial}</div>
              <div className="time">{vuelo.horarioDestino}</div>
              <div>
                <span className={`status-badge ${vuelo.estatus === 'A tiempo' ? 'status-on-time' : 'status-delayed'}`}>
                  {vuelo.estatus}
                </span>
              </div>
              <div>
                <button className="action-button" onClick={() => handleSimularML(vuelo)}>Simular Menú con ML</button>
              </div>
              <div>
                <button className="action-button" onClick={() => handleGenerarMenuIA(vuelo)}
                  >Generar Menú con IA</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function MenuIARouteWrapper() {
  const location = useLocation();
  const vuelo = location.state?.vuelo || null;
  const navigate = useNavigate();
  return <MenuIA vueloSeleccionado={vuelo} onBack={() => navigate('/')} />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu-ia" element={<MenuIARouteWrapper />} />
        <Route path="/inventario" element={<Inventory />} />
      </Routes>
    </Router>
  );
}

export default App;