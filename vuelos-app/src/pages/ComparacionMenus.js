import React, { useState } from 'react';
import KPIsMejorados from './KPIsMejorados';
import './ComparacionMenus.css';

// Ícono de flecha para regresar
const ArrowLeftIcon = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="white" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const ComparacionMenus = ({ onBack, archivoUsuario, vueloSeleccionado }) => {
  const [menuUsuario] = useState([
    { id: 1, nombre: 'Pollo en Salsa BBQ', cantidad: 160, consumido: 84 },
    { id: 2, nombre: 'Lasaña Vegetariana', cantidad: 52, consumido: 89 },
    { id: 3, nombre: 'Jugo de Naranja', cantidad: 160, consumido: 87 }
  ]);

  const [mostrarKPIs, setMostrarKPIs] = useState(false);
  const [menuSugerido, setMenuSugerido] = useState([
    { id: 1, nombre: 'Pollo en Salsa de Chipotle', cantidad: 91, sugerido: true },
    { id: 2, nombre: 'Pasta Alfredo Vegetales', cantidad: 70, sugerido: true },
    { id: 3, nombre: 'Jugo de Naranja', cantidad: 92, sugerido: true }
  ]);

  const [diferencias] = useState([
    '2x más seleccionado vs anterior',
    'Preferencia por calorías',
    'Aumento del bienestar',
    'Mayor satisfacción reportada',
    'Optimización de costos'
  ]);

  const [beneficios] = useState([
    'Rating: 4.3/5',
    '90% aceptado',
    'Reducción de desperdicio: 15%',
    'Ahorro estimado: $450 MXN'
  ]);

  const handleCantidadChange = (id, nuevaCantidad) => {
    setMenuSugerido(menuSugerido.map(item => 
      item.id === id ? { ...item, cantidad: parseInt(nuevaCantidad) || 0 } : item
    ));
  };

  const handleDescargar = () => {
    console.log('Descargando menú sugerido...');
    alert('Descargando archivo Excel con el menú sugerido');
  };

  const handleGuardar = () => {
    console.log('Guardando cambios...');
    alert('Cambios guardados exitosamente');
  };

  const handleKPIs = () => {
    setMostrarKPIs(true);
  };
  if (mostrarKPIs) {
    return <KPIsMejorados onBack={() => setMostrarKPIs(false)} vueloSeleccionado={vueloSeleccionado} />;
  }

  return (
    <div className="comparacion-container">
      {/* Header */}
      <header className="header">
        <div className="header-content-menu">
          <div className="logo">
            <span className="logo-bold">gate</span>
            <span className="logo-light">group</span>
          </div>
          <div className="header-buttons">
            <button className="header-btn-back" onClick={onBack}>
              <ArrowLeftIcon />
              <span>Regresar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content-comparacion">
        <div className="comparacion-title-section">
          <h1 className="comparacion-title">Análisis de Vuelos Similares</h1>
          <p className="comparacion-subtitle">Optimiza menú basado en vuelos previos</p>
        </div>

        {/* Comparación de Menús */}
        <div className="menus-grid">
          {/* Menú del Usuario */}
          <div className="menu-card menu-usuario">
            <div className="menu-card-header usuario-header">
              <h2>Vuelo Similar Anterior</h2>
            </div>
            <div className="menu-card-info">
              <p><strong>AA 2453</strong> - 18 Oct 2025</p>
              <p>MEX → JFK | 184 pax</p>
              <p>Similitud: 94%</p>
            </div>
            <div className="menu-card-content">
              <h3>Menú Servido:</h3>
              {menuUsuario.map((item) => (
                <div key={item.id} className="menu-item-comp">
                  <div className="item-info">
                    <span className="item-nombre">{item.nombre}</span>
                    <span className="item-cantidad">{item.cantidad} unidades</span>
                  </div>
                  <div className="item-consumo">
                    <div className="consumo-badge">{item.consumido}% consumido</div>
                  </div>
                </div>
              ))}
              
              <div className="metricas-usuario">
                <h4>📊 Métricas de Satisfacción</h4>
                <ul>
                  <li>Rating: 4.3/5</li>
                  <li>90% aceptado</li>
                  <li>Fecha: 18 Oct 2025</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Menú Recomendado */}
          <div className="menu-card menu-recomendado">
            <div className="menu-card-header recomendado-header">
              <h2>Menú Recomendado</h2>
            </div>
            <div className="menu-card-info">
              <p><strong>AA 2451</strong> - 25 Oct 2025</p>
              <p>MEX → JFK | 158 pax</p>
              <p>Optimizado con IA</p>
            </div>
            <div className="menu-card-content">
              <h3>Menú Sugerido:</h3>
              {menuSugerido.map((item) => (
                <div key={item.id} className="menu-item-comp editable">
                  <div className="item-info">
                    <span className="item-nombre">{item.nombre}</span>
                    <div className="cantidad-input-group">
                      <label>Cantidad:</label>
                      <input
                        type="number"
                        value={item.cantidad}
                        onChange={(e) => handleCantidadChange(item.id, e.target.value)}
                        className="cantidad-input"
                        min="0"
                      />
                      <span>unidades</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="insights-section">
                <h4>💡 Insights</h4>
                <ul>
                  {diferencias.map((diff, index) => (
                    <li key={index}>{diff}</li>
                  ))}
                </ul>
              </div>

              <div className="beneficios-section">
                <h4>✨ Beneficios</h4>
                <ul>
                  {beneficios.map((beneficio, index) => (
                    <li key={index}>{beneficio}</li>
                  ))}
                </ul>
              </div>

              <div className="confianza-badge">
                Confianza: 98%
              </div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="action-buttons-comparacion">
          <button className="comp-btn" onClick={handleKPIs}>
            Ver KPIs Mejorados
          </button>
          <button className="comp-btn" onClick={handleGuardar}>
            Guardar Cambios
          </button>
          <button className="comp-btn" onClick={handleDescargar}>
            Descargar Menú
          </button>
        </div>
      </main>
    </div>
  );
};

export default ComparacionMenus;