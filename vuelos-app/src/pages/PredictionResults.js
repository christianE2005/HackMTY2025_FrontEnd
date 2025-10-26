import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { predict } from '../services/predictService';
import '../App.css';

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

function PredictionResults() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Datos pasados desde SimularML
  const { initialResults, flightData, contextAnalysis } = location.state || {};
  
  const [results, setResults] = useState(initialResults || null);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [bufferPct, setBufferPct] = useState(contextAnalysis?.final_buffer || 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const listRef = useRef(null);

  const handleBufferChange = (e) => {
    // Accept numbers but normalize to integers to avoid decimal buffer errors
    const raw = Number(e.target.value);
    if (!isNaN(raw)) {
      const intVal = Math.max(0, Math.round(raw));
      setBufferPct(intVal);
    }
  };


  const handleReRunWithBuffer = async () => {
    if (!flightData) {
      setError('No hay datos de vuelo disponibles');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const payload = {
        ...flightData,
        buffer_pct: bufferPct
      };

      const newResults = await predict(payload);
      setResults(newResults);
      setLoading(false);
    } catch (err) {
      console.error('Error re-ejecutando predicción:', err);
      setError('Error al ejecutar la predicción: ' + err.message);
      setLoading(false);
    }
  };

  if (!results) {
    return (
      <div className="app-container">
        <header className="header">
          <div className="header-content">
            <div className="logo">
              <span className="logo-bold">gate</span>
              <span className="logo-light">group</span>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <button className="action-button" onClick={() => navigate(-1)}>
                <ArrowLeftIcon />
                Regresar
              </button>
            </div>
          </div>
        </header>
        <main className="main-content">
          <p>No hay resultados para mostrar</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-bold">gate</span>
            <span className="logo-light">group</span>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button className="action-button" onClick={() => navigate(-1)}>
              <ArrowLeftIcon />
              Regresar
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="title-section">
          <h1 className="title">Resultados de Predicción ML</h1>
        </div>

        {error && <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>}

        {/* Análisis de Contexto del Agente LLM */}
        {contextAnalysis && (
          <div style={{ 
            backgroundColor: '#ecfdf5', 
            border: '1px solid #10b981',
            padding: '16px 20px', 
            borderRadius: '8px', 
            marginBottom: '24px'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#065f46', fontSize: '16px', fontWeight: 600 }}>
              Análisis de Contexto del Agente LLM
            </h3>
            <p style={{ margin: '0 0 8px 0', color: '#047857', fontSize: '14px' }}>
              {contextAnalysis.explanation}
            </p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#065f46' }}>
              <div>
                <strong>Buffer detectado:</strong> {contextAnalysis.final_buffer}%
              </div>
              {contextAnalysis.detected_categories && contextAnalysis.detected_categories.length > 0 && (
                <div>
                  <strong>Categorías:</strong> {contextAnalysis.detected_categories.join(', ')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Resultados */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '24px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}>
          <h2 style={{ marginBottom: '16px', color: '#1D2C66' }}>Resultados</h2>

          {/* Render friendly list: product name + suggested load */}
          {(() => {
            // Try common shapes: { predictions: [...] } or array directly
            const predictions = Array.isArray(results?.predictions)
              ? results.predictions
              : Array.isArray(results)
              ? results
              : [];

            if (predictions.length === 0) {
              // Fallback: if structure is unexpected, show raw JSON
              return (
                <pre style={{ 
                  backgroundColor: '#f3f4f6', 
                  padding: '16px', 
                  borderRadius: '6px',
                  overflow: 'auto',
                  maxHeight: '400px'
                }}>
                  {JSON.stringify(results, null, 2)}
                </pre>
              );
            }

            return (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', fontWeight: 700, color: '#111827', borderBottom: '1px solid #e6edf3' }}>
                  <div>Producto</div>
                  <div style={{ width: '160px', textAlign: 'right' }}>Cantidad</div>
                </div>
                <ul ref={listRef} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {predictions.map((p, idx) => {
                  // Support different key namings
                  const name = p.Product || p.product || p.name || p.ProductName || 'Sin nombre';
                  const suggestedVal = (p.Suggested_Load ?? p.suggested_load ?? p.suggestedLoad ?? p.SuggestedLoad ?? p.suggested);
                  const suggestedDisplay = (suggestedVal !== undefined && suggestedVal !== null) ? String(suggestedVal) : '';

                  return (
                    <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderBottom: '1px solid #e6edf3' }}>
                      <div style={{ fontSize: '15px', color: '#1f2937' }}>{name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{suggestedDisplay !== '' ? suggestedDisplay : '-'}</div>
                        <button
                          onClick={() => {
                            // set selected and scroll to chart area
                            setSelectedPrediction(p);
                            // wait a tick for DOM update then scroll
                            setTimeout(() => {
                              if (chartRef.current) chartRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }, 120);
                          }}
                          aria-label={`Más info sobre ${name}`}
                          title={`Más info sobre ${name}`}
                          style={{
                            background: 'transparent',
                            color: '#1D2C66',
                            border: 'none',
                            textDecoration: 'underline',
                            fontSize: '13px',
                            cursor: 'pointer'
                          }}
                        >
                          más info.
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              </div>
            );
          })()}
        </div>

        {/* Chart area (appears when a prediction is selected) */}
        <div ref={chartRef}>
          {selectedPrediction && (() => {
            const p = selectedPrediction;
            const name = p.Product || p.product || p.name || p.ProductName || 'Sin nombre';
            const suggested = Number(p.Suggested_Load ?? p.suggested_load ?? p.suggestedLoad ?? p.SuggestedLoad ?? p.suggested) || 0;
            const histAvg = Number(p.Hist_Avg ?? p.hist_avg ?? p.HistAvg ?? p.histAvg ?? p.Hist_Average ?? 0) || 0;
            const histMax = Number(p.Hist_Max ?? p.hist_max ?? p.HistMax ?? p.histMax ?? p.Max ?? 0) || 0;

            const maxVal = Math.max(suggested, histAvg, histMax, 1);

            const chartHeight = 200;
            const barWidth = 60;

            const barStyle = (val) => {
              const heightPx = Math.max(6, (val / maxVal) * chartHeight);
              return {
                height: `${heightPx}px`,
                width: `${barWidth}px`,
                borderRadius: '6px 6px 0 0',
                transition: 'height 300ms ease, background 300ms ease',
                position: 'relative'
              };
            };

            const labelStyle = { 
              textAlign: 'center', 
              marginTop: '8px', 
              color: '#374151',
              fontSize: '14px',
              fontWeight: 500
            };

            return (
              <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)', marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ color: '#1D2C66', margin: 0 }}>Gráfica: {name}</h3>
                  <button
                    onClick={() => {
                      setSelectedPrediction(null);
                      setTimeout(() => {
                        if (listRef.current) listRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }, 120);
                    }}
                    aria-label="Cerrar gráfica"
                    title="Cerrar gráfica"
                    style={{
                      padding: '6px 12px',
                      height: '32px',
                      fontSize: '13px',
                      minWidth: 'auto',
                      width: 'auto',
                      display: 'inline-block',
                      maxWidth: '160px',
                      background: '#1D2C66',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Cerrar
                  </button>
                </div>

                {/* Chart container with baseline */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-end', 
                  justifyContent: 'center',
                  gap: '32px', 
                  height: `${chartHeight}px`, 
                  padding: '12px',
                  borderBottom: '2px solid #d1d5db',
                  position: 'relative'
                }}>
                  {/* Max bar */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ ...barStyle(histMax), background: '#111827' }}>
                      <div style={{ 
                        position: 'absolute', 
                        top: '-24px', 
                        left: '50%', 
                        transform: 'translateX(-50%)',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#111827'
                      }}>
                        {histMax}
                      </div>
                    </div>
                  </div>

                  {/* Avg bar */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ ...barStyle(histAvg), background: '#0ea5a4' }}>
                      <div style={{ 
                        position: 'absolute', 
                        top: '-24px', 
                        left: '50%', 
                        transform: 'translateX(-50%)',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#0ea5a4'
                      }}>
                        {histAvg}
                      </div>
                    </div>
                  </div>

                  {/* Simulado bar */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ ...barStyle(suggested), background: '#1D2C66' }}>
                      <div style={{ 
                        position: 'absolute', 
                        top: '-24px', 
                        left: '50%', 
                        transform: 'translateX(-50%)',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#1D2C66'
                      }}>
                        {suggested}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Labels below baseline */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '12px' }}>
                  <div style={{ ...labelStyle, width: `${barWidth}px` }}>Max</div>
                  <div style={{ ...labelStyle, width: `${barWidth}px` }}>Avg</div>
                  <div style={{ ...labelStyle, width: `${barWidth}px` }}>Simulado</div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Buffer adjustment */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '24px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ marginBottom: '16px', color: '#1D2C66' }}>Ajustar Buffer</h2>
          <p style={{ marginBottom: '12px', color: '#4b5563' }}>
            Modifica el porcentaje de buffer y vuelve a correr el modelo
            {contextAnalysis && (
              <span style={{ color: '#10b981', fontWeight: 500 }}>
                {' '}(Buffer inicial del agente: {contextAnalysis.final_buffer}%)
              </span>
            )}
          </p>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
            <label style={{ fontWeight: 500 }}>Buffer %:</label>

            <input
              type="number"
              value={bufferPct}
              onChange={handleBufferChange}
              min="0"
              step="1"
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                width: '100px',
                textAlign: 'center'
              }}
            />

            <span style={{ color: '#6b7280' }}>
              (Enteros — ejemplo: 5 = multiplicar resultados × 1.05)
            </span>
          </div>

          <button 
            onClick={handleReRunWithBuffer}
            disabled={loading}
            className="action-button"
            style={{ 
              padding: '10px 24px',
              fontSize: '15px',
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Ejecutando...' : 'Re-ejecutar con nuevo buffer'}
          </button>
        </div>
      </main>
    </div>
  );
}

export default PredictionResults;
