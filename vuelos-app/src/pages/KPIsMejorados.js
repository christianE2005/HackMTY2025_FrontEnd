import React, { useState } from 'react';
import './KPIsMejorados.css';

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

const KPIsMejorados = ({ onBack, vueloSeleccionado }) => {
  const [kpis] = useState({
    rcp: { 
      valor: 1.47, 
      max: 2.0,
      titulo: 'RCP',
      subtitulo: 'Ratio de Consumo por Pasajero',
      icono: '📊'
    },
    ctd: { 
      valor: 450, 
      max: 1000,
      titulo: 'CTD',
      subtitulo: 'Costo Total de Desperdicio',
      icono: '💰',
      unidad: 'MXN'
    },
    cpp: { 
      valor: 85.50, 
      max: 150,
      titulo: 'CPP',
      subtitulo: 'Costo por Pasajero',
      icono: '💵',
      unidad: 'MXN'
    },
    put: { 
      valor: 88, 
      max: 100,
      titulo: 'PUT',
      subtitulo: 'Tasa de Utilización por Producto',
      icono: '📦',
      unidad: '%'
    }
  });

  const [proyeccionConsumo] = useState([
    { mes: 'Coca Cola', valor: 15 },
    { mes: 'Agua', valor: 22 },
    { mes: 'IPA', valor: 35 },
    { mes: 'Pale', valor: 45 },
    { mes: 'Azul', valor: 48 }
  ]);

  const [consumoVsDesperdicio] = useState({
    consumido: 88,
    desperdicio: 12
  });

  const [costos] = useState([
    { categoria: 'Bebidas', costo: 850, porcentaje: 30 },
    { categoria: 'Alimentos', costo: 1420, porcentaje: 50 },
    { categoria: 'Snacks', costo: 340, porcentaje: 12 },
    { categoria: 'Otros', costo: 230, porcentaje: 8 }
  ]);

  const costoTotal = costos.reduce((sum, item) => sum + item.costo, 0);
  const calcularPorcentaje = (valor, max) => (valor / max) * 100;

  return (
    <div className="kpis-container">
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
      <main className="main-content-kpis">
        <div className="kpis-title-section">
          <h1 className="kpis-title">KPIs Mejorados</h1>
          <p className="kpis-subtitle">Análisis detallado de consumo y optimización</p>
        </div>

        {/* KPIs estilo segundo código */}
        <div className="kpis-graficos-pequeños">
          {Object.entries(kpis).map(([key, kpi]) => (
            <div key={key} className="kpi-grafico-card-pequeño">
              <div className="kpi-mini-header">
                <span className="kpi-mini-icono">{kpi.icono}</span>
                <div className="kpi-mini-info">
                  <h4 className="kpi-mini-titulo">{kpi.titulo}</h4>
                  <p className="kpi-mini-subtitulo">{kpi.subtitulo}</p>
                </div>
              </div>
              
              <div className="kpi-mini-valor">
                <span className="valor-mini">
                  {kpi.unidad && kpi.unidad !== '%' && '$'}
                  {kpi.valor}
                  {kpi.unidad === '%' && '%'}
                  {kpi.unidad === 'MXN' && ' MXN'}
                </span>
              </div>

              <div className="kpi-barra-mini">
                <div 
                  className="kpi-barra-fill-mini" 
                  style={{ width: `${calcularPorcentaje(kpi.valor, kpi.max)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Gráficos principales (del primer código) */}
        <div className="graficos-section">
          <h2 className="graficos-title">Análisis Visual</h2>
          
          <div className="graficos-horizontal">
            {/* 1. Proyección de Consumo */}
            <div className="grafico-card">
            <h3>Proyección de Consumo (Sugerido)</h3>
            <div className="chart-container">
                <div className="bar-chart">
                {proyeccionConsumo.map((item, index) => (
                    <div key={index} className="bar-item">
                    <div className="bar-wrapper">
                        <div 
                        className="bar-fill" 
                        style={{ height: `${item.valor}%` }}
                        >
                        <span className="bar-value">{item.valor}%</span>
                        </div>
                    </div>
                    <div className="bar-label">{item.mes}</div>
                    </div>
                ))}
                </div>
            </div>
            </div>

            {/* 2. Consumo vs Desperdicio */}
            <div className="grafico-card">
              <h3>Vuelo Anterior: AM433<br/>(Consumo vs Desperdicio)</h3>
              <div className="chart-container">
                <div className="donut-chart">
                  <svg viewBox="0 0 200 200" className="donut-svg">
                    <circle
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke="#60a5fa"
                      strokeWidth="40"
                      strokeDasharray={`${consumoVsDesperdicio.consumido * 4.4} 440`}
                      transform="rotate(-90 100 100)"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke="#f87171"
                      strokeWidth="40"
                      strokeDasharray={`${consumoVsDesperdicio.desperdicio * 4.4} 440`}
                      strokeDashoffset={`-${consumoVsDesperdicio.consumido * 4.4}`}
                      transform="rotate(-90 100 100)"
                    />
                  </svg>
                  <div className="donut-center">
                    <p className="donut-label">CONSUMIDO</p>
                    <p className="donut-value">{consumoVsDesperdicio.consumido}%</p>
                  </div>
                </div>
                <div className="donut-legend">
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#60a5fa' }}></span>
                    <span>Consumido: {consumoVsDesperdicio.consumido}%</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: '#f87171' }}></span>
                    <span>Desperdicio: {consumoVsDesperdicio.desperdicio}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Distribución de Costos */}
            <div className="grafico-card">
              <h3>💰 Distribución de Costos por Categoría</h3>
              <div className="chart-container">
                <div className="costos-chart">
                  {costos.map((item, index) => (
                    <div key={index} className="costo-item">
                      <div className="costo-header">
                        <span className="costo-categoria">{item.categoria}</span>
                        <span className="costo-monto">${item.costo} MXN</span>
                      </div>
                      <div className="costo-bar-wrapper">
                        <div 
                          className="costo-bar-fill" 
                          style={{ width: `${item.porcentaje}%` }}
                        >
                          <span className="costo-porcentaje">{item.porcentaje}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="costo-total">
                  <strong>Costo Total:</strong> ${costoTotal} MXN
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de Acción */}
        <div className="kpis-actions">
          <button className="kpis-btn" onClick={onBack}>
            Volver a Comparación
          </button>
        </div>
      </main>
    </div>
  );
};

export default KPIsMejorados;
