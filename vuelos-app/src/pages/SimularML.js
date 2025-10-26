import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { predict } from '../services/predictService';
import { predictWithContext } from '../services/agentService';
import ComparacionMenus from './ComparacionMenus';
import './SimularML.css';

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

// Ícono de upload
const UploadIcon = () => (
  <svg 
    width="48" 
    height="48" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="#60a5fa" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const SimularMenuML = ({ onBack, vueloSeleccionado }) => {
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState('Retail');
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [mostrarComparacion, setMostrarComparacion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { from: 'bot', text: 'Escribe aquí tus instrucciones o contexto para el LLM. Ejemplo: "Es una celebridad famosa" o "Va a un concierto". El agente detectará palabras clave y ajustará el buffer automáticamente.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [contextAnalysis, setContextAnalysis] = useState(null); // Guarda análisis del agente

  // Funciones del chat
  const handleSendMessage = () => {
    if (chatInput.trim() === '') return;
    setChatMessages(prev => [...prev, { from: 'user', text: chatInput.trim() }]);
    setChatInput('');
  };

  const handleSendToLLM = async () => {
    if (!archivoSeleccionado) {
      setChatMessages(prev => [...prev, { from: 'bot', text: '⚠️ Primero carga un archivo Excel con productos.' }]);
      return;
    }

    try {
      setLoading(true);
      
      // Leer Excel para obtener productos
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          
          const listaProductos = jsonData
            .slice(0)
            .map(row => row[0])
            .filter(nombre => nombre && typeof nombre === 'string' && nombre.trim() !== '');
          
          if (listaProductos.length === 0) {
            setChatMessages(prev => [...prev, { from: 'bot', text: '❌ El archivo no contiene productos válidos.' }]);
            setLoading(false);
            return;
          }

          // Construir historial del chat (solo mensajes de usuario)
          const chatHistory = chatMessages
            .filter(m => m.from === 'user')
            .map(m => ({ role: 'user', content: m.text }));

          // Llamar al agente LLM
          const agentPayload = {
            flight_number: vueloSeleccionado?.vuelo || 'N/A',
            passenger_count: vueloSeleccionado?.passenger_count || 200,
            productos: listaProductos,
            base_buffer: 10,
            chat_history: chatHistory
          };

          console.log('🤖 Enviando al agente LLM:', agentPayload);
          const agentResponse = await predictWithContext(agentPayload);
          
          // Guardar análisis de contexto (aplicar en background, sin feedback visible)
          setContextAnalysis(agentResponse.context_analysis);
          // Log para debugging, pero no mostrar feedback al usuario en el chat
          console.log('Agente LLM: contexto aplicado en background — final_buffer:', agentResponse.context_analysis?.final_buffer);
          
          setLoading(false);
        } catch (parseError) {
          console.error('Error procesando:', parseError);
          setChatMessages(prev => [...prev, { from: 'bot', text: `❌ Error: ${parseError.message}` }]);
          setLoading(false);
        }
      };
      
      reader.onerror = () => {
        setChatMessages(prev => [...prev, { from: 'bot', text: '❌ Error leyendo el archivo.' }]);
        setLoading(false);
      };
      
      reader.readAsArrayBuffer(archivoSeleccionado);
    } catch (err) {
      console.error('Error en handleSendToLLM:', err);
      setChatMessages(prev => [...prev, { from: 'bot', text: `❌ Error: ${err.message}` }]);
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setChatMessages([{ from: 'bot', text: 'Escribe aquí tus instrucciones o contexto para el LLM. Ejemplo: "Es una celebridad famosa" o "Va a un concierto". El agente detectará palabras clave y ajustará el buffer automáticamente.' }]);
    setContextAnalysis(null);
  };

  const handleArchivoChange = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setArchivoSeleccionado(archivo);
    }
  };

  const handleReiniciar = () => {
    setArchivoSeleccionado(null);
    document.getElementById('file-input').value = '';
  };

  const handleAceptar = async () => {
    if (!archivoSeleccionado) {
      setError('Por favor selecciona un archivo Excel');
      return;
    }

    if (!vueloSeleccionado) {
      setError('No hay información del vuelo seleccionado');
      return;
    }

        try {
      setLoading(true);
      setError(null);

      // Leer el archivo Excel
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Tomar la primera hoja
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          
          // Convertir a JSON (array de arrays)
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          
          // Extraer nombres de productos de la primera columna (omitiendo encabezados si los hay)
          const listaProductos = jsonData
            .slice(0) // tomar todas las filas
            .map(row => row[0]) // primera columna
            .filter(nombre => nombre && typeof nombre === 'string' && nombre.trim() !== ''); // filtrar vacíos
          
          if (listaProductos.length === 0) {
            setError('El archivo Excel no contiene productos en la primera columna');
            setLoading(false);
            return;
          }

          console.log('Productos extraídos del Excel:', listaProductos);

          // Determinar buffer_pct: usar el del agente si existe, sino 1
          const finalBuffer = contextAnalysis?.final_buffer || 1;
          const hasContextAnalysis = contextAnalysis !== null;

          // Construir payload para el modelo
          const payload = {
            origen: vueloSeleccionado.origen || vueloSeleccionado.origenCodigo || 'DOH',
            flight_type: vueloSeleccionado.flight_type || vueloSeleccionado.tipo || 'medium-haul',
            service_type: serviceType || vueloSeleccionado.service_type || vueloSeleccionado.servicio || 'Retail',
            passenger_count: vueloSeleccionado.passenger_count || vueloSeleccionado.pasajeros || 247,
            lista_productos: listaProductos,
            buffer_pct: finalBuffer
          };

          console.log('Payload enviado al modelo:', payload);
          if (hasContextAnalysis) {
            console.log('✅ Usando buffer del agente LLM:', finalBuffer, '%');
          }

          // Llamar al modelo (nuevo endpoint /predict-simple)
          let results;
          try {
            results = await predict(payload);
            console.log('Resultados del modelo:', results);
          } catch (apiError) {
            console.error('Error llamando a /predict-simple:', apiError);
            
            // Mejorar el mensaje de error
            if (apiError.message.includes('Failed to fetch') || apiError.message.includes('fetch')) {
              setError('No se pudo conectar con el backend. Asegúrate de que el servidor esté corriendo en http://localhost:8001 y que el endpoint /predict-simple exista.');
            } else {
              setError('Error al ejecutar la predicción: ' + apiError.message);
            }
            setLoading(false);
            return;
          }

          // Navegar a la página de resultados
          navigate('/prediction-results', {
            state: {
              initialResults: results,
              flightData: payload,
              contextAnalysis: contextAnalysis // Pasar análisis del agente
            }
          });

        } catch (parseError) {
          console.error('Error procesando el Excel:', parseError);
          setError('Error al leer el archivo Excel: ' + parseError.message);
          setLoading(false);
        }
      };

      reader.onerror = () => {
        setError('Error al leer el archivo');
        setLoading(false);
      };

      reader.readAsArrayBuffer(archivoSeleccionado);

    } catch (err) {
      console.error('Error en handleAceptar:', err);
      setError('Error: ' + err.message);
      setLoading(false);
    }
  };

  if (mostrarComparacion) {
    return (
      <ComparacionMenus 
        onBack={() => setMostrarComparacion(false)} 
        archivoUsuario={archivoSeleccionado}
        vueloSeleccionado={vueloSeleccionado}
      />
    );
  }

  return (
    <div className="simular-ml-container">
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
      <main className="main-content-simular">
        <div className="simular-title-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <h1 className="simular-title">Simular Menú con Machine Learning</h1>
              <p className="simular-subtitle">Carga tu menú propuesto y obtén recomendaciones basadas en datos históricos</p>
            </div>

            {/* Dropdown para seleccionar tipo de servicio */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <label style={{ fontSize: '14px', color: '#374151', marginBottom: '6px' }}>Tipo de Servicio</label>
              <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                <option value="Retail">Retail</option>
                <option value="Pick & Pack">Pick & Pack</option>
              </select>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="upload-container">
          {error && (
            <div style={{ 
              backgroundColor: '#fee2e2', 
              border: '1px solid #fca5a5',
              padding: '12px 16px',
              borderRadius: '6px',
              marginBottom: '16px',
              color: '#991b1b'
            }}>
              {error}
            </div>
          )}

          <div className="upload-card">
            <UploadIcon />
            <h2>Cargar Archivo de Excel</h2>
            <p>Sube tu menú propuesto en formato .xlsx o .xls</p>
            
            <input
              type="file"
              id="file-input"
              accept=".xlsx,.xls"
              onChange={handleArchivoChange}
              style={{ display: 'none' }}
            />
            
            <label htmlFor="file-input" className="upload-button">
              Seleccionar Archivo
            </label>

            {archivoSeleccionado && (
              <div className="archivo-seleccionado">
                <div className="archivo-info">
                  <span className="archivo-icono">📄</span>
                  <div className="archivo-detalles">
                    <p className="archivo-nombre">{archivoSeleccionado.name}</p>
                    <p className="archivo-size">
                      {(archivoSeleccionado.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <span className="archivo-check">✓</span>
                </div>
              </div>
            )}

            <div className="action-buttons-upload">
              <button 
                className="btn-reiniciar" 
                onClick={handleReiniciar}
                disabled={!archivoSeleccionado}
              >
                Reiniciar / Borrar
              </button>
              <button 
                className="btn-aceptar" 
                onClick={handleAceptar}
                disabled={!archivoSeleccionado || loading}
                style={{ opacity: loading ? 0.6 : 1 }}
              >
                {loading ? 'Analizando...' : 'Aceptar y Analizar'}
              </button>
            </div>
          </div>

          {/* Chat / LLM area (replaces info card) */}
          <div className="info-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3>Chat para LLM</h3>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', minHeight: '160px', overflowY: 'auto' }}>
              {chatMessages.map((m, i) => (
                <div key={i} style={{ marginBottom: '8px', textAlign: m.from === 'user' ? 'right' : 'left' }}>
                  <div style={{ display: 'inline-block', background: m.from === 'user' ? '#60a5fa' : '#fff', color: m.from === 'user' ? '#fff' : '#111827', padding: '8px 12px', borderRadius: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Escribe un mensaje para el LLM..."
                style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                style={{ padding: '10px 16px', borderRadius: '8px', background: '#1D2C66', color: '#fff', border: 'none' }}
              >Enviar</button>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button
                onClick={handleSendToLLM}
                style={{ padding: '10px 14px', borderRadius: '8px', background: '#10b981', color: '#fff', border: 'none' }}
              >Enviar al LLM</button>
              <button
                onClick={handleClearChat}
                style={{ padding: '10px 14px', borderRadius: '8px', background: '#ef4444', color: '#fff', border: 'none' }}
              >Limpiar Chat</button>
            </div>
          </div>
        </div>

        {/* Botones de Acción (copiados de MenuIA) */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn-aceptar" style={{ padding: '10px 20px' }} onClick={() => navigate('/KPIsMejorados')}>Ver KPIs Mejorados</button>
          <button className="btn-aceptar" style={{ padding: '10px 20px' }} onClick={() => navigate('/inventario')}>Ver Inventario Completo</button>
        </div>
      </main>
    </div>
  );
};

export default SimularMenuML;