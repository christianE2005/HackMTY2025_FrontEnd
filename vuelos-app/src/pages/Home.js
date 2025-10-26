import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFutureFlights } from '../services/flightService';
import '../App.css';

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
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoVuelo, setTipoVuelo] = useState('nacionales');
  const [vuelos, setVuelos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calcular fecha de mañana (siempre)
  const getTomorrowDate = () => {
    // Usar fecha fija válida para el backend (nov 3, 2025)
    return '03-11-2025';
  };

  const [startDate, setStartDate] = useState(getTomorrowDate());

  // Fetch vuelos futuros al cargar el componente
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('📡 Iniciando carga de vuelos...'); // Debug
        const data = await getFutureFlights();
        console.log('✅ Datos recibidos del backend:', data); // Debug
        
        // El backend devuelve { items: [...], total, page, per_page, total_pages }
        const flightsArray = data?.items || [];
        console.log('📋 Total de vuelos recibidos:', flightsArray.length); // Debug
        
        // Mapear los datos del backend al formato esperado por el componente
        const mappedFlights = flightsArray.map((flight, index) => ({
          id: index + 1,
          vuelo: flight.flight?.iataNumber || 'N/A',
          aerolinea: flight.airline?.name || 'N/A',
          origen: flight.departure?.iataCode?.toUpperCase() || 'N/A',
          destino: flight.arrival?.iataCode?.toUpperCase() || 'N/A',
          horarioInicial: flight.departure?.scheduledTime || 'N/A',
          horarioDestino: flight.arrival?.scheduledTime || 'N/A',
          estatus: 'A tiempo', // El backend no proporciona estado, asumir "A tiempo"
          // Datos adicionales para enviar al modelo
          flight_type: 'medium-haul', // por defecto
          service_type: 'Retail',
          passenger_count: 200, // estimado
          origenCodigo: flight.departure?.iataCode?.toUpperCase(),
          terminal: flight.departure?.terminal,
          gate: flight.departure?.gate
        }));
        
        setVuelos(mappedFlights);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching future flights:', err);
        setError('No se pudieron cargar los vuelos. Usando datos de respaldo.');
        // Fallback data
        setVuelos([
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
        setLoading(false);
      }
    };

    fetchFlights();
  }, []);

  const handleFilter = () => {
    console.log('Filtrando vuelos...', { searchTerm, startDate, tipoVuelo });
  };

  const handleGenerarMenuIA = (vuelo) => {
    navigate('/menu-ia', { state: { vuelo } });
  };
  
  const handleSimularML = (vuelo) => {
    navigate('/simular-ml', { state: { vuelo } });
  };

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
          {error && (
            <div style={{ 
              backgroundColor: '#fef3c7', 
              border: '1px solid #fbbf24',
              padding: '12px 16px',
              borderRadius: '6px',
              marginBottom: '16px',
              color: '#92400e'
            }}>
              {error}
            </div>
          )}
          
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
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              Cargando vuelos...
            </div>
          ) : vuelos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              No hay vuelos programados
            </div>
          ) : (
            vuelos.map((vuelo) => (
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
          ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;
