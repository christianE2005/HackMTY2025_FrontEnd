import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFutureFlights } from '../services/futureflights';
import '../App.css';

const apiKey = process.env.REACT_APP_AVIATION_EDGE_API || '7a2b14-202d05';


// Ícono de avión SVG
const PlaneIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1D2C66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
  </svg>
);

// Ícono de búsqueda SVG
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('2025-10-24');
  const [tipoVuelo, setTipoVuelo] = useState('nacionales');
  const [vuelos, setVuelos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleGenerarMenuIA = (vuelo) => {
    navigate('/menu-ia', { state: { vuelo } });
  };

  const handleSimularML = (vuelo) => {
    navigate('/simular-ml', { state: { vuelo } });
  };

  const handleFilter = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getFutureFlights({
        date: startDate,
        iataCode: 'MTY',
        arrDep: tipoVuelo === 'nacionales' ? 'departure' : 'arrival'
      });
      setVuelos(response || []);
    } catch (err) {
      console.error('Error al cargar vuelos:', err);
      setError('No se pudo obtener vuelos desde Aviation Edge.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFilter();
  }, []);

  const vuelosFiltrados = vuelos.filter((vuelo) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.trim().toLowerCase();
    const values = [
      vuelo.flight?.iataNumber,
      vuelo.airline?.name,
      vuelo.departure?.iataCode,
      vuelo.arrival?.iataCode
    ]
      .filter(Boolean)
      .map((v) => String(v).toLowerCase())
      .join(' ');
    return values.includes(term);
  });

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-bold">gate</span>
            <span className="logo-light">group</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="title-section">
          <PlaneIcon />
          <h1 className="title">Vuelos programados</h1>
        </div>

        <div className="filter-container">
          <div className="filter-row">
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

            <div className="date-field">
              <span className="date-label">Fecha de inicio:</span>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="date-input"
              />
            </div>

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

            <button onClick={handleFilter} className="filter-button">
              Filtrar
            </button>
          </div>
        </div>

        {loading && <p>Cargando vuelos...</p>}
        {error && <p style={{ color: 'orange' }}>{error}</p>}

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

        <div className="table-body">
          {vuelosFiltrados.map((vuelo, index) => (
            <div key={index} className="table-row">
              <div className="flight-number">{vuelo.flight?.iataNumber || 'N/A'}</div>
              <div className="airline">{vuelo.airline?.name || 'N/A'}</div>
              <div className="route">{vuelo.departure?.iataCode} - {vuelo.arrival?.iataCode}</div>
              <div className="time">{vuelo.departure?.scheduledTime?.slice(11, 16)}</div>
              <div className="time">{vuelo.arrival?.scheduledTime?.slice(11, 16)}</div>
              <div>
                <span className="status-badge status-on-time">Programado</span>
              </div>
              <div>
                <button className="action-button" onClick={() => handleSimularML(vuelo)}>
                  Simular Menú con ML
                </button>
              </div>
              <div>
                <button className="action-button" onClick={() => handleGenerarMenuIA(vuelo)}>
                  Generar Menú con IA
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;
